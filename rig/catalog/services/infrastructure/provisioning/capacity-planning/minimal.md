# infrastructure.provisioning.capacity-planning - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`capacity-planning-source-code-boundary` owns `provisioning.capacity-planning`. Given source-code is present and provisioning.capacity-planning is selected, it passes only when the repository binding evaluates provisioning.capacity-planning and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. Evidence is recorded against `fixture:infrastructure.provisioning.capacity-planning:policy-boundary`; absence never becomes a pass.
