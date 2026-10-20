# product-security.red-team.dast — behavior-oracle slice

Dynamic security testing needs a specifically authorized target and path scope. A declared target does not prove a live scan; missing scanner or credentials must remain visible.

Policy grade. The behavior-oracle slice checks target-origin presence only. It does not start a dynamic scanner or inspect any response.,A real scan requires authorized scope, available scanner tooling, and a record of which paths were actually tested.The native check is `dast-slice-behavior-oracle`.

A real scan requires authorized scope, available scanner tooling, and a record of which paths were actually tested.
