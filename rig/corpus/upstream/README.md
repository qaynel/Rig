# Upstream (third-party) metadata

One JSON file per upstream project. A file pins the repository, the exact
revision, the archive and its digests, the licence notice that must travel with
the bytes, and the local patches Rig applies to fetched bytes. Onboarding
downloads into a staging directory, verifies the digests, applies the patches,
and only then lets an approved selection use the result. An invalid digest or an
unavailable upstream is a named gap, never a silent pass.

Nothing here is executable and no upstream bytes live in this directory.
