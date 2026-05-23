# Cómo editar la gymkana

Esta gymkana es una **plantilla**. Cada estación se compone de **3 archivos** con responsabilidades separadas:

| Archivo                | Qué contiene                              | ¿Lo edito? |
|------------------------|-------------------------------------------|------------|
| `pregunta<N>.html`     | Pregunta + form/opciones                  | **Sí**, edita texto, opciones y categoría libremente |
| `<respuesta>.html`     | Stub mínimo que redirige a `pista<N>.html`| Solo lo **renombras** si cambia la respuesta |
| `pista<N>.html`        | Mensaje "✓ correcto" + pista física       | **Sí**, edita el texto de la pista libremente |

La pantalla final tiene la misma idea: `hexagono.html` (stub) → `final.html` (contenido).

---

## 1. Cambiar el TEXTO de una pregunta

Abre `pregunta<N>.html` (por ejemplo `pregunta2.html`) y busca:

```html
<div class="question-tag">// Pregunta · Software</div>
<p class="question">Software libre y modular...</p>
<p class="question-meta">Sólo las 3 letras de las siglas.</p>
```

- **Categoría** (Software, Hardware, Cultura…): edita `<div class="question-tag">// Pregunta · XXXX</div>`.
- **Pregunta**: edita `<p class="question">…</p>`.
- **Nota de formato** ("una palabra", "tres letras"…): edita `<p class="question-meta">…</p>`.

## 2. Cambiar el TEXTO de una pista

Abre `pista<N>.html` (por ejemplo `pista2.html`) y busca:

```html
<div class="next-hint">
  <span class="next-tag">// Siguiente pista física</span>
  <p>Acércate al <strong>rover</strong> que simula misiones marcianas...</p>
</div>
```

Edita el texto del `<p>`. Lo que destaques entre `<strong>` aparecerá con fondo magenta.

## 3. Cambiar una RESPUESTA correcta

Si la pregunta de la estación 1 deja de ser sobre Arduino y pasa a ser sobre micro:bit, hay dos cambios:

1. **Renombra el stub**: `arduino.html` ➡️ `microbit.html`.
   El contenido del stub no cambia (sigue redirigiendo a `pista1.html`), pero su nombre debe ser igual a la nueva respuesta normalizada.

2. **Edita la pregunta** en `pregunta1.html`: cambia el `<p class="question">…</p>` para que la respuesta lógica sea "micro:bit". (El JS normalizará lo que el usuario escriba: "Micro:bit", "MICROBIT", "micro bit" → todos llegan a `microbit.html`.)

3. Si la pregunta era **tipo test**, además debes actualizar el `data-answer` del botón correcto en `pregunta<N>.html`. El nuevo `data-answer` debe coincidir con el nombre del nuevo stub.

> Recuerda: la respuesta correcta nunca aparece en el código fuente. Solo aparece como nombre de archivo, que el navegador no expone si no se intenta acceder.

## 4. Convertir una pregunta de texto libre ↔ tipo test

### Texto libre → tipo test

Reemplaza dentro de `pregunta<N>.html`:

```html
<form id="answer-form" class="answer-form" autocomplete="off">
  <input id="answer" class="answer-input" ... />
  <button class="btn" type="submit">Enviar respuesta</button>
  <div id="message" class="message" role="status" aria-live="polite"></div>
</form>
```

Por:

```html
<div class="options">
  <button class="option" data-letter="A" data-answer="opcion1" type="button">Texto opción 1</button>
  <button class="option" data-letter="B" data-answer="opcion2" type="button">Texto opción 2</button>
  <button class="option" data-letter="C" data-answer="opcion3" type="button">Texto opción 3</button>
  <button class="option" data-letter="D" data-answer="opcion4" type="button">Texto opción 4</button>
</div>
```

Reglas:
- `data-answer` es el slug al que redirige al pulsar el botón. **Solo una** opción debe tener un slug que coincida con un stub existente; las demás van al 404.
- Para que las opciones incorrectas no resulten obvias, usa slugs cortos y plausibles (ej. para "¿Cuál es el robot Spot?" usa `atlas`, `pepper`, `bigdog` para las incorrectas).

### Tipo test → texto libre

Sustituye el `<div class="options">…</div>` por el bloque del `<form>` mostrado arriba.

## 5. Cambiar el banner o el logo

Sustituye `assets/banner.jpg` y `assets/logo.svg`.

Para cambiar la paleta de colores, edita `assets/styles.css`:

```css
:root {
  --azul-uma: #003c6e;
  --cian-star: #00aec7;
  --magenta-star: #e91f77;
  --blanco: #ffffff;
}
```

## 6. Añadir o quitar estaciones

Si la gymkana pasa de 7 a, por ejemplo, 5 estaciones:

1. Borra (o ignora) `pregunta6.html`, `pregunta7.html`, `pista6.html`, sus stubs (`imu.html`, `hexagono.html`) y todos los archivos legacy (`drone.html`, `logo.html`).
2. Cambia el stub que llevaba a `pista5.html`: ahora la última estación 5 debe llevar a `final.html`. Renombra el stub correspondiente o cámbiale el `target` del redirect interno.
3. En todas las páginas, actualiza:
   - `Estación X / 7` → `Estación X / 5`
   - El número de `<span class="dot"></span>` en `.progress-dots` (deben ser 5 en total).

## 7. Probar la cadena en local

```bash
cd Gymkana_STAR
python3 -m http.server 8000
# abre http://localhost:8000
```

Recorrido manual completo:

1. `index.html` → "Empezar" → `pregunta1.html`
2. Escribe `arduino` → `arduino.html` (stub) → `pista1.html`
3. Manualmente abre `pregunta2.html` (simula escanear QR2) → pulsa **Robot Operating System** → `ros.html` → `pista2.html`
4. `pregunta3.html` → escribe `curiosity` → `pista3.html`
5. `pregunta4.html` → **Spot** → `pista4.html`
6. `pregunta5.html` → escribe `asimov` → `pista5.html`
7. `pregunta6.html` → **IMU** → `pista6.html`
8. `pregunta7.html` → escribe `hexagono` → `final.html` (victoria + confeti)

Si en algún paso te sale 404, hay un nombre de archivo de stub mal escrito o un `data-answer` que no apunta a ningún stub existente.

## 8. Tabla de referencia rápida

```
preguntaN.html  -- editas pregunta y opciones --
       │
       │  usuario responde (texto o clic)
       ▼
<respuesta>.html  -- stub redirect, nombre = respuesta correcta --
       │
       ▼
pistaN.html  -- editas pista y dónde está el siguiente QR --
```
