# development.code-creation.api-client-generation — maximal

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: api-client-generation-source-code-boundary, api-client-generation-code-creation-context, api-client-generation-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.code-creation.api-client-generation:maximal:api-client-generation-source-code-boundary+api-client-generation-code-creation-context+api-client-generation-evidence-receipt.

Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array); api-client-generation-code-creation-context: `compatibility_version` is nonempty (a string or array); api-client-generation-evidence-receipt: `unknown_response_policy` is nonempty (a string or array).
