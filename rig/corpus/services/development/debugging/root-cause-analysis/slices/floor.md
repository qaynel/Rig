# development.debugging.root-cause-analysis — floor and mutation-floor slice

Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.

Policy grade slice `root-cause-analysis-slice-floor`: Name the first boundary where behavior diverged from expectation. Without it the fix targets the final symptom, so record the component and input where it first went wrong.
