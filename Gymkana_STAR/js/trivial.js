/* ============================================================
   GYMKANA STAR UMA — Lógica compartida
   ----------------------------------------------------------
   Estrategia antitrampas (sin backend):
     - La respuesta correcta NO se guarda en este código.
     - Texto libre: normalizamos lo que escribió el usuario
       (minúsculas, sin acentos, sin espacios, sin signos) y lo
       usamos como nombre de archivo: ej. "Arduino" -> "arduino.html".
     - Tipo test: cada opción tiene un atributo data-answer con su
       slug; al hacer clic se redirige a "<slug>.html".
     - Si la respuesta es correcta, ese archivo existe y carga la
       pista. Si es incorrecta, Netlify devuelve 404.html.
   ============================================================ */

(function () {
  /**
   * Normaliza la respuesta del usuario a un slug compatible con URL.
   * Quita acentos, signos, espacios y mayúsculas.
   *
   *   "  Arduino!  "       -> "arduino"
   *   "Curiosidad"         -> "curiosidad"
   *   "Hexágono"           -> "hexagono"
   *   "Boston Dynamics"    -> "bostondynamics"
   *   "R.O.S."             -> "ros"
   */
  function normalize(raw) {
    if (!raw) return '';
    return raw
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')              // quita diacríticos
      .replace(/[^a-z0-9]/g, '');         // sólo letras y números
  }

  /**
   * Redirige a la página de la respuesta dada. Bloquea la UI durante
   * un instante para evitar dobles clics.
   */
  function goToAnswer(slug) {
    if (!slug) return;
    document.querySelectorAll('button, input').forEach(el => el.disabled = true);
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('visible');
    setTimeout(() => {
      window.location.href = slug + '.html';
    }, 280);
  }

  /**
   * Maneja el envío del formulario de respuesta libre.
   */
  function handleSubmit(ev) {
    ev.preventDefault();
    const input = document.getElementById('answer');
    const msg   = document.getElementById('message');
    if (!input) return;

    const slug = normalize(input.value);
    if (!slug) {
      if (msg) msg.textContent = 'Escribe una respuesta antes de enviar.';
      input.focus();
      return;
    }
    if (msg) msg.textContent = '';
    goToAnswer(slug);
  }

  /**
   * Maneja el clic en una opción tipo test.
   */
  function handleOptionClick(ev) {
    const btn = ev.currentTarget;
    // Si la opción no tiene data-answer explícito, usa su texto.
    const raw = btn.dataset.answer || btn.textContent;
    const slug = normalize(raw);
    goToAnswer(slug);
  }

  function init() {
    const form = document.getElementById('answer-form');
    if (form) form.addEventListener('submit', handleSubmit);

    document.querySelectorAll('.option').forEach(btn => {
      btn.addEventListener('click', handleOptionClick);
    });

    const canvas = document.getElementById('confetti');
    if (canvas) launchConfetti(canvas);

    // Auto-focus en escritorio (en móvil tapa la pregunta)
    if (window.matchMedia('(min-width: 600px)').matches) {
      const input = document.getElementById('answer');
      if (input) input.focus();
    }
  }

  /* =========================================================
     Confeti minimalista (sin librerías externas)
     ========================================================= */
  function launchConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const colors = ['#00aec7', '#e91f77', '#ffffff', '#ffd166'];
    const N = 140;
    const pieces = Array.from({length: N}, () => ({
      x: Math.random() * W,
      y: -20 - Math.random() * H,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2
    }));

    let frames = 0;
    function tick() {
      ctx.clearRect(0, 0, W, H);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      frames++;
      if (frames < 60 * 8) requestAnimationFrame(tick); // ~8 segundos
      else ctx.clearRect(0, 0, W, H);
    }
    tick();

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
