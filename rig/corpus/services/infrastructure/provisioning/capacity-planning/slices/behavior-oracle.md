# infrastructure.provisioning.capacity-planning — behavior-oracle slice

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Policy grade slice `capacity-planning-slice-behavior-oracle`: Declare the peak requests per second, at least 100. A lower figure is not a peak workload, so size from the real maximum. Despite its name this slice is not a behavior oracle: it confirms a peak request rate, headroom and the growth-forecast flag are declared; it does not test that the hardware sustains the load.
