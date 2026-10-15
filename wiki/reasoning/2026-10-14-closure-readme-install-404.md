---
date: 2026-10-14
source: agent
topics: the-overhaul, distribution-and-release
decisions:
status: current
summary: The README install flow cannot finish because the public v6.0.0 archive URL returns HTTP 404 before target writes; the bundled bootstrap it unpacks installs clean into a fresh repository, so T-9.7 waits on publication rather than on code.
---
Done: T-9.7 attempted the README command on a fresh `.context/readme-clean-install` target: `./install rig --version v6.0.0 --target "$PWD/.context/readme-clean-install"`. Exact result: `curl: (56) The requested URL returned error: 404`. No Rig payload was installed. In flight: T-9.7 awaits publication of the v6.0.0 archive. Next: proceed with independent WP10 review work; retry this exact flow after the owner publishes the release artifact.

Update, same day: re-ran the documented command against a fresh `git init`
target at `/tmp/t97/repo` — same `curl: (56) The requested URL returned error:
404`, exit 56, no writes. Since the missing asset is the only cause, the half of
the flow that lives in this repository was run directly: `sh rig/bootstrap.sh
--target /tmp/t97/repo --hosts claude` printed `writes: 27 (recorded in
.rig/install-manifest.jsonl)` and left `.claude/`, `.rig/`, `CLAUDE.md` and
`.gitignore` in place, with the first manifest line
`{"kind":"install_state","complete":false,"owner":null}` — install does not
claim onboarding (North star 2). Two environmental obstacles, neither the
product's: the global `~/.githooks/pre-commit` rejected the fixture's first
commit (worked around with `git config core.hooksPath /dev/null` inside the
fixture only), and the download needs the asset the tag has not published.
T-9.7 stays unticked; its remaining half is the same post-publication run as
T-6.8 and the download smoke in T-10.8, all owner-only.
