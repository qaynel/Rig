# development.debugging.root-cause-analysis — behavior-oracle slice

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Policy grade slice `root-cause-analysis-slice-behavior-oracle`: Name the first boundary where behavior diverged from expectation. Without it the fix targets the final symptom, so record the component and input where it first went wrong. Despite its name this slice is not a behavior oracle: it confirms the failure boundary, causal evidence and the symptom-only-fix flag are declared; it does not show the cause is correct.
