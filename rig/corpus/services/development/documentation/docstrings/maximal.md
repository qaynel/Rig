# development.documentation.docstrings — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for docstrings. The evidence must preserve the documented_symbols, parameters, failure_contract inputs that determined the result. Binding checks: docstrings-evidence-receipt.

Read a second run against unchanged docstrings inputs. Record the documented_symbols, parameters, failure_contract inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this docstrings result is stale. The ceiling remains: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Choose a repository-owned check that observes docstrings from rig-services/development.documentation.docstrings.json.

Acceptance target: fixture:development.documentation.docstrings:evidence-replay. Given the documentation.docstrings binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.
minimal: documented symbols — ["parseRecord"].
mid: parameters — ["raw: serialized record"].
maximal: failure contract — "throws on malformed records".
