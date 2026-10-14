# infrastructure.cost.utilization-analysis — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for utilization analysis; it does not widen ownership beyond cost.utilization-analysis. For utilization analysis, inspect these context signals: observation_window_days. Binding checks: utilization-analysis-cost-context.

Start from the existing repository's utilization analysis convention, then name the source path or command that establishes it. For utilization analysis, inspect the repository's actual spec, source, test, or configuration for observation_window_days; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cost services outside the utilization analysis decision for cost.utilization-analysis.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:repository-context. Given cost.utilization-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.
minimal: observed resources — ["cpu","memory"].
mid: observation window days — 7.
maximal: decide from single peak — false.
