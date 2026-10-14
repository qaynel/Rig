# testing.mutation.language-adapter — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for language adapter. The minimal boundary for language adapter checks source_extensions (nonempty): source extensions must name the concrete repository contract.. Binding checks: language-adapter-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe mutation.language-adapter; bind it to the input named in `rig-services/testing.mutation.language-adapter.json` and preserve the check's failure status. When adopting this in an existing repository, connect language adapter to the command that inspects source_extensions and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.language-adapter as a failure.

Acceptance target: fixture:testing.mutation.language-adapter:policy-boundary. Given source-code is present and mutation.language-adapter is selected, pass only when the repository binding evaluates mutation.language-adapter and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is language adapter configuration validation only; declared policy does not prove running language adapter behavior. Choose a repository-owned check that observes language adapter from rig-services/testing.mutation.language-adapter.json..

Service-specific evidence cues:
Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.
minimal: source extensions — [".js"].
mid: compiler command — ["node","--check"].
maximal: parse errors are success — false.
