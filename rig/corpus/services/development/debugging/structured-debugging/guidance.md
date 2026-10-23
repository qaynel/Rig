# structured-debugging

Capture a repeatable failure before changing code and rank hypotheses from evidence. One experiment should separate explanations; speculative fixes before reproduction erase useful evidence.

Owned scope: `debugging.structured-debugging`. Input: `rig-services/development.debugging.structured-debugging.json`.

Coverage ceiling: Configuration validation only, so it confirms reproduction steps, ranked hypotheses and the change-before-reproduction flag are declared; it does not show the bug is reproducible.

minimal: reproduction steps — ["run failing case"]. Write the steps that reproduce the failure. A fix made without a repeatable failure erases evidence, so capture the commands and input first.

mid: ranked hypotheses — ["invalid input reaches parser"]. Rank the hypotheses by evidence, each with the experiment that separates it. An unranked list invites guessing, so order them and name the discriminating test.

maximal: change before reproduction — false. Set change before reproduction to false. Editing code before the failure reproduces destroys the evidence, so reproduce first.
