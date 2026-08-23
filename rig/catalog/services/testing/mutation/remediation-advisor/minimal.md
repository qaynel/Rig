# testing.mutation.remediation-advisor - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`remediation-advisor-source-code-boundary` owns `mutation.remediation-advisor`. Given source-code is present and mutation.remediation-advisor is selected, it passes only when the repository binding evaluates mutation.remediation-advisor and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. Evidence is recorded against `fixture:testing.mutation.remediation-advisor:policy-boundary`; absence never becomes a pass.
