# capacity-planning

Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Owned scope: `provisioning.capacity-planning`. Input: `rig-services/infrastructure.provisioning.capacity-planning.json`.

Coverage ceiling: Configuration validation only, so it confirms a peak request rate, headroom and the growth-forecast flag are declared; it does not test that the hardware sustains the load.

minimal: peak requests per second — 100. Declare the peak requests per second, at least 100. A lower figure is not a peak workload, so size from the real maximum.

mid: headroom percent — 30. Keep headroom of at least 30 percent. Running at the forecast leaves no room for error, so add margin.

maximal: ignore growth forecast — false. Set ignoring the growth forecast to false. Capacity sized for today fails next quarter, so include growth assumptions.
