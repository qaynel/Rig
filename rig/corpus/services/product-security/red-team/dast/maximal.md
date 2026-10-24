# product-security.red-team.dast — maximal

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Policy grade, maximal: Set scanning unapproved targets to false. Only specifically authorized targets may be scanned, so keep the list explicit. Cumulative with minimal and mid. Binding checks: dast-source-code-boundary, dast-red-team-context, dast-evidence-receipt.
