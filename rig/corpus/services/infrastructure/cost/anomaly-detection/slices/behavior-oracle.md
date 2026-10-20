# infrastructure.cost.anomaly-detection — behavior-oracle slice

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Policy grade slice `anomaly-detection-slice-behavior-oracle`: Declare the cost baseline anomalies are compared against. Without a stable baseline any figure looks normal, so record the reference period or amount. Despite its name this slice is not a behavior oracle: it confirms a cost baseline, deviation threshold and the missing-data flag are declared; it does not read real billing data.
