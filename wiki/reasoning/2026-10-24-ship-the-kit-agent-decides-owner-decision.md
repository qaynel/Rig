---
date: 2026-10-24
source: owner
topics: product-direction, onboarding, distribution-and-release, gate1-signing
decisions: ship every capability advertised and let the host agent graft; release approval needs real authentication with no secret leakage
status: current
supersedes:
tags: owner-decision, onboarding, install-scope, release-authorisation
summary: Owner rejected the install-scope question outright — Rig is a starter pack thrown at the user's agent, which decides what to onboard. Offline search ships included and described. Separately, publishing must require real authentication covering principal and key, implemented completely, with no secret written anywhere that reaches git.
---

# Ship the kit; the agent decides. And authenticate releases properly.

## The install-scope question should never have been asked

The owner was asked whether offline meaning-based search belongs in the default
install or should be fetched on request. The question was wrong, not merely
badly worded.

> This is the issue with memory, right? You wouldn't have asked me this because
> the entire point of Rig is that the agent would dynamically onboard. Whatever
> agent is running on the user side would dynamically onboard whatever is
> required. It would see that this thing is there and then you would advertise
> it... Then it's up to the agent's reasoning to bring it in or not.
>
> Just ship it out with the description and all, and then say that this would be
> used so and so forth. Let the agent decide on the user's side whether it's
> relevant to that project or not, or whether the user already has something
> like that, so it need not be.
>
> Don't ask me such questions. These are very bad questions because this is the
> entire spirit of Rig and you're asking me the same question again and again.
> The user's agent is the best person who understands the project so they should
> be deciding how Rig should be onboarded. Our entire job is to give all the
> tools the agent wants so that it could function — it's an all-in-one sort of
> kit, a starter pack. You throw it at the agent and now the agent knows a lot
> of things.

In a later message, unambiguously: *"Yeah just install that, this thing, offline
search. Install that."*

This is locked items 1 and 2 restated. It is recorded again as its own locked
item because the repeated asking, not the eventual answer, is what costs the
owner time. The operative rule now reads: ship everything complete and
described, and never put install scope, shipped size or per-host coverage to
the owner as a question.

### What this means for the work in flight

Offline search ships. The two data files and their reader are part of the kit,
carried with a description of what the capability does and when an agent should
graft it. Whether a given project ends up using it is the host agent's call,
made against that project — not a packaging decision taken here. The open item
that previously read "decide default-install scope" is closed by this.

## Release approval must actually authenticate

> Yeah make me confirm: there's a username and then there's a user key and all.
> All of this must be part of the authentication steps — and do not leave git
> traces and all, that's a pretty dumb thing to do. There should be name-based
> authentication but then remove all of that. Keep it hand-secret: handling
> needs to be there. We want authentication but we don't want the downsides of
> leaking the name and stuff. Just keep it like: authenticate, you see the
> authentication, then only proceed, and then you handle the secret correctly
> so that it's not leaked into git, GitHub and all.

Three requirements, all of which must land together:

1. **Authenticate for real.** Publishing currently accepts any non-empty
   approver name and verifies nothing. That is replaced by an authentication
   the agent cannot perform, per owner decision 24 — the owner's Secure Enclave
   signature, or an equivalent human prompt.
2. **Principal and key both count.** The check covers who is claiming to
   approve and the key that backs the claim. A name alone is not an identity.
3. **No secret reaches the repository.** No identity, key material, token or
   derived secret may be written into a tracked file, a commit message, or
   anything pushed to GitHub. The owner called leaving such traces "a pretty
   dumb thing to do," and the existing rule that installed repositories never
   receive secrets or generated environment files extends to this path.

> Make it complete. Don't half-heartedly attempt anything.

So the gate is not satisfied by checking a signature and leaving the secret
handling for later; both halves ship together or neither does.

## Not committing

Asked whether the uncommitted work should be saved into history, the owner
first said yes and then, in the next message, reversed it: *"Right now we don't
want to save anything. We just keep it uncommitted until we have done anything
for it."* The later instruction governs. Nothing is committed. A deployment
tracker holds the state instead, so the work is still resumable.
