# development.debugging.structured-debugging — floor and mutation-floor slice

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Policy grade slice `structured-debugging-slice-floor`: Write the steps that reproduce the failure. A fix made without a repeatable failure erases evidence, so capture the commands and input first.
