# testing.performance-load.load-stress-scripts — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for load stress scripts; it does not widen ownership beyond perf-load-test-authoring, load-stress-scripts. For load stress scripts, inspect these context signals: stop_conditions. Binding checks: load-stress-scripts-performance-load-context.

Use the existing repository's load stress scripts convention, then name the source path or command that establishes it. For load stress scripts, inspect the repository's actual spec, source, test, or configuration for stop_conditions; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring performance-load services outside the load stress scripts decision for perf-load-test-authoring, load-stress-scripts.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:repository-context. Given perf-load-test-authoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.
minimal: load profile — "ramp 10 to 100 users".
mid: stop conditions — ["error rate above 5 percent"].
maximal: target production by default — false.
