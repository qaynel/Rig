# policy-conflict

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`. Input: `rig-services/product-security.license-compliance.policy-conflict.json`.

Coverage ceiling: Configuration validation only, so it confirms allowed licenses, restricted licenses and the ignore-conflict flag are declared; it does not scan components.

minimal: allowed licenses — ["MIT","Apache-2.0"]. List the licenses the distribution policy allows. With no list every license is unchecked, so name them.

mid: restricted licenses — ["AGPL-3.0-only"]. List the restricted licenses. An unlisted restriction is silently allowed, so name each prohibited license.

maximal: ignore license conflicts — false. Set ignoring license conflicts to false. Conflicting or unknown licenses need review instead of expanding the allow list silently.
