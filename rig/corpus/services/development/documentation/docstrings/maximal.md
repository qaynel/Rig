# development.documentation.docstrings — maximal

Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: docstrings-source-code-boundary, docstrings-documentation-context, docstrings-evidence-receipt.

To verify docstrings, inspect the source and compare each public symbol’s actual parameters and failure behavior with its documentation. These policy checks do not parse source or docstrings. The native rule does not verify this runtime evidence or perform a replay.

Catalogue policy target: `policy:development.documentation.docstrings:maximal:docstrings-source-code-boundary+docstrings-documentation-context+docstrings-evidence-receipt`. Its current policy check proves only that failure_contract is nonempty.
