# testing.integration.cross-module — floor and mutation-floor slice

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Policy grade slice `cross-module-slice-floor`: List the real modules that interact. Without them the check is a unit test, so name each participant.
