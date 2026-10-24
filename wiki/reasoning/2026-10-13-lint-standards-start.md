---
date: 2026-10-13
source: agent
topics: onboarding-flow, install-manifest-removal, testing-strategy
decisions:
status: historical
supersedes:
tags: interdependency
summary: Setup replacement uses typed journal records and explicit separate approval; standards completion evidence will execute referenced tests rather than inspect titles.
---
Read the routing, owner decisions, primer, setup preferences and reviewed subplans 05/07. Existing journalWriter already retains preimages, but lifecycle only deletes generic owned files and does not restore target lint configs. The change will reuse journalWriter with a narrow typed record and recover before ordinary lifecycle deletion. Shared TOML proposals may change only approved tool sections, preserving all other bytes. Separate SSH approval uses a distinct namespace. Standards evidence must resolve actual passing executed tests; existing title reference hygiene remains separate. Root owns wiki hubs and integration; no protected oracle bytes will change.
