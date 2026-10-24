# development.debugging.structured-debugging — behavior-oracle slice

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Policy grade slice `structured-debugging-slice-behavior-oracle`: Write the steps that reproduce the failure. A fix made without a repeatable failure erases evidence, so capture the commands and input first. Despite its name this slice is not a behavior oracle: it confirms reproduction steps, ranked hypotheses and the change-before-reproduction flag are declared; it does not show the bug is reproducible.
