# testing.mutation.language-adapter — floor slice

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Assurance remains Policy grade.

This Policy slice checks `source_extensions` through `language-adapter-slice-floor`. The good fixture supplies `source_extensions` = `[".js"]`; the bad fixture removes it.

List a supported extension before the adapter attempts source transformation. Keep the failure attached to `rig-services/testing.mutation.language-adapter.json`; do not infer that a mutation was generated or killed. language adapter configuration validation only; declared policy does not prove running language adapter behavior. Select an approved repository-owned command to verify that behavior.
