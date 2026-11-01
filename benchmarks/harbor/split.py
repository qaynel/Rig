#!/usr/bin/env python3
"""Stable, seeded partitioning for the pinned Terminal-Bench task identifiers."""
import hashlib


def generate_split(task_ids, seed):
    ids = list(task_ids)
    if len(ids) != len(set(ids)):
        raise ValueError('task identifiers must be unique')
    shuffled = sorted(ids, key=lambda item: hashlib.sha256(f'{seed}\0{item}'.encode()).digest())
    # Keep roughly one fifth untouched for final scoring, with both sets nonempty.
    holdout = max(1, round(len(shuffled) * 0.2))
    if len(shuffled) > 1:
        holdout = min(holdout, len(shuffled) - 1)
    return {'seed': seed, 'practice': shuffled[holdout:], 'test': shuffled[:holdout]}
