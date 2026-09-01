# Approvers for Rig onboarding plans

Rig re-verifies every onboarding approval receipt before it applies anything.
A receipt that merely claims it was approved is refused; the approval must be
an SSH signature made by a key listed in this repository, over exactly the
proposal digest being applied.

Copy this file's key list into a sibling file named allowed-signers (this same
path, without the .example.md suffix). Rig never writes that file for you: who
may approve is repository-owned, not installer-owned.

## Format

One line per human key, in OpenSSH allowed-signers format:

```
<identity> [namespaces="rig-plan-approval"] <keytype> <base64key>
```

For example:

```
alice@example ssh-ed25519 AAAA...REPLACE-WITH-YOUR-KEY...
```

## Enrolling a key

Generate the key locally — never inside the installer, and never commit the
private half:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/rig-approver
```

Then paste the contents of `~/.ssh/rig-approver.pub` after your identity in the
allowed-signers file.

## Signing an approval

The signed message binds the namespace and the proposal digest, so a signature
made for anything else — a different proposal, or policy activation — cannot be
replayed as a plan approval:

```sh
printf 'rig-plan-approval\ndigest=%s\n' "$PROPOSAL_DIGEST" > approval.txt
ssh-keygen -Y sign -f ~/.ssh/rig-approver -n rig-plan-approval approval.txt
```

Hand the armored contents of `approval.txt.sig` back as
`approval.signature`, with your identity as `approval.identity` and
`external-sshsig` as `approval.method`.
