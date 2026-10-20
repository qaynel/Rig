# development.code-creation.api-client-generation — minimal

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for api client generation. The minimal boundary for api client generation checks specification_path (nonempty): specification path must name the concrete repository contract. Binding checks: api-client-generation-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe code-creation.api-client-generation; bind it to the input named in `rig-services/development.code-creation.api-client-generation.json` and preserve the check's failure status. When adopting this in an existing repository, connect api client generation to the command that inspects specification_path and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-creation.api-client-generation as a failure.

Acceptance target: policy:development.code-creation.api-client-generation:minimal:api-client-generation-source-code-boundary.

Declared predicates: api-client-generation-source-code-boundary: `specification_path` is nonempty (a string or array).
