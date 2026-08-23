# testing.property-fuzz.invariant-identification - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`invariant-identification-source-code-boundary` owns `property-fuzz.invariant-identification`. Given source-code is present and property-fuzz.invariant-identification is selected, it passes only when the repository binding evaluates property-fuzz.invariant-identification and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent property fuzz concern. Evidence is recorded against `fixture:testing.property-fuzz.invariant-identification:policy-boundary`; absence never becomes a pass.
