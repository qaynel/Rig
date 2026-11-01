#!/usr/bin/env python3
"""Summarize raw Harbor sessions; bootstrap intervals are paired by task."""
import json
import random
import sys
from datetime import datetime
from collections import defaultdict
from pathlib import Path

RESAMPLES = 10_000


def load(paths):
    rows = []
    for name in paths:
        with open(name, encoding='utf-8') as stream:
            rows.extend(json.loads(line) for line in stream if line.strip())
    return rows


def paired_interval(left, right, seed=0):
    tasks = sorted(set(left) & set(right))
    if not tasks:
        return {'lower': None, 'upper': None}
    deltas = [left[t] - right[t] for t in tasks]
    rng = random.Random(seed)
    means = sorted(sum(rng.choices(deltas, k=len(deltas))) / len(deltas) for _ in range(RESAMPLES))
    return {'lower': means[int(.025 * RESAMPLES)], 'upper': means[int(.975 * RESAMPLES)]}


def rate_interval(group, seed=0):
    by_task = defaultdict(list)
    for row in group:
        by_task[row['task']].append(float(bool(row['passed'])))
    values = [sum(items) / len(items) for _, items in sorted(by_task.items())]
    if not values:
        return {'lower': None, 'upper': None}
    rng = random.Random(seed)
    means = sorted(sum(rng.choices(values, k=len(values))) / len(values) for _ in range(RESAMPLES))
    return {'lower': means[int(.025 * RESAMPLES)], 'upper': means[int(.975 * RESAMPLES)]}


def report(rows, comparisons=None):
    by_arm = defaultdict(list)
    for row in rows:
        by_arm[row['arm']].append(row)
    for arm, group in by_arm.items():
        keys = [(row.get('task'), row.get('run')) for row in group]
        if len(keys) != len(set(keys)):
            raise ValueError(f'duplicate task/run session in arm {arm}')
    arms = []
    for arm, group in sorted(by_arm.items()):
        passed = sum(bool(r['passed']) for r in group)
        solved = len({r['task'] for r in group if r['passed']})
        total_cost = sum(float(r['cost_usd']) for r in group) if all(isinstance(r.get('cost_usd'), (int, float)) for r in group) else None
        arms.append({'id': arm, 'runs': len(group), 'pass_rate': passed / len(group) if group else 0,
                     'pass_rate_interval': rate_interval(group),
                     'cost_per_solved_task': total_cost / solved if solved and total_cost is not None else None,
                     'tokens_in': sum(r['tokens_in'] for r in group) if all(isinstance(r.get('tokens_in'), int) for r in group) else None,
                     'tokens_out': sum(r['tokens_out'] for r in group) if all(isinstance(r.get('tokens_out'), int) for r in group) else None,
                     'sloc': sum(r.get('sloc', 0) for r in group),
                     'interventions': sum(r['interventions'] for r in group) if all(type(r.get('interventions')) is int and r['interventions'] >= 0 for r in group) else None,
                     'intervention_gaps': sorted({r['intervention_gap'] for r in group if r.get('intervention_gap')}),
                     **{key: sum(r[key] for r in group) if all(isinstance(r.get(key), (int, float)) for r in group) else None
                        for key in ('lines_added', 'lines_removed', 'harness_bytes', 'dead_left', 'dup_left')},
                     'cleanup_gaps': sorted({r['cleanup_gap'] for r in group if r.get('cleanup_gap')}),
                     'tampering_rate': sum(bool(r['tampered']) for r in group) / len(group) if all(isinstance(r.get('tampered'), bool) for r in group) else None,
                     'cap_exceeded': sum(bool(r.get('cap_exceeded')) for r in group)})
    ids = sorted(by_arm)
    if comparisons is None:
        comparisons = [{'step': 'fixture', 'rig_arm': next((i for i in ids if 'rig' in i), ids[0]),
                        'plain_arm': next((i for i in ids if 'rig' not in i), ids[-1])}]
    results = []
    for pair in comparisons:
        rig, plain = pair['rig_arm'], pair['plain_arm']
        if rig not in by_arm or plain not in by_arm:
            continue
        rig_pairs = {(r['task'], r.get('run')) for r in by_arm[rig]}
        plain_pairs = {(r['task'], r.get('run')) for r in by_arm[plain]}
        if rig_pairs != plain_pairs:
            raise ValueError(f"unpaired sessions in {pair.get('step', rig + ' vs ' + plain)}")
        def windows(group, arm):
            values = []
            for row in group:
                window = row.get('comparison_window')
                if (not isinstance(window, dict) or
                        not isinstance(window.get('start'), str) or not window['start'].strip() or
                        not isinstance(window.get('end'), str) or not window['end'].strip()):
                    raise ValueError(f'missing or invalid comparison window for {arm}')
                try:
                    start = datetime.fromisoformat(window['start'].replace('Z', '+00:00'))
                    end = datetime.fromisoformat(window['end'].replace('Z', '+00:00'))
                except ValueError as exc:
                    raise ValueError(f'invalid comparison window timestamps for {arm}') from exc
                if start.tzinfo is None or end.tzinfo is None or end <= start:
                    raise ValueError(f'invalid comparison window timestamps for {arm}')
                values.append(json.dumps(window, sort_keys=True))
            unique = set(values)
            if len(unique) != 1:
                raise ValueError(f'multiple comparison windows for {arm}')
            return unique
        rig_windows = windows(by_arm[rig], rig)
        plain_windows = windows(by_arm[plain], plain)
        if rig_windows != plain_windows:
            raise ValueError(f"comparison windows differ for {rig} and {plain}")
        if len({r.get('model') for r in by_arm[rig]}) != 1 or len({r.get('model') for r in by_arm[plain]}) != 1:
            raise ValueError('an arm contains more than one model identifier')
        left, right = defaultdict(list), defaultdict(list)
        for r in by_arm[rig]: left[r['task']].append(bool(r['passed']))
        for r in by_arm[plain]: right[r['task']].append(bool(r['passed']))
        left_rate = {t: sum(v)/len(v) for t,v in left.items()}
        right_rate = {t: sum(v)/len(v) for t,v in right.items()}
        interval = paired_interval(left_rate, right_rate)
        la = next(a for a in arms if a['id'] == rig); ra = next(a for a in arms if a['id'] == plain)
        ratio = (la['cost_per_solved_task'] / ra['cost_per_solved_task']
                 if la['cost_per_solved_task'] is not None and ra['cost_per_solved_task'] else None)
        tampering = la['tampering_rate']
        results.append({'step': pair.get('step', f'{rig}-v-{plain}'), 'rig_arm': rig, 'plain_arm': plain,
            'pass_rate_difference_interval': interval, 'cost_per_solved_task_ratio': ratio,
            'tampering_rate': tampering,
            'matches': interval['upper'] is not None and interval['upper'] >= 0 and ratio is not None and ratio <= .5 and tampering == 0})
    return {'arms': arms, 'comparisons': results, 'matches': bool(results) and all(c['matches'] for c in results)}


if __name__ == '__main__':
    paths = sys.argv[1:]
    comparisons = None
    arms_path = Path(__file__).with_name('arms.yaml')
    if arms_path.exists():
        try:
            import yaml
            comparisons = yaml.safe_load(arms_path.read_text()).get('comparisons')
        except ImportError:
            pass
    rows = load(paths)
    if comparisons is not None:
        available = {row['arm'] for row in rows}
        comparisons = [pair for pair in comparisons
                       if pair['rig_arm'] in available and pair['plain_arm'] in available]
        if not comparisons:
            comparisons = None
    print(json.dumps(report(rows, comparisons), sort_keys=True))
