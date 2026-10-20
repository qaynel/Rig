# testing.unit.mocking-strategy — floor and mutation-floor slice

Mock costly external boundaries while exercising the real unit and its local collaborators. Mocking the unit itself proves only what the mock was told to return.

Policy grade slice `mocking-strategy-slice-floor`: List the costly external boundaries that are mocked. Mocking everything proves nothing, so name only true boundaries.
