# infrastructure.cost.anomaly-detection — property-floor slice

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Policy grade slice `anomaly-detection-slice-property-floor`: Declare the cost baseline anomalies are compared against. Without a stable baseline any figure looks normal, so record the reference period or amount.
