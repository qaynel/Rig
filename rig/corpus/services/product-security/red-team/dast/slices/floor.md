# product-security.red-team.dast — floor slice

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Policy grade. `dast-slice-floor` requires a nonempty `target_origin` value. It does not establish who controls that target or whether scanning is authorized.,Use only an origin explicitly approved for testing; the example loopback URL is illustrative, not a configured target for an actual scan. Both floor and mutation-floor map to this configuration rule (dast-slice-floor and dast-slice-mutation-floor); the latter name does not indicate runtime mutation.

Use only an origin explicitly approved for testing; the example loopback URL is illustrative, not a configured target for an actual scan.
