# product-security.license-compliance.license-diff — behavior-oracle slice

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Policy grade slice `license-diff-slice-behavior-oracle`: Provide the previous license inventory for the release. Without a baseline changes cannot be seen, so reference the earlier inventory. Despite its name this slice is not a behavior oracle: it confirms previous and current inventories and the auto-accept flag are declared; it does not compute a diff.
