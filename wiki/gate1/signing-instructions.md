# Signing the frozen oracle — per-platform instructions

Who this is for: the Gate 1 key holder. Nobody else can complete these steps, and
no agent may complete them on your behalf — the human signature *is* the gate.

Contents: [Before you start](#before-you-start) ·
[macOS](#macos) · [Windows](#windows) · [Debian / Ubuntu](#debian--ubuntu) ·
[Fedora](#fedora) · [Arch Linux](#arch-linux) ·
[Signing](#signing-the-oracle-all-platforms) ·
[Rotating the key](#rotating-the-signing-key) ·
[Troubleshooting](#troubleshooting)

---

## Before you start

### Which kind of key to use

| Key kind | Human presence enforced? | Notes |
|---|---|---|
| Plain `ed25519`, no passphrase | No | What this repo uses today. |
| Plain `ed25519`, **with** a passphrase | **No** | See the warning below. |
| FIDO `ed25519-sk` / `ecdsa-sk` with `verify-required` | **Yes** | The only option that is actually enforced. |
| macOS Secure Enclave (Secretive) | Yes, in practice | Non-exportable, Touch ID per signature. Not expressible as `verify-required`. |

> **A passphrase proves nothing to the verifier.** This was tested, not assumed:
> signing the same message with the same key before and after adding a passphrase
> produces **byte-identical** signatures, because ed25519 is deterministic and the
> passphrase only protects the private key at rest. Once the key is loaded into
> `ssh-agent` you are not asked again. A passphrase is good hygiene for your
> laptop; it is not a gate control, and a verifier cannot distinguish your
> passphrase-protected key from one an agent generated a second ago.

Only a FIDO key carries a per-signature, machine-checkable proof that a human was
verified, and only when the pin line says so — see
[Enforcing human presence](#enforcing-human-presence-optional).

### Check your OpenSSH version

FIDO (`-sk`) key types need OpenSSH **8.2+**; `verify-required` needs **8.4+**.

```sh
ssh -V
```

---

## macOS

### Option A — Secure Enclave via Secretive (recommended on Mac)

The private key is generated inside the Secure Enclave and **cannot** be
exported — not by you, not by malware, not by an agent with full disk access.
Every signature requires Touch ID.

```sh
brew install --cask secretive
```

Then, in the Secretive app: create a new key, enable **"Require authentication
before use"**, and copy its public key to a file:

```sh
mkdir -p ~/.ssh
pbpaste > ~/.ssh/gate1.pub      # after clicking "Copy Public Key" in Secretive
```

Point the ceremony at the **public** key — signing happens through Secretive's
agent, which holds the private half:

```sh
mkdir -p .context
echo 'RIG_GATE1_SIGNING_KEY=~/.ssh/gate1.pub' > .context/gate1.env
```

`scripts/approve-gate1.js` detects Secretive's agent socket automatically and
sets `SSH_AUTH_SOCK` for you. macOS always exports a launchd `SSH_AUTH_SOCK`
that does *not* contain Secretive keys, which is why the script overrides it.

### Option B — FIDO security key (YubiKey and similar)

macOS's bundled `ssh-keygen` is often built without libfido2. Install one that
has it:

```sh
brew install openssh
ssh-keygen -t ed25519-sk -O resident -O verify-required -f ~/.ssh/gate1
```

If the token rejects `ed25519-sk`, use `-t ecdsa-sk` instead — older keys
(including YubiKey 5 before firmware 5.2.3) do not support ed25519.

---

## Windows

Use **PowerShell**. Windows 10 1809+ and Windows 11 ship the OpenSSH client;
if `ssh -V` is missing or older than 8.4:

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

If the bundled version is still too old for `-sk` keys, use Git Bash or WSL,
which carry a current OpenSSH.

### Plain key

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\gate1"
```

### FIDO security key

```powershell
ssh-keygen -t ed25519-sk -O resident -O verify-required -f "$env:USERPROFILE\.ssh\gate1"
```

Touch the token when it blinks. Fall back to `-t ecdsa-sk` if the token refuses.

### Point the ceremony at it

```powershell
New-Item -ItemType Directory -Force .context | Out-Null
"RIG_GATE1_SIGNING_KEY=$env:USERPROFILE\.ssh\gate1" | Out-File -Encoding ascii .context\gate1.env
```

Backslashes are fine — the path is read literally, never shell-evaluated.
`~` and `$HOME` are also expanded if you prefer them.

---

## Debian / Ubuntu

```sh
sudo apt update
sudo apt install openssh-client libfido2-1 fido2-tools
```

### Plain key

```sh
ssh-keygen -t ed25519 -f ~/.ssh/gate1
```

### FIDO security key

```sh
ssh-keygen -t ed25519-sk -O resident -O verify-required -f ~/.ssh/gate1
```

If you get `device not found` as a non-root user, the udev rules shipped by
`libfido2-1` have not been applied to an already-plugged token. Reload and
re-insert it:

```sh
sudo udevadm control --reload-rules && sudo udevadm trigger
```

---

## Fedora

```sh
sudo dnf install openssh-clients libfido2 fido2-tools
```

Key creation is identical to Debian:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/gate1                                    # plain
ssh-keygen -t ed25519-sk -O resident -O verify-required -f ~/.ssh/gate1  # FIDO
```

SELinux does not interfere with local signing. If the token is invisible to a
non-root user, reload udev rules as in the Debian section.

---

## Arch Linux

```sh
sudo pacman -S openssh libfido2
```

Key creation is identical to Debian:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/gate1                                    # plain
ssh-keygen -t ed25519-sk -O resident -O verify-required -f ~/.ssh/gate1  # FIDO
```

`libfido2` ships the udev rules. Ensure your user is in the group the rules
grant (`plugdev` or `uucp`, depending on your setup) and re-insert the token.

---

## Signing the oracle (all platforms)

Tell the ceremony where your key is. `.context/` is listed in
`.git/info/exclude` rather than `.gitignore`, so this survives branch switches
and is never committed:

```sh
mkdir -p .context
echo 'RIG_GATE1_SIGNING_KEY=~/.ssh/gate1' > .context/gate1.env
```

`RIG_GATE1_SIGNING_KEY` may also be exported in your environment; it wins over
the file. Point it at the **private** key normally, or at a `.pub` file when an
agent (Secretive, `ssh-agent`, a smartcard) holds the private half.

Then sign:

```sh
node scripts/approve-gate1.js
```

**The first run will refuse** if any frozen byte changed, and will print the
exact digest it wants you to confirm. This is deliberate: it forces you to
acknowledge precisely what you are about to sign, and it changes nothing on
disk until you do. Re-run with the digest it printed:

```sh
node scripts/approve-gate1.js --confirm-digest-delta <the 64-character digest>
```

Verify the result:

```sh
node scripts/check-advanced-spec.js
# Gate 1 protected: principal=gate1-owner fingerprint=SHA256:...
```

To change a frozen test, first copy `wiki/gate1/unfreeze-request.template.md`
to a dated file under `wiki/gate1/unfreeze-requests/` and fill in its evidence
and authorization. An agent may draft that request and the patch; only you may
sign. `node scripts/approve-gate1.js status` verifies without changing anything,
and there is no `unlock` — an armed gate is re-signed, never disarmed.

### Enforcing human presence (optional)

Once you are on a FIDO key, add `verify-required` to the pin line in
`wiki/gate1/gate1.allowed-signers`:

```
gate1-owner namespaces="rig-gate1" verify-required sk-ssh-ed25519@openssh.com AAAA...
```

OpenSSH will then reject any signature that does not record that the user was
verified. **This retires plain keys immediately** — the option is only valid for
`ecdsa-sk` and `ed25519-sk`, and a plain `ssh-ed25519` key fails closed with
`invalid key`. Do not add it until you can sign from every machine you need to.

---

## Rotating the signing key

Read this before generating a replacement — step 3 is easy to miss and will
block every merge until it is done.

1. Create the new key using your platform's section above.
2. Re-sign: `node scripts/approve-gate1.js` (confirm the digest when prompted).
   This rewrites `wiki/gate1/gate1.allowed-signers` with the new public key.
3. **Update the `GATE1_FINGERPRINT` repository secret on GitHub** to the new
   fingerprint, which `check-advanced-spec.js` prints and you can also get from:

   ```sh
   ssh-keygen -lf ~/.ssh/gate1.pub
   ```

   CI compares the pinned key against that secret from outside the repository.
   If you skip this step, the `gate1-pin` check fails on every pull request —
   correctly, because from CI's point of view an unrecognised key signing the
   oracle is indistinguishable from a forgery.
4. Record the rotation in `wiki/topics/gate1-signing.md` under "Standing".

`gate1.allowed-signers` is a **generated** file: exactly one principal line, no
comments. Do not hand-edit it and do not add commentary to it — the ceremony
rewrites it on every run. Provenance belongs in the signing hub.

---

## Troubleshooting

**`set RIG_GATE1_SIGNING_KEY or copy .credentials/gate1.env.example to .context/gate1.env`**
The ceremony found no key configuration. Create `.context/gate1.env` as above.

**`RIG_GATE1_SIGNING_KEY does not exist: <path>`**
The path resolved to nothing. `~` and `$HOME` are expanded; other shell syntax
is not, because the file is parsed literally rather than evaluated.

**`oracle digest confirmation required`**
Working as designed — read the printed diff, then re-run with
`--confirm-digest-delta <digest>`.

**Signing hangs, or "agent refused operation"**
The private half lives in an agent that is not reachable. On macOS confirm
Secretive is running; elsewhere check `ssh-add -l` lists the key and that
`SSH_AUTH_SOCK` is set.

**FIDO key: `device not found` / no touch prompt**
udev rules were not applied to an already-inserted token. Reload them and
re-insert (see the Debian section). On Windows, run PowerShell as the logged-in
desktop user — a remote session cannot reach the token.

**CI `gate1-pin` fails with "the signing key is not the pinned owner key"**
Either you rotated without doing step 3 of
[Rotating the signing key](#rotating-the-signing-key), or the oracle was signed
by a key that is not yours. Check the fingerprint the job prints before assuming
the former.
