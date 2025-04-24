import { Transaction } from "@scure/btc-signer";
import { TransactionInput } from "@scure/btc-signer/psbt";
import {
  CooperativeExitResponse,
  LeafRefundTxSigningJob,
  Transfer,
} from "../proto/spark.js";
import {
  getP2TRScriptFromPublicKey,
  getTxFromRawTxBytes,
} from "../utils/bitcoin.js";
import { getCrypto } from "../utils/crypto.js";
import { getNextTransactionSequence } from "../utils/transaction.js";
import { WalletConfigService } from "./config.js";
import { ConnectionManager } from "./connection.js";
import {
  BaseTransferService,
  LeafKeyTweak,
  LeafRefundSigningData,
} from "./transfer.js";
import { ValidationError, NetworkError } from "../errors/types.js";
import { Network } from "../utils/network.js";

const crypto = getCrypto();

export type GetConnectorRefundSignaturesParams = {
  leaves: LeafKeyTweak[];
  exitTxId: Uint8Array;
  connectorOutputs: TransactionInput[];
  receiverPubKey: Uint8Array;
};

export class CoopExitService extends BaseTransferService {
  constructor(
    config: WalletConfigService,
    connectionManager: ConnectionManager,
  ) {
    super(config, connectionManager);
  }

  async getConnectorRefundSignatures({
    leaves,
    exitTxId,
    connectorOutputs,
    receiverPubKey,
  }: GetConnectorRefundSignaturesParams): Promise<{
    transfer: Transfer;
    signaturesMap: Map<string, Uint8Array>;
  }> {
    const { transfer, signaturesMap } = await this.signCoopExitRefunds(
      leaves,
      exitTxId,
      connectorOutputs,
      receiverPubKey,
    );
    const transferTweak = await this.sendTransferTweakKey(
      transfer,
      leaves,
      signaturesMap,
    );

    return { transfer: transferTweak, signaturesMap };
  }

  private createConnectorRefundTransaction(
    sequence: number,
    nodeOutPoint: TransactionInput,
    connectorOutput: TransactionInput,
    amountSats: bigint,
    receiverPubKey: Uint8Array,
  ): Transaction {
    const refundTx = new Transaction();
    if (!nodeOutPoint.txid || nodeOutPoint.index === undefined) {
      throw new ValidationError("Invalid node outpoint", {
        field: "nodeOutPoint",
        value: { txid: nodeOutPoint.txid, index: nodeOutPoint.index },
        expected: "Both txid and index must be defined",
      });
    }
    refundTx.addInput({
      txid: nodeOutPoint.txid,
      index: nodeOutPoint.index,
      sequence,
    });

    refundTx.addInput(connectorOutput);
    const receiverScript = getP2TRScriptFromPublicKey(
      receiverPubKey,
      this.config.getNetwork(),
    );

    refundTx.addOutput({
      script: receiverScript,
      amount: amountSats,
    });

    return refundTx;
  }
  private async signCoopExitRefunds(
    leaves: LeafKeyTweak[],
    exitTxId: Uint8Array,
    connectorOutputs: TransactionInput[],
    receiverPubKey: Uint8Array,
  ): Promise<{ transfer: Transfer; signaturesMap: Map<string, Uint8Array> }> {
    if (leaves.length !== connectorOutputs.length) {
      throw new ValidationError(
        "Mismatch between leaves and connector outputs",
        {
          field: "leaves/connectorOutputs",
          value: {
            leavesCount: leaves.length,
            outputsCount: connectorOutputs.length,
          },
          expected: "Equal length",
        },
      );
    }

    const signingJobs: LeafRefundTxSigningJob[] = [];
    const leafDataMap: Map<string, LeafRefundSigningData> = new Map();

    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];
      if (!leaf) {
        throw new ValidationError("Missing leaf", {
          field: "leaf",
          value: leaf,
          expected: "Valid leaf object",
        });
      }
      const connectorOutput = connectorOutputs[i];
      if (!connectorOutput) {
        throw new ValidationError("Missing connector output", {
          field: "connectorOutput",
          value: connectorOutput,
          expected: "Valid connector output",
        });
      }
      const currentRefundTx = getTxFromRawTxBytes(leaf.leaf.refundTx);

      const { nextSequence } = getNextTransactionSequence(
        currentRefundTx.getInput(0).sequence,
      );

      const refundTx = this.createConnectorRefundTransaction(
        nextSequence,
        currentRefundTx.getInput(0),
        connectorOutput,
        BigInt(leaf.leaf.value),
        receiverPubKey,
      );

      const signingNonceCommitment =
        await this.config.signer.getRandomSigningCommitment();
      const signingJob: LeafRefundTxSigningJob = {
        leafId: leaf.leaf.id,
        refundTxSigningJob: {
          signingPublicKey: leaf.signingPubKey,
          rawTx: refundTx.toBytes(),
          signingNonceCommitment: signingNonceCommitment,
        },
      };

      signingJobs.push(signingJob);
      const tx = getTxFromRawTxBytes(leaf.leaf.nodeTx);
      leafDataMap.set(leaf.leaf.id, {
        signingPubKey: leaf.signingPubKey,
        refundTx,
        signingNonceCommitment,
        tx,
        vout: leaf.leaf.vout,
        receivingPubkey: receiverPubKey,
      });
    }

    const sparkClient = await this.connectionManager.createSparkClient(
      this.config.getCoordinatorAddress(),
    );

    let response: CooperativeExitResponse;
    try {
      response = await sparkClient.cooperative_exit({
        transfer: {
          transferId: crypto.randomUUID(),
          leavesToSend: signingJobs,
          ownerIdentityPublicKey:
            await this.config.signer.getIdentityPublicKey(),
          receiverIdentityPublicKey: receiverPubKey,
          expiryTime:
            this.config.getNetwork() == Network.MAINNET
              ? new Date(Date.now() + 6 * 60 * 60 * 1000 + 5 * 60 * 1000)
              : new Date(Date.now() + 5 * 60 * 1000), // 6 hours 5 min for mainnet, 5 min otherwise
        },
        exitId: crypto.randomUUID(),
        exitTxid: exitTxId,
      });
    } catch (error: unknown) {
      throw new NetworkError(
        "Failed to initiate cooperative exit",
        {
          operation: "cooperative_exit",
          errorCount: 1,
          errors: error instanceof Error ? error.message : String(error),
        },
        error instanceof Error ? error : undefined,
      );
    }

    if (!response.transfer) {
      throw new NetworkError("Failed to initiate cooperative exit", {
        operation: "cooperative_exit",
        errors: "No transfer in response",
      });
    }

    const signatures = await this.signRefunds(
      leafDataMap,
      response.signingResults,
    );

    const signaturesMap: Map<string, Uint8Array> = new Map();
    for (const signature of signatures) {
      signaturesMap.set(signature.nodeId, signature.refundTxSignature);
    }

    return { transfer: response.transfer, signaturesMap };
  }
}
