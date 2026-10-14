# testing.performance-load.load-stress-scripts — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for load stress scripts; it does not widen ownership beyond perf-load-test-authoring, load-stress-scripts. The context signals are stop_conditions. Binding checks: load-stress-scripts-performance-load-context.

Use the existing repository's load stress scripts convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance-load under their own verdicts.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:repository-context. Given perf-load-test-authoring has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring`, `load-stress-scripts`.

Offer: Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Input: `rig-services/testing.performance-load.load-stress-scripts.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.

minimal: load profile — "ramp 10 to 100 users".

mid: stop conditions — ["error rate above 5 percent"].

maximal: target production by default — false.
