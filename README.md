# Gymkana Robótica · STAR UMA

Trivial robótico físico-digital. El público escanea un QR ➡️ responde la pregunta en la web ➡️ recibe **solo una pista** que indica dónde está el siguiente QR ➡️ va físicamente, lo escanea y aparece la siguiente pregunta. Y así hasta el final.

Esta es una **plantilla reutilizable**: pensada para adaptarla cambiando preguntas, respuestas y pistas en futuros eventos sin reescribir la arquitectura.

---

## Flujo de cada estación

```
[QR físico estación N] ──escanea──> preguntaN.html
                                          │
                                  responde correctamente
                                          ▼
                              <respuesta>.html (stub redirect)
                                          │
                                          ▼
                                   pistaN.html
                                "Ve al brazo robótico"
                                          │
                                  busca el QR físico
                                          ▼
[QR físico estación N+1] ──escanea──> preguntaN+1.html
```

Si el usuario falla, el servidor devuelve nuestro **`404.html`** con un botón "volver atrás".

---

## Tres tipos de archivo

Cada estación se compone de **3 archivos** con responsabilidades separadas:

| Archivo            | Qué contiene                               | ¿Lo edito?                                                   |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------ |
| `preguntaN.html`   | Pregunta + form/opciones                   | **Sí**, edita texto, opciones y categoría                    |
| `<respuesta>.html` | Stub mínimo que redirige a `pistaN.html`   | Solo lo **renombras** si cambia la respuesta correcta        |
| `pistaN.html`      | Mensaje "✓ correcto" + pista física        | **Sí**, edita el texto de la pista                           |

> La respuesta correcta nunca aparece en el código fuente — está únicamente como nombre de archivo en el servidor.

## Tipos de pregunta

- **Texto libre** (estaciones 1, 3, 5, 7): el usuario teclea. JS normaliza (minúsculas, sin acentos, sin espacios) y redirige a `<respuesta>.html`.
- **Tipo test** (estaciones 2, 4, 6): 4 botones grandes con un slug oculto en `data-answer`. Solo el slug correcto tiene archivo; los demás caen al 404.

---

## Estructura de archivos

```
.
├── index.html              # Landing — banner + botón "Empezar"
├── 404.html                # "Respuesta incorrecta — inténtalo de nuevo"
├── .nojekyll               # Desactiva Jekyll en GitHub Pages
├── netlify.toml            # Cabeceras y config para despliegue en Netlify
├── README.md               # Este archivo
├── CONFIGURACION.md        # Cómo editar preguntas, pistas y respuestas
│
├── assets/
│   ├── styles.css
│   ├── logo.svg
│   └── banner.jpg
│
├── js/
│   └── trivial.js
│
└── estaciones/             # ← TODO el contenido del juego vive aquí
    │
    ├── pregunta1.html      # Pregunta 1 — tipo test           [QR1]
    ├── sentidos.html       # Stub: respuesta correcta → pista1.html
    ├── pista1.html         # Pista física estación 1
    │
    ├── pregunta2.html      # Pregunta 2 — tipo test           [QR2]
    ├── arduino.html        # Stub: respuesta correcta → pista2.html
    ├── pista2.html         # Pista física estación 2
    │
    ├── pregunta3.html      # Pregunta 3 — texto libre         [QR3]
    ├── curiosity.html      # Stub: respuesta correcta → pista3.html
    ├── pista3.html         # Pista física estación 3
    │
    ├── pregunta4.html      # Pregunta 4 — tipo test           [QR4]
    ├── helices.html        # Stub: respuesta correcta → pista4.html
    ├── pista4.html         # Pista física estación 4
    │
    ├── pregunta5.html      # Pregunta 5 — texto libre         [QR5]
    ├── asimov.html         # Stub: respuesta correcta → pista5.html
    ├── isaac.html          # Stub alternativo (variante ortográfica)
    ├── isaacasimov.html    # Stub alternativo (variante ortográfica)
    ├── pista5.html         # Pista física estación 5
    │
    ├── pregunta6.html      # Pregunta 6 — tipo test           [QR6]
    ├── walle.html          # Stub: respuesta correcta → pista6.html
    ├── pista6.html         # Pista física estación 6
    │
    ├── pregunta7.html      # Pregunta 7 — texto libre         [QR7]
    ├── hexagono.html       # Stub: respuesta correcta → final.html
    └── final.html          # PANTALLA FINAL DE VICTORIA
```

---

## Cadena de estaciones (edición actual)

Todos los archivos están en `estaciones/`.

| #   | Pregunta         | Tipo | Respuesta correcta | Stub(s)                                       | Pista         |
| --- | ---------------- | ---- | ------------------ | --------------------------------------------- | ------------- |
| 1   | `pregunta1.html` | Test | `sentidos`         | `sentidos.html`                               | `pista1.html` |
| 2   | `pregunta2.html` | Test | `arduino`          | `arduino.html`                                | `pista2.html` |
| 3   | `pregunta3.html` | Text | `curiosity`        | `curiosity.html`                              | `pista3.html` |
| 4   | `pregunta4.html` | Test | `helices`          | `helices.html`                                | `pista4.html` |
| 5   | `pregunta5.html` | Text | `asimov`           | `asimov.html`, `isaac.html`, `isaacasimov.html` | `pista5.html` |
| 6   | `pregunta6.html` | Test | `walle`            | `walle.html`                                  | `pista6.html` |
| 7   | `pregunta7.html` | Text | `hexagono`         | `hexagono.html`                               | `final.html`  |

---

## Despliegue

### Estado actual

El sitio se despliega automáticamente en **GitHub Pages** mediante GitHub Actions. Cualquier push a `main` actualiza el sitio en ~1-2 minutos.

🌐 **URL del sitio:** `https://star-uma.github.io/gymkana-trivial-star-uma/`

---

### GitHub Pages (método activo)

El repositorio incluye `.github/workflows/deploy.yml`, que publica la carpeta `Gymkana_STAR/` en GitHub Pages en cada push a `main`.

Para activarlo en un fork o nuevo repositorio:

1. Ve a *Settings → Pages → Source* y selecciona **GitHub Actions**.
2. Haz un push a `main` — el workflow se ejecuta automáticamente.

> **Nota técnica:** GitHub Pages sirve el `404.html` personalizado cuando una URL no existe, por lo que la mecánica del juego (respuesta incorrecta → página de error personalizada) funciona igual que en Netlify.

---

### Opción alternativa — Netlify (método probado en el primer evento)

1. Abre [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `Gymkana_STAR/` al área de drop.
3. Netlify asigna una URL del tipo `https://nombre-aleatorio.netlify.app`.
4. (Opcional) En *Site settings → Change site name* ponle un nombre como `star-uma-gymkana`.

El archivo `netlify.toml` ya está configurado con cabeceras de seguridad y caché correctas.

---

### Probar en local

```bash
cd Gymkana_STAR
python3 -m http.server 8000
# abre http://localhost:8000
```

> El 404 personalizado solo se ve en Netlify o GitHub Pages. En local, el servidor de Python muestra su 404 genérico, pero el flujo de respuestas correctas funciona perfectamente.

---

## URLs para los QR físicos

| QR   | URL                                                                                  |
| ---- | ------------------------------------------------------------------------------------ |
| QR 1 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta1.html`      |
| QR 2 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta2.html`      |
| QR 3 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta3.html`      |
| QR 4 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta4.html`      |
| QR 5 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta5.html`      |
| QR 6 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta6.html`      |
| QR 7 | `https://star-uma.github.io/gymkana-trivial-star-uma/estaciones/pregunta7.html`      |

Generación rápida con `qrencode`:

```bash
BASE="https://star-uma.github.io/gymkana-trivial-star-uma/estaciones"
for n in 1 2 3 4 5 6 7; do
  qrencode -o qr$n.png "$BASE/pregunta$n.html"
done
```

---

## Editar contenido

Lee `CONFIGURACION.md` para instrucciones detalladas sobre cómo cambiar preguntas, respuestas, pistas, añadir o quitar estaciones, y cambiar el aspecto visual.
