# product-security.red-team.dast — minimal

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Grade: minimal. Assurance remains Policy grade. `dast-source-code-boundary` checks that `target_origin` is nonempty. Example: "http://127.0.0.1:8080".

Replace the example origin and paths with a target explicitly approved for testing. A nonempty string does not prove the target is controlled by the repository owner. The rule proves only that a value was configured.

Catalogue policy target: `policy:product-security.red-team.dast:minimal:dast-source-code-boundary`. This names the policy condition; no runnable attack fixture is included here.
