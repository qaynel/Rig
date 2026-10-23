# iac-authoring

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Owned scope: `provisioning.iac-authoring`. Input: `rig-services/infrastructure.provisioning.iac-authoring.json`.

Coverage ceiling: Configuration validation only, so it confirms resource names, a state backend and the unreviewed-apply flag are declared; it does not read live infrastructure.

minimal: resource names — ["app-network"]. List the resources the code declares. Unlisted resources escape review, so name each one.

mid: state backend — "encrypted-remote". Declare a recoverable state backend. Local state is lost with the machine, so configure remote locked storage.

maximal: apply without reviewed plan — false. Set applying without a reviewed plan to false. Applying unseen changes can destroy resources, so inspect the exact plan first.
