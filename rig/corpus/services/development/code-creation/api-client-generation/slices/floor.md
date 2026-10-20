# development.code-creation.api-client-generation — floor and mutation-floor slice

Generate clients from the authoritative API document and expose the compatibility version. Treat unknown response variants explicitly so schema drift cannot become a plausible successful response.

Policy grade slice `api-client-generation-slice-floor`: Point to the authoritative API document the client is generated from. Without a path the client can drift from the contract, so declare the specification file.
