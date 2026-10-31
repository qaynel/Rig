<figure>
<img width="1012" height="506" alt="image" src="https://github.com/user-attachments/assets/c647015e-6538-43de-8c26-6d6358c89729" />
<figcaption>
  Foto de <a href="https://unsplash.com/@luandmario?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maria Lupan</a> en <a href="https://unsplash.com/photos/red-and-black-metal-tower-during-sunset-hy97yy3e03A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</figcaption>
</figure>

# Rig

Rig es una caja de herramientas para agentes de programación. Ofrece instrucciones
de flujo de trabajo compartidas, una línea base de seguridad obligatoria para el
agente y un catálogo à-la-carte de servicios de ingeniería. El agente de tu repositorio
inspecciona el proyecto y propone los servicios y grados relevantes; tú revisas y
apruebas la adaptación exacta. Rig no instala niveles de capacidad fijos.

## Instalar

En una máquina con Git, ejecuta este comando para obtener el instalador de la versión
6.0.1 e instalar Rig en un repositorio:

```sh
git clone --depth 1 --branch v6.0.1 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.1 && /tmp/rig-v6.0.1/install rig --version v6.0.1 --target /path/to/repository
```

El instalador detecta la configuración de agente existente y añade las instrucciones
compartidas de Rig, la línea base de seguridad, el catálogo y el runtime activo.
Registra los archivos instalados en `.rig/install-manifest.jsonl`.

## Instalar la distribución completa de plugins

Rig también incluye adaptadores nativos para hosts que soportan plugins, extensiones,
comandos, hooks o integraciones de barra de estado. La instalación del corpus anterior
es la capa base; usa estas integraciones de host cuando quieras su superficie de
instalación nativa.

| Host | Ruta de instalación / carga |
|---|---|
| GitHub Copilot CLI | `copilot plugin marketplace add qaynel/Rig`, luego `copilot plugin install rig@rig` |
| Hermes Agent | Plugin nativo en `plugin.yaml`; ver más abajo |
| Swival | `swival skills add https://github.com/qaynel/Rig` |
| OpenClaw | `clawhub install rig` |
| Devin | `devin plugins install qaynel/Rig` |

### Hermes Agent

Instala Rig como plugin nativo de Hermes (`plugin.yaml`). Inyecta el modo activo
mediante `pre_llm_call`, registra el cambio de modo `/rig` y expone las skills
como `rig:<skill>`.

## Después de instalar

En tu agente, invoca `rig-onboarding`. Inspecciona el repositorio y prepara una
propuesta de adaptación, incluyendo los servicios y grados del catálogo relevantes.
Revisa y aprueba esa propuesta antes de que modifique el repositorio; no hay un
paso de selección de servicios por separado.

## Por dónde continuar

**Instalando Rig** — Configuración paso a paso con comandos y explicaciones. → [Guía de instalación](docs/install.md)

**Entendiendo el producto** — Qué hace Rig por tu equipo y por qué. → [Visión del producto](docs/vision.md)

**Entendiendo la arquitectura** — Cómo funciona Rig internamente, con diagramas. → [Arquitectura](docs/architecture.md)

**Profundizando** — Entrypoints por host, configuración MCP, guía avanzada del operador.
→ [Portabilidad de host](docs/agent-portability.md) · [Guía del operador](docs/advanced/operator.md) · [Wiki del proyecto](wiki/agent-primer.md)

## Comunidad

Políticas del proyecto y cómo participar. Los documentos están en inglés.
→ [Código de conducta](CODE_OF_CONDUCT.md) · [Contribuir](CONTRIBUTING.md) · [Estándares de código abierto](docs/open-source-standards.md) · [Seguridad](SECURITY.md) · [Accesibilidad](ACCESSIBILITY.md) · [Soporte](SUPPORT.md) · [Licencia](LICENSE)
