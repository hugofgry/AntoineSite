/* =========================================================
   LA MAISON DE L'ÉCAILLE — main.js
   Aucune dépendance externe. Fonctions :
   - menu mobile
   - halo de la nav au scroll
   - reveal léger au défilement (IntersectionObserver)
   - carrousel de photos (sans librairie)
   - suivi des clics (téléphone / instagram / itinéraire / formulaire)
   - envoi du formulaire de contact
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Nav mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileMenu.classList.remove('is-open'); });
    });
  }

  /* ---------- Halo / ombre de la nav au scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal léger au défilement ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Onglets de filtre (page Notre carte) ---------- */
  var tabs = document.querySelectorAll('[data-menu-tab]');
  var cats = document.querySelectorAll('[data-menu-cat]');
  if (tabs.length && cats.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var target = tab.getAttribute('data-menu-tab');
        cats.forEach(function (cat) {
          var show = target === 'tous' || cat.getAttribute('data-menu-cat') === target;
          cat.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Carrousel (galerie / ambiance) ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var prev = carousel.querySelector('[data-prev]');
    var next = carousel.querySelector('[data-next]');
    if (!track) return;
    var scrollByAmount = function () {
      var slide = track.querySelector('.carousel-slide');
      return slide ? slide.getBoundingClientRect().width + 20 : 300;
    };
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' }); });
  });

  /* ---------- Suivi des clics utiles pour les statistiques ----------
     Fonctionne avec Google Analytics (gtag) OU Plausible (plausible()).
     Voir README.md § "Statistiques" pour la mise en place.
  ------------------------------------------------------------------- */
  function trackEvent(name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
    if (typeof window.plausible === 'function') {
      window.plausible(name, { props: params || {} });
    }
  }
  window.trackEvent = trackEvent; // exposé si besoin ailleurs

  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent(el.getAttribute('data-track'));
    });
  });

  /* ---------- Formulaire de contact ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var endpoint = form.getAttribute('action');
      var showStatus = function (type, message) {
        if (!status) return;
        status.textContent = message;
        status.className = 'form-status is-visible ' + type;
      };

      // Tant que l'action du formulaire n'a pas été configurée (voir README),
      // on affiche un message clair plutôt que d'échouer silencieusement.
      if (!endpoint || endpoint.indexOf('VOTRE_ID') !== -1) {
        showStatus('err', 'Le formulaire n\'est pas encore connecté. Voir README.md pour l\'activer (Formspree).');
        return;
      }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          showStatus('ok', 'Merci, votre message a bien été envoyé. Nous vous répondons rapidement.');
          trackEvent('envoi_formulaire');
        } else {
          showStatus('err', 'Une erreur est survenue. Vous pouvez aussi nous appeler ou nous écrire directement.');
        }
      }).catch(function () {
        showStatus('err', 'Une erreur est survenue. Vous pouvez aussi nous appeler ou nous écrire directement.');
      });
    });
  }
});
