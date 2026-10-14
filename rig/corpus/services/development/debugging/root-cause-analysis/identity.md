# development.debugging.root-cause-analysis — identity

Policy grade: root cause analysis owns debugging.root-cause-analysis. Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Keep neighboring debugging services outside the root cause analysis decision for debugging.root-cause-analysis. Trace the verdict to the configured input at `rig-services/development.debugging.root-cause-analysis.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Choose a repository-owned check that observes root cause analysis from rig-services/development.debugging.root-cause-analysis.json.

Acceptance target: fixture:development.debugging.root-cause-analysis:policy-boundary. Given source-code is present and debugging.root-cause-analysis is selected, pass only when the repository binding evaluates debugging.root-cause-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern.

Service-specific evidence cues:
Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.
minimal: failure boundary — "parser rejects malformed record".
mid: causal evidence — ["repro case fails at parser"].
maximal: symptom only fix — false.
