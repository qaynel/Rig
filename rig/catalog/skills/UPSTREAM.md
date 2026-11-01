# Upstream provenance

This directory and `../plumbing/` contain modified source vendored from
[`garrytan/gstack`](https://github.com/garrytan/gstack).

- Current source pin, included paths, and SHA-256 hashes: [`rig/upstreams/lock.json`](../../upstreams/lock.json).
- The upstream licence and notice are preserved with the snapshot and listed in
  [`rig/upstreams/NOTICES.md`](../../upstreams/NOTICES.md).

## Import history

- Earlier vendored version: `1.60.1.0`
- Upstream release commit: `7c9df1c568a9ea745508f679a329332b2c338063`
- Local import commit: `ff7cea5d4d678bbd447dcdaee3cd14ea2ecfeeed`
- The earlier modified partial import remains for compatibility until its readers move.

The import renamed the upstream product and command namespace to Rig, omitted
dependencies, fixtures, generated bundles, source maps, and release history,
and neutralized illustrative credential-shaped strings. It is a modified,
partial distribution, not an upstream release.
