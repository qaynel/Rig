# product-security.license-compliance.attribution — behavior-oracle slice

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Policy grade slice `attribution-slice-behavior-oracle`: List the files holding each redistributed component's copyright and license notice, such as THIRD_PARTY_NOTICES. An empty list means notices cannot be traced, so add the real paths. Despite its name this slice is not a behavior oracle: it confirms notice paths, attributed components and the notice-removal flag are declared; it does not show the shipped artifact carries those notices.
