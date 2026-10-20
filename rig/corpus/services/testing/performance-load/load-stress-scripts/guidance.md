# load-stress-scripts

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Owned scope: `perf-load-test-authoring, load-stress-scripts`. Input: `rig-services/testing.performance-load.load-stress-scripts.json`.

Coverage ceiling: Configuration validation only, so it confirms a load profile, stop conditions and the production-default flag are declared; it does not generate load.

minimal: load profile — "ramp 10 to 100 users". Define the load profile, such as ramp and peak rate. Without it pressure is arbitrary, so write the shape.

mid: stop conditions — ["error rate above 5 percent"]. Define the stop conditions that end the test automatically. An unbounded stress run can damage an environment, so write the abort limits.

maximal: target production by default — false. Set targeting production by default to false. Stress scripts must aim at an approved isolated environment, so require an explicit target.
