# Setup decision rule

The approved lint/format setup and replacement contract lives once in the shipped
corpus: [setup decision rule](../../rig/corpus/standards/lint-format-setup.md).
Replacement uses journal preimages and its own signature; uninstall restores the
original bytes and retains the last preimage when edits conflict or recovery is
interrupted. No sidecar backup files are created.
