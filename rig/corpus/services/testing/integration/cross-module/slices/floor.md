# testing.integration.cross-module — floor and mutation-floor slice

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Policy grade slice. This slice bounds cross module to integration.cross-module. It uses `cross-module-slice-floor` and checks participating_modules (nonempty): participating modules must name the concrete repository contract.