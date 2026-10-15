---
date: 2026-10-13
source: agent
topics: catalogue-contract, services-and-reports
decisions:
status: current
tags: interdependency
summary: Specific configuration contracts have been authored for every original capability; actual behavior assurance still needs repository-owned tool bindings and must not be inferred from those configuration checks.
---

Authored a separate domain recipe for each of the 115 original service IDs: three concrete constraints and service-specific adoption/failure guidance. These cover actual distinctions such as snapshot acceptance, mutation equivalence, disaster-recovery fencing, scanner error handling, and cross-tenant isolation. The structural generation reuses those authored rules rather than substituting the old shared generic-baseline prose.

The important limit is explicit: verifying a declared service configuration does not demonstrate the broader runtime capability. A scanner command recorded in a config is not a scan; a recovery target is not an exercise; a feature acceptance list is not tested software. The implemented binding seam must therefore support actual repository-owned commands and preserve named missing-tool gaps. The README onboarding-docs tracer checks actual documentation rather than fixture labels.

In flight: materialize canonical definitions/guidance and minimal good/bad fixtures, extend slice-only bindings, then test the signed installed path. Next: add approval-bound repository command adapters and distinguish configuration results from behavior assurance so the product cannot claim a complete service from declaration-only evidence.
