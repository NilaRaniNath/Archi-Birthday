(function () {
  'use strict';

  // =============================================
  //  STATE
  // =============================================
  let giftOpened = false;
  let audioEl = null;
  let audioLoaded = false;
  let denseHeartInterval = null;

  // =============================================
  //  STARS CANVAS
  // =============================================
  (function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [], w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function create() {
      stars = [];
      for (let i = 0; i < 130; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.6
        });
      }
    }
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.016;
      for (const s of stars) {
        const opacity = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(247,238,243,' + opacity + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resize(); create(); draw();
    window.addEventListener('resize', function () { resize(); create(); });
  })();

  // =============================================
  //  CONFETTI
  // =============================================
  (function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], running = false;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#F3C25B', '#F08FAE', '#A9B6F0', '#A8E6CF', '#FFB7B2', '#ffffff', '#ff6b6b', '#C3ACD0'];

    window.triggerConfetti = function (x, y, count) {
      count = count || 80;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 7;
        particles.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.5,
          w: 6 + Math.random() * 8,
          h: 4 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.3,
          alpha: 1,
          gravity: 0.18 + Math.random() * 0.1
        });
      }
      if (!running) loop();
    };

    function loop() {
      running = true;
      ctx.clearRect(0, 0, w, h);
      particles = particles.filter(function (p) { return p.alpha > 0.01; });
      if (particles.length === 0) { running = false; return; }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        p.vy += p.gravity; p.vx *= 0.99;
        p.rot += p.rotV; p.alpha -= 0.012;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      requestAnimationFrame(loop);
    }
  })();

  // =============================================
  //  GLOBAL FLOATING LOVE EMOJIS (Continuous)
  // =============================================
  const HEART_EMOJIS = ['❤️', '💕', '💖', '🩷', '💗', '♥', '🤍', '💛', '💜', '🩵', '💞'];
  let globalHeartsInterval = null;

  function startGlobalHearts() {
    if (globalHeartsInterval) return;
    globalHeartsInterval = setInterval(function () {
      var heart = document.createElement('div');
      heart.className = 'global-floating-heart';
      heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
      var size = 0.55 + Math.random() * 1.35;
      var opacity = 0.25 + Math.random() * 0.55;
      var duration = 5 + Math.random() * 4.5;
      var left = 3 + Math.random() * 94;
      heart.style.cssText =
        'left:' + left + 'vw;' +
        'bottom:-24px;' +
        'font-size:' + size + 'rem;' +
        '--h-op:' + opacity + ';' +
        '--h-dur:' + duration + 's;';
      document.body.appendChild(heart);
      var removeMs = (duration + 0.3) * 1000;
      setTimeout(function () { if (heart.parentNode) heart.remove(); }, removeMs);
    }, 420);
  }
  startGlobalHearts();

  // =============================================
  //  LIGHTBOX
  // =============================================
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  // Attach lightbox to Page 2 Archi photos
  document.querySelectorAll('.archi-photo').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.src, img.dataset.caption || img.alt);
    });
  });

  // Attach lightbox to Page 3 Memory cards
  document.querySelectorAll('.memory-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var fullImg = card.dataset.full;
      var caption = card.dataset.caption || '';
      openLightbox(fullImg, caption);
    });
  });

  // =============================================
  //  HASH ROUTER
  // =============================================
  var pages = ['intro', 'golpo', 'chhobi', 'surprise'];
  var navPills = document.querySelectorAll('.nav-pill');

  function showPage(id) {
    if (pages.indexOf(id) === -1) id = 'intro';

    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    navPills.forEach(function (pill) {
      var isActive = pill.dataset.target === id;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    var pageEl = document.getElementById(id);
    if (pageEl) {
      pageEl.classList.add('active');
      pageEl.classList.remove('page-enter');
      void pageEl.offsetWidth;
      pageEl.classList.add('page-enter');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (id === 'intro') onIntroShow();
      if (id === 'golpo') onGolpoShow();
      if (id === 'chhobi') onChhobiShow();
      if (id === 'surprise') onSurpriseShow();
    }

    if (id !== 'surprise') stopDenseHearts();
  }

  function navigateTo(id) { window.location.hash = '#' + id; }

  window.addEventListener('hashchange', function () {
    showPage(window.location.hash.replace('#', ''));
  });

  // =============================================
  //  PAGE 1 — INTRO
  // =============================================
  var giftPhase = document.getElementById('gift-phase');
  var heroSection = document.getElementById('hero-section');
  var hbText = document.getElementById('hb-text');

  function buildHBText() {
    if (!hbText) return;
    hbText.innerHTML = '';
    var words = ['Happy', 'Birthday'];
    words.forEach(function (word, wi) {
      var wordSpan = document.createElement('div');
      wordSpan.className = 'word';
      var baseIdx = wi === 0 ? 0 : words[0].length;
      word.split('').forEach(function (ch, ci) {
        var s = document.createElement('span');
        s.textContent = ch;
        s.style.animationDelay = ((baseIdx + ci) * 0.05) + 's';
        wordSpan.appendChild(s);
      });
      hbText.appendChild(wordSpan);
    });
  }

  function openGift() {
    if (!giftPhase) return;
    var rect = giftPhase.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    triggerConfetti(cx, cy, 120);

    giftPhase.classList.add('fade-out');
    setTimeout(function () {
      giftPhase.style.display = 'none';
      if (heroSection) heroSection.classList.add('visible');
      buildHBText();
      giftOpened = true;
    }, 500);
  }

  if (giftPhase) {
    giftPhase.addEventListener('click', openGift);
    giftPhase.setAttribute('tabindex', '0');
    giftPhase.setAttribute('role', 'button');
    giftPhase.setAttribute('aria-label', 'Open gift surprise');
    giftPhase.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); }
    });
  }

  function onIntroShow() {
    if (giftOpened) {
      if (giftPhase) giftPhase.style.display = 'none';
      if (heroSection) { heroSection.classList.add('visible'); buildHBText(); }
    } else {
      if (giftPhase) giftPhase.style.display = 'flex';
      if (heroSection) heroSection.classList.remove('visible');
    }
  }

  var letsBeginBtn = document.getElementById('lets-begin-btn');
  var introNextBtn = document.getElementById('intro-next');
  if (letsBeginBtn) letsBeginBtn.addEventListener('click', function () { navigateTo('golpo'); });
  if (introNextBtn) introNextBtn.addEventListener('click', function () { navigateTo('golpo'); });

  // =============================================
  //  PAGE 2 — ARCHI'S GALLERY SCROLL OBSERVER
  // =============================================
  var archiObserverInit = false;

  function onGolpoShow() {
    initArchiObserver();
  }

  function initArchiObserver() {
    var items = document.querySelectorAll('.archi-item');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    if (!archiObserverInit) {
      archiObserverInit = true;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

      items.forEach(function (el) { obs.observe(el); });
    }
  }

  var golpoBack = document.getElementById('golpo-back');
  var golpoNext = document.getElementById('golpo-next');
  if (golpoBack) golpoBack.addEventListener('click', function () { navigateTo('intro'); });
  if (golpoNext) golpoNext.addEventListener('click', function () { navigateTo('chhobi'); });

  // =============================================
  //  PAGE 3 — MEMORIES STAGGERED POP-IN
  // =============================================
  function onChhobiShow() {
    var cards = document.querySelectorAll('.memory-card');
    cards.forEach(function (card, index) {
      card.classList.remove('pop-in');
      setTimeout(function () {
        card.classList.add('pop-in');
      }, index * 90);
    });
  }

  var chhobiBack = document.getElementById('chhobi-back');
  var chhobiNext = document.getElementById('chhobi-next');
  if (chhobiBack) chhobiBack.addEventListener('click', function () { navigateTo('golpo'); });
  if (chhobiNext) chhobiNext.addEventListener('click', function () { navigateTo('surprise'); });

  // =============================================
  //  PAGE 4 — LETTER (EMOTIONAL "TUI" VOICE)
  // =============================================
  var letterText =
    'Archi,\n\n' +
    'Tui hoyto bhabish tui amar shudhu ekta best friend. Kintu shotti bolte, tui amar jiboner prothom bondhu, ar tui-e amar shesh bondhu. Ei shara duniay tor jayga ta ar kauke kokhono dewa shombhob na re Sucho.\n\n' +
    'Mone ache sei 2019 er shurur kotha? Tokhon ki ami jan-tam je ekta manush etota apon hoye jabe? Jakhon amar jibone shob elomelo chilo, jokhon ami bhenge gechilam, sobai jokhon bhalo thakar upodesh dichilo — tokhon shudhu tui chupchap amar pashe boshe chile. Kono proshno na kore, shudhu bhorsha hoye.\n\n' +
    'Tor chhotokhato hashi, tor sei paglami, raat jege faltu kotha bola — eigulo chara amar din ta ekhon puro fanka laage. Tui jodi khushi thakish, tokhon mone hoy amar din ta bhalo gelo. Kothao fireo tor moto eto shundor moner manush pabo na.\n\n' +
    'Ajke tor jonmodine shudhu ektai kotha bolbo: shara jibon erokomi amar pashe thakbi toh? Joto jhogra hok, joto durutto ashuk — amader ei bondhutto jeno kokhono na haray. Onek bhalo thakish amar priyo bondhu. Nijer khayal rakhish.\n\n' +
    'Tor,\nNila';

  var letterCard = document.getElementById('letter-card');
  var letterHint = document.getElementById('letter-hint');
  var pillsRow = document.getElementById('pills-row');
  var surpriseBtn = document.getElementById('surprise-btn');
  var surpriseStage = document.getElementById('surprise-stage');

  var typewriterInterval = null;
  var typewriterDone = false;
  var pillsShown = false;

  var pillTexts = [
    'Tor hashi 😊',
    'Tor paglami 🤪',
    'Tor shundor mon 💛',
    'Shara raat kotha 🌙',
    'Amar first & last friend 🤍'
  ];

  function showPills() {
    if (pillsShown) return;
    pillsShown = true;
    pillTexts.forEach(function (text, i) {
      setTimeout(function () {
        var pill = document.createElement('span');
        pill.className = 'reason-pill';
        pill.textContent = text;
        pillsRow.appendChild(pill);
        void pill.offsetWidth;
        pill.classList.add('show');
      }, i * 180);
    });
    setTimeout(function () {
      if (surpriseBtn) surpriseBtn.style.display = 'block';
    }, pillTexts.length * 180 + 350);
  }

  function finishTypewriter() {
    if (typewriterInterval) { clearInterval(typewriterInterval); typewriterInterval = null; }
    if (letterCard) letterCard.textContent = letterText;
    if (letterHint) letterHint.textContent = '';
    typewriterDone = true;
    setTimeout(showPills, 350);
  }

  if (letterCard) {
    letterCard.addEventListener('click', function () {
      if (!typewriterDone) finishTypewriter();
    });
  }

  function startTypewriter() {
    typewriterDone = false;
    pillsShown = false;
    if (pillsRow) pillsRow.innerHTML = '';
    if (surpriseBtn) surpriseBtn.style.display = 'none';
    if (letterCard) letterCard.textContent = '';
    if (letterHint) letterHint.textContent = 'Typing... click to show everything';

    var idx = 0;
    typewriterInterval = setInterval(function () {
      if (idx < letterText.length) {
        letterCard.textContent = letterText.slice(0, idx + 1);
        idx++;
      } else {
        finishTypewriter();
      }
    }, 24);
  }

  function onSurpriseShow() {
    if (typewriterInterval) clearInterval(typewriterInterval);
    startTypewriter();
  }

  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', function () {
      var rect = surpriseBtn.getBoundingClientRect();
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 120);
      if (surpriseStage) surpriseStage.classList.add('visible');
      setTimeout(function () {
        if (surpriseStage) surpriseStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  var surpriseBack = document.getElementById('surprise-back');
  if (surpriseBack) surpriseBack.addEventListener('click', function () { navigateTo('chhobi'); });

  // =============================================
  //  BALLOONS
  // =============================================
  var balloonMessages = [
    'Tui amar jibone asha shobcheye shundor upohar 💕',
    'Tor hashi ta dekhei amar mon ta bhalo hoye jae ✨',
    'Tor moto bondhu pawa amar sobcheye boro bhagyo 🌸',
    'Prithibir shob shukh jeno tui pash, Shucho 🌟',
    'First and last friend... forever and always, Archi 🤍'
  ];
  var balloonMsgEl = document.getElementById('balloon-messages');

  document.querySelectorAll('.balloon-wrap').forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('popped')) return;
      btn.classList.add('popped');
      var rect = btn.getBoundingClientRect();
      triggerConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);
      if (balloonMsgEl) balloonMsgEl.textContent = balloonMessages[i];
    });
  });

  // =============================================
  //  CAKE / BLOW
  // =============================================
  var blowBtn = document.getElementById('blow-btn');
  var flameGroup = document.getElementById('flame-group');
  var wishText = document.getElementById('wish-text');
  var finalMessage = document.getElementById('final-message');

  if (blowBtn) {
    blowBtn.addEventListener('click', function () {
      if (flameGroup) flameGroup.style.display = 'none';
      if (wishText) wishText.classList.add('visible');
      blowBtn.disabled = true;
      blowBtn.style.opacity = '0.5';

      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      triggerConfetti(cx, cy, 90);
      setTimeout(function () { triggerConfetti(cx - 120, cy - 60, 70); }, 300);
      setTimeout(function () { triggerConfetti(cx + 120, cy - 60, 70); }, 600);

      setTimeout(function () {
        if (finalMessage) {
          finalMessage.classList.add('visible');
          finalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
          startDenseHearts();
        }
      }, 1000);
    });
  }

  // =============================================
  //  DENSE FLOATING HEARTS (Page 4 after blow)
  // =============================================
  function startDenseHearts() {
    if (denseHeartInterval) return;
    denseHeartInterval = setInterval(function () {
      var heart = document.createElement('div');
      heart.className = 'surprise-floating-heart';
      heart.textContent = ['♥', '❤️', '💖', '💕', '💗'][Math.floor(Math.random() * 5)];
      var size = 1 + Math.random() * 1.25;
      var dur = 3 + Math.random() * 3;
      heart.style.cssText =
        'left:' + (5 + Math.random() * 90) + 'vw;' +
        'bottom:80px;' +
        'font-size:' + size + 'rem;' +
        'color:' + ['var(--rose)', 'var(--gold)', 'var(--lavender)', '#FF6B6B', '#FFB7B2'][Math.floor(Math.random() * 5)] + ';' +
        '--h-dur:' + dur + 's;';
      document.body.appendChild(heart);
      setTimeout(function () { if (heart.parentNode) heart.remove(); }, (dur + 0.5) * 1000);
    }, 320);
  }

  function stopDenseHearts() {
    if (denseHeartInterval) { clearInterval(denseHeartInterval); denseHeartInterval = null; }
    document.querySelectorAll('.surprise-floating-heart').forEach(function (h) { h.remove(); });
  }

  // =============================================
  //  NAV PILLS
  // =============================================
  navPills.forEach(function (pill) {
    pill.addEventListener('click', function () { navigateTo(pill.dataset.target); });
  });

  // =============================================
  //  INITIAL PAGE
  // =============================================
  var initHash = window.location.hash.replace('#', '');
  showPage(initHash || 'intro');

})();
