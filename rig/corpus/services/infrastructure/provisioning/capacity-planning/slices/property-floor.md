# infrastructure.provisioning.capacity-planning — property-floor slice

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Policy grade slice. This slice bounds capacity planning to provisioning.capacity-planning. It uses `capacity-planning-slice-property-floor` and checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100.