# testing.performance-load.load-stress-scripts — behavior-oracle slice

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Policy grade slice. This slice bounds load stress scripts to perf-load-test-authoring, load-stress-scripts. It uses `load-stress-scripts-slice-behavior-oracle` and checks load_profile (nonempty): load profile must name the concrete repository contract.