# infrastructure.provisioning.iac-authoring — behavior-oracle slice

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Policy grade slice `iac-authoring-slice-behavior-oracle`: List the resources the code declares. Unlisted resources escape review, so name each one. Despite its name this slice is not a behavior oracle: it confirms resource names, a state backend and the unreviewed-apply flag are declared; it does not read live infrastructure.
