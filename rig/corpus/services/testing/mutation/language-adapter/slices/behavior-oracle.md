# testing.mutation.language-adapter — behavior-oracle slice

Bind the mutation adapter to supported source syntax and the actual language toolchain. Parser and compiler errors are explicit gaps rather than successful mutation results.

Assurance remains Policy grade.

The policy oracle for this service is `language-adapter-slice-behavior-oracle`, and it validates `source_extensions`. A parse or compile error is a coverage gap, not a killed mutant or successful result.

A passing result means the input meets this one rule. It does not show the mutation tool or its oracle ran. For that claim, use a repository-owned execution check and report the observed result.
