# development.debugging.root-cause-analysis — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for root cause analysis. The evidence must preserve the failure_boundary, causal_evidence, symptom_only_fix inputs that determined the result. Binding checks: root-cause-analysis-evidence-receipt.

Read a second run against unchanged root cause analysis inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.root-cause-analysis:evidence-replay. Given the debugging.root-cause-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Owned scope: `debugging.root-cause-analysis`.

Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Input: `rig-services/development.debugging.root-cause-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure boundary — "parser rejects malformed record".

mid: causal evidence — ["repro case fails at parser"].

maximal: symptom only fix — false.
