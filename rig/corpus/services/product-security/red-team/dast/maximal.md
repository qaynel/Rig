# product-security.red-team.dast — maximal

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: dast-source-code-boundary, dast-red-team-context, dast-evidence-receipt.

The native rules only check that target_origin and authorized_scope are nonempty and scan_unapproved_targets is false. They do not run a scanner or verify ownership or authorization of the target. A runtime scan requires explicit target authorization, scanner availability, and evidence that requests remained inside the approved origin and paths.

Catalogue policy target: `policy:product-security.red-team.dast:maximal:dast-source-code-boundary+dast-red-team-context+dast-evidence-receipt`. Its current rule proves only that scan_unapproved_targets equals false. It does not run or replay a red-team test.
