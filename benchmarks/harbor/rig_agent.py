"""Harbor custom-agent entry point shared by the three built-in CLI agents."""
import hashlib
import shlex


def hash_hidden_tests(root):
    from pathlib import Path
    root = Path(root)
    return {p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(root.rglob('*')) if p.is_file()}


def guard_session_result(result, before_hashes, after_hashes):
    result = dict(result)
    tampered = before_hashes != after_hashes
    result['tampered'] = tampered
    if tampered:
        result['passed'] = False
    return result


try:
    from harbor.agents.installed.claude_code import ClaudeCode
    from harbor.agents.installed.codex import Codex
    from harbor.agents.installed.cursor_cli import CursorCli
except ImportError:
    ClaudeCode = Codex = CursorCli = object

_INNERS = {'claude-code': ClaudeCode, 'codex': Codex, 'cursor-cli': CursorCli}
_ADAPTERS = {}


def _adapter(base):
    if base not in _ADAPTERS:
        class RigAdapter(base):
            def __init__(self, inner='claude-code', rig_ref='none', pack=None,
                         rig_archive=None, rig_commit=None, rig_digest=None, pack_archive=None, pack_digest=None, ablate_role=None, **kwargs):
                if inner not in _INNERS or _INNERS[inner] is not base:
                    raise ValueError(f'unsupported Harbor inner agent: {inner}')
                self.inner, self.rig_ref, self.pack, self.ablate_role = inner, rig_ref, (pack or None), ablate_role
                if self.ablate_role:
                    raise RuntimeError(f'ablation role {self.ablate_role} has no Stage 2 role-specific artifact')
                self.rig_archive, self.rig_commit, self.rig_digest = rig_archive, rig_commit, rig_digest
                self.pack_archive, self.pack_digest = pack_archive, pack_digest
                super().__init__(**kwargs)

            async def configure(self, environment):
                await super().configure(environment)
                self._hidden_tests_before = await self._hidden_tests_hash(environment)
                if self.rig_ref != 'none':
                    if not self.rig_archive or not self.rig_commit or not self.rig_digest:
                        raise RuntimeError('Rig arms require a local pinned archive, commit, and digest')
                    await environment.upload_file(self.rig_archive, '/tmp/rig-benchmark.tar')
                    digest = shlex.quote(self.rig_digest)
                    commit = shlex.quote(self.rig_commit)
                    await environment.exec(command=(
                        'set -eu; '
                        f"echo '{digest}  /tmp/rig-benchmark.tar' | sha256sum -c -; "
                        'mkdir -p /tmp/rig-benchmark-source; '
                        'tar -xf /tmp/rig-benchmark.tar -C /tmp/rig-benchmark-source; '
                        'sh /tmp/rig-benchmark-source/rig-benchmark/install.sh '
                        '--candidate-artifact /tmp/rig-benchmark.tar '
                        f'--candidate-sha {commit} --candidate-digest {digest} '
                        f'--target "$PWD" --hosts ' + {'claude-code':'claude','codex':'codex','cursor-cli':'cursor'}[self.inner]
                    ))
                if self.pack:
                    if not self.pack_archive or not self.pack_digest:
                        raise RuntimeError(f'{self.pack} pack requires its pinned archive and digest')
                    await environment.upload_file(self.pack_archive, '/tmp/rig-benchmark-pack.tar')
                    digest = shlex.quote(self.pack_digest)
                    await environment.exec(command=(
                        'set -eu; '
                        f"echo '{digest}  /tmp/rig-benchmark-pack.tar' | sha256sum -c -; "
                        'mkdir -p /tmp/rig-benchmark-pack; '
                        'tar -xf /tmp/rig-benchmark-pack.tar -C /tmp/rig-benchmark-pack; '
                        'cp -R /tmp/rig-benchmark-pack/. "$PWD"/'
                    ))
                await environment.exec(command='rm -rf /tmp/rig-benchmark-baseline; cp -a /app /tmp/rig-benchmark-baseline')

            async def _hidden_tests_hash(self, environment):
                command = "find /tests -type f -print0 2>/dev/null | sort -z | xargs -0 -r sha256sum"
                result = await environment.exec(command=command)
                if result.return_code != 0:
                    raise RuntimeError('cannot hash hidden Harbor acceptance tests')
                hashes = {}
                for line in (result.stdout or '').splitlines():
                    digest, _, path = line.partition('  ')
                    hashes[path] = digest
                if not hashes:
                    raise RuntimeError('Harbor did not expose hidden acceptance tests at /tests')
                if not hashes:
                    raise RuntimeError('Harbor did not expose hidden acceptance tests at /tests')
                return hashes

            async def run(self, instruction, environment, context):
                await super().run(instruction, environment, context)
                after = await self._hidden_tests_hash(environment)
                tamper = self._hidden_tests_before != after
                metrics = await environment.exec(command="python3 -c 'import difflib,json,pathlib; a=pathlib.Path(\"/tmp/rig-benchmark-baseline\"); b=pathlib.Path(\"/app\"); files=sorted({str(p.relative_to(a)) for p in a.rglob(\"*\") if p.is_file()}|{str(p.relative_to(b)) for p in b.rglob(\"*\") if p.is_file()}); added=removed=sloc=0;\nfor f in files:\n x=(a/f).read_text(errors=\"replace\").splitlines() if (a/f).is_file() else []; y=(b/f).read_text(errors=\"replace\").splitlines() if (b/f).is_file() else []; sloc+=sum(bool(z.strip()) for z in y);\n for tag,i1,i2,j1,j2 in difflib.SequenceMatcher(a=x,b=y).get_opcodes():\n  added+=j2-j1 if tag in (\"insert\",\"replace\") else 0; removed+=i2-i1 if tag in (\"delete\",\"replace\") else 0\nprint(json.dumps({\"lines_added\":added,\"lines_removed\":removed,\"sloc\":sloc}))'")
                if metrics.return_code != 0:
                    raise RuntimeError('cannot measure task diff after Harbor agent execution')
                context.metadata = {**(context.metadata or {}), 'rig_hidden_tests_before': self._hidden_tests_before, 'rig_hidden_tests_after': after, 'rig_task_diff': __import__('json').loads(metrics.stdout or '{}')}
        RigAdapter.__name__ = f'Rig{base.__name__}'
        _ADAPTERS[base] = RigAdapter
    return _ADAPTERS[base]


class RigInstalled:
    """Dispatch Harbor construction to its pinned Claude, Codex, or Cursor agent."""
    def __new__(cls, inner='claude-code', **kwargs):
        if inner not in _INNERS or _INNERS[inner] is object:
            raise ValueError(f'unsupported Harbor inner agent: {inner}')
        return _adapter(_INNERS[inner])(inner=inner, **kwargs)
