# development.code-creation.api-client-generation — minimal

Minimal establishes a non-vacuous policy boundary for api client generation. It checks specification_path (nonempty): specification path must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe code-creation.api-client-generation; bind it to the input named in `rig-services/development.code-creation.api-client-generation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-creation.api-client-generation is a failure.

Acceptance target: fixture:development.code-creation.api-client-generation:policy-boundary. Given source-code is present and code-creation.api-client-generation is selected, pass only when the repository binding evaluates code-creation.api-client-generation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. A passing policy check does not establish runtime behavior.
