# root-cause-analysis

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Owned scope: `debugging.root-cause-analysis`. Input: `rig-services/development.debugging.root-cause-analysis.json`.

Coverage ceiling: Configuration validation only, so it confirms the failure boundary, causal evidence and the symptom-only-fix flag are declared; it does not show the cause is correct.

minimal: failure boundary — "parser rejects malformed record". Name the first boundary where behavior diverged from expectation. Without it the fix targets the final symptom, so record the component and input where it first went wrong.

mid: causal evidence — ["repro case fails at parser"]. Record the observation that links cause to failure, such as a log line or failing input. Claims without evidence cannot be re-checked, so attach the trace.

maximal: symptom only fix — false. Set symptom-only fix to false. Masking the final symptom leaves the shared cause in place, so fix the cause and keep a reproduction.
