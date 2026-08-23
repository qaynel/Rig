<figure>
<img width="1012" height="506" alt="image" src="https://github.com/user-attachments/assets/c647015e-6538-43de-8c26-6d6358c89729" />
<figcaption>
  <a href="https://unsplash.com/@luandmario?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maria Lupan</a>의 사진, <a href="https://unsplash.com/photos/red-and-black-metal-tower-during-sunset-hy97yy3e03A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</figcaption>
</figure>

---
Rig은 코딩 에이전트를 위한 엄선된 호스트 독립형 도구 상자다. 두 가지 전달
표면을 제공한다.

1. **마크다운 부트스트랩 (Tier 1)** — 공유 라우터, 항상 켜져 있는 Ponytail
   구현 규칙, 의도·설계·실행·TDD·디버깅·코드 리뷰용 집중 스킬. 프로세스,
   API 키, 의존성 없음.
2. **베이스라인 + à-la-carte 카탈로그** — 먼저 에이전트 하네스를 안전하게
   만든 뒤, 사용자가 `family → group → service → grade`로 기능을 고른다
   (Development · Testing · Infrastructure · Product-Security). 고정된
   Basic / mid / Advanced 설치 패키지는 폐기되었고, 카탈로그가 제품이다.

## 마크다운 부트스트랩 설치

이 체크아웃에서:

```sh
sh rig/bootstrap.sh --target /path/to/repository
```

기본적으로 로컬 부트스트랩은 마크다운만 설치한다: 각 스킬의 `SKILL.md`는
설치되지만, 코드와 `.rig/plumbing` 트리는 제외된다. 이것도 설치하려면
`--with-runtime`을 추가한다:

```sh
sh rig/bootstrap.sh --target /path/to/repository --with-runtime
```

루트 스크립트 `install.sh`는 이름이 지정된 릴리스를 해석하고, 실행 전에
다운로드하며, 항상 `--with-runtime`으로 부트스트랩을 호출한다. 그래서 활성
카탈로그와 안전 runtime이 함께 설치된다:

```sh
sh install.sh --version v5.0.0 --target /path/to/repository
```

부트스트랩은 대화형으로 실행될 때 tier를 묻는다. 자동화에서는 같은 선택을
명시적으로 지정할 수 있다:

```sh
sh rig/bootstrap.sh --tier 1 --target /path/to/repository
```

`--hosts` 없이 실행하면 Rig은 19개 호스트 레지스트리를 기준으로 기존 호스트
설정을 기계적으로 감지하고, 없는 호스트 트리는 설치하지 않는다. 쉼표로
구분한 목록으로 그 선택을 명시적으로 좁히거나 덮어쓸 수 있다:

```sh
sh rig/bootstrap.sh --tier 1 --target /path/to/repository --hosts antigravity,codex
# 또는: RIG_HOSTS=antigravity,codex sh rig/bootstrap.sh --tier 1 --target /path/to/repository
```

부트스트랩에는 `PATH`에 `node`가 필요하다. 출력은 감지되거나 명시적으로
지정된 각 호스트를 나열하고, 모든 payload 기록을
`.rig/install-manifest.jsonl`에 남긴다.

Tier 1은 다음 호스트 진입점에 같은 지시문 세트를 설치한다:

- Claude Code는 `.claude/skills/`에 프로젝트 스킬을 받고 `CLAUDE.md`에
  라우터 포인터를 받는다.
- Codex는 `.agents/skills/`에 네이티브 프로젝트 스킬을 받고 `AGENTS.md`에
  항상 켜져 있는 라우터 포인터를 받는다.
- Antigravity는 같은 `.agents/` 스킬/룰 트리를 함께 읽고, `GEMINI.md`
  (Antigravity 전용 오버라이드가 `AGENTS.md`보다 우선)와
  `.agents/workflows/`의 슬래시 커맨드 워크플로를 추가로 받는다.
- OpenCode, CodeWhale, Swival 및 그 밖의 `AGENTS.md` 리더는 루트 포인터를
  받는다.
- Gemini CLI는 `GEMINI.md` 포인터를 받는다.
- Cursor, Windsurf, Cline, GitHub Copilot, Kiro 및 `.agents/rules` 리더는
  각자의 네이티브 프로젝트 지시문 파일을 받는다.

모든 어댑터는 `.rig/routing.md`를 읽는다. Claude와 Codex는 호스트
디렉터리에서 같은 일곱 스킬도 네이티브로 발견한다. 기존 호스트 진입점은
보존된다.

그 네이티브 스킬 트리는 이 저장소의 `.claude/skills/`와
`.agents/skills/`에 커밋되어 있다. 부트스트랩은 이를 변경 없이 대상
저장소로 복사한다.

| 호스트 | 설치되는 진입점 |
|---|---|
| Claude Code | `CLAUDE.md`, `.claude/skills/rig-*/SKILL.md` |
| Cursor | `.cursor/rules/rig.mdc` |
| Windsurf | `.windsurf/rules/rig.md` |
| Cline | `.clinerules/rig.md` |
| GitHub Copilot editor/CLI | `.github/copilot-instructions.md`, `AGENTS.md` |
| Codex / VS Code Codex | `AGENTS.md`, `.agents/skills/rig-*/SKILL.md` |
| Gemini CLI | `GEMINI.md` |
| Antigravity | `AGENTS.md`, `GEMINI.md`, `.agents/rules/rig.md`, `.agents/skills/rig-*/SKILL.md`, `.agents/workflows/` |
| Kiro | `.kiro/steering/rig.md` |
| OpenCode, CodeWhale, Swival | `AGENTS.md` |
| 기타 에이전트 | 호스트가 `.rig/routing.md`를 읽도록 설정하거나, `rig/tier-1/adapters/pointer.md`의 한 줄 포인터를 프로젝트 지시문에 추가한다. |

### Hermes Agent

Hermes 네이티브 플러그인(`plugin.yaml`)으로 Rig을 설치한다. `pre_llm_call`로
활성 모드를 주입하고, `/rig` 모드 전환 명령을 등록하며, 스킬을
`rig:<skill>` 형식으로 노출한다.

## 베이스라인 + à-la-carte 카탈로그

하네스를 안전하게 만든 뒤, Rig은 스캔 추천 메뉴를 제공한다. 사용자는
`rig.json`에서 리프 서비스와 grade를 고르고, 누락된 의존성은 필요한
슬라이스만 정확히 끌어온다. 설치는 기존 에이전트 인프라에 graft되며
sanitation · drift · secret · git · CI floor는 항상 유지된다.

```text
inspect → host review → recommend → select (rig.json) → plan → apply → check
```

운영자 가이드: [`docs/advanced/operator.md`](docs/advanced/operator.md).
설계 및 추론: [`wiki/`](wiki/).

레거시 MCP 설정 CLI는 호환 경로로 남아 있으며, 더 이상 별도의 설치
tier가 아니다.

## 큐레이션 축

| 단계 | Rig 소유자 |
|---|---|
| 의도와 인수 테스트 | Grilling |
| 제품 및 기술 설계 | Product design |
| 구현 | Ponytail |
| 실행과 병렬 처리 | Execution |
| TDD | Curated graft |
| 디버깅 | Curated graft |
| 코드 리뷰 | Curated graft |

큐레이션된 스킬은 워크플로 단계별로 자체 점검에 라벨을 붙인다. 소스 문서를
그냥 이어 붙이지 않고, 각 워크플로의 특징적인 부분을 합친다.

## 마크다운 부트스트랩 경계

Tier 1 부트스트랩은 의도적으로 고정 파일 목록만 가진 단순한 설치다.
카탈로그 해석기, runtime, keys, `.env` 처리가 없다. 공유 레이아웃은 예측
가능하므로 카탈로그 materializer가 설치된 형태를 바꾸지 않고 설명할 수 있다.

부트스트랩은 마크다운만 제공하므로 워크플로는 권고 사항이다. Claude와 다른
hook 가능 호스트는 호스트가 지원하는 곳에서 실제 도구 경계 강제를 제공할 수
있지만, Cursor는 그럴 수 없다. Rig은 산문이 단단한 가드레일이라고 주장하지
않고 그 한계를 명시한다.

## 검증

```sh
npm run test:rig
```

테스트는 새 임시 저장소를 부트스트랩하고, 완전한 공유 payload, 모든 지시문
어댑터, 기존 호스트 파일 보존, 마크다운 전용 경계, secret placeholder의
부재를 확인한다.

카탈로그 인수 테스트는 `tests/advanced-*.test.js`에 있으며 `npm test`에
포함된다.
