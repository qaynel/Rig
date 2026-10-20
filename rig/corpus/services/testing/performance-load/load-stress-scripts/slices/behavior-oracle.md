# testing.performance-load.load-stress-scripts — behavior-oracle slice

Define the load profile and automatic stop conditions before generating pressure. Stress scripts must target an approved isolated environment instead of defaulting to production.

Policy grade slice `load-stress-scripts-slice-behavior-oracle`: Define the load profile, such as ramp and peak rate. Without it pressure is arbitrary, so write the shape. Despite its name this slice is not a behavior oracle: it confirms a load profile, stop conditions and the production-default flag are declared; it does not generate load.
