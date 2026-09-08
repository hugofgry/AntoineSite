/* =========================================================
   LA MAISON DE L'ÉCAILLE — chatbot.js
   Petit widget de FAQ en forme d'huître ("Coquillette").
   - Aucune dépendance, aucun appel réseau, aucune IA :
     uniquement des réponses pré-écrites (mots-clés).
   - L'icône est un dessin SVG original (pas de photo,
     pas d'image tierce) : réutilisable sans souci de droits.
   - Un seul fichier à inclure sur chaque page :
       <script src="js/chatbot.js"></script>
   ========================================================= */

(function () {

  /* ---------- Dessin de l'huître (SVG original, 100% maison) ---------- */
  var OYSTER_SVG = ''
    + '<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '  <path d="M20 46 Q26 8 62 6 Q98 8 104 44 Q78 28 62 28 Q44 28 20 46 Z" fill="#CBB68F" stroke="#163B44" stroke-width="2.5" stroke-linejoin="round"/>'
    + '  <path d="M10 52 Q10 94 60 94 Q110 94 110 52 Q84 68 60 68 Q36 68 10 52 Z" fill="#E7DAC2" stroke="#163B44" stroke-width="2.5" stroke-linejoin="round"/>'
    + '  <ellipse cx="58" cy="62" rx="30" ry="19" fill="#FBF9F4" stroke="#163B44" stroke-width="1.5"/>'
    + '  <circle cx="93" cy="76" r="7" fill="#F4EEE2" stroke="#163B44" stroke-width="1.5"/>'
    + '  <circle cx="90.5" cy="73.5" r="2" fill="#ffffff"/>'
    + '  <ellipse cx="41" cy="66" rx="5.5" ry="3.2" fill="#E7A99A" opacity="0.55"/>'
    + '  <ellipse cx="75" cy="66" rx="5.5" ry="3.2" fill="#E7A99A" opacity="0.55"/>'
    + '  <circle cx="46" cy="57" r="7" fill="#FBF9F4" stroke="#163B44" stroke-width="2"/>'
    + '  <circle cx="70" cy="57" r="7" fill="#FBF9F4" stroke="#163B44" stroke-width="2"/>'
    + '  <circle cx="48" cy="58" r="3.4" fill="#163B44"/>'
    + '  <circle cx="72" cy="58" r="3.4" fill="#163B44"/>'
    + '  <circle cx="49.3" cy="56.3" r="1" fill="#ffffff"/>'
    + '  <circle cx="73.3" cy="56.3" r="1" fill="#ffffff"/>'
    + '  <path d="M50 71 Q58 77 66 71" fill="none" stroke="#163B44" stroke-width="2.4" stroke-linecap="round"/>'
    + '</svg>';

  /* ---------- Base de connaissances (à modifier ici si besoin) ---------- */
  var FAQ = [
    {
      id: 'horaires',
      chip: 'Horaires',
      keywords: ['horaire', 'heure', 'ouvert', 'ouverture', 'ferme', 'fermeture'],
      answer: 'Nous sommes ouverts du <strong>mardi au samedi</strong>, de 11h30 à 15h et de 18h30 à 22h30. Fermé le dimanche et le lundi.'
    },
    {
      id: 'adresse',
      chip: 'Adresse',
      keywords: ['adresse', 'ou', 'localis', 'trouve', 'itineraire', 'parking', 'venir'],
      answer: 'Nous sommes au <strong>marché des Carmes</strong>, Place des Carmes, 33000 Bordeaux.',
      linkText: 'Voir l\'itinéraire',
      linkHref: 'https://www.google.com/maps?q=March%C3%A9+des+Carmes,+Bordeaux',
      linkTrack: 'clic_itineraire'
    },
    {
      id: 'carte',
      chip: 'La carte',
      keywords: ['carte', 'menu', 'prix', 'tarif', 'huitre', 'plateau', 'boisson', 'vin', 'manger'],
      answer: 'Notre carte propose des huîtres du bassin, des fruits de mer, des plateaux à partager et une sélection de vins et boissons.',
      linkText: 'Voir la carte complète',
      linkHref: 'carte.html'
    },
    {
      id: 'reservation',
      chip: 'Réservation',
      keywords: ['reserv', 'table', 'grouper', 'groupe'],
      answer: 'Nous ne prenons pas de réservation en ligne pour le moment. Le plus simple est de nous appeler directement.',
      linkText: 'Appeler le 05 00 00 00 00',
      linkHref: 'tel:+33500000000',
      linkTrack: 'clic_telephone'
    },
    {
      id: 'contact',
      chip: 'Nous contacter',
      keywords: ['contact', 'telephone', 'appel', 'mail', 'email', 'ecrire', 'joindre'],
      answer: 'Vous pouvez nous appeler au 05 00 00 00 00, ou passer par notre formulaire de contact.',
      linkText: 'Ouvrir le formulaire',
      linkHref: 'contact.html#contact-form'
    },
    {
      id: 'instagram',
      chip: 'Instagram',
      keywords: ['instagram', 'photo', 'reseau', 'social'],
      answer: 'Retrouvez nos arrivages et plateaux du jour sur Instagram.',
      linkText: 'Voir l\'Instagram',
      linkHref: 'https://www.instagram.com/lamaisondelecaille/',
      linkTrack: 'clic_instagram'
    }
  ];

  var FALLBACK = 'Je n\'ai pas de réponse toute prête pour ça. Le plus sûr est de nous appeler au 05 00 00 00 00, ou d\'utiliser le formulaire de contact.';

  function normalize(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function findAnswer(text) {
    var n = normalize(text);
    for (var i = 0; i < FAQ.length; i++) {
      for (var j = 0; j < FAQ[i].keywords.length; j++) {
        if (n.indexOf(FAQ[i].keywords[j]) !== -1) return FAQ[i];
      }
    }
    return null;
  }

  /* ---------- Styles ---------- */
  var CSS = ''
    + '#lme-chat-launcher{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;background:#FBF9F4;border:2px solid #163B44;box-shadow:0 8px 24px rgba(22,59,68,0.25);cursor:pointer;padding:8px;z-index:998;transition:transform .25s cubic-bezier(.22,.61,.36,1);}'
    + '#lme-chat-launcher:hover{transform:scale(1.08);}'
    + '#lme-chat-launcher svg{width:100%;height:100%;display:block;}'
    + '#lme-chat-launcher .lme-badge{position:absolute;top:-2px;right:-2px;background:#5C7A5E;color:#fff;font-family:"Work Sans",sans-serif;font-size:10px;font-weight:600;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #FBF9F4;}'
    + '#lme-chat-panel{position:fixed;right:20px;bottom:92px;width:330px;max-width:calc(100vw - 32px);height:440px;max-height:calc(100vh - 140px);background:#FBF9F4;border-radius:16px;box-shadow:0 20px 50px rgba(22,59,68,0.3);display:flex;flex-direction:column;overflow:hidden;z-index:999;font-family:"Work Sans",-apple-system,sans-serif;opacity:0;transform:translateY(12px) scale(.98);pointer-events:none;transition:opacity .22s cubic-bezier(.22,.61,.36,1),transform .22s cubic-bezier(.22,.61,.36,1);}'
    + '#lme-chat-panel.is-open{opacity:1;transform:none;pointer-events:auto;}'
    + '.lme-chat-head{background:#163B44;color:#FBF9F4;display:flex;align-items:center;gap:10px;padding:12px 14px;flex:0 0 auto;}'
    + '.lme-chat-head .lme-avatar{width:34px;height:34px;flex:0 0 auto;background:#FBF9F4;border-radius:50%;padding:4px;}'
    + '.lme-chat-head .lme-avatar svg{width:100%;height:100%;display:block;}'
    + '.lme-chat-head strong{font-family:"Fraunces",Georgia,serif;font-weight:500;font-size:1.05rem;display:block;}'
    + '.lme-chat-head span{font-size:.78rem;color:#cfe0df;}'
    + '.lme-chat-head .lme-close{margin-left:auto;background:none;border:0;color:#FBF9F4;font-size:1.3rem;line-height:1;cursor:pointer;padding:4px 6px;}'
    + '.lme-chat-body{flex:1 1 auto;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}'
    + '.lme-msg{max-width:82%;padding:9px 13px;border-radius:14px;font-size:.9rem;line-height:1.45;}'
    + '.lme-msg a{color:inherit;text-decoration:underline;}'
    + '.lme-msg.bot{background:#E7DAC2;color:#1B2523;border-bottom-left-radius:4px;align-self:flex-start;}'
    + '.lme-msg.user{background:#163B44;color:#FBF9F4;border-bottom-right-radius:4px;align-self:flex-end;}'
    + '.lme-msg .lme-link-btn{display:inline-block;margin-top:8px;background:#163B44;color:#FBF9F4;padding:6px 12px;border-radius:100px;font-size:.8rem;font-weight:600;text-decoration:none;}'
    + '.lme-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 12px;flex:0 0 auto;}'
    + '.lme-chip{background:#fff;border:1.5px solid #163B44;color:#163B44;border-radius:100px;padding:6px 12px;font-size:.8rem;font-weight:600;cursor:pointer;font-family:"Work Sans",sans-serif;}'
    + '.lme-chip:hover{background:#163B44;color:#FBF9F4;}'
    + '@media (max-width:480px){#lme-chat-panel{right:12px;left:12px;width:auto;bottom:88px;}}'
    + '@media (prefers-reduced-motion: reduce){#lme-chat-panel{transition:none;}}';

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'lme-chatbot-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ---------- Construction du widget ---------- */
  function build() {
    injectStyles();

    var launcher = document.createElement('button');
    launcher.id = 'lme-chat-launcher';
    launcher.setAttribute('aria-label', "Ouvrir l'assistant Coquillette");
    launcher.setAttribute('aria-expanded', 'false');
    launcher.innerHTML = OYSTER_SVG + '<span class="lme-badge">1</span>';

    var panel = document.createElement('div');
    panel.id = 'lme-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Assistant Coquillette');
    panel.innerHTML =
      '<div class="lme-chat-head">' +
        '<div class="lme-avatar">' + OYSTER_SVG + '</div>' +
        '<div><strong>Coquillette</strong><span>Réponses rapides</span></div>' +
        '<button class="lme-close" aria-label="Fermer">&times;</button>' +
      '</div>' +
      '<div class="lme-chat-body" id="lme-chat-body"></div>' +
      '<div class="lme-chips" id="lme-chat-chips"></div>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var body = panel.querySelector('#lme-chat-body');
    var chipsRow = panel.querySelector('#lme-chat-chips');
    var closeBtn = panel.querySelector('.lme-close');
    var opened = false;

    function addMessage(text, who) {
      var div = document.createElement('div');
      div.className = 'lme-msg ' + who;
      div.innerHTML = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function answerLinkHtml(item) {
      if (!item.linkHref) return '';
      var trackAttr = item.linkTrack ? ' data-track="' + item.linkTrack + '"' : '';
      var target = item.linkHref.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '';
      return '<a class="lme-link-btn" href="' + item.linkHref + '"' + target + trackAttr + '>' + item.linkText + '</a>';
    }

    function renderChips() {
      chipsRow.innerHTML = '';
      FAQ.forEach(function (item) {
        var chip = document.createElement('button');
        chip.className = 'lme-chip';
        chip.textContent = item.chip;
        chip.addEventListener('click', function () {
          addMessage(item.chip, 'user');
          addMessage(item.answer + answerLinkHtml(item), 'bot');
        });
        chipsRow.appendChild(chip);
      });
    }

    function openPanel() {
      opened = true;
      panel.classList.add('is-open');
      launcher.setAttribute('aria-expanded', 'true');
      var badge = launcher.querySelector('.lme-badge');
      if (badge) badge.remove();
      if (!body.childNodes.length) {
        addMessage('Bonjour ! Je suis Coquillette 🦪 Choisissez un sujet ci-dessous, ou écrivez votre question.', 'bot');
        renderChips();
      }
    }

    function closePanel() {
      opened = false;
      panel.classList.remove('is-open');
      launcher.setAttribute('aria-expanded', 'false');
      launcher.focus();
    }

    launcher.addEventListener('click', function () {
      opened ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && opened) closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
