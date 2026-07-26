<figure>
<img width="1012" height="506" alt="image" src="https://github.com/user-attachments/assets/c647015e-6538-43de-8c26-6d6358c89729" />
<figcaption>
  Foto de <a href="https://unsplash.com/@luandmario?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maria Lupan</a> en <a href="https://unsplash.com/photos/red-and-black-metal-tower-during-sunset-hy97yy3e03A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</figcaption>
</figure>

---
Rig es una caja de herramientas curada e independiente del host para agentes de
programación. Ofrece dos superficies de entrega:

1. **Bootstrap solo Markdown (Tier 1)** — un router compartido, una regla de
   implementación Ponytail siempre activa y skills enfocadas para intención,
   diseño, ejecución, TDD, depuración y revisión de código. Sin procesos, claves
   de API ni dependencias.
2. **Línea base + catálogo à-la-carte** — primero hace seguro el harness del
   agente; luego el usuario elige capacidades como
   `familia → grupo → servicio → grado` (Development · Testing · Infrastructure ·
   Product-Security). Los paquetes fijos Basic / mid / Advanced están retirados;
   el catálogo es el producto.

## Instalar el bootstrap Markdown

Desde este checkout:

```sh
sh rig/bootstrap.sh --target /path/to/repository
```

Tier 1 actualmente se instala desde un checkout local de Rig. La ruta de
bootstrap con release/git-ref fijado que describe el diseño fundacional todavía
no está publicada.

El bootstrap pregunta por el tier cuando se ejecuta de forma interactiva. La
automatización puede tomar la misma decisión explícitamente:

```sh
sh rig/bootstrap.sh --tier 1 --target /path/to/repository
```

Para limitar la instalación a hosts concretos (el mismo gating que el materializer de Tier 2):

```sh
sh rig/bootstrap.sh --tier 1 --target /path/to/repository --hosts antigravity,codex
# o: RIG_HOSTS=antigravity,codex sh rig/bootstrap.sh --tier 1 --target /path/to/repository
```

La selección de hosts requiere `node` en el `PATH`. La instalación completa por
defecto sigue siendo solo POSIX `sh`.

Tier 1 instala el mismo conjunto de instrucciones para estos entrypoints de
host:

- Claude Code recibe skills de proyecto en `.claude/skills/` y un puntero al
  router en `CLAUDE.md`.
- Codex recibe skills nativas de proyecto en `.agents/skills/` más el puntero
  siempre activo al router en `AGENTS.md`.
- Antigravity co-lee ese mismo árbol `.agents/` (skills/rules), más `GEMINI.md`
  (los overrides específicos de Antigravity ganan sobre `AGENTS.md`) y workflows
  de slash commands en `.agents/workflows/`.
- OpenCode, CodeWhale, Swival y otros lectores de `AGENTS.md` reciben un puntero
  raíz.
- Gemini CLI recibe un puntero en `GEMINI.md`.
- Cursor, Windsurf, Cline, GitHub Copilot, Kiro y lectores de `.agents/rules`
  reciben sus archivos nativos de instrucciones de proyecto.

Cada adaptador lee `.rig/routing.md`. Claude y Codex también descubren las
mismas siete skills de forma nativa desde sus directorios de host. Los
entrypoints de host existentes se preservan.

Esos árboles de skills nativas están versionados en este repositorio en
`.claude/skills/` y `.agents/skills/`; el bootstrap los copia sin cambios en los
repositorios destino.

| Host | Entrypoint instalado |
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
| Otros agentes | Configura el host para leer `.rig/routing.md`, o agrega el puntero de una línea de `rig/tier-1/adapters/pointer.md` a sus instrucciones de proyecto. |

### Hermes Agent

Instala Rig como plugin nativo de Hermes (`plugin.yaml`): inyecta el modo
activo vía `pre_llm_call`, registra el cambio de modo `/rig` y expone las
skills como `rig:<skill>`.

## Línea base + catálogo à-la-carte

Tras sanear el harness, Rig ofrece un menú recomendado por el escaneo. El
usuario elige servicios hoja y grados en `rig.json`; las dependencias faltantes
solo arrastran las slices exactas requeridas. La instalación se injerta en la
infraestructura de agentes existente y siempre conserva los suelos de
sanitation, drift, secretos, git y CI.

```text
inspect → host review → recommend → select (rig.json) → plan → apply → check
```

Detalles del operador: [`docs/advanced/operator.md`](docs/advanced/operator.md).
Diseño: [`project-dev-docs/current/`](project-dev-docs/current/).

La CLI legacy del configurador MCP sigue disponible como compatibilidad; ya no
es un tier de instalación separado.

## Columna vertebral de curaduría

| Fase | Owner de Rig |
|---|---|
| Intención y pruebas de aceptación | Grilling |
| Diseño de producto y técnico | Product design |
| Implementación | Ponytail |
| Ejecución y paralelismo | Execution |
| TDD | Injerto curado |
| Depuración | Injerto curado |
| Revisión de código | Injerto curado |

Las skills curadas etiquetan sus checks por fase del flujo de trabajo. Fusionan
las partes distintivas de cada flujo en vez de concatenar documentos fuente.

## Límite del bootstrap Markdown

El bootstrap Tier 1 es intencionalmente una instalación tonta con una lista fija
de archivos. No tiene resolvedor de catálogo, runtime, claves ni manejo de
`.env`. El layout compartido es predecible para que el materializer del
catálogo lo describa sin cambiar la forma instalada.

El flujo de trabajo es asesor porque el bootstrap solo entrega Markdown. Claude
y otros hosts con hooks pueden proveer enforcement real donde el host lo
soporta; Cursor no. Rig afirma esa limitación en vez de pretender que la prosa
es un hard guardrail.

## Verificar

```sh
npm run test:rig
```

El test arranca un repositorio temporal fresco y comprueba el payload
compartido completo, cada adaptador de instrucciones, la preservación de
archivos de host existentes, el límite solo-Markdown y la ausencia de
placeholders de secretos.

La aceptación del catálogo vive en `tests/advanced-*.test.js` e `npm test`.
