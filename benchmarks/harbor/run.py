#!/usr/bin/env python3
"""Reproducible Harbor benchmark entry point with a no-model local fixture transport."""
import argparse
import datetime as dt
import difflib
import hashlib
import json
import os
import random
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path
try:
    from .rig_agent import guard_session_result
except ImportError:
    from rig_agent import guard_session_result

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
TASKS = ROOT / 'benchmarks/tasks/rig-vague'

MODEL_PRICING = {
    'claude-haiku-4-5-20251001': {'input': 1.0, 'output': 5.0, 'cache_write_5m': 1.25,
        'cache_write_1h': 2.0, 'cache_hit': 0.10, 'source': 'https://www-cdn.anthropic.com/files/4zrzovbb/website/3684c2faafb97418665782cea0001f439f74b1d2.pdf', 'as_of': '2026-05-27'},
    'claude-sonnet-4-6': {'input': 3.0, 'output': 15.0, 'cache_write_5m': 3.75,
        'cache_write_1h': 6.0, 'cache_hit': 0.30, 'source': 'https://www-cdn.anthropic.com/files/4zrzovbb/website/3684c2faafb97418665782cea0001f439f74b1d2.pdf', 'as_of': '2026-05-27'},
    'claude-opus-4-1': {'input': 15.0, 'output': 75.0, 'cache_write_5m': 18.75,
        'cache_write_1h': 30.0, 'cache_hit': 1.50, 'source': 'https://www-cdn.anthropic.com/files/4zrzovbb/website/3684c2faafb97418665782cea0001f439f74b1d2.pdf', 'as_of': '2026-05-27'},
}



def read_arms():
    try:
        import yaml
    except ImportError as exc:
        raise SystemExit('Install requirements-dev.txt to read the pinned arm configuration') from exc
    with (HERE / 'arms.yaml').open(encoding='utf-8') as f:
        return yaml.safe_load(f)['arms']


def read_split(which):
    data = json.loads((HERE / 'split.json').read_text())
    return data[which]


def enforce_token_cap(row, cap):
    # Reject over-cap solutions while retaining the true token and cost totals.
    tokens_in, tokens_out = row.get('tokens_in'), row.get('tokens_out')
    if not isinstance(tokens_in, int) or not isinstance(tokens_out, int):
        raise RuntimeError('cannot enforce token cap without complete token usage')
    used = tokens_in + tokens_out
    if not isinstance(used, int):
        raise RuntimeError('cannot enforce token cap without complete token usage')
    row['cap_exceeded'] = used > cap
    if row['cap_exceeded']:
        row['passed'] = False
    return row


def trial_to_row(arm, task, run, cap, harness_bytes, trial_result):
    """Convert Harbor's measured TrialResult and agent metadata into one row."""
    tokens_in, cache_tokens, tokens_out, cost_usd = trial_result.compute_token_cost_totals()
    if tokens_in is None or tokens_out is None or cost_usd is None:
        raise RuntimeError('Harbor did not record complete input/output/cost usage; refusing incomplete baseline row')
    if not trial_result.reward_valid:
        raise RuntimeError('Harbor trial reward is missing or invalid; refusing baseline row')
    rewards = trial_result.verifier_result.rewards
    if not isinstance(rewards, dict) or 'reward' not in rewards:
        raise RuntimeError('Harbor primary reward is missing; refusing baseline row')
    primary_reward = rewards['reward']
    if isinstance(primary_reward, bool) or not isinstance(primary_reward, (int, float)) or primary_reward not in (0, 1):
        raise RuntimeError('Harbor primary reward is not binary; refusing baseline row')
    metadata = getattr(trial_result.agent_result, 'metadata', None) or {}
    before = metadata.get('rig_hidden_tests_before')
    after = metadata.get('rig_hidden_tests_after')
    diff = metadata.get('rig_task_diff')
    if not isinstance(before, dict) or not before or not isinstance(after, dict):
        raise RuntimeError('Harbor agent metadata lacks hidden-test hashes; refusing baseline row')
    if not isinstance(diff, dict) or any(type(diff.get(key)) is not int or diff[key] < 0
                                         for key in ('lines_added', 'lines_removed', 'sloc')):
        raise RuntimeError('Harbor agent metadata lacks measured task diff; refusing baseline row')
    prices = MODEL_PRICING.get(arm['model'])
    if prices is None:
        raise RuntimeError(f"missing exact list-price metadata for {arm['model']}")
    row = {'arm': arm['id'], 'task': task, 'run': run,
           'model': trial_result.agent_info.model_info.name,
           'seed': 0, 'passed': primary_reward == 1,
           'tokens_in': tokens_in, 'tokens_out': tokens_out,
           'fit_tokens': None, 'cache_tokens': cache_tokens, 'cost_usd': cost_usd,
           'prices': prices, 'pricing_source': prices['source'], 'pricing_as_of': prices['as_of'],
           'tampered': None, 'sloc': diff['sloc'], 'interventions': None,
           'intervention_gap': 'Harbor TrialResult does not record human intervention counts',
           'harness_bytes': harness_bytes, 'pack_sources': arm.get('pack_sources'),
           'pack_digest': arm.get('pack_digest'), 'lines_added': diff['lines_added'],
           'lines_removed': diff['lines_removed'], 'dead_left': None, 'dup_left': None,
           'token_cap': cap, 'started_at': dt.datetime.now(dt.timezone.utc).isoformat(),
           'comparison_window': {'start': 'pending', 'end': 'pending'},
           'cleanup_gap': 'Harbor integration measures changed lines and SLOC; dead-code and duplicate-block detectors are not available',
           'fit_gap': 'Harbor reports total usage, not separate fit-step tokens; fit_tokens remains null and cost uses Harbor total'}
    row = guard_session_result(row, before, after)
    return enforce_token_cap(row, cap)


def _fixture_snapshot(root):
    root = Path(root)
    excluded = {'inner.py', 'sessions.jsonl', 'final.marker'}
    return {p.relative_to(root).as_posix(): p.read_text(errors='replace').splitlines()
            for p in root.rglob('*') if p.is_file() and p.name not in excluded}


def _fixture_diff(before, after):
    added = removed = sloc = 0
    for name in sorted(set(before) | set(after)):
        left, right = before.get(name, []), after.get(name, [])
        sloc += sum(bool(line.strip()) for line in right)
        for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=left, b=right).get_opcodes():
            if tag in ('insert', 'replace'): added += j2 - j1
            if tag in ('delete', 'replace'): removed += i2 - i1
    return added, removed, sloc


def session_fixture(arm, task, run, cap):
    inner = os.environ.get('RIG_BENCH_FIXTURE_INNER')
    if not inner:
        raise SystemExit('fixture mode requires RIG_BENCH_FIXTURE_INNER pointing to a local transport')
    task_root = Path(os.environ['RIG_BENCH_FIXTURE_TASK'])
    before = _fixture_snapshot(task_root)
    completed = subprocess.run([sys.executable, inner], cwd=task_root,
                               capture_output=True, text=True, check=False)
    if completed.returncode:
        raise RuntimeError(completed.stderr or completed.stdout)
    result = json.loads(completed.stdout)
    lines_added, lines_removed, sloc = _fixture_diff(before, _fixture_snapshot(task_root))
    price = arm.get('fixture_prices', {'input': 1.0, 'output': 5.0})
    fit = int(result.get('fit_tokens', 0))
    tokens_in, tokens_out = int(result.get('tokens_in', 0)), int(result.get('tokens_out', 0))
    fixture_cost = ((tokens_in + fit) * price['input'] + tokens_out * price['output']) / 1_000_000
    result.update({'arm': arm['id'], 'task': task, 'run': run, 'model': arm['model'],
                   'seed': 0, 'passed': bool(result.get('passed')), 'token_cap': cap,
                   'tokens_in': tokens_in, 'tokens_out': tokens_out, 'fit_tokens': fit,
                   'cost_usd': fixture_cost,
                   'prices': price, 'pricing_source': 'local fixture-only rates; not model pricing', 'started_at': dt.datetime.now(dt.timezone.utc).isoformat(),
                   'comparison_window': {'start': 'fixture', 'end': 'fixture'},
                   'harness_bytes': 0 if arm['rig_ref'] == 'none' else _fixture_harness_bytes(arm),
                   'tampered': bool(result.get('tampered')), 'sloc': sloc,
                   'interventions': int(result.get('interventions', 0)),
                   'lines_added': lines_added, 'lines_removed': lines_removed, 'dead_left': None, 'dup_left': None,
                   'cleanup_gap': 'fixture transport does not run dead-code or duplicate-block detectors'})
    return enforce_token_cap(result, cap)


def _fixture_harness_bytes(arm):
    with tempfile.TemporaryDirectory(prefix='rig-fixture-archive-') as directory:
        archive, _, _ = pinned_archive(arm['rig_ref'], directory)
        return archive.stat().st_size



def build_pack_archive(pack, directory):
    """Stage pinned, hash-checked upstream skill files without running upstream installers."""
    import tomllib
    lock = json.loads((ROOT / 'rig/upstreams/lock.json').read_text())
    ids = {'ecc': ['affaan-m__ECC'],
           'hand-stacked': ['obra__superpowers', 'garrytan__gstack', 'DietrichGebert__ponytail']}[pack]
    fork = Path(os.environ.get('RIG_FORK_DIR', '/Users/winmore/conductor/workspaces/rig-v0.1/davao-v1/.context/fork'))
    staged = Path(directory) / 'pack-root'
    staged.mkdir()
    manifest = {'pack': pack, 'sources': [], 'files': []}
    for source_id in ids:
        upstream = next((item for item in lock['upstreams'] if item['id'] == source_id), None)
        if not upstream or not upstream.get('included'):
            raise RuntimeError(f'benchmark pack source is not pinned in lock: {source_id}')
        source_root = fork / 'skill-packs' / source_id
        if not source_root.is_dir():
            raise RuntimeError(f'read-only fork source is missing: {source_root}')
        manifest['sources'].append({'id': source_id, 'commit': upstream['commit']})
        for item in upstream['paths']:
            rel = Path(item['path'])
            parts = rel.parts
            if pack == 'ecc':
                if parts[0] == '.agents' and len(parts) > 2 and parts[1] in {'skills', 'rules'}:
                    target = Path('.claude', *parts[1:])
                elif parts[0] == '.claude': target = rel
                elif parts[0] in {'agents', 'commands', 'rules', 'hooks'}: target = Path('.claude', *parts)
                else: continue
            elif source_id == 'obra__superpowers':
                if parts[0] != 'skills' or len(parts) < 3: continue
                target = Path('.claude/skills', *parts[1:])
            elif source_id == 'garrytan__gstack':
                if len(parts) < 2 or parts[-1] not in {'SKILL.md', 'README.md'} and 'sections' not in parts: continue
                target = Path('.claude/skills/gstack', *parts)
            else:
                if len(parts) < 3 or parts[0] != 'skills': continue
                target = Path('.claude/skills/ponytail', *parts[1:])
            source = source_root / rel
            if not source.is_file() or source.is_symlink():
                raise RuntimeError(f'pinned pack file is missing or not regular: {source_id}:{rel}')
            digest = hashlib.sha256(source.read_bytes()).hexdigest()
            if digest != item['sha256']:
                raise RuntimeError(f'pinned pack file hash mismatch: {source_id}:{rel}')
            destination = staged / target
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)
            manifest['files'].append({'source': f'{source_id}/{rel.as_posix()}', 'target': target.as_posix(), 'sha256': digest})
    if not manifest['files']:
        raise RuntimeError(f'benchmark pack has no files: {pack}')
    (staged / 'rig-benchmark-pack.json').write_text(json.dumps(manifest, sort_keys=True, indent=2) + '\n')
    archive = Path(directory) / 'pack.tar'
    with tarfile.open(archive, 'w') as tar:
        for path in sorted(staged.rglob('*')):
            tar.add(path, arcname=path.relative_to(staged))
    return archive, hashlib.sha256(archive.read_bytes()).hexdigest(), manifest


def harbor_trial(arm, task_path, trials_dir):
    """Start one pinned Harbor trial through Harbor's public CLI."""
    if shutil.which('harbor') is None:
        raise SystemExit('Harbor CLI is unavailable; install the pinned requirements-dev.txt first')
    args = ['harbor', 'trials', 'start', '--path', str(task_path),
            '--agent', 'benchmarks.harbor.rig_agent:RigInstalled',
            '--model', arm['model'], '--trials-dir', str(trials_dir),
            '--agent-kwarg', f"inner={arm['inner']}",
            '--agent-kwarg', f"rig_ref={arm['rig_ref']}",
            '--agent-kwarg', f"pack={arm.get('pack') or ''}"]
    if arm.get('ablate_role'): args.extend(['--agent-kwarg', f"ablate_role={arm['ablate_role']}"])
    for key in ('rig_archive', 'rig_commit', 'rig_digest', 'pack_archive', 'pack_digest'):
        if arm.get(key): args.extend(['--agent-kwarg', f'{key}={arm[key]}'])
    completed = subprocess.run(args, cwd=ROOT, text=True, capture_output=True)
    if completed.returncode:
        raise RuntimeError(completed.stderr or completed.stdout)
    results = sorted(Path(trials_dir).rglob('result.json'), key=lambda p: p.stat().st_mtime)
    if not results:
        raise RuntimeError('Harbor completed without a result.json session record')
    return json.loads(results[-1].read_text())


def pinned_archive(ref, directory):
    commit = subprocess.run(['git', 'rev-parse', '--verify', f'{ref}^{{commit}}'],
                            cwd=ROOT, text=True, capture_output=True, check=True).stdout.strip()
    archive = Path(directory) / 'rig-source.tar'
    with archive.open('wb') as stream:
        subprocess.run(['git', 'archive', '--format=tar', f'--prefix=rig-benchmark/', ref],
                       cwd=ROOT, stdout=stream, check=True)
    return archive, commit, hashlib.sha256(archive.read_bytes()).hexdigest()


def verify_tasks(directory, output):
    root = Path(directory).resolve()
    rows = []
    for task in sorted(p for p in root.iterdir() if p.is_dir()):
        env = task / 'environment'
        tests = task / 'tests'
        reference = task / 'solution/app.py'
        visible = any(p.name in {'tests', 'test'} for p in env.rglob('*'))
        results = []
        for source in (env, task / 'solution'):
            with tempfile.TemporaryDirectory(prefix='rig-task-check-') as tmp:
                app_root = Path(tmp) / 'app'
                shutil.copytree(source, app_root)
                app = app_root / 'app.py'
                code = ("import importlib.util, pathlib; "
                        f"p=pathlib.Path({str(tests)!r}); "
                        "[(__import__('sys').path.insert(0, str(f.parent)), "
                        "(lambda s: [getattr(m, n)() for n in dir(m) if n.startswith('test_')])( "
                        "(lambda s: (s.loader.exec_module(m), m)[1])(s))) "
                        "for f in p.glob('test_*.py') "
                        "for s in [importlib.util.spec_from_file_location('fixture_tests', f)] "
                        "for m in [importlib.util.module_from_spec(s)]]")
                result = subprocess.run([sys.executable, '-c', code], cwd=tmp,
                    env={**os.environ, 'TASK_APP': str(app), 'TASK_ENV': str(app_root)}, capture_output=True, text=True)
                if result.returncode and source.name == 'solution':
                    detail = (result.stderr or result.stdout).strip().splitlines()[-1:]
                    sys.stderr.write(f"{task.name}: reference failed: {' '.join(detail)}\n")
                results.append(result.returncode == 0)
        rows.append({'task': task.name, 'category': _category(task / 'task.toml'),
                     'agent_can_read_hidden_tests': visible, 'starter_passed': results[0],
                     'reference_passed': results[1]})
    Path(output).write_text(json.dumps(rows, indent=2) + '\n')
    return rows


def _category(path):
    import tomllib
    return tomllib.loads(path.read_text())['metadata']['category']


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--arms', default='plain')
    parser.add_argument('--split', choices=['practice', 'test'], default='practice')
    parser.add_argument('--runs', type=int, default=3)
    parser.add_argument('--token-cap', type=int, default=100_000)
    parser.add_argument('--final', action='store_true')
    parser.add_argument('--verify-tasks')
    parser.add_argument('--output')
    parser.add_argument('--tasks', help='comma-separated task IDs; must belong to selected split')
    args = parser.parse_args()
    if args.verify_tasks:
        if not args.output: parser.error('--verify-tasks requires --output')
        rows = verify_tasks(args.verify_tasks, args.output)
        if len(rows) < 30 or any(r['agent_can_read_hidden_tests'] or r['starter_passed'] or not r['reference_passed'] for r in rows):
            raise SystemExit('task validation failed')
        return
    if args.split == 'test':
        if not args.final: raise SystemExit('test split is reserved for one --final run')
        marker = Path(os.environ.get('RIG_BENCH_FINAL_MARKER', HERE / '.final-used'))
        try: fd = os.open(marker, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        except FileExistsError: raise SystemExit('final test split has already been used')
        os.close(fd)
    selected = args.arms.split(',')
    arms = [a for a in read_arms() if a['id'] in selected]
    if {a['id'] for a in arms} != set(selected): raise SystemExit('unknown arm id')
    unsupported = [a['id'] for a in arms if a.get('ablate_role')]
    if unsupported and not os.environ.get('RIG_BENCH_FIXTURE_TASK'):
        raise SystemExit('live run blocked: ablation artifacts are not built for ' + ', '.join(unsupported))
    tasks = [os.environ['RIG_BENCH_FIXTURE_TASK']] if os.environ.get('RIG_BENCH_FIXTURE_TASK') else read_split(args.split)
    if args.tasks:
        requested = args.tasks.split(',')
        if not set(requested) <= set(tasks): raise SystemExit('requested tasks must belong to the selected split')
        tasks = requested
    if not os.environ.get('RIG_BENCH_FIXTURE_TASK'):
        unresolved = [f"{a['id']} ({a['model']})" for a in arms if a['model'] not in MODEL_PRICING]
        if unresolved:
            raise SystemExit('live run blocked: no exact model pricing metadata for ' + ', '.join(unresolved))
    output = Path(os.environ.get('RIG_BENCH_FIXTURE_OUTPUT', ROOT / 'benchmarks/results/sessions.jsonl'))
    output.parent.mkdir(parents=True, exist_ok=True)
    window_start = dt.datetime.now(dt.timezone.utc).isoformat()
    rows = []
    for task in tasks:
        for arm in arms:
            for run in range(1, args.runs + 1):
                    if os.environ.get('RIG_BENCH_FIXTURE_TASK'):
                        row = session_fixture(arm, task, run, args.token_cap)
                    else:
                        fork = Path(os.environ.get('RIG_FORK_DIR', '/Users/winmore/conductor/workspaces/rig-v0.1/victoria-v1/fork'))
                        public = fork / 'benchmark-tooling/harbor-framework__terminal-bench-2' / task
                        task_path = public if public.is_dir() else TASKS / task
                        harness_bytes = 0 if arm['rig_ref'] == 'none' else None
                        with tempfile.TemporaryDirectory(prefix='rig-harbor-trial-') as trial_dir:
                            if arm['rig_ref'] != 'none':
                                archive, commit, digest = pinned_archive(arm['rig_ref'], trial_dir)
                                arm['rig_archive'], arm['rig_commit'], arm['rig_digest'] = str(archive), commit, digest
                                harness_bytes = archive.stat().st_size
                            if arm.get('pack'):
                                pack_archive, pack_digest, pack_manifest = build_pack_archive(arm['pack'], trial_dir)
                                arm['pack_archive'], arm['pack_digest'] = str(pack_archive), pack_digest
                                arm['pack_sources'] = pack_manifest['sources']
                                harness_bytes = pack_archive.stat().st_size
                            raw = harbor_trial(arm, task_path, trial_dir)
                        from harbor.models.trial.result import TrialResult
                        trial_result = TrialResult.model_validate(raw)
                        row = trial_to_row(arm, task, run, args.token_cap, harness_bytes, trial_result)
                    rows.append(row)
    window_end = dt.datetime.now(dt.timezone.utc).isoformat()
    for row in rows:
        row['comparison_window'] = {'start': window_start, 'end': window_end}
        row['started_at'] = row.get('started_at') or window_start
    with output.open('a', encoding='utf-8') as f:
        for row in rows:
            f.write(json.dumps(row, sort_keys=True) + '\n')

if __name__ == '__main__':
    main()
