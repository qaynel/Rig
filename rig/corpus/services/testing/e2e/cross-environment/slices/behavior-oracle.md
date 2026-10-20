# testing.e2e.cross-environment — behavior-oracle slice

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade slice. This slice bounds cross environment to e2e.cross-environment. It uses `cross-environment-slice-behavior-oracle` and checks environments (nonempty): environments must name the concrete repository contract.