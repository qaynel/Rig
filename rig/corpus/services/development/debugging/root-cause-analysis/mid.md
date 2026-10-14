# development.debugging.root-cause-analysis — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for root cause analysis; it does not widen ownership beyond debugging.root-cause-analysis. For root cause analysis, inspect these context signals: causal_evidence. Binding checks: root-cause-analysis-debugging-context.

Tie acceptance to the existing repository's root cause analysis convention, then name the source path or command that establishes it. For root cause analysis, inspect the repository's actual spec, source, test, or configuration for causal_evidence; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring debugging services outside the root cause analysis decision for debugging.root-cause-analysis.

Acceptance target: fixture:development.debugging.root-cause-analysis:repository-context. Given debugging.root-cause-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Locate the first boundary where expected behavior diverges and record the causal observation. Fix the shared cause and retain a reproduction rather than masking the final symptom.
minimal: failure boundary — "parser rejects malformed record".
mid: causal evidence — ["repro case fails at parser"].
maximal: symptom only fix — false.
