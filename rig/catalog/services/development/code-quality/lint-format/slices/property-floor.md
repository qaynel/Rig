# Property-case formatting slice

Require formatter cleanliness for property generators, shrinkers, and saved
counterexamples so minimized failing cases remain reviewable. This dependency
slice brings only the repository's `format:check` verifier and does not select a
lint-format grade or add linter, CI, or autofix behavior.

Missing formatter configuration is reported as a nonzero coverage gap.
