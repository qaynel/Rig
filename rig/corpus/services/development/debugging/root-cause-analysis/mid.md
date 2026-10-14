# development.debugging.root-cause-analysis — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for root cause analysis; it does not widen ownership beyond debugging.root-cause-analysis. The context signals are causal_evidence. Binding checks: root-cause-analysis-debugging-context.

Tie acceptance to the existing repository's root cause analysis convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in debugging under their own verdicts.

Acceptance target: fixture:development.debugging.root-cause-analysis:repository-context. Given debugging.root-cause-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Owned scope: `debugging.root-cause-analysis`.

Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Input: `rig-services/development.debugging.root-cause-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: failure boundary — "parser rejects malformed record".

mid: causal evidence — ["repro case fails at parser"].

maximal: symptom only fix — false.
