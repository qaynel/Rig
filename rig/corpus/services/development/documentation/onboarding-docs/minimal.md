# development.documentation.onboarding-docs — minimal

Offer when a new contributor cannot locate installation and execution instructions.

Grade: minimal. Assurance remains Policy grade. `onboarding-docs-source-code-boundary` checks that `README.md` has a heading matching Setup, Install, Installation, or Getting started.

The section should tell a new contributor which prerequisites are needed and which installation command to run. The native rule recognizes only the heading; it does not validate those instructions.

Catalogue policy target: `policy:development.documentation.onboarding-docs:minimal:onboarding-docs-source-code-boundary`. Its pass condition is the matching setup heading, not a successful installation. This target identifier does not point to a fixture shipped in the service directory.
