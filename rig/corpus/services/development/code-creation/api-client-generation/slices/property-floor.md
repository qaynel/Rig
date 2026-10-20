# development.code-creation.api-client-generation — property-floor slice

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Policy grade slice. This slice bounds api client generation to code-creation.api-client-generation. It uses `api-client-generation-slice-property-floor` and checks specification_path (nonempty): specification path must name the concrete repository contract.