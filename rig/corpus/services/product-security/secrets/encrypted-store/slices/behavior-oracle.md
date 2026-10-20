# product-security.secrets.encrypted-store — behavior-oracle slice

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Policy grade slice. This slice bounds encrypted store to secrets.encrypted-store. It uses `encrypted-store-slice-behavior-oracle` and checks secret_store (nonempty): secret store must name the concrete repository contract.