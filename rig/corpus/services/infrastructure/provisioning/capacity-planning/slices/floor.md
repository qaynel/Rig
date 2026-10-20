# infrastructure.provisioning.capacity-planning — floor and mutation-floor slice

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Policy grade slice `capacity-planning-slice-floor`: Declare the peak requests per second, at least 100. A lower figure is not a peak workload, so size from the real maximum.
