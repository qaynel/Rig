# testing.integration.cross-module — behavior-oracle slice

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Policy grade slice `cross-module-slice-behavior-oracle`: List the real modules that interact. Without them the check is a unit test, so name each participant. Despite its name this slice is not a behavior oracle: it confirms participating modules, interaction cases and the stub-internals flag are declared; it does not run the modules.
