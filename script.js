// ── CAMBIA ESTOS DOS DATOS ──────────────────────────────────
const DOCTOR_WHATSAPP = "50499999999"; // número real del doctor (sin + ni espacios)
const MAPS_LINK = "https://maps.google.com/?q=Tu+Clinica+Honduras"; // link real de Google Maps
// ───────────────────────────────────────────────────────────

/* CURSOR */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top  = e.clientY + 'px';
  }, 60);
});
document.querySelectorAll('a, button, .service-card, .sobre-bullets li').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});

/* NAV SCROLL */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

/* HAMBURGER */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* REVEAL ON SCROLL */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.closest('section')
        ? [...entry.target.closest('section').querySelectorAll('.reveal')] : [];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* CONTADORES */
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target, parseInt(entry.target.dataset.target));
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* BOTONES WHATSAPP Y MAPA */
document.getElementById('btnWhatsapp').href  = `https://wa.me/${DOCTOR_WHATSAPP}`;
document.getElementById('btnUbicacion').href = MAPS_LINK;

/* FORMULARIO → WHATSAPP */
document.getElementById('btnEnviar').addEventListener('click', () => {
  const nombre   = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const fecha    = document.getElementById('fecha').value;
  const hora     = document.getElementById('hora').value;
  const motivo   = document.getElementById('motivo').value.trim();

  if (!nombre)   return shake('nombre',   'Por favor ingresa tu nombre');
  if (!telefono) return shake('telefono', 'Por favor ingresa tu teléfono');
  if (!fecha)    return shake('fecha',    'Por favor selecciona una fecha');
  if (!hora)     return shake('hora',     'Por favor selecciona una hora');
  if (!motivo)   return shake('motivo',   'Por favor describe el motivo de consulta');

  const selected = new Date(fecha + 'T00:00:00');
  const today    = new Date(); today.setHours(0,0,0,0);
  if (selected < today) return shake('fecha', 'La fecha no puede ser en el pasado');

  const fechaStr = selected.toLocaleDateString('es-HN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const msg = [
    `🏥 *Solicitud de Cita — Clínica Dr. Dubón*`,
    ``,
    `👤 *Nombre:* ${nombre}`,
    `📱 *Teléfono:* ${telefono}`,
    `📅 *Fecha deseada:* ${fechaStr}`,
    `⏰ *Hora preferida:* ${hora}`,
    `📋 *Motivo:* ${motivo}`,
    ``,
    `_Mensaje enviado desde la página web de la clínica._`
  ].join('\n');

  window.open(`https://wa.me/${DOCTOR_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  showSuccess();
});

function shake(fieldId, msg) {
  const el   = document.getElementById(fieldId);
  const wrap = el.closest('.input-group');
  el.style.borderColor = '#fc8181';
  el.style.boxShadow   = '0 0 0 3px rgba(245,101,101,0.15)';
  let err = wrap.querySelector('.err-msg');
  if (!err) { err = document.createElement('span'); err.className = 'err-msg'; err.style.cssText = 'color:#fc8181;font-size:0.78rem;margin-top:4px;'; wrap.appendChild(err); }
  err.textContent = msg;
  el.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}], { duration: 400, easing: 'ease-out' });
  el.focus();
  setTimeout(() => { el.style.borderColor=''; el.style.boxShadow=''; if(err) err.remove(); }, 3000);
}

['nombre','telefono','fecha','hora','motivo'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const el = document.getElementById(id);
    el.style.borderColor = ''; el.style.boxShadow = '';
    const err = el.closest('.input-group')?.querySelector('.err-msg');
    if (err) err.remove();
  });
});

function showSuccess() {
  const btn = document.getElementById('btnEnviar');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Abriendo WhatsApp!';
  btn.style.background = 'linear-gradient(135deg,#48bb78,#38a169)';
  setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 3000);
}

/* SCROLL SPY */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
  navLinks.forEach(link => { link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent)' : ''; });
}, { passive: true });