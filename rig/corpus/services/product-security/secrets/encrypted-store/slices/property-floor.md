# product-security.secrets.encrypted-store — property-floor slice

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Policy grade slice. This slice bounds encrypted store to secrets.encrypted-store. It uses `encrypted-store-slice-property-floor` and checks secret_store (nonempty): secret store must name the concrete repository contract.