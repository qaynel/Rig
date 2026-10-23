# product-security.secrets.encrypted-store — behavior-oracle slice

Keep secrets in an encrypted authority with identified key management. A declaration of encryption does not verify the deployed vault or grant access to its contents.

Policy grade slice `encrypted-store-slice-behavior-oracle`: Name the encrypted store that holds secrets. Secrets in an unnamed place are untracked, so declare the authority. Despite its name this slice is not a behavior oracle: it confirms the secret store, encryption at rest and the plaintext flag are declared; it does not inspect the deployed vault.
