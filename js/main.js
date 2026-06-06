(function () {
  'use strict';

  // スクロール/リサイズ等の高頻度イベントを requestAnimationFrame で間引く共通ヘルパ。
  // 1フレームにつき最大1回だけ fn を呼ぶ（header/floatingCTA/scrollSpy で共用）。
  function rafThrottle(fn) {
    let ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        fn();
        ticking = false;
      });
    };
  }

  // ===== Header shadow on scroll =====
  const header = document.getElementById('siteHeader');
  function updateHeader() {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', rafThrottle(updateHeader), { passive: true });
  updateHeader();

  // ===== Mobile menu =====
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.getElementById('headerNav');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const body = document.body;

  function openMenu() {
    headerNav.classList.add('is-open');
    drawerOverlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'メニューを閉じる');
    body.style.overflow = 'hidden';
  }
  function closeMenu() {
    headerNav.classList.remove('is-open');
    drawerOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'メニューを開く');
    body.style.overflow = '';
  }
  menuToggle.addEventListener('click', function () {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeMenu();
    else openMenu();
  });
  drawerOverlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && headerNav.classList.contains('is-open')) closeMenu();
  });
  // Close on nav link click (mobile)
  headerNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 1024) closeMenu();
    });
  });
  // Reset on resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && headerNav.classList.contains('is-open')) closeMenu();
  });

  // ===== Floating CTA visibility =====
  const floatingCta = document.getElementById('floatingCta');
  const contactSection = document.getElementById('contact-form');
  function updateFloatingCta() {
    const scrolled = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrolled / docHeight) : 0;
    const contactRect = contactSection.getBoundingClientRect();
    const contactInView = contactRect.top < window.innerHeight && contactRect.bottom > 0;
    if (percent > 0.15 && !contactInView) {
      floatingCta.classList.add('is-visible');
    } else {
      floatingCta.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', rafThrottle(updateFloatingCta), { passive: true });
  window.addEventListener('resize', updateFloatingCta);
  updateFloatingCta();

  // ===== Scroll spy for nav active state =====
  const navLinks = document.querySelectorAll('.header-nav-list a[href^="#"]');
  const sectionMap = {};
  navLinks.forEach(function (link) {
    const id = link.getAttribute('href').substring(1);
    const sec = document.getElementById(id);
    if (sec) sectionMap[id] = { link: link, section: sec };
  });
  function updateScrollSpy() {
    const offset = 120;
    let current = null;
    Object.keys(sectionMap).forEach(function (id) {
      const rect = sectionMap[id].section.getBoundingClientRect();
      if (rect.top - offset <= 0) current = id;
    });
    navLinks.forEach(function (l) { l.classList.remove('is-active'); });
    if (current && sectionMap[current]) {
      sectionMap[current].link.classList.add('is-active');
    }
  }
  window.addEventListener('scroll', rafThrottle(updateScrollSpy), { passive: true });
  updateScrollSpy();

  // ===== Reveal on scroll =====
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-gentle');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ===== Parallax decoration =====
  const parallaxDecos = document.querySelectorAll('.parallax-deco');
  if (!reduceMotion && parallaxDecos.length) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      parallaxDecos.forEach(function (el) {
        const speed = parseFloat(el.dataset.speed) || 0.02;
        el.style.transform = 'translateY(' + (y * speed) + 'px)';
      });
    }, { passive: true });
  }

  // ===== Counter animation for stats =====
  const counterEls = document.querySelectorAll('.stat-number .num');
  if (counterEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1600;
          const start = performance.now();
          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counterEls.forEach(function (el) {
      el.textContent = el.dataset.count;
    });
  }

  // ===== Primary button ripple hint =====
  document.querySelectorAll('.btn-primary').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  // ===== Form submission (Google Apps Script 経由でシート記録 + メール通知 + 自動返信) =====
  // ▼▼▼ デプロイ後の Apps Script ウェブアプリURLをここに貼り付けてください ▼▼▼
  //      （「フォーム連携/セットアップ手順.md」⑤で取得したURL）
  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx99eMirkLJEkL7HpoiPtK8yQpEgU4gcfCzqI_pjVmdR5NoTGqnp7m7yn_Hh5PlOZRR/exec';
  // ▲▲▲ 例: https://script.google.com/macros/s/AKf.../exec ▲▲▲

  const form = document.getElementById('applyForm');
  if (form) {
    const submitBtn = form.querySelector('.btn-submit');
    const submitBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    // インライン・バリデーション対象の必須フィールド定義
    // kind: 'text' | 'email' | 'radio' | 'checkbox'、anchor(): エラー表示・スクロールの基準要素
    const requiredFields = [
      {
        kind: 'radio',
        name: 'inquiry_type',
        anchor: function () { return form.querySelector('.checkbox-group[role="radiogroup"]'); },
        msgMissing: 'お問い合わせ種別を選択してください'
      },
      {
        kind: 'text',
        name: 'name',
        anchor: function () { return document.getElementById('field-name').closest('.form-group'); },
        msgMissing: 'お名前を入力してください'
      },
      {
        kind: 'email',
        name: 'email',
        anchor: function () { return document.getElementById('field-email').closest('.form-group'); },
        msgMissing: 'メールアドレスを入力してください',
        msgFormat: 'メールアドレスの形式が正しくありません'
      },
      {
        kind: 'text',
        name: 'message',
        anchor: function () { return document.getElementById('field-message').closest('.form-group'); },
        msgMissing: 'ご要望・ご質問を入力してください'
      },
      {
        kind: 'checkbox',
        name: 'privacy',
        anchor: function () { return form.querySelector('.privacy-check'); },
        msgMissing: 'プライバシーポリシーへの同意が必要です'
      }
    ];

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // 入力チェック。無効な必須項目すべてに赤枠＋メッセージを付け、先頭の不備項目へスクロール。
      clearFieldErrors();
      clearFormError(); // フォーム全体エラーが残っていれば消す（二重表示防止）
      var firstInvalidEl = null;
      for (var fi = 0; fi < requiredFields.length; fi++) {
        var focusEl = validateField(requiredFields[fi]); // 無効なら focus 先要素、有効なら null
        if (focusEl && !firstInvalidEl) firstInvalidEl = focusEl;
      }
      if (firstInvalidEl) {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        firstInvalidEl.focus({ preventScroll: true });
        firstInvalidEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        return;
      }

      // 送信先URLが未設定のまま公開された場合の安全策（誤って「送信できた」風に見せない）
      if (!FORM_ENDPOINT || FORM_ENDPOINT.indexOf('PASTE_YOUR') === 0) {
        showFormError('送信先が設定されていません。お手数ですがメールにてご連絡ください。');
        return;
      }

      clearFormError();
      submitBtn.disabled = true;
      submitBtn.innerHTML = '送信しています…';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form), // multipart/form-data。プリフライト不要で GAS にそのまま届く
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.ok) {
            showFormSuccess();
          } else {
            throw new Error((data && data.error) || 'unknown');
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtnHTML;
          showFormError('送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。');
        });
    });

    // 入力・選択が行われたら、その項目のエラー表示を解除（修正中の即時フィードバック）
    form.addEventListener('input', function (e) { clearFieldErrorFor(e.target); });
    form.addEventListener('change', function (e) { clearFieldErrorFor(e.target); });

    // 送信完了：フォームを隠し、「ありがとうございました」表示に差し替える
    function showFormSuccess() {
      const wrapper = form.parentNode;
      const success = document.createElement('div');
      success.className = 'form-success';
      success.setAttribute('role', 'status');
      success.innerHTML =
        '<div class="success-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
        '</div>' +
        '<h3>送信が完了しました</h3>' +
        '<p>お問い合わせいただき、ありがとうございます。<br>' +
        'ご入力のメールアドレスへ確認メールをお送りしました。<br>' +
        '内容を確認のうえ、順次お返事いたします。</p>';
      form.style.display = 'none';
      wrapper.appendChild(success);
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // エラーメッセージを送信ボタンの直前に表示
    function showFormError(message) {
      clearFormError();
      const err = document.createElement('div');
      err.className = 'form-error';
      err.setAttribute('role', 'alert');
      err.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        '<span></span>';
      err.querySelector('span').textContent = message;
      submitBtn.parentNode.insertBefore(err, submitBtn);
      err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearFormError() {
      const existing = form.querySelector('.form-error');
      if (existing) existing.parentNode.removeChild(existing);
    }

    // ===== インライン・バリデーション（フィールド単位の赤枠＋メッセージ）=====

    // .field-error 要素を生成（showFormError と同系の警告アイコンでトーンを統一）
    function buildFieldError(id, message) {
      var p = document.createElement('p');
      p.className = 'field-error';
      p.id = id;
      p.setAttribute('role', 'alert');
      p.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        '<span></span>';
      p.querySelector('span').textContent = message;
      return p;
    }

    // 1項目を検証。無効なら赤枠＋メッセージ＋aria属性を付与し、focus先要素を返す。有効なら null。
    function validateField(def) {
      var errId = def.name + '-error';
      if (def.kind === 'radio') {
        var radios = form.querySelectorAll('input[name="' + def.name + '"]');
        var checked = false;
        for (var r = 0; r < radios.length; r++) { if (radios[r].checked) { checked = true; break; } }
        if (checked) return null;
        var group = def.anchor();
        group.classList.add('is-invalid');
        group.setAttribute('aria-invalid', 'true');
        if (!document.getElementById(errId)) {
          group.appendChild(buildFieldError(errId, def.msgMissing));
          group.setAttribute('aria-describedby', errId);
        }
        return radios[0] || group;
      }
      if (def.kind === 'checkbox') {
        var cb = form.elements[def.name];
        if (cb.checked) return null;
        var box = def.anchor();
        box.classList.add('is-invalid');
        cb.setAttribute('aria-invalid', 'true');
        if (!document.getElementById(errId)) {
          // .privacy-check は flex 横並びのため、メッセージはボックスの直後に挿入する
          box.parentNode.insertBefore(buildFieldError(errId, def.msgMissing), box.nextSibling);
          cb.setAttribute('aria-describedby', errId);
        }
        return cb;
      }
      // text / email
      var el = form.elements[def.name];
      if (el.validity.valid) return null;
      var message = (el.validity.typeMismatch && def.msgFormat) ? def.msgFormat : def.msgMissing;
      el.classList.add('is-invalid');
      el.setAttribute('aria-invalid', 'true');
      if (!document.getElementById(errId)) {
        def.anchor().appendChild(buildFieldError(errId, message));
        el.setAttribute('aria-describedby', errId);
      }
      return el;
    }

    // すべてのフィールドエラーを解除（submit 冒頭で使用）
    function clearFieldErrors() {
      form.querySelectorAll('.field-error').forEach(function (el) { el.parentNode.removeChild(el); });
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
      form.querySelectorAll('[aria-describedby]').forEach(function (el) {
        var v = el.getAttribute('aria-describedby');
        if (v && v.indexOf('-error') !== -1) el.removeAttribute('aria-describedby');
      });
    }

    // 入力された項目が valid になったら、その項目のエラーだけ解除
    function clearFieldErrorFor(target) {
      if (!target || !target.name) return;
      var def = null;
      for (var i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i].name === target.name) { def = requiredFields[i]; break; }
      }
      if (!def) return;
      var nowValid;
      if (def.kind === 'radio') {
        var radios = form.querySelectorAll('input[name="' + def.name + '"]');
        nowValid = false;
        for (var r = 0; r < radios.length; r++) { if (radios[r].checked) { nowValid = true; break; } }
      } else if (def.kind === 'checkbox') {
        nowValid = form.elements[def.name].checked;
      } else {
        nowValid = form.elements[def.name].validity.valid;
      }
      if (!nowValid) return;

      var existing = document.getElementById(def.name + '-error');
      if (existing) existing.parentNode.removeChild(existing);
      if (def.kind === 'radio') {
        var rgroup = def.anchor();
        rgroup.classList.remove('is-invalid');
        rgroup.removeAttribute('aria-invalid');
        rgroup.removeAttribute('aria-describedby');
      } else if (def.kind === 'checkbox') {
        var cbox = def.anchor();
        cbox.classList.remove('is-invalid');
        var cb2 = form.elements[def.name];
        cb2.removeAttribute('aria-invalid');
        cb2.removeAttribute('aria-describedby');
      } else {
        var el2 = form.elements[def.name];
        el2.classList.remove('is-invalid');
        el2.removeAttribute('aria-invalid');
        el2.removeAttribute('aria-describedby');
      }
    }
  }

  // ===== Privacy Policy Dialog =====
  const privacyDialog = document.getElementById('privacyDialog');
  if (privacyDialog) {
    const openBtns = document.querySelectorAll('[data-privacy-open]');
    const closeBtns = privacyDialog.querySelectorAll('[data-privacy-close]');

    function openPrivacy() {
      if (typeof privacyDialog.showModal === 'function') {
        privacyDialog.showModal();
      } else {
        privacyDialog.setAttribute('open', '');
      }
      document.body.classList.add('privacy-dialog-open');
    }
    function closePrivacy() {
      if (typeof privacyDialog.close === 'function') {
        privacyDialog.close();
      } else {
        privacyDialog.removeAttribute('open');
      }
      document.body.classList.remove('privacy-dialog-open');
    }

    openBtns.forEach(function (b) { b.addEventListener('click', openPrivacy); });
    closeBtns.forEach(function (b) { b.addEventListener('click', closePrivacy); });

    // 背景クリックで閉じる
    privacyDialog.addEventListener('click', function (e) {
      if (e.target === privacyDialog) closePrivacy();
    });
    // ESC キーや submit 等で close した際の body クラス解除
    privacyDialog.addEventListener('close', function () {
      document.body.classList.remove('privacy-dialog-open');
    });
  }
})();
