---
date: 2026-10-13
source: owner
topics: the-overhaul, agent-working-conventions
decisions:
status: current
supersedes:
tags: grilling, scope
summary: Owner's round-1 answers for the close-everything branch — scope is every genuinely open item (redesign deferred), GitHub and tracker are reconciled against reality in both directions, every item is fixed unless a strong written replaced-by reason exists, one batched re-sign at the end, one branch and one PR to qa-prod.
---

# Close-everything branch — owner answers, round 1

## Verbatim

> For question 1 I'd say anything that is genuinely open. Compare whatever is
> open right now. Say if there are conflicts between GitHub issues and the
> tracker, then just check whether they are actually open and bring them into
> sync. Say if the tracker is well ahead of itself, then revert the status of a
> few tickets. If the GitHub issue is prematurely closed, then just sync all of
> that up. Just close down everything. I think there was a redesigned path and
> all. I think we'll do that later.
>
> I'll sign everything once everything has been finalized. I think the item can
> be closed as "won't do/replaced" but it shouldn't be a cheap response saying,
> "Okay I don't want to do this" or "This is too tough." That is not really a
> thing. Code is cheap. We are going to do everything so fix everything. If it
> is not fixed give it a really good reason and mark it as replaced. At the end
> it should be a finished product. That is all that I care about.
>
> Treat me as a product manager. I want a finished product that is coherent.
> That is what "closed" means: closed with a really good reason, not just a
> flaky reason. One branch and one PR. We'll just close out all the existing
> issues so that I can just go back into redesigning the entire product. I
> think there was a redesign. I have a new bunch of ideas that I want to work
> on. That is how I want to proceed.

## What this locks

1. **Scope:** every genuinely open item, verified against the code — not
   against either tracker. The September redesign (overhaul) is out of scope
   for this branch; it is next.
2. **Sync rule:** reality wins. Board ahead of reality → revert the card.
   GitHub closed prematurely → reopen and work it. Both trackers end agreeing.
3. **Close bar:** fix is the default ("code is cheap"). "Replaced" is allowed
   only with a strong written reason naming what replaces it; difficulty or
   preference is never a reason.
4. **Signing:** one batched re-sign after everything is finalized.
5. **Shipping:** one branch, one PR, base `qa-prod`.
6. **Goal:** a coherent finished product, clearing the deck for the owner's
   redesign.

## Still to ask

Production-maintenance level; what end-product finish means for the depth axis.
