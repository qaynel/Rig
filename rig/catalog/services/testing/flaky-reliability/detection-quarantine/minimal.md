# testing.flaky-reliability.detection-quarantine - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`detection-quarantine-source-code-boundary` owns `flaky-reliability.detection-quarantine`. Given source-code is present and flaky-reliability.detection-quarantine is selected, it passes only when the repository binding evaluates flaky-reliability.detection-quarantine and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. Evidence is recorded against `fixture:testing.flaky-reliability.detection-quarantine:policy-boundary`; absence never becomes a pass.
