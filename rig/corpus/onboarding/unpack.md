# Unpacking Rig for a host Rig has no projector for

Use this when the repository's agent host has no projector in the corpus. You
use your intelligence once, to write a deterministic script; the script does the
mechanical work. A human approves the script's exact bytes before it runs.

## 1. Learn the host

Read the host's own documentation for where it reads project rules, skills or
prompts, what file format and frontmatter it expects, and how it treats existing
files. Write the sources you used into the summary you show the user. Do not guess
a location.

## 2. Write the script

A single Node.js file, builtin modules only, at most 256 KiB. It must:

- read the corpus from `process.env.RIG_CORPUS_DIR` (the installed `.rig/`) and the
  repository from `process.env.RIG_REPO_DIR`, both read-only;
- write every output file under `process.env.RIG_OUT_DIR` and nowhere else, using
  the repository-relative path the file should end up at;
- discover skills by listing the corpus, not by hard-coding names;
- be deterministic and idempotent: no clock, randomness, network, child processes
  or reading outside the two input directories.

If the host already has a file you must extend, read it from `RIG_REPO_DIR`,
merge inside a clearly marked managed section, and emit the whole new file.

## 3. Declare what it may produce

Run the script yourself first so you know exactly what it emits. The proposal
lists every file it may produce and nothing else:

```json
"projection_script": {
  "host": "zed",
  "source": "<the script text>",
  "approved_outputs": [
    { "path": ".zed/rig-rules.md", "max_bytes": 4096,
      "preimage_digest": null, "content_digest": "<sha256 of the bytes you saw>" }
  ],
  "limits": { "timeout_ms": 20000 }
}
```

`preimage_digest` is the SHA-256 of the destination file as it exists now, or
`null` if it does not exist; a file that changed since is refused, not overwritten.
`content_digest` is optional but recommended: with it, any difference between what
you previewed and what the sandboxed run produces is refused. Paths under `.rig/`
or `.git/`, environment files and `node_modules` are never allowed. Rig computes
the script digest itself; the human's signature covers the script bytes, the
output list and the limits.

## 4. What Rig does at apply

1. Verifies the human's signature over the exact proposal.
2. Refuses to run anything unless it can show a **filesystem and network
   sandbox**: a probe must fail to write outside the output directory and fail to
   open a network connection. Process cleanup is not a sandbox.
3. Runs the approved script with the repository read-only and a private output
   directory.
4. Validates every produced file against the approved list: paths, sizes,
   regular files only (no symlinks or hard links), containment, and digests.
5. Writes the approved script to `.rig/projections/<host>.js` and the validated
   files through the install journal. The script cannot write to the repository
   itself or choose new files after approval.

## 5. Named refusals

| Code | Meaning | What to do |
|---|---|---|
| `sandbox-unavailable` | No verifiable sandbox on this machine (`sandbox-disabled`, `sandbox-tool-missing`, `sandbox-unsupported-platform` or `sandbox-probe-failed`) | Tell the user the reason. On macOS `sandbox-exec` is built in; on Linux install `bubblewrap`. Do not run the script yourself outside the apply step. |
| `script-digest-mismatch` | The script bytes are not the approved bytes | Re-propose; the human must approve the new bytes. |
| `script-failed` / `script-timeout` | The script exited non-zero or ran too long | Fix the script and re-propose. |
| `artifact-unapproved-path` | It produced a file that was not in `approved_outputs` | Fix the script or the list and re-propose. |
| `artifact-not-regular` / `artifact-escapes-output` | It produced a symlink, hard link, or special file | Emit plain files only. |
| `artifact-too-large` / `artifact-missing` / `artifact-digest-mismatch` | Output does not match what was approved | Re-run your preview and re-propose with the true values. |

Any refusal leaves the repository exactly as it was.

## 6. Verify and offer it back

`check` must pass; it also fails if an applied output or the kept script changes
later. If the script is worth keeping for everyone, port it to a pure projector at
`rig/corpus/projections/<host>.js` (a function from the corpus snapshot to
`{ path, bytes }` entries, no I/O) with a parity test, and offer it to the Rig
project. Until then the kept script is the repository's own record of how the host
was unpacked.
