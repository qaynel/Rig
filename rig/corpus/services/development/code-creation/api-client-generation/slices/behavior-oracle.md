# development.code-creation.api-client-generation — behavior-oracle slice

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Policy grade slice `api-client-generation-slice-behavior-oracle`: Point to the authoritative API document the client is generated from. Without a path the client can drift from the contract, so declare the specification file. Despite its name this slice is not a behavior oracle: it confirms the specification path, compatibility version and unknown-response policy are declared; it does not show the generated client matches the live API.
