# cross-module

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Owned scope: `integration.cross-module`. Input: `rig-services/testing.integration.cross-module.json`.

Coverage ceiling: Configuration validation only, so it confirms participating modules, interaction cases and the stub-internals flag are declared; it does not run the modules.

minimal: participating modules — ["orders","inventory"]. List the real modules that interact. Without them the check is a unit test, so name each participant.

mid: interaction cases — ["order reserves stock"]. List the interaction cases and their shared observable result. Untested interactions break silently, so write each case.

maximal: stub internal contracts — false. Set stubbing internal contracts to false. A stubbed internal boundary defeats the integration check, so exercise the real module.
