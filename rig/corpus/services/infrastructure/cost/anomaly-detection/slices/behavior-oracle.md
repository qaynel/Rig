# infrastructure.cost.anomaly-detection — behavior-oracle slice

Compare cost with a stable baseline and an explicit deviation threshold. Missing billing input is a gap, never evidence that spending is normal.

Policy grade slice. This slice bounds anomaly detection to cost.anomaly-detection. It uses `anomaly-detection-slice-behavior-oracle` and checks cost_baseline (nonempty): cost baseline must name the concrete repository contract.