
// Copyright ©, 2023-present, Lightspark Group, Inc. - All Rights Reserved


import { Query, isObject } from '@lightsparkdev/core';

/** This interface is used by all the entities in the Lightspark system. It defines a few core fields that are available everywhere. Any object that implements this interface can be queried using the `entity` query and its ID. **/
interface Entity {


    /**
 * The unique identifier of this entity across all Lightspark systems. Should be treated as an opaque
 * string.
**/
id: string;

    /** The date and time when the entity was first created. **/
createdAt: string;

    /** The date and time when the entity was last updated. **/
updatedAt: string;

    /** The typename of the object **/
typename: string;




}





    export const FRAGMENT = `
fragment EntityFragment on Entity {
    __typename
    ... on ClaimStaticDeposit {
        __typename
        claim_static_deposit_id: id
        claim_static_deposit_created_at: created_at
        claim_static_deposit_updated_at: updated_at
        claim_static_deposit_network: network
        claim_static_deposit_credit_amount: credit_amount {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        claim_static_deposit_max_fee: max_fee {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        claim_static_deposit_status: status
        claim_static_deposit_transaction_id: transaction_id
        claim_static_deposit_output_index: output_index
        claim_static_deposit_bitcoin_network: bitcoin_network
        claim_static_deposit_transfer_spark_id: transfer_spark_id
    }
    ... on CoopExitFeeQuote {
        __typename
        coop_exit_fee_quote_id: id
        coop_exit_fee_quote_created_at: created_at
        coop_exit_fee_quote_updated_at: updated_at
        coop_exit_fee_quote_network: network
        coop_exit_fee_quote_total_amount: total_amount {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_user_fee_fast: user_fee_fast {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_user_fee_medium: user_fee_medium {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_user_fee_slow: user_fee_slow {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_l1_broadcast_fee_fast: l1_broadcast_fee_fast {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_l1_broadcast_fee_medium: l1_broadcast_fee_medium {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_l1_broadcast_fee_slow: l1_broadcast_fee_slow {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_fee_quote_expires_at: expires_at
    }
    ... on CoopExitRequest {
        __typename
        coop_exit_request_id: id
        coop_exit_request_created_at: created_at
        coop_exit_request_updated_at: updated_at
        coop_exit_request_network: network
        coop_exit_request_fee: fee {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_request_l1_broadcast_fee: l1_broadcast_fee {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        coop_exit_request_fee_quote: fee_quote {
            id
        }
        coop_exit_request_exit_speed: exit_speed
        coop_exit_request_status: status
        coop_exit_request_expires_at: expires_at
        coop_exit_request_raw_connector_transaction: raw_connector_transaction
        coop_exit_request_raw_coop_exit_transaction: raw_coop_exit_transaction
        coop_exit_request_coop_exit_txid: coop_exit_txid
        coop_exit_request_transfer: transfer {
            __typename
            transfer_total_amount: total_amount {
                __typename
                currency_amount_original_value: original_value
                currency_amount_original_unit: original_unit
                currency_amount_preferred_currency_unit: preferred_currency_unit
                currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
                currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
            }
            transfer_spark_id: spark_id
            transfer_user_request: user_request {
                id
            }
        }
    }
    ... on LeavesSwapRequest {
        __typename
        leaves_swap_request_id: id
        leaves_swap_request_created_at: created_at
        leaves_swap_request_updated_at: updated_at
        leaves_swap_request_network: network
        leaves_swap_request_status: status
        leaves_swap_request_total_amount: total_amount {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        leaves_swap_request_target_amount: target_amount {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        leaves_swap_request_fee: fee {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        leaves_swap_request_inbound_transfer: inbound_transfer {
            __typename
            transfer_total_amount: total_amount {
                __typename
                currency_amount_original_value: original_value
                currency_amount_original_unit: original_unit
                currency_amount_preferred_currency_unit: preferred_currency_unit
                currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
                currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
            }
            transfer_spark_id: spark_id
            transfer_user_request: user_request {
                id
            }
        }
        leaves_swap_request_outbound_transfer: outbound_transfer {
            __typename
            transfer_total_amount: total_amount {
                __typename
                currency_amount_original_value: original_value
                currency_amount_original_unit: original_unit
                currency_amount_preferred_currency_unit: preferred_currency_unit
                currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
                currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
            }
            transfer_spark_id: spark_id
            transfer_user_request: user_request {
                id
            }
        }
        leaves_swap_request_expires_at: expires_at
        leaves_swap_request_swap_leaves: swap_leaves {
            __typename
            swap_leaf_leaf_id: leaf_id
            swap_leaf_raw_unsigned_refund_transaction: raw_unsigned_refund_transaction
            swap_leaf_adaptor_signed_signature: adaptor_signed_signature
        }
    }
    ... on LightningReceiveRequest {
        __typename
        lightning_receive_request_id: id
        lightning_receive_request_created_at: created_at
        lightning_receive_request_updated_at: updated_at
        lightning_receive_request_network: network
        lightning_receive_request_invoice: invoice {
            __typename
            invoice_encoded_invoice: encoded_invoice
            invoice_bitcoin_network: bitcoin_network
            invoice_payment_hash: payment_hash
            invoice_amount: amount {
                __typename
                currency_amount_original_value: original_value
                currency_amount_original_unit: original_unit
                currency_amount_preferred_currency_unit: preferred_currency_unit
                currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
                currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
            }
            invoice_created_at: created_at
            invoice_expires_at: expires_at
            invoice_memo: memo
        }
        lightning_receive_request_status: status
        lightning_receive_request_transfer: transfer {
            __typename
            transfer_total_amount: total_amount {
                __typename
                currency_amount_original_value: original_value
                currency_amount_original_unit: original_unit
                currency_amount_preferred_currency_unit: preferred_currency_unit
                currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
                currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
            }
            transfer_spark_id: spark_id
            transfer_user_request: user_request {
                id
            }
        }
        lightning_receive_request_payment_preimage: payment_preimage
        lightning_receive_request_receiver_identity_public_key: receiver_identity_public_key
    }
    ... on LightningSendRequest {
        __typename
        lightning_send_request_id: id
        lightning_send_request_created_at: created_at
        lightning_send_request_updated_at: updated_at
        lightning_send_request_network: network
        lightning_send_request_encoded_invoice: encoded_invoice
        lightning_send_request_fee: fee {
            __typename
            currency_amount_original_value: original_value
            currency_amount_original_unit: original_unit
            currency_amount_preferred_currency_unit: preferred_currency_unit
            currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
            currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
        }
        lightning_send_request_idempotency_key: idempotency_key
        lightning_send_request_status: status
        lightning_send_request_transfer: transfer {
            __typename
            transfer_total_amount: total_amount {
                __typename
                currency_amount_original_value: original_value
                currency_amount_original_unit: original_unit
                currency_amount_preferred_currency_unit: preferred_currency_unit
                currency_amount_preferred_currency_value_rounded: preferred_currency_value_rounded
                currency_amount_preferred_currency_value_approx: preferred_currency_value_approx
            }
            transfer_spark_id: spark_id
            transfer_user_request: user_request {
                id
            }
        }
        lightning_send_request_payment_preimage: payment_preimage
    }
    ... on SparkWalletUser {
        __typename
        spark_wallet_user_id: id
        spark_wallet_user_created_at: created_at
        spark_wallet_user_updated_at: updated_at
        spark_wallet_user_identity_public_key: identity_public_key
    }
}`;




export default Entity;
