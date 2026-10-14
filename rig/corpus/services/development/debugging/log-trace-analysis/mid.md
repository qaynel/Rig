# development.debugging.log-trace-analysis — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for log trace analysis; it does not widen ownership beyond debugging.log-trace-analysis. For log trace analysis, inspect these context signals: redacted_fields. Binding checks: log-trace-analysis-debugging-context.

Anchor the review on the existing repository's log trace analysis convention, then name the source path or command that establishes it. For log trace analysis, inspect the repository's actual spec, source, test, or configuration for redacted_fields; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring debugging services outside the log trace analysis decision for debugging.log-trace-analysis.

Acceptance target: fixture:development.debugging.log-trace-analysis:repository-context. Given debugging.log-trace-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent debugging concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.
minimal: trace fields — ["correlation_id","timestamp"].
mid: redacted fields — ["authorization"].
maximal: log credentials — false.
