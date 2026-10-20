# testing.e2e.cross-environment — floor and mutation-floor slice

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade slice. This slice bounds cross environment to e2e.cross-environment. It uses `cross-environment-slice-floor` and checks environments (nonempty): environments must name the concrete repository contract.