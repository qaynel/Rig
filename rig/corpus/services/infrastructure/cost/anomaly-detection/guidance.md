# anomaly-detection

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Owned scope: `cost.anomaly-detection`. Input: `rig-services/infrastructure.cost.anomaly-detection.json`.

Coverage ceiling: Configuration validation only, so it confirms a cost baseline, deviation threshold and the missing-data flag are declared; it does not read real billing data.

minimal: cost baseline — "weekly service spend". Declare the cost baseline anomalies are compared against. Without a stable baseline any figure looks normal, so record the reference period or amount.

mid: deviation threshold percent — 25. Set the deviation threshold percent to at least 25. A tighter threshold alarms on ordinary variance, so choose a documented threshold of 25 or more.

maximal: ignore missing billing data — false. Set ignoring missing billing data to false. Absent billing input is a gap, never evidence that spending is normal, so surface it.
