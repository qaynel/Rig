# product-security.secrets.encrypted-store — property-floor slice

Policy grade slice. This slice bounds encrypted store to secrets.encrypted-store. It uses `encrypted-store-slice-property-floor` and checks secret_store (nonempty): secret store must name the concrete repository contract..

For encrypted store, choose a repository example that satisfies secret_store at the property-floor floor, plus a failure where secret store must name the concrete repository contract. is false. For encrypted store, wire `property-floor` to `rig-services/product-security.secrets.encrypted-store.json` and keep its verdict on secret_store; missing evidence is a named gap, with ceiling encrypted store configuration validation only; declared policy does not prove running encrypted store behavior. Choose a repository-owned check that observes encrypted store from rig-services/product-security.secrets.encrypted-store.json..

Service-specific evidence cues:
Offer: Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.
minimal: secret store — "managed vault".
mid: encryption at rest — "provider-managed-kms".
maximal: store plaintext credentials — false.
