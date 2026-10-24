# testing.e2e.cross-environment — floor and mutation-floor slice

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade slice `cross-environment-slice-floor`: List the environments the cases must run in. One passing platform says nothing about another, so name each OS or runtime.
