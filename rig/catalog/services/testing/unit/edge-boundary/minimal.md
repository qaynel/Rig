# testing.unit.edge-boundary - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`edge-boundary-source-code-boundary` owns `unit.edge-boundary`. Given source-code is present and unit.edge-boundary is selected, it passes only when the repository binding evaluates unit.edge-boundary and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern. Evidence is recorded against `fixture:testing.unit.edge-boundary:policy-boundary`; absence never becomes a pass.
