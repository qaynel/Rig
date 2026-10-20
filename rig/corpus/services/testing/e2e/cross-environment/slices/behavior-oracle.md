# testing.e2e.cross-environment — behavior-oracle slice

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade slice `cross-environment-slice-behavior-oracle`: List the environments the cases must run in. One passing platform says nothing about another, so name each OS or runtime. Despite its name this slice is not a behavior oracle: it confirms environments, shared cases and the platform-equivalence flag are declared; it does not run on any platform.
