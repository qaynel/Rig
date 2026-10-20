# attribution

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Owned scope: `license-compliance.attribution`. Input: `rig-services/product-security.license-compliance.attribution.json`.

Coverage ceiling: Configuration validation only, so it confirms notice paths, attributed components and the notice-removal flag are declared; it does not show the shipped artifact carries those notices.

minimal: notice paths — ["THIRD_PARTY_NOTICES"]. List the files holding each redistributed component's copyright and license notice, such as THIRD_PARTY_NOTICES. An empty list means notices cannot be traced, so add the real paths.

mid: attributed components — ["library@1.0.0"]. List the third-party components that are attributed, with versions. A component missing from the list ships without credit, so enumerate them.

maximal: remove required notices — false. Set removing required notices to false. A license label cannot replace a required copyright notice, so keep them in the distributed output.
