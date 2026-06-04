---
title: El fin de la barra libre en GitHub Copilot
description: El 1 de junio de 2026, GitHub eliminó el modelo de tarifa plana y pasó a cobrar por tokens. Te explico qué ha cambiado, por qué tu presupuesto desaparece más rápido de lo que esperas y cómo optimizar tu flujo de trabajo para no quedarte sin créditos a mitad de mes.
publishDate: 2026-06-06T09:00:00+02:00
draft: false
lang: es
tags:
  - github
  - ai
  - developer tools
  - opinion
  - español
---

El 1 de junio de 2026 no fue un lunes cualquiera. Fue el día en que GitHub apagó la "barra libre" de IA y encendió la caja registradora.

Si en los últimos días has notado que tu asistente de código respondía con menos entusiasmo, o directamente se bloqueaba diciéndote que te habías quedado sin créditos, no ha sido cosa de tu imaginación. GitHub ha ejecutado uno de los cambios más drásticos en la historia de Copilot: ha abandonado el modelo de suscripción con "premium requests" ilimitadas y ha pasado a un sistema de **facturación basada en el consumo de tokens**.

Bienvenido a la Economía de Tokens.

## ¿Qué ha cambiado exactamente?

Hasta mayo de 2026, el modelo era sencillo: pagabas una suscripción mensual y tenías un número fijo de "solicitudes premium" al mes. Si las agotabas, el sistema te bajaba silenciosamente a un modelo más barato, pero seguías trabajando.

Eso ya no existe.

Ahora todo se mide en **GitHub AI Credits**, donde 1 crédito equivale exactamente a $0,01 USD. Cada vez que interactúas con el chat, ejecutas un agente o usas la CLI, el sistema cuenta los tokens de entrada, los tokens de salida y los tokens de caché del modelo que has elegido, y te descuenta los créditos correspondientes.

Y si te quedas sin créditos, el asistente se bloquea. Sin degradación silenciosa, sin plan B automático. Pared.

## Los planes ahora son monederos de créditos

Los precios de las suscripciones base no han cambiado, pero su naturaleza sí:

| Plan | Créditos mensuales | Precio |
|---|---|---|
| Free | Limitados | Gratis |
| Pro | 1.000 créditos | $10/mes |
| Pro+ | 3.900 créditos | $39/mes |
| Max | ~20.000 créditos | $100/mes |
| Business | 1.900 por usuario | $19/mes/usuario |
| Enterprise | 3.900 por usuario | $39/mes/usuario |

*(Consultado a 05/06/2026.)*

Una nota importante para los planes empresariales: los créditos se **agrupan a nivel organizacional** (pooled usage). Eso significa que los usuarios que consumen poco compensan a los que consumen mucho. En teoría, es un modelo más justo para equipos.

### Una trampa para los suscriptores anuales: los nuevos multiplicadores

Si todavía estás en un plan anual heredado (*legacy*) de Copilot Pro o Pro+, **no pasarás a la facturación por tokens de inmediato**. Mantendrás el sistema de "peticiones premium" (Premium Request Units) hasta que expire tu año de suscripción. Hasta aquí, buenas noticias.

El problema es que, para compensar el coste real de los agentes autónomos, GitHub ha disparado los multiplicadores de consumo a partir del 1 de junio:

| Modelo | Multiplicador anterior | Multiplicador nuevo |
|---|---|---|
| Claude Opus 4.8 | 7,5x | **27x** |
| Claude Opus 4.6 | 3x | **27x** |
| Claude Sonnet 4.6 | 1x | **9x** |
| GPT-5.4 | 1x | **6x** |
| GPT-5.4 mini | 0,33x | **6x** |
| GPT-5 mini | 0x | 0,33x |
| Claude Haiku 4.5 | — | 0,33x |
| Gemini 3 Flash | — | 0,33x |

*(Consultado a 05/06/2026.)*

En la práctica: una sesión de trabajo con Opus 4.8 que antes consumía 7,5 solicitudes ahora consume 27. El mismo trabajo. El mismo resultado. Cuatro veces más caro.

Un detalle útil: si usas el modo de selección **"Auto"**, Copilot elige el modelo dinámicamente según la carga del sistema en tiempo real. En planes legados, este modo aplica un **descuento del 10% sobre el multiplicador final**. No es una solución, pero algo es algo.

## Lo que sigue siendo gratuito (y es más importante de lo que parece)

Antes de entrar en pánico, hay buenas noticias que GitHub no ha comunicado con suficiente énfasis:

**El autocompletado de código no consume créditos.** Las sugerencias inline que aparecen mientras escribes y las Next Edit Suggestions siguen siendo ilimitadas y gratuitas en todos los planes de pago.

**GPT-4.1 y GPT-5 mini son modelos "incluidos" en la suscripción.** No descuentan créditos de tu saldo mensual. Para la mayoría de las tareas cotidianas —completar una función, refactorizar algo sencillo, explicar un error— rinden perfectamente.

La regla de oro que se desprende de esto: **si una tarea puede resolverse en el editor o con un modelo incluido, usar Opus o Sonnet para lo mismo es tirar el dinero**.

## El coste real: precio por millón de tokens

Aquí está la tabla que GitHub no te pone en el centro de la pantalla cuando eliges el modelo. Ordenada de más barato a más caro en output, que es donde se esconde el gasto real:

| Modelo | Entrada | Caché | Salida | Notas |
|---|---|---|---|---|
| GPT-5.4 nano | $0,20 | $0,02 | $1,25 | La opción más económica |
| Gemini 3 Flash | $0,50 | $0,05 | $3,00 | — |
| **GPT-5 mini** | **$0,25** | **$0,025** | **$2,00** | **✓ Incluido en el plan** |
| GPT-5.4 mini | $0,75 | $0,075 | $4,50 | — |
| Claude Haiku 4.5 | $1,00 | $0,10 | $5,00 | — |
| **GPT-4.1** | **$2,00** | **$0,50** | **$8,00** | **✓ Incluido en el plan** |
| Gemini 2.5 Pro | $1,25 | $0,125 | $10,00 | — |
| Gemini 3.1 Pro | $2,00 | $0,20 | $12,00 | — |
| GPT-5.4 | $2,50 | $0,25 | $15,00 | — |
| Claude Sonnet 4.6 | $3,00 | $0,30 | $15,00 | — |
| Claude Opus 4.8 | $5,00 | $0,50 | $25,00 | Fast mode: $10/$50 entrada/salida |

*(Precios en USD por millón de tokens. 1 crédito de IA = $0,01 USD. Consultados a 05/06/2026.)*

Para que los números cobren sentido: **Opus 4.8 cuesta 20 veces más en output que GPT-5.4 nano** para producir la misma cantidad de texto. Renombrar una variable con Opus cuando podrías hacerlo con nano no es una preferencia técnica, es un derroche directo de tu presupuesto.

**Nota importante para usuarios de la familia Claude**: los modelos de Anthropic tienen un coste adicional de escritura en caché (*cache write*) que oscila entre $1,25 y $6,25 por millón de tokens según el modelo. No aparece en la tabla de precios principal, pero sí se descuenta de tu saldo. Tenlo en cuenta si usas Sonnet u Opus de forma intensiva en sesiones largas.

## ¿Por qué se van los créditos tan rápido?

Aquí está la parte que más confunde a la gente, y es legítimo confundirse porque GitHub no lo explica bien en ningún sitio.

### El "Reserved Output": la factura que nadie te avisó

Abres un chat nuevo, escribes "hola" y el medidor ya te muestra un 30-40% de consumo. ¿Qué ha pasado?

No es un bug. Es una característica de diseño llamada **Reserved Output**. El sistema reserva automáticamente hasta el 40% de la ventana de contexto (unos 60.000 tokens en modelos con ventanas de 192k) como buffer de seguridad para la respuesta. La idea es que la IA nunca se corte a mitad de un refactor complejo.

A eso hay que sumarle:
- **System Instructions**: 2-3% de la ventana (reglas de comportamiento del sistema)
- **Tool Definitions**: ~5% (los esquemas de las herramientas del agente)

Resultado: antes de escribir una sola línea de tu propio prompt, ya has consumido casi la mitad de la ventana útil.

### Context Rot: el veneno del historial largo

Cada vez que respondes en un chat, el sistema reenvía todo el historial desde el principio. No hay memoria persistente entre mensajes; es stateless por diseño. Eso significa que cuanto más larga sea la conversación, más tokens pagas por mensaje, incluso si lo que preguntas es completamente nuevo.

Además, a partir del 50-60% de uso de la ventana de contexto, los modelos empiezan a sufrir lo que se conoce como **pérdida en el medio**: ignoran las instrucciones iniciales y priorizan los mensajes más recientes. La calidad cae, los errores aumentan, y terminas pagando más por respuestas peores.

### Tool Overload: el overhead invisible de los MCPs

Si usas servidores MCP (el protocolo de herramientas externas), cada herramienta que tienes activa inyecta su esquema JSON en cada llamada al modelo. Con 40 herramientas activas, estás metiendo entre 10 y 15 KB de overhead en cada turno del chat, aunque no uses ninguna de esas herramientas en esa pregunta concreta.

## La reacción de la comunidad: furia y "bait-and-switch"

La recepción en Reddit, Hacker News y Discord fue, en el mejor de los casos, hostil. Los temas más repetidos:

**"Bait and Switch"**: GitHub (y Microsoft detrás) acostumbraron a los desarrolladores a un estilo de programación conversacional e iterativa —el famoso *vibe coding*— donde la IA hacía el trabajo pesado sin límites aparentes, para luego empezar a cobrar exactamente por ese mismo comportamiento.

**Presupuestos evaporados**: Muchos usuarios de Pro+ han reportado consumir el 100% de sus créditos en uno o dos días de trabajo normal. Para los que usaban agentes de forma intensiva, no ha sido ninguna sorpresa. Para los que creían que $39/mes era suficiente para uso "avanzado", sí lo ha sido.

**Sector educativo**: La pausa en el GitHub Student Developer Pack ha dejado a estudiantes sin acceso a las herramientas con las que estaban aprendiendo. El resentimiento en esta comunidad es especialmente alto.

**Errores 401 antes del cambio**: Hubo reportes masivos de errores de autenticación en modo "Auto" durante las semanas previas al 1 de junio, incluso con créditos disponibles. La sospecha general es que GitHub aplicó throttles ocultos para ir preparando la transición.

## Cómo sobrevivir sin fundir el presupuesto

### Regla 1: "Planificar caro, ejecutar barato"

Esta es la estrategia más efectiva para la nueva economía de tokens. El modelo mental es sencillo:

1. **Fase de planificación**: usa un modelo de primera línea (Claude Opus 4.8, GPT-5.4) para crear el plan técnico, el documento de arquitectura, el `implementation.md`. Pagas por inteligencia pura en el momento donde el coste de equivocarse es alto.
2. **Fase de ejecución**: cambias a un modelo mini o nano para implementar los pasos uno a uno. Las tareas mecánicas no necesitan el motor más caro del catálogo.

Esta estrategia puede reducir el consumo mensual entre un 47% y un 79% sin sacrificar calidad en las decisiones importantes.

### Regla 2: Higiene de contexto

- **Usa `/clear` al cambiar de subtarea**, no en mitad de la resolución de un mismo problema. Borrar el historial a mitad de un bug hace que el modelo pierda el hilo de decisiones previas, lo que suele provocar respuestas peores y más reintentos —que también cuestan créditos—. El momento correcto es cuando terminas una tarea y empiezas otra diferente.
- **Usa `/compact` antes de que el historial se vuelva inmanejable**. Resume la conversación y reinicia la ventana de contexto.
- **Adjunta solo los archivos necesarios**. No el repositorio entero.
- **Crea un `.copilotignore`** para excluir `node_modules`, binarios, carpetas de build y cualquier cosa que Copilot no necesite leer.

### Regla 3: Poda tus herramientas MCP

Desactiva los servidores MCP que no uses activamente. Cada herramienta inactiva que tienes conectada es tokens de overhead en cada llamada. Menos herramientas activas = menor factura base por turno.

### Regla 4: Escribe tus prompts en inglés

El inglés es el idioma nativo de todos estos modelos y, estructuralmente, es menos verboso que el español. Una misma instrucción en inglés ocupa entre un 15% y un 30% menos de tokens que su equivalente en castellano. En sesiones largas o flujos agénticos con muchas llamadas encadenadas, ese ahorro se acumula de forma significativa.

Para el ahorro máximo, pide también que responda en inglés o directamente en código. Si el modelo responde en español, los tokens de salida —los más caros— siguen siendo más verbosos. Si dominas el inglés técnico suficiente para leer la respuesta sin fricción cognitiva, esa combinación (prompt en inglés, respuesta en inglés o código) es la más eficiente. Si no, el ahorro en input no compensa el coste mental de traducir mentalmente cada respuesta.

### Regla 5: Vuelve a los comentarios

Antes de que existiera el chat, Copilot funcionaba así: escribías un comentario describiendo lo que necesitabas y el autocompletado sugería el código. Sigue funcionando exactamente igual, sigue siendo gratuito, y para muchas tareas del día a día es más que suficiente.

```python
# Parse the JWT token and return the user ID, raise ValueError if expired
def get_user_id_from_token(token: str) -> int:
```

Eso genera una sugerencia completa sin gastar un solo crédito. No es tan interactivo como el chat ni tan potente como un agente, pero para implementaciones concretas y bien definidas es una alternativa real. La clave está en ser específico en el comentario: cuanto más detallas el comportamiento esperado, los casos de error y el tipo de retorno, más útil es la sugerencia que obtienes.

Es, en cierto modo, volver al origen. Y en la economía de tokens actual, eso tiene mucho más valor del que parecía hace seis meses.

### Regla 6: `#codebase` antes que `@workspace`

`#codebase` hace búsquedas semánticas en el proyecto y puede combinar resultados con otras fuentes (terminal, archivos abiertos). `@workspace` aísla al modelo y no admite mezcla de herramientas. Para la mayoría de los flujos de trabajo, `#codebase` es más flexible y generalmente más eficiente.

### Regla 7: Restringe el formato de salida

Los tokens de salida cuestan entre 4 y 8 veces más que los de entrada. Si haces una pregunta abierta, el modelo te responde con un ensayo, y ese ensayo lo pagas a precio de oro.

La solución es sencilla: dile explícitamente qué formato quieres. Frases como *"solo el diff"*, *"solo la firma de la función"* o *"código sin comentarios explicativos"* recortan el output de forma drástica sin perder precisión.

En la comunidad se popularizó un MCP llamado **caveman** que fuerza a modelos como Claude a responder de forma ultra-concisa, con reducciones de output reportadas de entre el 65% y el 75%. Para Copilot específicamente ya existe una versión adaptada: [caveman-copilot](https://github.com/Mijutra/caveman-copilot). No es una herramienta oficial, pero vale la pena explorarla si trabajas con sesiones largas.

### Regla 8: Sube el esfuerzo de razonamiento antes de cambiar de modelo

Cuando un modelo barato se atasca en un problema, el instinto es saltar directamente a Opus o GPT-5.5. Ese instinto cuesta dinero.

Antes de cambiar de modelo, sube el parámetro de **reasoning effort** (o `thinking_level`) del modelo actual a *High* o *Max*. El modelo pensará más antes de responder, consumirá más tokens internos, pero seguirá siendo mucho más barato que multiplicar el coste base cambiando a la gama Opus.

La distinción que hay que interiorizar: **sube el esfuerzo de razonamiento cuando el problema sea de lógica; cambia de modelo solo cuando el problema sea de capacidad pura**. Son cosas distintas y tratarlas igual es la fuente de mucho gasto innecesario.

### Regla 9: Adelgaza tu `copilot-instructions.md`

El archivo `.github/copilot-instructions.md` se envía como tokens de entrada en absolutamente cada turno de conversación. Si tu equipo ha ido acumulando ahí guías de estilo, convenciones de arquitectura y documentación interna, estáis pagando por reenviar todo ese texto en cada mensaje que alguien escribe.

La táctica es mantener ese archivo global por debajo de 20 líneas con directivas de alto impacto, y mover las reglas específicas a archivos `.instructions.md` dentro de subcarpetas concretas —por ejemplo `.github/instructions/frontend.instructions.md`— con un campo `applyTo` que le diga a Copilot cuándo inyectarlos. De esa forma solo pagas esos tokens cuando realmente son relevantes.

Una advertencia: esta segmentación funciona bien cuando las subtareas son limpias. Si en la misma sesión de chat saltas constantemente entre archivos de frontend y backend, el contexto de instrucciones cambia en cada turno y eso puede invalidar la caché de tokens —especialmente en los modelos de Anthropic, que son más sensibles a los cambios bruscos de contexto. La segmentación por carpetas es una herramienta, no una bala de plata: úsala en sesiones enfocadas.

### Regla 10: Usa la CLI para datos deterministas, no el agente

Dejar que un agente navegue por el repositorio para extraer información que podrías obtener con un comando de terminal es uno de los mayores desperdicios de tokens que existen. El agente hará múltiples llamadas, cometerá errores intermedios, los corregirá, y todo ese razonamiento lo pagarás.

Si `gh pr diff`, `kubectl get ... -o json` o una query directa a tu base de datos pueden darte el dato de forma determinista, úsalos tú y pásale el resultado limpio al modelo. Reduces tokens y eliminas la no-determinismo del proceso.

Una advertencia adicional si usas subagentes: revisa periódicamente los logs de diagnóstico de Copilot. Se han reportado casos donde un subagente configurado para usar un modelo `mini` termina ejecutándose con el modelo base sin ningún aviso en la interfaz. Tu "ejecución barata" puede estar siendo una ilusión cara.

### Regla 11: Cierra las pestañas que no necesitas

Copilot inyecta automáticamente fragmentos de los archivos que tienes abiertos en el editor para dar contexto a la IA. Es útil cuando esos archivos son relevantes para tu tarea. Es un vampiro de tokens cuando no lo son.

Si estás resolviendo un problema concreto, cierra todo lo que no tenga que ver con esa tarea. Tres o cinco pestañas activas es el límite razonable. Cada archivo abierto de más es contexto implícito que pagas en cada mensaje aunque no lo hayas pedido.

## Impacto en los equipos de desarrollo

Este es el punto que más me preocupa, y del que menos se habla.

Muchos equipos han construido su planificación de los últimos meses asumiendo que Copilot estaría disponible tal y como lo conocían: sin fricciones, sin techo visible, como una extensión natural del flujo de trabajo. Esas estimaciones de velocidad, esos sprints planificados con "soporte de IA", esa capacidad prometida al negocio… todo eso se calculó con un Copilot que ya no existe.

**El problema no es solo el dinero, es la predictibilidad.** Un equipo que ha calibrado su cadencia de entrega asumiendo asistencia constante de IA ahora tiene una variable nueva en la ecuación: ¿cuántos créditos quedan a mitad de sprint? ¿Quién los está consumiendo? ¿Con qué modelo?

Piénsalo en concreto: una funcionalidad que antes se estimaba en dos semanas pasó a estimarse en dos o tres días con Copilot activo y sin restricciones. Esa estimación ya está en el roadmap, comprometida con negocio, quizás hasta en un contrato. Ahora, si los créditos se agotan a mitad del desarrollo o el equipo empieza a racionarlos para no quedarse sin saldo hasta fin de mes, esa tarea vuelve a necesitar su tiempo original. Las estimaciones suben. Los compromisos no pueden subir tan fácilmente.

Algunos efectos concretos que ya están apareciendo:

**Fricción entre perfiles.** En planes Business y Enterprise los créditos son un pool compartido. Eso significa que un desarrollador que usa agentes de forma intensiva con Opus puede agotar el cupo de todo el equipo. La conversación incómoda sobre quién consume qué ya ha empezado en varios foros.

**Ralentización en onboarding.** Los desarrolladores nuevos o junior tienden a usar más el chat para entender el código, explorar la base de datos o generar scaffolding básico. Son exactamente el perfil que más tokens consume y el que menos retorno inmediato genera por crédito. Con créditos limitados, el onboarding asistido por IA —uno de los argumentos de venta más sólidos de Copilot para equipos— se vuelve costoso de sostener.

**Revisiones de código con coste doble.** Las code reviews automáticas de Copilot en Pull Requests ahora consumen tanto créditos de IA como minutos de GitHub Actions. Una PR con revisión automática activa tiene un coste que muchos equipos no habían presupuestado.

**El "estado de flujo" interrumpido.** Antes, un desarrollador podía iterar con la IA sin pensar en el coste. Ahora hay una voz en el fondo que dice "¿merece la pena gastar créditos en esta pregunta?". Esa fricción cognitiva es pequeña pero constante, y rompe exactamente el tipo de concentración que hace productivo el trabajo con IA.

Y para hacer todo esto todavía más difícil: **el panel de uso de Copilot no se actualiza en tiempo real**. Los datos de consumo tienen un desfase de horas, a veces de más de un día. Eso significa que puedes estar quemando créditos a un ritmo insostenible ahora mismo y no saberlo hasta mañana. Para un equipo intentando gestionar un presupuesto compartido a mitad de sprint, es como conducir mirando solo por el retrovisor.

Si lideras un equipo, el imperativo inmediato es revisar las planificaciones que se hicieron asumiendo disponibilidad plena de Copilot, establecer presupuestos por perfil o por equipo, y decidir qué flujos automatizados realmente justifican el uso de modelos premium. No como ejercicio de ahorro, sino como decisión consciente que no se tomó en su momento porque no hacía falta.

## Conclusión

La era de la IA "gratis" ha terminado. No es ninguna sorpresa —era insostenible—. Los modelos de primera línea tienen costes operativos reales, y alguien tenía que pagarlo tarde o temprano.

Lo que sí es criticable es la forma en que se ha ejecutado la transición: comunicación opaca, cambios en multiplicadores que han afectado retroactivamente a suscriptores anuales, y la falta de herramientas nativas para monitorizar el consumo en tiempo real.

La buena noticia es que con un poco de disciplina, el nuevo modelo es manejable. El autocompletado sigue siendo gratuito. Los modelos incluidos son más capaces de lo que mucha gente cree. Y la estrategia de routing —planificar con el modelo caro, ejecutar con el barato— es un hábito que mejora no solo los costes sino la calidad del trabajo.

La pregunta ya no es "¿cuántas requests me quedan?" sino "¿estoy usando el modelo correcto para esta tarea concreta?". Y esa es, honestamente, una pregunta mucho más inteligente.

Hay un argumento que GitHub no se ha molestado en hacer, pero que tiene cierto mérito: el modelo anterior fomentaba el *vibe coding* más descuidado. Pedirle a la IA 500 líneas de código, descartarlas porque no funcionaban, y volver a pedirlas. Ese ciclo era posible porque era gratuito. El nuevo sistema, aunque doloroso en la transición, obliga a pensar antes de escribir, a acotar el problema, a elegir la herramienta adecuada. En cierto modo, es un retorno a la ingeniería de software consciente —solo que esta vez con una factura como motivador.
