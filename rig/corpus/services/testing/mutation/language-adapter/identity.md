# testing.mutation.language-adapter — identity

language adapter owns mutation.language-adapter. Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Keep sibling services in mutation under their own verdicts. Start from the configured input at `rig-services/testing.mutation.language-adapter.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.language-adapter:policy-boundary. Given source-code is present and mutation.language-adapter is selected, pass only when the repository binding evaluates mutation.language-adapter and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
