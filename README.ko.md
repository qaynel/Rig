<figure>
<img width="1012" height="506" alt="image" src="https://github.com/user-attachments/assets/c647015e-6538-43de-8c26-6d6358c89729" />
<figcaption>
  <a href="https://unsplash.com/@luandmario?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maria Lupan</a>의 사진, <a href="https://unsplash.com/photos/red-and-black-metal-tower-during-sunset-hy97yy3e03A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</figcaption>
</figure>

# Rig

Rig은 코딩 에이전트를 위한 도구 상자다. 공유 워크플로 지시문, 필수 에이전트 안전
기준선, 그리고 à-la-carte 엔지니어링 서비스 카탈로그를 제공한다. 저장소의 에이전트가
프로젝트를 검사하고 관련 서비스와 등급을 제안하면, 사용자가 정확한 적용 내용을
검토하고 승인한다. Rig은 고정된 기능 패키지를 설치하지 않는다.

## 설치

Git이 설치된 머신에서 다음 명령어를 실행해 6.0.0 인스톨러를 가져오고 저장소에
Rig을 설치한다:

```sh
git clone --depth 1 --branch v6.0.0 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.0 && /tmp/rig-v6.0.0/install rig --version v6.0.0 --target /path/to/repository
```

인스톨러는 기존 에이전트 설정을 감지하고, 공유 Rig 지시문, 안전 기준선, 카탈로그,
활성 runtime을 추가한다. 설치된 파일은 `.rig/install-manifest.jsonl`에 기록된다.

## 전체 플러그인 배포판 설치

Rig은 플러그인, 확장, 커맨드, 훅, 상태바 통합을 지원하는 호스트용 네이티브 어댑터도
제공한다. 위의 corpus 설치가 기본 레이어이며, 호스트의 네이티브 설치 방식을 원할 때
이 통합을 사용한다.

| 호스트 | 설치 / 로드 경로 |
|---|---|
| GitHub Copilot CLI | `copilot plugin marketplace add qaynel/Rig`, 이후 `copilot plugin install rig@rig` |
| Hermes Agent | `plugin.yaml`의 네이티브 플러그인; 아래 참고 |
| Swival | `swival skills add https://github.com/qaynel/Rig` |
| OpenClaw | `clawhub install rig` |
| Devin | `devin plugins install qaynel/Rig` |

### Hermes Agent

Hermes 네이티브 플러그인(`plugin.yaml`)으로 Rig을 설치한다. `pre_llm_call`로 활성
모드를 주입하고, `/rig` 모드 전환 명령을 등록하며, 스킬을 `rig:<skill>` 형식으로
노출한다.

## 설치 후

에이전트에서 `rig-onboarding`을 실행한다. 저장소를 검사해 적응 제안을 준비하며,
관련 카탈로그 서비스와 등급을 포함한다. 저장소를 변경하기 전에 해당 제안을 검토하고
승인한다. 별도의 서비스 선택 단계는 없다.

## 다음 단계

**Rig 설치하기** — 명령어와 설명이 포함된 단계별 설정 안내. → [설치 가이드](docs/install.md)

**제품 이해하기** — Rig이 팀에 무엇을 제공하고 왜 그런지. → [제품 개요](docs/vision.md)

**아키텍처 이해하기** — 다이어그램과 함께 Rig이 내부적으로 동작하는 방식. → [아키텍처](docs/architecture.md)

**더 깊이 알아보기** — 호스트별 진입점, MCP 설정, 고급 운영자 가이드.
→ [호스트 이식성](docs/agent-portability.md) · [운영자 가이드](docs/advanced/operator.md) · [프로젝트 위키](wiki/agent-primer.md)

## 커뮤니티

프로젝트 정책과 참여 방법. 문서는 영어입니다.
→ [행동 강령](CODE_OF_CONDUCT.md) · [기여](CONTRIBUTING.md) · [보안](SECURITY.md) · [접근성](ACCESSIBILITY.md) · [지원](SUPPORT.md) · [라이선스](LICENSE)
