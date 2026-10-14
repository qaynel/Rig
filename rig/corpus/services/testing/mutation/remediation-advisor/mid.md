# testing.mutation.remediation-advisor — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for remediation advisor; it does not widen ownership beyond mutation.remediation-advisor. For remediation advisor, inspect these context signals: target_behaviors. Binding checks: remediation-advisor-mutation-context.

Anchor the review on the existing repository's remediation advisor convention, then name the source path or command that establishes it. For remediation advisor, inspect the repository's actual spec, source, test, or configuration for target_behaviors; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the remediation advisor decision for mutation.remediation-advisor.

Acceptance target: fixture:testing.mutation.remediation-advisor:repository-context. Given mutation.remediation-advisor has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.
minimal: remediation cases — ["reject exact upper limit"].
mid: target behaviors — ["limit enforcement"].
maximal: add implementation mirrors — false.
