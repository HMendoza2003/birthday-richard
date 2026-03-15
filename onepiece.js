/* ════════════════════════════════════════
   RICHARD — FELIZ CUMPLEAÑOS
   onepiece.js
════════════════════════════════════════ */

/* STARS */
(function () {
  const sl = document.getElementById('star-layer');
  for (let i = 0; i < 160; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 2.3 + .3;
    s.style.cssText = `
      width:${sz}px;
      height:${sz}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 65}%;
      opacity:${Math.random() * .5};
      animation:twinkle ${Math.random() * 5 + 2}s ${Math.random() * 7}s linear infinite;
    `;
    sl.appendChild(s);
  }
})();

/* ── AUDIO — BINK'S SAKE ─────────────────
   Comienza al cargar la página (loop).
   Se pausa cuando RICHARD completa el unlock.
   Botón flotante permite silenciar/activar.
──────────────────────────────────────── */
const bgAudio = (function () {
  const audio = document.createElement('audio');
  audio.src     = 'binks_sake.mp3';
  audio.loop    = true;
  audio.volume  = 0.35;
  audio.preload = 'auto';
  document.body.appendChild(audio);

  // Botón mute — esquina superior derecha
  const btn = document.createElement('button');
  btn.id = 'audio-btn';
  btn.innerHTML = '\u{1F3B5}';
  btn.title = 'Silenciar / Activar música';
  Object.assign(btn.style, {
    position:       'fixed',
    top:            '1.2rem',
    right:          '1.2rem',
    zIndex:         '99999',
    width:          '2.4rem',
    height:         '2.4rem',
    borderRadius:   '50%',
    border:         '1px solid rgba(232,184,75,.35)',
    background:     'rgba(6,14,28,.85)',
    color:          '#e8b84b',
    fontSize:       '1rem',
    cursor:         'pointer',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    transition:     'all .2s',
    backdropFilter: 'blur(6px)',
    boxShadow:      '0 2px 12px rgba(0,0,0,.4)',
  });
  document.body.appendChild(btn);

  let muted = false;

  function setMute(m) {
    muted        = m;
    audio.muted  = m;
    btn.innerHTML = m ? '\u{1F507}' : '\u{1F3B5}';
    btn.style.borderColor = m ? 'rgba(255,255,255,.15)' : 'rgba(232,184,75,.35)';
    btn.style.color       = m ? 'rgba(255,255,255,.3)'  : '#e8b84b';
  }

  btn.addEventListener('click', () => setMute(!muted));

  // Autoplay: intentar al cargar, si falla esperar primer clic
  function tryPlay() {
    audio.play().catch(() => {
      const resume = () => { audio.play(); document.removeEventListener('click', resume); };
      document.addEventListener('click', resume);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryPlay);
  } else {
    tryPlay();
  }

  return {
    pause() { audio.pause(); btn.style.display = 'none'; },
    play()  { audio.play(); },
  };
})();

/* GATE OBSERVER */
const gObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting && unlocked) e.target.classList.add('open'); });
}, { threshold: .1 });

/* ── UNLOCK ──────────────────────────────
   Solo "RICHARD" (en mayúsculas) da acceso.
   Cualquier otro nombre recibe un mensaje
   de rechazo temático.
──────────────────────────────────────── */
const SECRET_NAME = 'RICHARD';
let unlocked = false;

function doUnlock() {
  const raw = document.getElementById('h-inp').value.trim();
  const v   = raw.toUpperCase();             // normalizar para comparar
  const errEl = document.getElementById('h-err');

  // Campo vacío
  if (!raw) {
    errEl.textContent = 'Escribe tu nombre para continuar.';
    return;
  }

  // Ya desbloqueado (doble clic)
  if (unlocked) return;

  // ── ACCESO DENEGADO ──────────────────
  if (v !== SECRET_NAME) {
    errEl.textContent = `¡Ey, pirata! Ese no es tu nombre… este tesoro no es para ti. 🏴‍☠️`;
    // Shake visual en el input
    const inp = document.getElementById('h-inp');
    inp.style.transition = 'transform .08s';
    let n = 0;
    const shake = setInterval(() => {
      inp.style.transform = n % 2 === 0 ? 'translateX(6px)' : 'translateX(-6px)';
      if (++n > 5) { clearInterval(shake); inp.style.transform = 'translateX(0)'; }
    }, 80);
    return;
  }

  // ── ACCESO CONCEDIDO ─────────────────
  unlocked = true;
  errEl.textContent = '';

  // Ocultar formulario
  document.getElementById('hero-copy').style.display  = 'none';
  document.getElementById('parchment').style.display  = 'none';
  document.getElementById('input-wrap').style.display = 'none';
  document.getElementById('h-btn').style.display      = 'none';

  // Mostrar confirmación y cue de scroll
  document.getElementById('h-ok-txt').textContent = `¡Lo lograste, ${SECRET_NAME}! El viaje comienza…`;
  document.getElementById('h-ok').style.display   = 'flex';
  document.getElementById('scue').style.display   = 'flex';

  // Personalizar contenido con el nombre canónico
  document.getElementById('fn').textContent       = SECRET_NAME;
  document.getElementById('ws-done').textContent  = `¡Encontraste todo! Eres increíble, ${SECRET_NAME}. ✦`;
  document.getElementById('intro-txt').innerHTML  =
    `He construido este rincón solo para ti, <span class="nm">${SECRET_NAME}</span>.
     Un viaje a través de los recuerdos que guardé con cuidado.
     Como el <strong>Thousand Sunny</strong> navega al horizonte,
     hoy navegamos juntos hacia lo más especial:
     <strong>tu cumpleaños</strong>. ¡Prepárate, pirata!`;

  // Activar secciones con veil
  document.querySelectorAll('.gate').forEach(g => gObs.observe(g));

  // Pausar música al entrar — la aventura visual toma el protagonismo
  setTimeout(() => bgAudio.pause(), 800);
}

document.getElementById('h-btn').addEventListener('click', doUnlock);
document.getElementById('h-inp').addEventListener('keydown', e => {
  if (e.key === 'Enter') doUnlock();
});

/* ── MAPA PIRATA ─────────────────────────
   Reemplaza .pills con mapa interactivo.
   Cada destino = marcador X con líneas SVG.
──────────────────────────────────────── */
(function () {
  const PINS = [
    { key: 'PIRATA',     section: '#s4', fact: '🏴‍☠️ En One Piece, ser pirata no es un crimen — es una declaración de libertad. Luffy lo dice claro: ¡yo seré el Rey de los Piratas!', px: 16,  py: 25  },
    { key: 'NAVEGANTE',  section: '#s3', fact: '🧭 Nami tardó años en trazar el mapa del mundo. Cada isla cartografiada es una victoria ganada con esfuerzo y valentía.',             px: 73,  py: 65  },
    { key: 'TESORO',     section: '#s8', fact: '💎 El One Piece existe de verdad — Oda lo confirmó. Pero el tesoro más grande siempre fue la tripulación reunida en el camino.',      px: 50,  py: 38  },
    { key: 'NAKAMA',     section: '#s5', fact: '❤ "Nakama" no significa solo amigo. Significa la persona por la que romperías el mundo entero si fuera necesario.',                   px: 26,  py: 72  },
    { key: 'GRAND LINE', section: '#s6', fact: '🌊 El Grand Line desafía toda lógica: brújulas que fallan, climas imposibles y mares que nadie cruza sin valentía real.',             px: 82,  py: 28  },
  ];

  const TOTAL   = PINS.length;
  const visited = new Set();

  // ── Construir mapa ──────────────────────
  const pillsEl = document.querySelector('.pills');
  if (!pillsEl) return;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:.7rem;width:100%';

  // Océano — contenedor transparente
  const ocean = document.createElement('div');
  ocean.id = 'map-ocean';

  // Anillos de oleaje (4 capas)
  for (let i = 0; i < 4; i++) {
    const wave = document.createElement('div');
    wave.className = 'wave-ring';
    ocean.appendChild(wave);
  }

  // Isla
  const map = document.createElement('div');
  map.id = 'pirate-map';

  // Rosa de los vientos ⊕
  const compass = document.createElement('div');
  compass.className = 'map-compass';
  compass.textContent = '⊕';
  map.appendChild(compass);

  // SVG líneas de ruta — doradas, punteadas, con marcadores de dirección
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'map-lines';
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');

  // Definir marcador de flecha dorada
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrow" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
      <polygon points="0 0, 5 2.5, 0 5" fill="rgba(232,184,75,.55)" />
    </marker>
    <filter id="glow">
      <feGaussianBlur stdDeviation="0.8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  // Líneas de ruta con flecha y glow
  const route = [...PINS, PINS[0]];
  for (let i = 0; i < route.length - 1; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', route[i].px);   line.setAttribute('y1', route[i].py);
    line.setAttribute('x2', route[i+1].px); line.setAttribute('y2', route[i+1].py);
    line.setAttribute('stroke', 'rgba(232,184,75,.45)');
    line.setAttribute('stroke-width', '.65');
    line.setAttribute('stroke-dasharray', '2.5 2');
    line.setAttribute('marker-end', 'url(#arrow)');
    line.setAttribute('filter', 'url(#glow)');
    svg.appendChild(line);
  }
  map.appendChild(svg);

  // Pins
  const pinEls = {};
  PINS.forEach(p => {
    const pin = document.createElement('div');
    pin.className   = 'map-pin';
    pin.style.left  = p.px + '%';
    pin.style.top   = p.py + '%';
    pin.dataset.key = p.key;
    pin.innerHTML   = `<div class="map-pulse"></div><div class="map-x"></div><span class="map-label">${p.key}</span>`;
    map.appendChild(pin);
    pinEls[p.key] = pin;
  });

  ocean.appendChild(map);
  wrap.appendChild(ocean);

  const counter = document.createElement('p');
  counter.className   = 'map-counter';
  counter.id          = 'map-ctr';
  counter.textContent = `☠ 0 / ${TOTAL} islas descubiertas`;
  wrap.appendChild(counter);

  pillsEl.replaceWith(wrap);

  // ── Banner ──────────────────────────────
  const banner = document.createElement('div');
  banner.id = 'pill-banner';
  Object.assign(banner.style, {
    position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: '99999',
    padding: '1rem 2rem', background: 'rgba(6,14,28,.97)',
    borderTop: '1px solid rgba(232,184,75,.4)', color: 'rgba(240,236,228,.9)',
    fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1rem',
    lineHeight: '1.6', fontStyle: 'italic', textAlign: 'center',
    transform: 'translateY(100%)', transition: 'transform .35s cubic-bezier(.25,.46,.45,.94)',
    boxShadow: '0 -4px 30px rgba(0,0,0,.5)', display: 'block',
  });
  document.body.appendChild(banner);

  // ── Botón Extra ─────────────────────────
  const extraBtn = document.createElement('button');
  extraBtn.id        = 'extra-btn';
  extraBtn.innerHTML = '🎁 Bono Extra';
  Object.assign(extraBtn.style, {
    position: 'fixed', bottom: '1.4rem', left: '1.4rem', zIndex: '99998',
    padding: '.55rem 1.4rem', fontFamily: "'Courier New', monospace",
    fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase',
    color: '#03070f', background: '#e8b84b', border: '1px solid #e8b84b',
    cursor: 'pointer', opacity: '0', transform: 'translateY(12px)',
    transition: 'opacity .4s ease, transform .4s ease, background .2s, color .2s',
    pointerEvents: 'none', boxShadow: '0 4px 24px rgba(232,184,75,.45)',
  });
  document.body.appendChild(extraBtn);
  extraBtn.addEventListener('click', () => document.querySelector('#s7')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  extraBtn.addEventListener('mouseenter', () => { extraBtn.style.background = '#ffd97a'; extraBtn.style.boxShadow = '0 4px 32px rgba(232,184,75,.7)'; });
  extraBtn.addEventListener('mouseleave', () => { extraBtn.style.background = '#e8b84b'; extraBtn.style.boxShadow = '0 4px 24px rgba(232,184,75,.45)'; });

  let hideTimer = null;

  function showBanner(text, duration) {
    clearTimeout(hideTimer);
    banner.textContent     = text;
    banner.style.transform = 'translateY(0)';
    hideTimer = setTimeout(() => { banner.style.transform = 'translateY(100%)'; }, duration || 4000);
  }

  function revealExtraBtn() {
    extraBtn.style.opacity      = '1';
    extraBtn.style.transform    = 'translateY(0)';
    extraBtn.style.pointerEvents= 'auto';
    showBanner('🎉 ¡Descubriste todas las islas! El Bono Extra está desbloqueado ↙', 5500);
  }

  // ── Eventos de pins ─────────────────────
  Object.values(pinEls).forEach(pin => {
    const key  = pin.dataset.key;
    const data = PINS.find(p => p.key === key);

    pin.addEventListener('click', () => {
      Object.values(pinEls).forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      const alreadyAll = visited.size === TOTAL;
      visited.add(key);
      counter.textContent = `☠ ${visited.size} / ${TOTAL} islas descubiertas`;

      showBanner(data.fact);

      if (!alreadyAll && visited.size === TOTAL) {
        setTimeout(revealExtraBtn, 4300);
      }

      setTimeout(() => {
        document.querySelector(data.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    });
  });
})();


/* ── BOTÓN VOLVER A PILLS ────────────────
   Aparece cuando el usuario está fuera de
   #s2 (la sección de pills). Al hacer clic
   regresa con scroll suave a #s2.
──────────────────────────────────────── */
(function () {
  const btn = document.createElement('button');
  btn.id          = 'back-btn';
  btn.innerHTML   = '&#8593; Volver';
  btn.title       = 'Volver a las pills';
  Object.assign(btn.style, {
    position:     'fixed',
    bottom:       '1.4rem',
    right:        '1.4rem',
    zIndex:       '99998',
    padding:      '.55rem 1.2rem',
    fontFamily:   "'Courier New', monospace",
    fontSize:     '.65rem',
    letterSpacing:'.2em',
    textTransform:'uppercase',
    color:        '#e8b84b',
    background:   'rgba(6,14,28,.95)',
    border:       '1px solid rgba(232,184,75,.4)',
    cursor:       'pointer',
    opacity:      '0',
    transform:    'translateY(12px)',
    transition:   'opacity .3s ease, transform .3s ease',
    pointerEvents:'none',
    boxShadow:    '0 4px 20px rgba(0,0,0,.5)',
  });
  document.body.appendChild(btn);

  // Mostrar solo cuando #s2 no está en viewport
  const s2 = document.getElementById('s2');
  const visObs = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    btn.style.opacity      = visible ? '0' : '1';
    btn.style.transform    = visible ? 'translateY(12px)' : 'translateY(0)';
    btn.style.pointerEvents= visible ? 'none' : 'auto';
  }, { threshold: 0.15 });

  visObs.observe(s2);

  btn.addEventListener('click', () => {
    s2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#e8b84b';
    btn.style.color      = '#03070f';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'rgba(6,14,28,.95)';
    btn.style.color      = '#e8b84b';
  });
})();
const mObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: .15 });
document.querySelectorAll('.mem').forEach(m => mObs.observe(m));

/* PUZZLE */
[
  { e: '⚔️', t: 'Tu valentía es digna de un Capitán Pirata' },
  { e: '💛', t: 'Tu corazón brilla más que el One Piece' },
  { e: '✦',  t: 'Tu sonrisa ilumina cualquier isla' },
  { e: '🧭', t: 'Tu inteligencia supera a Nico Robin' },
  { e: '⚓', t: 'Tu determinación es igual a la de Luffy' },
  { e: '🌊', t: 'Tu energía es inagotable como el mar' },
  { e: '☠',  t: 'Tu espíritu pirata es único e irrepetible' },
  { e: '💎', t: 'Eres un tesoro que no tiene precio' },
  { e: '❤',  t: 'Tu presencia es un regalo para todos' },
].forEach((p, i) => {
  const d = document.createElement('div');
  d.className = 'piece';
  d.innerHTML = `
    <div class="piece-glow"></div>
    <span class="p-n">${String(i + 1).padStart(2, '0')}</span>
    <span class="p-e">${p.e}</span>
    <span class="p-t">${p.t}</span>
  `;
  d.addEventListener('click', () => {
    if (!d.classList.contains('done')) d.classList.add('done');
  });
  document.getElementById('puzzle-g').appendChild(d);
});

/* FLIP CARDS */
let fc = 0;
[
  { i: '⚓', l: 'Tu Alegría',    tt: 'Tu Alegría',    tx: 'Tu risa puede iluminar el mar más oscuro. Cuando ríes, hasta el Marineford se volvería un lugar alegre.' },
  { i: '✦',  l: 'Tu Fortaleza', tt: 'Tu Fortaleza',  tx: 'Enfrentas cada tormenta con una fuerza que inspira a toda la tripulación. Eres el ancla que nos mantiene.' },
  { i: '☠',  l: 'Tu Lealtad',   tt: 'Tu Lealtad',    tx: 'Tu lealtad no tiene precio. Saber que estás ahí es el tesoro más grande que existe en cualquier mar.' },
  { i: '💎', l: 'Tu Energía',   tt: 'Tu Energía',    tx: 'Tienes una presencia y una energía que ilumina cualquier lugar. Es imposible no notarte cuando entras.' },
].forEach(t => {
  const c = document.createElement('div');
  c.className = 'fc';
  c.innerHTML = `
    <div class="fc-inner">
      <div class="fc-front">
        <span class="fi">${t.i}</span>
        <span class="fl">${t.l}</span>
        <span class="fh">— clic para revelar —</span>
      </div>
      <div class="fc-back">
        <p class="bt">${t.tt}</p>
        <p class="bx">${t.tx}</p>
      </div>
    </div>
  `;
  c.addEventListener('click', () => {
    if (!c.classList.contains('flipped')) {
      c.classList.add('flipped');
      fc++;
      document.getElementById('f-cnt').textContent = `${fc} / 4 reveladas`;
    }
  });
  document.getElementById('flip-g').appendChild(c);
});

/* WORD SEARCH */
(function () {
  const WS   = ['PIRATA', 'FUERTE', 'ALEGRE', 'VALIENTE', 'RICHARD', 'BELLA', 'NAKAMA'];
  const S    = 13;
  const ABC  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DIRS = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[1,-1],[-1,1],[-1,-1]];

  let grid  = Array.from({ length: S }, () => Array(S).fill(''));
  let found = new Set(), sel = false, sS = null, sC = [];

  function place(w) {
    for (let t = 0; t < 500; t++) {
      const d  = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r  = Math.floor(Math.random() * S);
      const c  = Math.floor(Math.random() * S);
      let ok   = true;
      const cs = [];
      for (let i = 0; i < w.length; i++) {
        const nr = r + d[0] * i, nc = c + d[1] * i;
        if (nr < 0 || nr >= S || nc < 0 || nc >= S)          { ok = false; break; }
        if (grid[nr][nc] && grid[nr][nc] !== w[i])            { ok = false; break; }
        cs.push([nr, nc]);
      }
      if (ok) { cs.forEach(([r, c], i) => grid[r][c] = w[i]); return; }
    }
  }

  WS.forEach(place);
  for (let r = 0; r < S; r++)
    for (let c = 0; c < S; c++)
      if (!grid[r][c]) grid[r][c] = ABC[Math.floor(Math.random() * 26)];

  // Chips
  const ch = document.getElementById('chips');
  WS.forEach(w => {
    const s = document.createElement('span');
    s.className = 'chip'; s.textContent = w; s.id = 'ch-' + w;
    ch.appendChild(s);
  });

  // Grid cells
  const wg  = document.getElementById('ws-g');
  wg.style.gridTemplateColumns = `repeat(${S},1fr)`;
  const els = [];
  for (let r = 0; r < S; r++) {
    els[r] = [];
    for (let c = 0; c < S; c++) {
      const d = document.createElement('div');
      d.className = 'wc'; d.textContent = grid[r][c];
      d.dataset.r = r; d.dataset.c = c;
      wg.appendChild(d); els[r][c] = d;
    }
  }

  function line(a, b) {
    const dr = Math.sign(b[0] - a[0]), dc = Math.sign(b[1] - a[1]);
    const res = []; let r = a[0], c = a[1];
    while (true) {
      res.push([r, c]);
      if (r === b[0] && c === b[1]) break;
      r += dr; c += dc;
      if (res.length > S + 2) break;
    }
    return res;
  }

  function check(sc) {
    const str = sc.map(([r, c]) => grid[r][c]).join('');
    const rev = str.split('').reverse().join('');
    for (const w of WS) {
      if (!found.has(w) && (str === w || rev === w)) {
        found.add(w);
        sc.forEach(([r, c]) => els[r][c].classList.add('hit'));
        document.getElementById('ch-' + w).classList.add('found');
        const fb = document.getElementById('ws-fb');
        fb.textContent = `"${w}" encontrada ✦`;
        fb.classList.add('show');
        setTimeout(() => fb.classList.remove('show'), 2500);
        if (found.size === WS.length)
          document.getElementById('ws-done').style.display = 'block';
        return;
      }
    }
  }

  function clr() {
    document.querySelectorAll('.wc.sel:not(.hit)').forEach(c => c.classList.remove('sel'));
  }

  // Mouse
  wg.addEventListener('mousedown', e => {
    const cl = e.target.closest('.wc'); if (!cl) return;
    sel = true; sS = [+cl.dataset.r, +cl.dataset.c]; clr(); cl.classList.add('sel'); e.preventDefault();
  });
  wg.addEventListener('mousemove', e => {
    if (!sel) return;
    const cl = e.target.closest('.wc'); if (!cl) return;
    clr(); const l = line(sS, [+cl.dataset.r, +cl.dataset.c]);
    l.forEach(([r, c]) => els[r][c].classList.add('sel')); sC = l;
  });
  document.addEventListener('mouseup', () => {
    if (!sel) return; sel = false; check(sC); setTimeout(clr, 300);
  });

  // Touch
  wg.addEventListener('touchstart', e => {
    const t = e.touches[0], cl = document.elementFromPoint(t.clientX, t.clientY)?.closest('.wc');
    if (!cl) return; sel = true; sS = [+cl.dataset.r, +cl.dataset.c]; clr(); cl.classList.add('sel'); e.preventDefault();
  }, { passive: false });
  wg.addEventListener('touchmove', e => {
    if (!sel) return;
    const t = e.touches[0], cl = document.elementFromPoint(t.clientX, t.clientY)?.closest('.wc');
    if (!cl) return; clr(); const l = line(sS, [+cl.dataset.r, +cl.dataset.c]);
    l.forEach(([r, c]) => els[r][c].classList.add('sel')); sC = l; e.preventDefault();
  }, { passive: false });
  wg.addEventListener('touchend', () => {
    if (!sel) return; sel = false; check(sC); setTimeout(clr, 300);
  });
})();

/* SCRATCH CARDS */
(function () {
  [
    { i: '🍖', l: 'Vale por',   v: 'Festín de Sanji\nUna comida increíble' },
    { i: '🗺️', l: 'Vale por',   v: 'Bono Aventura\nSorpresa especial'      },
    { i: '❤',  l: 'Con cariño', v: 'Tu Nakama\nSiempre aquí para ti'       },
  ].forEach(pr => {
    const wrap = document.createElement('div'); wrap.className = 'sc-w';
    const card = document.createElement('div'); card.className = 'sc-card';
    const pz   = document.createElement('div'); pz.className   = 'sc-prize';
    pz.innerHTML = `<span class="spi">${pr.i}</span><p class="spl">${pr.l}</p><p class="spv">${pr.v}</p>`;
    card.appendChild(pz);

    const cv  = document.createElement('canvas'); cv.className  = 'sc-cv'; card.appendChild(cv);
    const pct = document.createElement('p');       pct.className = 'sc-pct';
    const btn = document.createElement('button');  btn.className = 'sc-btn'; btn.textContent = 'Acepto ✦';

    wrap.appendChild(card); wrap.appendChild(pct); wrap.appendChild(btn);
    document.getElementById('sc-row').appendChild(wrap);

    let revealed = false, painting = false;

    function init() {
      cv.width  = card.offsetWidth  || 228;
      cv.height = card.offsetHeight || 153;
      const ctx = cv.getContext('2d');
      const g   = ctx.createLinearGradient(0, 0, cv.width, cv.height);
      g.addColorStop(0,  '#0b1e3a');
      g.addColorStop(.5, '#0f3060');
      g.addColorStop(1,  '#0b1e3a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = 'rgba(232,184,75,.08)'; ctx.lineWidth = 1;
      for (let x = 0; x < cv.width;  x += 20) { ctx.beginPath(); ctx.moveTo(x, 0);        ctx.lineTo(x, cv.height); ctx.stroke(); }
      for (let y = 0; y < cv.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y);        ctx.lineTo(cv.width, y);  ctx.stroke(); }
      ctx.fillStyle = 'rgba(232,184,75,.45)';
      ctx.font      = '500 11px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('RASPA AQUÍ', cv.width / 2, cv.height / 2);
    }

    function scratch(x, y) {
      const ctx = cv.getContext('2d');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
      if (revealed) return;
      const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let tr = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] < 128) tr++;
      const p = Math.round(tr / (cv.width * cv.height) * 100);
      pct.textContent = p + '%';
      if (p > 55) {
        revealed = true;
        cv.style.transition = 'opacity .7s'; cv.style.opacity = '0';
        pct.textContent = '✦'; btn.classList.add('show');
      }
    }

    cv.addEventListener('mousedown',  e => { painting = true; const r = cv.getBoundingClientRect(); scratch(e.clientX - r.left, e.clientY - r.top); });
    cv.addEventListener('mousemove',  e => { if (!painting) return; const r = cv.getBoundingClientRect(); scratch(e.clientX - r.left, e.clientY - r.top); });
    cv.addEventListener('mouseup',    () => painting = false);
    cv.addEventListener('mouseleave', () => painting = false);
    cv.addEventListener('touchstart', e => { painting = true; const r = cv.getBoundingClientRect(), t = e.touches[0]; scratch(t.clientX - r.left, t.clientY - r.top); e.preventDefault(); }, { passive: false });
    cv.addEventListener('touchmove',  e => { if (!painting) return; const r = cv.getBoundingClientRect(), t = e.touches[0]; scratch(t.clientX - r.left, t.clientY - r.top); e.preventDefault(); }, { passive: false });
    cv.addEventListener('touchend',   () => painting = false);
    btn.addEventListener('click',     () => { btn.textContent = 'Con mucho gusto ❤'; btn.style.opacity = '.4'; btn.disabled = true; });

    setTimeout(init, 200);
  });
})();

/* CONFETTI */
(function () {
  const cv = document.getElementById('conf-cv');
  if (!cv) return;
  try {
    const ctx = cv.getContext('2d');
    function resize() { cv.width = innerWidth; cv.height = innerHeight; }
    resize(); addEventListener('resize', resize);

    const pal = [
      'rgba(232,184,75,.85)', 'rgba(255,217,122,.75)',
      'rgba(240,236,228,.6)', 'rgba(192,57,43,.7)', 'rgba(255,255,255,.55)'
    ];
    const ps = Array.from({ length: 100 }, () => ({
      x:     Math.random() * innerWidth,
      y:     Math.random() * -innerHeight * .9,
      w:     Math.random() * 12 + 4,
      h:     Math.random() * 7 + 2,
      color: pal[Math.floor(Math.random() * pal.length)],
      vy:    Math.random() * 3 + 1.5,
      vx:    (Math.random() - .5) * 2,
      rot:   Math.random() * Math.PI * 2,
      rs:    (Math.random() - .5) * .11,
    }));

    let running = false;
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += p.rs;
        if (p.y > cv.height + 10) { p.y = -10; p.x = Math.random() * cv.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      requestAnimationFrame(tick);
    }

    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !running) { running = true; tick(); }
    }, { threshold: .3 }).observe(document.getElementById('s8'));

  } catch (e) { /* silencia errores de canvas en entornos restrictivos */ }
})();

/* ════════════════════════════════════════
   BLOQUE 1A — CUENTA REGRESIVA
   Cumpleaños: 14 de marzo
   Muestra días/horas/min/seg hasta la fecha.
   Al llegar a 0 → explosión de confetti + banner.
════════════════════════════════════════ */
(function () {
  // Inyectar widget en §1 hero, encima del emblem
  const heroInner = document.getElementById('hero-inner');
  if (!heroInner) return;

  const now   = new Date();
  const year  = now.getMonth() > 2 || (now.getMonth() === 2 && now.getDate() > 14)
                ? now.getFullYear() + 1
                : now.getFullYear();
  const bday  = new Date(year, 2, 14, 0, 0, 0); // mes 2 = marzo (0-indexed)

  const wrap = document.createElement('div');
  wrap.id = 'countdown-wrap';

  const label = document.createElement('p');
  label.id = 'cd-label';
  label.textContent = 'El Gran Festejo comienza en';

  const units = ['días', 'horas', 'min', 'seg'];
  const blocks = units.map(u => {
    const b = document.createElement('div');
    b.className = 'cd-block';
    b.innerHTML = `<span class="cd-num" id="cd-${u}">00</span><span class="cd-unit">${u}</span>`;
    return b;
  });

  const grid = document.createElement('div');
  grid.id = 'cd-grid';
  blocks.forEach(b => grid.appendChild(b));

  wrap.appendChild(label);
  wrap.appendChild(grid);
  heroInner.insertBefore(wrap, heroInner.firstChild);

  let exploded = false;

  function tick() {
    const diff = bday - Date.now();
    if (diff <= 0) {
      if (!exploded) {
        exploded = true;
        label.textContent = '🎉 ¡HOY ES EL DÍA, PIRATA! 🎉';
        grid.style.display = 'none';
        wrap.classList.add('cd-today');
        // Trigger confetti burst
        triggerBirthdayBurst();
      }
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cd-días').textContent  = String(d).padStart(2, '0');
    document.getElementById('cd-horas').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-min').textContent   = String(m).padStart(2, '0');
    document.getElementById('cd-seg').textContent   = String(s).padStart(2, '0');
  }

  function triggerBirthdayBurst() {
    const cv = document.getElementById('conf-cv');
    if (!cv) return;
    // Forzar visibilidad y lanzar animación de confetti ya existente
    cv.style.display = 'block';
    cv.style.zIndex  = '9999';
  }

  tick();
  setInterval(tick, 1000);
})();

/* ════════════════════════════════════════
   BLOQUE 1B — KONAMI CODE
   ↑↑↓↓←→←→BA → animación secreta
════════════════════════════════════════ */
(function () {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
                  'b','a'];
  let idx = 0;

  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        activateKonami();
      }
    } else {
      idx = e.key === KONAMI[0] ? 1 : 0;
    }
  });

  function activateKonami() {
    // Overlay secreto
    const ov = document.createElement('div');
    ov.id = 'konami-ov';
    ov.innerHTML = `
      <div id="konami-inner">
        <div id="konami-skull">☠</div>
        <p id="konami-title">CÓDIGO PIRATA ACTIVADO</p>
        <p id="konami-msg">Sabía que lo encontrarías, Richard.<br>
        Solo un verdadero pirata conoce el código secreto.<br><br>
        <span style="color:#e8b84b">El One Piece es real.</span><br>
        Y este momento también lo es.</p>
        <button id="konami-close">⚓ Continuar la aventura</button>
      </div>`;
    document.body.appendChild(ov);

    requestAnimationFrame(() => ov.classList.add('konami-show'));

    document.getElementById('konami-close').addEventListener('click', () => {
      ov.classList.remove('konami-show');
      setTimeout(() => ov.remove(), 500);
    });

    // Cambiar música brevemente — subir volumen
    const audioEl = document.querySelector('audio');
    if (audioEl) { audioEl.volume = 0.7; setTimeout(() => { audioEl.volume = 0.35; }, 4000); }
  }
})();

/* ════════════════════════════════════════
   BLOQUE 1C — MODO GEAR 5
   Botón oculto en el footer / §8.
   Activa tema blanco+dorado con nubes.
════════════════════════════════════════ */
(function () {
  // Botón oculto — aparece al triple-click en el emblema final
  const badge = document.querySelector('.final-badge');
  if (!badge) return;

  let clicks = 0, timer = null;
  badge.style.cursor = 'pointer';

  badge.addEventListener('click', () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 600);
    if (clicks >= 3) { clicks = 0; toggleGear5(); }
  });

  let gear5Active = false;

  function toggleGear5() {
    gear5Active = !gear5Active;
    document.body.classList.toggle('gear5', gear5Active);

    // Banner de activación
    const msg = document.createElement('div');
    msg.id = 'gear5-banner';
    msg.textContent = gear5Active
      ? '⚡ GEAR FIVE — NIKA DESPERTÓ ⚡'
      : '— Modo normal restaurado —';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);

    // Nubes flotantes
    if (gear5Active) spawnClouds();
    else document.querySelectorAll('.g5-cloud').forEach(c => c.remove());
  }

  function spawnClouds() {
    for (let i = 0; i < 8; i++) {
      const c = document.createElement('div');
      c.className = 'g5-cloud';
      c.style.cssText = `
        left:${Math.random() * 110 - 10}%;
        top:${Math.random() * 100}%;
        width:${80 + Math.random() * 120}px;
        opacity:${0.4 + Math.random() * 0.4};
        animation-duration:${8 + Math.random() * 12}s;
        animation-delay:${Math.random() * 4}s;
      `;
      document.body.appendChild(c);
    }
  }
})();

/* ════════════════════════════════════════
   BLOQUE 2A — TERMINAL PIRATA
   Tecla ` (backtick) abre la consola.
   Comandos: help, nakama, onepiece,
             richard, treasure, gear5, clear
════════════════════════════════════════ */
(function () {
  const COMMANDS = {
    help: () => `<span class="t-gold">Comandos disponibles:</span>
  help       → esta ayuda
  nakama     → mensaje de la tripulación
  onepiece   → la gran verdad
  richard    → perfil del pirata
  treasure   → ubicación del tesoro
  gear5      → activa Gear 5 (si lo encuentras primero)
  clear      → limpiar terminal
  exit       → cerrar`,

    nakama: () => `<span class="t-gold">[ MENSAJE DE LA TRIPULACIÓN ]</span>
  Luffy    → "¡Eres increíble, nakama!"
  Zoro     → "... (asiente con respeto)"
  Nami     → "Feliz cumpleaños. Te debo nada."
  Usopp    → "¡Yo sabía que llegarías hasta aquí!"
  Sanji    → "Un festín digno de un rey para ti."
  Chopper  → "¡FELIZ CUMPLEAÑOS! ¡YA SÉ QUIEN ERES!"
  Robin    → "Qué interesante... sobreviviste otro año."
  Franky   → "¡SUPER! ¡SUPER! ¡SUPER!"
  Brook    → "¿Puedo ver tus calzones? Yohohoho~"`,

    onepiece: () => `<span class="t-gold">[ CLASIFICADO — NIVEL JOLLY ROGER ]</span>
  El One Piece existe.
  Oda lo confirmó en 2017.

  Pero la verdad más profunda es esta:

  El tesoro no es oro ni poder.
  Es el viaje. Son las personas.
  Son los momentos como este.

  <span class="t-red">Este momento es tu One Piece, Richard.</span>`,

    richard: () => `<span class="t-gold">[ PERFIL — RICHARD ]</span>
  Clase        → Pirata de Alto Nivel
  Recompensa   → ∞ Berries
  Habilidad    → Conqueror's Haki
  Devil Fruit  → Desconocido (y eso da miedo)
  Estado       → <span class="t-gold">CUMPLEAÑOS ACTIVADO</span>
  Nakamas      → Los mejores del Grand Line
  Sueño        → En proceso. Imparable.`,

    treasure: () => `<span class="t-gold">[ COORDENADAS DEL TESORO ]</span>
  Log Pose calibrado...
  Calculando ruta...

  North Blue  → 14°03'N
  Grand Line  → 03°14'W

  El tesoro está exactamente donde estás tú.
  <span class="t-red">Siempre estuvo ahí.</span>`,

    gear5: () => {
      document.body.classList.toggle('gear5');
      const on = document.body.classList.contains('gear5');
      return on
        ? `<span class="t-gold">⚡ GEAR FIVE ACTIVADO ⚡</span>\n  El Joy Boy despertó. El mundo nunca será igual.`
        : `<span class="t-gold">— Gear Five desactivado —</span>\n  Volviendo a la realidad... por ahora.`;
    },

    clear: () => { termBody.innerHTML = ''; return null; },

    exit: () => { closeTerm(); return null; },
  };

  // Crear terminal
  const term = document.createElement('div');
  term.id = 'pirate-term';
  term.innerHTML = `
    <div id="term-bar">
      <span>☠ PIRATE OS v1.0 — Grand Line Terminal</span>
      <button id="term-x">✕</button>
    </div>
    <div id="term-body"></div>
    <div id="term-input-row">
      <span class="t-prompt">pirata@grandline:~$</span>
      <input id="term-inp" type="text" autocomplete="off" spellcheck="false" placeholder="escribe un comando...">
    </div>`;
  document.body.appendChild(term);

  const termBody = document.getElementById('term-body');
  const termInp  = document.getElementById('term-inp');

  function print(html) {
    const line = document.createElement('pre');
    line.className = 'term-line';
    line.innerHTML = html;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function openTerm() {
    term.classList.add('term-open');
    termInp.focus();
    if (termBody.children.length === 0) {
      print(`<span class="t-gold">Bienvenido al Grand Line Terminal, Richard.</span>\nEscribe <span class="t-gold">help</span> para ver los comandos disponibles.\n`);
    }
  }

  function closeTerm() {
    term.classList.remove('term-open');
  }

  document.getElementById('term-x').addEventListener('click', closeTerm);

  // Tecla ` para abrir/cerrar
  document.addEventListener('keydown', e => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      term.classList.contains('term-open') ? closeTerm() : openTerm();
    }
    if (e.key === 'Escape' && term.classList.contains('term-open')) closeTerm();
  });

  termInp.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const raw = termInp.value.trim().toLowerCase();
    termInp.value = '';
    if (!raw) return;

    print(`<span class="t-prompt">pirata@grandline:~$</span> ${raw}`);

    const fn = COMMANDS[raw];
    if (fn) {
      const out = fn();
      if (out !== null && out !== undefined) print(out);
    } else {
      print(`<span class="t-red">Comando no encontrado: "${raw}"</span>\nEscribe <span class="t-gold">help</span> para ver los comandos disponibles.`);
    }
  });

  // Hint discreto en la esquina
  const hint = document.createElement('div');
  hint.id = 'term-hint';
  hint.textContent = '` Terminal';
  document.body.appendChild(hint);
  hint.addEventListener('click', () => term.classList.contains('term-open') ? closeTerm() : openTerm());
})();

/* ════════════════════════════════════════
   BLOQUE 2B — BATALLA NAVAL
   Mini-juego 6×6. Encuentra el barco
   enemigo (3 celdas). Al hundir → mensaje.
════════════════════════════════════════ */
(function () {
  // Insertar sección antes de §3
  const s3 = document.getElementById('s3');
  if (!s3) return;

  // Crear sección
  const sec = document.createElement('section');
  sec.className = 'section gate';
  sec.id = 's2b';
  sec.innerHTML = `
    <div class="veil"><div class="vt"></div><div class="vb"></div></div>
    <div class="sec-hd">
      <p class="eyebrow">— Misión secreta —</p>
      <h2 class="t-display">Batalla Naval</h2>
      <p class="t-body mt6">Hunde el barco enemigo para desbloquear un mensaje secreto</p>
    </div>
    <div id="bn-status">🎯 Disparos restantes: <span id="bn-shots">12</span></div>
    <div id="bn-grid"></div>
    <div id="bn-msg"></div>`;

  // Divisor
  const rule = document.createElement('div');
  rule.className = 'rule';
  rule.innerHTML = '<div class="rl"></div><span class="ri">⚓ ☠ ⚓</span><div class="rl"></div>';

  s3.before(rule);
  s3.before(sec);

  // Usar el gObs global para que respete el unlock de contraseña
  if (typeof gObs !== 'undefined') gObs.observe(sec);

  // Lógica del juego
  const SIZE  = 6;
  const SHIP  = 3; // tamaño del barco
  let shots   = 12;
  let hits    = 0;
  let gameOver = false;

  // Posicionar barco aleatoriamente
  const horiz  = Math.random() > .5;
  const startR = horiz ? Math.floor(Math.random() * SIZE) : Math.floor(Math.random() * (SIZE - SHIP + 1));
  const startC = horiz ? Math.floor(Math.random() * (SIZE - SHIP + 1)) : Math.floor(Math.random() * SIZE);
  const shipCells = new Set();
  for (let i = 0; i < SHIP; i++) {
    const r = horiz ? startR : startR + i;
    const c = horiz ? startC + i : startC;
    shipCells.add(`${r},${c}`);
  }

  const grid = document.getElementById('bn-grid');
  const msg  = document.getElementById('bn-msg');
  const shotsEl = document.getElementById('bn-shots');

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'bn-cell';
      cell.dataset.pos = `${r},${c}`;
      cell.addEventListener('click', () => fire(cell));
      grid.appendChild(cell);
    }
  }

  function fire(cell) {
    if (gameOver || cell.classList.contains('bn-hit') || cell.classList.contains('bn-miss')) return;
    const pos = cell.dataset.pos;
    shots--;
    shotsEl.textContent = shots;

    if (shipCells.has(pos)) {
      cell.classList.add('bn-hit');
      cell.textContent = '💥';
      hits++;
      if (hits === SHIP) {
        gameOver = true;
        msg.innerHTML = `<span class="t-gold">☠ ¡BARCO HUNDIDO!</span><br>
          El mensaje secreto: <em>"Richard, eres el capitán de tu propio destino.<br>
          Nadie navega el Grand Line solo — gracias por dejarme ser tu nakama."</em>`;
        msg.classList.add('bn-win');
        revealShip();
      }
    } else {
      cell.classList.add('bn-miss');
      cell.textContent = '🌊';
      if (shots <= 0 && hits < SHIP) {
        gameOver = true;
        msg.innerHTML = `<span class="t-red">Sin munición. El barco escapó.</span><br>
          <button id="bn-retry">↺ Intentar de nuevo</button>`;
        revealShip();
        document.getElementById('bn-retry')?.addEventListener('click', resetGame);
      }
    }
  }

  function revealShip() {
    document.querySelectorAll('.bn-cell').forEach(cell => {
      if (shipCells.has(cell.dataset.pos) && !cell.classList.contains('bn-hit')) {
        cell.classList.add('bn-reveal');
        cell.textContent = '🚢';
      }
    });
  }

  function resetGame() {
    gameOver = false; shots = 12; hits = 0;
    shotsEl.textContent = shots;
    msg.innerHTML = '';
    msg.className = 'bn-msg';
    document.querySelectorAll('.bn-cell').forEach(cell => {
      cell.className = 'bn-cell';
      cell.textContent = '';
    });
    // Re-posicionar barco
    shipCells.clear();
    const h2 = Math.random() > .5;
    const r0 = h2 ? Math.floor(Math.random() * SIZE) : Math.floor(Math.random() * (SIZE - SHIP + 1));
    const c0 = h2 ? Math.floor(Math.random() * (SIZE - SHIP + 1)) : Math.floor(Math.random() * SIZE);
    for (let i = 0; i < SHIP; i++) {
      shipCells.add(h2 ? `${r0},${c0+i}` : `${r0+i},${c0}`);
    }
  }
})();

/* ════════════════════════════════════════
   BLOQUE 3A — LÍNEA DE TIEMPO (manga scroll)
   Scroll horizontal estilo viñetas de manga.
   Se inserta entre §4 y §5.
════════════════════════════════════════ */
(function () {
  const s5 = document.getElementById('s5');
  if (!s5) return;

  const PANELS = [
    { icon: '⚓', year: 'El Inicio',      title: 'Zarpando',           body: 'Todo gran viaje empieza con un paso al vacío y la valentía de no mirar atrás.' },
    { icon: '🌊', year: 'Las Tormentas',  title: 'Mar Adentro',         body: 'Los mares más difíciles forjan a los mejores navegantes. Tú los cruzaste todos.' },
    { icon: '🗺️', year: 'Nuevas Islas',  title: 'Territorios Nuevos',  body: 'Cada desafío fue una isla nueva. Cada isla, una versión más poderosa de ti.' },
    { icon: '💎', year: 'Los Tesoros',    title: 'Lo Que Encontraste',  body: 'No era oro lo que buscabas. Era crecer, reír, conectar — y lo lograste.' },
    { icon: '🏴‍☠️', year: 'Hoy',          title: 'El Capitán',          body: 'Hoy celebramos al pirata que eres. El Grand Line te espera — y tú ya sabes navegarlo.' },
  ];

  const sec = document.createElement('section');
  sec.className = 'section gate';
  sec.id = 's-timeline';
  sec.innerHTML = `
    <div class="veil"><div class="vt"></div><div class="vb"></div></div>
    <div class="sec-hd">
      <p class="eyebrow">— La historia del navegante —</p>
      <h2 class="t-display">Tu viaje en <span class="gold it">viñetas</span></h2>
    </div>
    <div id="tl-track">
      ${PANELS.map((p, i) => `
        <div class="tl-panel" style="animation-delay:${i * .12}s">
          <div class="tl-icon">${p.icon}</div>
          <p class="tl-year">${p.year}</p>
          <h3 class="tl-title">${p.title}</h3>
          <p class="tl-body">${p.body}</p>
          <div class="tl-num">${String(i+1).padStart(2,'0')}</div>
        </div>`).join('')}
    </div>
    <p class="tl-hint">← desliza →</p>`;

  const rule = document.createElement('div');
  rule.className = 'rule';
  rule.innerHTML = '<div class="rl"></div><span class="ri">📖 ☠ 📖</span><div class="rl"></div>';

  s5.before(rule);
  s5.before(sec);

  // Usar el gObs global para que respete el unlock de contraseña
  if (typeof gObs !== 'undefined') gObs.observe(sec);

  // Drag-to-scroll en el track
  const track = document.getElementById('tl-track');
  let down = false, startX, scrollLeft;
  track.addEventListener('mousedown',  e => { down = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; track.style.cursor = 'grabbing'; });
  track.addEventListener('mouseleave', () => { down = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',    () => { down = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove',  e => { if (!down) return; e.preventDefault(); track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX); });
})();

/* ════════════════════════════════════════
   BLOQUE 3B — CURSOR PERSONALIZADO
   Calavera pirata que sigue el mouse.
   + Espada que aparece al hacer hover en pins.
════════════════════════════════════════ */
(function () {
  const cur = document.createElement('div');
  cur.id = 'pirate-cursor';
  cur.textContent = '☠';
  document.body.appendChild(cur);

  const trail = document.createElement('div');
  trail.id = 'cursor-trail';
  document.body.appendChild(trail);

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  // Trail con lerp suave
  function animTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  // Esconder cursor nativo
  document.body.style.cursor = 'none';

  // Efecto click — escalar
  document.addEventListener('mousedown', () => cur.classList.add('cur-click'));
  document.addEventListener('mouseup',   () => cur.classList.remove('cur-click'));

  // Hover en elementos interactivos — cambiar color
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('button, a, .map-pin, .bn-cell, .flip-card, .mem, .pill');
    cur.classList.toggle('cur-active', !!el);
  });
})();

/* ════════════════════════════════════════
   BLOQUE 3C — EFECTOS DE SONIDO
   Web Audio API — sin archivos externos.
   Genera sonidos sintéticos temáticos.
════════════════════════════════════════ */
(function () {
  let ctx = null;
  let userHasInteracted = false;

  // AudioContext solo puede crearse tras un gesto del usuario (política del navegador).
  // Registramos el primer clic/teclado y a partir de ahí habilitamos el audio.
  function onFirstGesture() {
    userHasInteracted = true;
    document.removeEventListener('click',   onFirstGesture);
    document.removeEventListener('keydown', onFirstGesture);
  }
  document.addEventListener('click',   onFirstGesture);
  document.addEventListener('keydown', onFirstGesture);

  function getCtx() {
    if (!userHasInteracted) return null;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTone({ freq = 440, type = 'sine', duration = 0.15, vol = 0.18, decay = 0.1 } = {}) {
    try {
      const ac  = getCtx();
      if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = type; osc.frequency.setValueAtTime(freq, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ac.currentTime + duration);
      gain.gain.setValueAtTime(vol, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration + decay);
      osc.start(); osc.stop(ac.currentTime + duration + decay + 0.05);
    } catch (e) { /* silenciar en entornos sin audio */ }
  }

  function playWhoosh() {
    try {
      const ac   = getCtx();
      if (!ac) return;
      const buf  = ac.createBuffer(1, ac.sampleRate * 0.18, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src  = ac.createBufferSource();
      const gain = ac.createGain();
      const filt = ac.createBiquadFilter();
      filt.type = 'bandpass'; filt.frequency.value = 800;
      src.buffer = buf;
      src.connect(filt); filt.connect(gain); gain.connect(ac.destination);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      src.start();
    } catch (e) {}
  }

  function playCoin() {
    [880, 1100, 1320].forEach((f, i) => {
      setTimeout(() => playTone({ freq: f, type: 'triangle', duration: 0.12, vol: 0.15 }), i * 60);
    });
  }

  function playWave() {
    try {
      const ac   = getCtx();
      if (!ac) return;
      const buf  = ac.createBuffer(1, ac.sampleRate * 0.4, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ac.sampleRate;
        data[i] = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 6) * 0.4;
      }
      const src  = ac.createBufferSource();
      const gain = ac.createGain();
      src.buffer = buf;
      src.connect(gain); gain.connect(ac.destination);
      gain.gain.setValueAtTime(0.3, ac.currentTime);
      src.start();
    } catch (e) {}
  }

  // Sonido en pins del mapa
  document.addEventListener('mouseover', e => {
    if (e.target.closest('.map-pin')) playWhoosh();
  });

  // Sonido al abrir flip cards
  document.addEventListener('click', e => {
    if (e.target.closest('.flip-card')) playCoin();
  });

  // Sonido en disparo naval
  document.addEventListener('click', e => {
    const cell = e.target.closest('.bn-cell');
    if (!cell) return;
    if (cell.classList.contains('bn-hit'))  playCoin();
    else if (!cell.classList.contains('bn-miss')) playWave();
  });

  // Sonido suave al hacer scroll entre secciones
  let lastSection = '';
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.target.id !== lastSection) {
        lastSection = e.target.id;
        playTone({ freq: 220, type: 'sine', duration: 0.3, vol: 0.06, decay: 0.4 });
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section').forEach(s => secObs.observe(s));
})();

/* ════════════════════════════════════════
   BLOQUE 4A — TYPEWRITER FINAL
   La dedicatoria de §8 se escribe sola
   letra por letra al entrar en viewport.
════════════════════════════════════════ */
(function () {
  const msgEl = document.querySelector('.final-msg');
  const sigEl = document.querySelector('.final-sig');
  if (!msgEl) return;

  const originalMsg = msgEl.innerHTML;
  const originalSig = sigEl ? sigEl.innerHTML : '';

  // Limpiar para la animación
  msgEl.innerHTML = '';
  msgEl.style.minHeight = '8rem';
  if (sigEl) sigEl.innerHTML = '';

  let started = false;

  function typeHTML(el, html, speed, onDone) {
    // Convertir HTML a tokens (texto + tags)
    const tokens = [];
    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    function walk(node) {
      if (node.nodeType === 3) {
        // Texto — dividir en chars
        node.textContent.split('').forEach(ch => tokens.push({ type: 'char', val: ch }));
      } else if (node.nodeType === 1) {
        tokens.push({ type: 'open',  tag: node.outerHTML.match(/^<[^>]+>/)[0] });
        node.childNodes.forEach(walk);
        tokens.push({ type: 'close', tag: `</${node.tagName.toLowerCase()}>` });
      }
    }
    tmp.childNodes.forEach(walk);

    let i = 0;
    let html2 = '';
    const openTags = [];

    function next() {
      if (i >= tokens.length) { if (onDone) onDone(); return; }
      const t = tokens[i++];
      if (t.type === 'char') {
        html2 += t.val === '\n' ? '<br>' : t.val;
      } else if (t.type === 'open') {
        html2 += t.tag; openTags.push(t.tag);
      } else if (t.type === 'close') {
        html2 += t.tag; openTags.pop();
      }
      el.innerHTML = html2 + '<span class="tw-cursor">▌</span>';
      setTimeout(next, t.type === 'char' ? speed : 0);
    }
    next();
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      obs.disconnect();
      setTimeout(() => {
        typeHTML(msgEl, originalMsg, 28, () => {
          msgEl.innerHTML = originalMsg; // limpiar cursor
          if (sigEl) {
            setTimeout(() => typeHTML(sigEl, originalSig, 35, () => {
              sigEl.innerHTML = originalSig;
            }), 300);
          }
        });
      }, 800);
    }
  }, { threshold: 0.4 });

  obs.observe(document.getElementById('s8') || msgEl);
})();

/* ════════════════════════════════════════
   BLOQUE 4B — MODO NOCHE / DÍA
   Detecta hora del sistema automáticamente.
   6:00–18:00 → modo día (suave)
   18:00–6:00 → modo noche (default oscuro)
   Botón en esquina para cambiar manualmente.
════════════════════════════════════════ */
(function () {
  const btn = document.createElement('button');
  btn.id = 'daynight-btn';
  document.body.appendChild(btn);

  const hour = new Date().getHours();
  let isDay = hour >= 6 && hour < 18;

  function apply(day) {
    isDay = day;
    document.body.classList.toggle('day-mode', day);
    btn.textContent = day ? '🌙' : '☀️';
    btn.title = day ? 'Cambiar a modo noche' : 'Cambiar a modo día';
  }

  btn.addEventListener('click', () => apply(!isDay));
  apply(isDay); // aplicar según hora actual
})();

/* ════════════════════════════════════════
   §9 PLAYLIST — BONUS FINAL
   Al llegar a §8 → desbloquear §9.
   Secuencia: mensaje dramático → playlist.
════════════════════════════════════════ */
(function () {
  const s8  = document.getElementById('s8');
  const s9  = document.getElementById('s9');
  const ruleS9 = document.getElementById('rule-s9');
  if (!s8 || !s9) return;

  let triggered = false;

  const s8Obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || triggered || !unlocked) return;
    triggered = true;
    s8Obs.disconnect();

    // 1) Desbloquear §9 y su rule — 25s para que lea §8 completo
    setTimeout(() => {
      // Mostrar rule
      if (ruleS9) ruleS9.style.display = 'flex';

      // Activar §9 como gate abierta
      s9.classList.add('open');

      // Scroll suave hacia §9
      setTimeout(() => {
        s9.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);

      // 2) Mostrar mensaje de alerta primero
      const alert  = document.getElementById('s9-alert');
      const playlist = document.getElementById('s9-playlist');
      if (!alert || !playlist) return;

      alert.classList.add('s9-alert-show');
      playlist.style.opacity = '0';
      playlist.style.display = 'flex';

      // 3) Después de leer el mensaje → revelar playlist
      setTimeout(() => {
        alert.classList.add('s9-alert-exit');
        setTimeout(() => {
          alert.style.display = 'none';
          playlist.classList.add('s9-playlist-show');
        }, 600);
      }, 4200);

    }, 25000);
  }, { threshold: 0.5 });

  s8Obs.observe(s8);
})();
