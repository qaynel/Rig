# Troubleshooting

Rig refusals and coverage gaps stop the affected operation. Read the named
code and detail together; do not bypass approval or isolation checks to get
past a refusal. Fix the cause, rebuild a stale proposal when asked, and rerun
the operation.

## Install and v5 migration

| Message or code | What to do |
| --- | --- |
| `install.sh: missing required tool: …` | Install the named program (`curl`, `tar`, or `node`) and rerun `./install rig`. |
| `could not resolve release tag` or `refusing unsafe release tag` | Check the selected release tag and retry. Use only a published version tag. |
| `install: unknown argument` or `install.sh: unknown argument` | Use only options shown by `./install rig --help`. |
| `journal-corrupt` | Restore `.rig/install-manifest.jsonl` from a backup or rerun the installer as the message directs. Do not hand-edit journal entries. |
| `state-invalid` | Repair or remove invalid `.rig/state.json`, then rerun migration. Nothing was changed by the refused migration. |
| `release-invalid` | Repair `.rig/release.json`, or pass an explicit supported host list to migration. |
| `unknown-host` | Correct the host in the release record or pass supported host IDs. |
| `no-install` | Install Rig first; migration needs the v5 install journal. |
| `journal-open` | Rerun the installer to finish the interrupted install, then retry migration. |
| `conflicts` | Review the reported path. Restore the planned Rig bytes or move the conflicting symlink/user edit; rerun migration to create a fresh plan. Rig will not overwrite it. |
| `plan-drift` | Restore the previous Rig checkout and its planned bytes, then retry. Do not delete the migration plan while its backup is needed. |
| `migration-corrupt` | Follow the message to remove the invalid migration plan and start over. The install journal and migration backup retain recovery data. |

## Onboarding and third-party skills

The corpus [unpack guide](../rig/corpus/onboarding/unpack.md#5-named-refusals)
lists every projection-script refusal and its recovery: invalid script slots,
approval digest changes, sandbox unavailability, script failures or timeouts,
and output path, file type, size, presence, and digest mismatches. Fix the
script or host support, preview again, and obtain approval for the new exact
proposal. Never run the script outside the approved sandbox.

Third-party skills are fetched only from pinned revisions. These named gaps
leave the install unapplied:

| Code | What to do |
| --- | --- |
| `upstream-unavailable` | Restore network access or configure the named `RIG_UPSTREAM_MIRROR_<ID>` to a reachable HTTPS or local file mirror. The archive still must pass digest checks. |
| `digest-mismatch` | Do not use the downloaded bytes. Retry from the pinned source; report a mismatch that persists because the mirror may be tampered with. |
| `licence-missing` | Restore the exact licence notice named by upstream metadata, then retry. |
| `archive-invalid` | Use a valid pinned archive; links and special files are rejected. Report a repeat failure against the pinned source. |
| `upstream-file-missing` or `patch-base-mismatch` | The pinned upstream revision does not match the expected files. Do not patch around it; report the revision and code. |
| `patch-missing`, `patch-tampered`, `patch-failed`, or `patch-result-mismatch` | Restore the pinned local patch and metadata. If the mismatch remains, report the code; the fetched skill is not installed. |

## Catalogue check coverage gaps

`rig check` writes the detailed result to `.rig/reports/` and exits nonzero on
a gap. A gap means Rig could not establish the selected service's check; it is
not a pass. Use the service ID, check ID, and reason in the report:

| Message or reason | What to do |
| --- | --- |
| `<service>: coverage gap: binding is missing` / `No service binding is installed` | Reapply the approved catalogue selection to restore its binding, then rerun the check. |
| `No argv binding for scope …` | Add a repository-owned command binding for that scope or select a service with a check that applies there. |
| `…: missing <path>` / `<input>: missing input` | Add the required repository file or input, or select an appropriate repository-owned adapter. |
| `…: invalid required path`, `component cwd escapes repository`, or malformed binding/command/fix | Correct the repository-owned binding so paths stay in the repository and command arguments use the declared shape. |
| `…: <declared coverage gap>` | Follow the service-specific setup guidance in its installed `.rig/services/<service-id>.md`; if that limitation remains, keep it recorded as a gap. |
| `required tool "…" is unavailable` | Install the named tool or configure an approved repository-owned adapter. |
| `network isolation is unavailable on this host` | Use a host with verified network isolation for checks that require it. Do not rerun without isolation. |
| `capability_not_authorized`, `capability_policy_invalid`, or `capability_policy_not_committed` | Review the service's requested network or resource capability. Correct and commit the repository execution policy only when the repository owner approves that grant. |
| `<input>: … input …` or `unsupported_input` | Supply the input in the format and size the service declares, or select an approved repository-owned adapter. |
| `approved proposal body digest is stale` | Rebuild and approve the proposal again; its selected services changed after approval. |
| `not_run_due_to_dependency:…` | Fix the earlier failing service first, then rerun the checks. |

Command failures and failed assertions are reported as `failed`, not as
coverage gaps. Read the command output in the report, repair the command or
repository condition, and rerun. A `vacuous` result means the service has no
applicable surface; it is not evidence that the service checked that surface.

## Onboarding approval and proposal refusals

| Message | What to do |
| --- | --- |
| `onboarding request must be an object`, `unsupported onboarding schema version`, `unknown onboarding action`, or `onboarding request needs a target` | Correct the request shape, use schema version 1 and a supported action, and name an existing repository target. |
| `onboarding lock exists; refuse to break it` | Check whether another onboarding operation is active. Do not delete the lock while it may be in use. Retry after that operation finishes. |
| `no prepared onboarding state`, `requires a current proposal`, or `action is invalid from phase …` | Resume at the action for the reported phase: prepare, propose, apply, or check. |
| `stale revision`, changed repository inventory, changed skill catalogue, changed projection bytes, or `stale proposal` | Run prepare and rebuild the proposal from the current repository and catalogue. Review and approve the new exact proposal digest. |
| invalid approval receipt, tampered proposal digest, or `apply is blocked by an unresolved critical decision` | Resolve the decision with the user and obtain a fresh approval for the current proposal. Never reuse an approval for changed bytes. |
| `host-native approval has no configured verifier` or `approval verifier not configured` | Configure the approved external SSH signature verifier and signer record; follow the message's signer path. Rig cannot substitute an unsigned approval. |
| selected or unknown skill, missing staged skill, missing `SKILL.md`, stale fetched skill, invalid/duplicate/mismatched skill binding | Select only installed optional skills, rerun prepare/propose after catalogue changes, and restore the pinned skill bytes. |
| selected skill projection conflict, invalid owned path, stale preimage, or file not journal-proven | Restore the approved preimage or move the conflicting user-owned file. Rebuild the proposal so ownership and preimage digests are current. |
| duplicate graft, stale projection output, output not journal-proven, or changed upstream metadata | Correct the proposal or restore pinned metadata; prepare and propose again. Do not hand-edit ownership records. |

When any required field or installed authority file is reported as missing or
unreadable, restore it from the installed release or rerun the installer. Do
not fabricate release markers, signer receipts, or journal entries.

If a refusal is not covered above, keep the exact code, detail, and report
path, then report it with the Rig version and the operation that produced it.
