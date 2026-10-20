# infrastructure.provisioning.iac-authoring — floor and mutation-floor slice

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Policy grade slice `iac-authoring-slice-floor`: List the resources the code declares. Unlisted resources escape review, so name each one.
