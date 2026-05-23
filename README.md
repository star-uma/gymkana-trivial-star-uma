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
│
├── pregunta1.html          # Pregunta 1 — texto libre        [QR1]
├── arduino.html            # Stub: redirige a pista1.html
├── pista1.html             # Pista física: "ve al brazo robótico"
│
├── pregunta2.html          # Pregunta 2 — tipo test          [QR2]
├── ros.html                # Stub: redirige a pista2.html
├── pista2.html             # Pista física: "ve al rover"
│
├── pregunta3.html          # Pregunta 3 — texto libre        [QR3]
├── curiosity.html          # Stub: redirige a pista3.html
├── pista3.html             # Pista física: "ve al cuadrúpedo"
│
├── pregunta4.html          # Pregunta 4 — tipo test          [QR4]
├── spot.html               # Stub: redirige a pista4.html
├── pista4.html             # Pista física: "ve al panel 3 leyes"
│
├── pregunta5.html          # Pregunta 5 — texto libre        [QR5]
├── asimov.html             # Stub: redirige a pista5.html
├── pista5.html             # Pista física: "ve al dron"
│
├── pregunta6.html          # Pregunta 6 — tipo test          [QR6]
├── imu.html                # Stub: redirige a pista6.html
├── pista6.html             # Pista física: "ve al cartel STAR"
│
├── pregunta7.html          # Pregunta 7 — texto libre        [QR7]
├── hexagono.html           # Stub: redirige a final.html
├── final.html              # PANTALLA FINAL DE VICTORIA
│
├── 404.html                # "Respuesta incorrecta — inténtalo de nuevo"
├── .nojekyll               # Desactiva Jekyll en GitHub Pages
├── netlify.toml            # Cabeceras y config para despliegue en Netlify
├── README.md               # Este archivo
├── CONFIGURACION.md        # Cómo editar preguntas, pistas y respuestas
├── assets/
│   ├── styles.css
│   ├── logo.svg
│   └── banner.jpg
└── js/
    └── trivial.js
```

> Existen también `start.html`, `arm.html`, `mars.html`, `dog.html`, `laws.html`, `drone.html`, `logo.html`, `inicio.html` como redirecciones de compatibilidad de ediciones anteriores. Se pueden ignorar al editar.

---

## Cadena de estaciones (edición actual)

| #   | Pregunta         | Tipo  | Respuesta correcta | Stub             | Pista         |
| --- | ---------------- | ----- | ------------------ | ---------------- | ------------- |
| 1   | `pregunta1.html` | Texto | `arduino`          | `arduino.html`   | `pista1.html` |
| 2   | `pregunta2.html` | Test  | `ros`              | `ros.html`       | `pista2.html` |
| 3   | `pregunta3.html` | Texto | `curiosity`        | `curiosity.html` | `pista3.html` |
| 4   | `pregunta4.html` | Test  | `spot`             | `spot.html`      | `pista4.html` |
| 5   | `pregunta5.html` | Texto | `asimov`           | `asimov.html`    | `pista5.html` |
| 6   | `pregunta6.html` | Test  | `imu`              | `imu.html`       | `pista6.html` |
| 7   | `pregunta7.html` | Texto | `hexagono`         | `hexagono.html`  | `final.html`  |

---

## Despliegue

### Estado actual

El proyecto se publicó durante el evento usando **Netlify** (método drag & drop). Funcionó sin incidencias — el 404 personalizado se sirvió correctamente para las respuestas incorrectas.

**Pendiente:** migrar el despliegue a **GitHub Pages** con auto-deploy al hacer push.
---

### Opción A — Netlify (método probado en el evento)

1. Abre [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra esta carpeta entera al área de drop.
3. Netlify asigna una URL del tipo `https://nombre-aleatorio.netlify.app`.
4. (Opcional) En *Site settings → Change site name* ponle un nombre como `star-uma-gymkana`.

El archivo `netlify.toml` ya está configurado con cabeceras de seguridad y caché correctas.

---

### Opción B — GitHub Pages (pendiente de configurar)

> **Nota técnica:** GitHub Pages sí sirve un `404.html` personalizado desde la raíz del repositorio, por lo que la mecánica del juego (respuesta incorrecta → página de error personalizada) funciona igual que en Netlify. Las cabeceras de seguridad del `netlify.toml` no aplican aquí, pero no son necesarias para el juego.

Pasos para activarlo:

1. Sube el repositorio a la organización de STAR en GitHub (si no está ya).
2. En el repositorio: *Settings → Pages → Source → Deploy from a branch*.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. GitHub Pages publicará el sitio en `https://star-uma.github.io/gymkana-star/`.
5. Asegúrate de que el archivo `.nojekyll` está en la raíz (ya incluido en este repo). Sin él, Jekyll puede ignorar archivos o carpetas con nombres que empiecen por `_`.

Con esto, cualquier push a `main` actualiza el sitio automáticamente en pocos segundos.

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

| QR   | URL                                                                        |
| ---- | -------------------------------------------------------------------------- |
| QR 1 | `https://star-uma.github.io/gymkana-star/pregunta1.html`                   |
| QR 2 | `https://star-uma.github.io/gymkana-star/pregunta2.html`                   |
| QR 3 | `https://star-uma.github.io/gymkana-star/pregunta3.html`                   |
| QR 4 | `https://star-uma.github.io/gymkana-star/pregunta4.html`                   |
| QR 5 | `https://star-uma.github.io/gymkana-star/pregunta5.html`                   |
| QR 6 | `https://star-uma.github.io/gymkana-star/pregunta6.html`                   |
| QR 7 | `https://star-uma.github.io/gymkana-star/pregunta7.html`                   |

Generación rápida con `qrencode`:

```bash
BASE="https://star-uma.github.io/gymkana-star"
for n in 1 2 3 4 5 6 7; do
  qrencode -o qr$n.png "$BASE/pregunta$n.html"
done
```

---

## Editar contenido

Lee `CONFIGURACION.md` para instrucciones detalladas sobre cómo cambiar preguntas, respuestas, pistas, añadir o quitar estaciones, y cambiar el aspecto visual.
