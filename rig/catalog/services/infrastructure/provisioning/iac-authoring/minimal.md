# infrastructure.provisioning.iac-authoring - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`iac-authoring-source-code-boundary` owns `provisioning.iac-authoring`. Given source-code is present and provisioning.iac-authoring is selected, it passes only when the repository binding evaluates provisioning.iac-authoring and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. Evidence is recorded against `fixture:infrastructure.provisioning.iac-authoring:policy-boundary`; absence never becomes a pass.
