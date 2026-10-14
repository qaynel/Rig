# testing.mutation.language-adapter — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for language adapter; it does not widen ownership beyond mutation.language-adapter. For language adapter, inspect these context signals: compiler_command. Binding checks: language-adapter-mutation-context.

Inspect the existing repository's language adapter convention, then name the source path or command that establishes it. For language adapter, inspect the repository's actual spec, source, test, or configuration for compiler_command; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the language adapter decision for mutation.language-adapter.

Acceptance target: fixture:testing.mutation.language-adapter:repository-context. Given mutation.language-adapter has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.
minimal: source extensions — [".js"].
mid: compiler command — ["node","--check"].
maximal: parse errors are success — false.
