# testing.strategy.risk-prioritization — behavior-oracle slice

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Policy grade slice `risk-prioritization-slice-behavior-oracle`: List the high-risk behaviors. Without them effort goes to the easy cases, so name the costly failures. Despite its name this slice is not a behavior oracle: it confirms high-risk behaviors, impact scores and the easy-cases-only flag are declared; it does not rank anything.
