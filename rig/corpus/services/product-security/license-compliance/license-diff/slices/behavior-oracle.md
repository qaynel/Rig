# product-security.license-compliance.license-diff — behavior-oracle slice

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Policy grade slice. This slice bounds license diff to license-compliance.license-diff. It uses `license-diff-slice-behavior-oracle` and checks previous_inventory (nonempty): previous inventory must name the concrete repository contract.