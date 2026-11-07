/**
 * AVAHAN 2027 · sports motion
 * - Scroll progress: a cricket ball rolls along a turf strip under the menu
 * - Click: main buttons launch a ball (the card's own sport on sport cards)
 * - Sports section: a bat swings and hits a six when it scrolls into view
 * - Trivia: right answer = goal, wrong answer = off the post
 * - Back to top: a shuttlecock that flies up
 * - Cards rise in as they scroll into view; medals swing on hover (CSS)
 * Everything is skipped for people who ask their device for reduced motion.
 */
(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INK = '#16130e';

    const BALLS = {
        football: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M32 21l10 7-4 12H26l-4-12z" fill="${INK}"/><path d="M32 21V5M42 28l15-5M38 40l9 13M26 40l-9 13M22 28L7 23" stroke="${INK}" stroke-width="3"/></svg>`,
        cricket: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#c8202f" stroke="${INK}" stroke-width="4"/><path d="M20 8c10 14 10 34 0 48M27 6c10 16 10 36 0 52" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="3 4"/></svg>`,
        volleyball: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#ffc82c" stroke="${INK}" stroke-width="4"/><path d="M32 4c-4 14 0 22 10 28M8 22c12 2 20 8 24 10M10 48c10-10 16-14 22-16 8 6 12 14 12 26" fill="none" stroke="#2346c8" stroke-width="4"/></svg>`,
        shuttle: `<svg viewBox="0 0 64 64"><path d="M20 6l12 30 12-30z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M26 8l6 26M38 8l-6 26" stroke="${INK}" stroke-width="2"/><path d="M24 36h16v6a8 8 0 01-16 0z" fill="#d7263d" stroke="${INK}" stroke-width="3.5"/></svg>`,
        tt: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="#f26a1b" stroke="${INK}" stroke-width="4"/><path d="M22 26a12 12 0 0110-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
        chess: `<svg viewBox="0 0 64 64"><path d="M22 56h20l-3-8H25zM26 48l2-16h8l2 16M24 32h16M28 24a6 6 0 118 0" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
        carrom: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#d7263d" stroke="${INK}" stroke-width="4"/><circle cx="32" cy="32" r="12" fill="none" stroke="#fff" stroke-width="3"/></svg>`
    };

    function ballForSport(text) {
        const s = String(text || '').toLowerCase();
        if (s.includes('cricket')) return 'cricket';
        if (s.includes('volley') || s.includes('throw')) return 'volleyball';
        if (s.includes('badminton')) return 'shuttle';
        if (s.includes('table')) return 'tt';
        if (s.includes('chess')) return 'chess';
        if (s.includes('carrom')) return 'carrom';
        return 'football';
    }

    /* ---------------- Click: launch a ball ---------------- */
    function launch(x, y, kind) {
        const el = document.createElement('div');
        el.className = 'fx-ball';
        el.innerHTML = BALLS[kind] || BALLS.football;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        document.body.appendChild(el);
        const dir = x > window.innerWidth * 0.6 ? -1 : 1;
        const dx = dir * (180 + Math.random() * 200);
        const h = 200 + Math.random() * 140;
        const spin = kind === 'shuttle' ? 40 : 720;
        el.animate([
            { transform: 'translate(-50%,-50%) translate(0,0) rotate(0deg) scale(.5)', opacity: 1 },
            { transform: `translate(-50%,-50%) translate(${dx * 0.5}px,${-h}px) rotate(${spin / 2}deg) scale(1)`, opacity: 1, offset: 0.45 },
            { transform: `translate(-50%,-50%) translate(${dx}px,${-h * 0.35}px) rotate(${spin}deg) scale(.85)`, opacity: 0 }
        ], { duration: 950, easing: 'cubic-bezier(.22,.8,.3,1)' }).onfinish = () => el.remove();
    }

    document.addEventListener('click', (e) => {
        if (reduce) return;
        const btn = e.target.closest('.btn-primary, .btn-yellow, .tourn-body .btn, .jersey');
        if (!btn || btn.disabled) return;
        const card = btn.closest('.tourn-card');
        const kind = card ? ballForSport((card.querySelector('.sport') || {}).textContent) : 'football';
        let x = e.clientX, y = e.clientY;
        if (!x && !y) { const r = btn.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
        launch(x, y, kind);
    });

    /* ---------------- Scroll progress: ball on a pitch ---------------- */
    function setupProgress() {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        const track = document.createElement('div');
        track.className = 'pitch-progress';
        track.setAttribute('aria-hidden', 'true');
        track.innerHTML = `<span class="pitch-fill"></span><span class="pitch-ball">${BALLS.cricket}</span>`;
        nav.appendChild(track);
        const fill = track.querySelector('.pitch-fill');
        const ball = track.querySelector('.pitch-ball');
        let ticking = false;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            const w = track.clientWidth - 18;
            fill.style.transform = `scaleX(${p})`;
            ball.style.transform = `translateX(${p * w}px) rotate(${p * 1440}deg)`;
            ticking = false;
        };
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ---------------- Bat swing hits a six ---------------- */
    function setupBatSwing() {
        const section = document.getElementById('registrations');
        if (!section) return;
        const wrap = section.querySelector('.wrap');
        const scene = document.createElement('button');
        scene.className = 'bat-scene';
        scene.type = 'button';
        scene.title = 'Hit it again';
        scene.setAttribute('aria-label', 'Play the cricket shot again');
        scene.innerHTML = `
            <span class="bat"><svg viewBox="0 0 40 150"><rect x="15" y="0" width="10" height="44" rx="4" fill="${INK}"/><path d="M15 40h10v6l7 6v90a6 6 0 01-6 6H14a6 6 0 01-6-6V52l7-6z" fill="#e8c27a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M20 60v74" stroke="#c99a4a" stroke-width="3"/></svg></span>
            <span class="six-ball">${BALLS.cricket}</span>
            <span class="six-tag">SIX</span>`;
        wrap.appendChild(scene);
        const play = () => { scene.classList.remove('play'); void scene.offsetWidth; scene.classList.add('play'); };
        scene.addEventListener('click', play);
        if (reduce) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { setTimeout(play, 250); io.disconnect(); } });
        }, { threshold: 1, rootMargin: '0px 0px -15% 0px' });
        io.observe(scene);
    }

    /* ---------------- Trivia: goal or post ---------------- */
    function setupTriviaKick() {
        const box = document.getElementById('triviaExplanationBox');
        const title = document.getElementById('triviaResultTitle');
        if (!box || !title) return;
        const mo = new MutationObserver(() => {
            if (box.classList.contains('hidden')) return;
            const ok = title.classList.contains('ok');
            let scene = box.querySelector('.kick-scene');
            if (!scene) {
                scene = document.createElement('div');
                scene.className = 'kick-scene';
                scene.setAttribute('aria-hidden', 'true');
                scene.innerHTML = `
                    <span class="goal"><svg viewBox="0 0 90 70"><path d="M6 66V6h78v60" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M6 6l14 12h50l14-12M20 18v48M70 18v48M20 34h50M20 50h50M38 18v48M54 18v48" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/></svg></span>
                    <span class="kick-ball">${BALLS.football}</span>
                    <span class="kick-word"></span>`;
                box.prepend(scene);
            }
            scene.classList.remove('goal-in', 'post-hit');
            scene.querySelector('.kick-word').textContent = ok ? 'GOAL' : 'OFF THE POST';
            if (reduce) { scene.classList.add('static', ok ? 'goal-in' : 'post-hit'); return; }
            void scene.offsetWidth;
            scene.classList.add(ok ? 'goal-in' : 'post-hit');
        });
        mo.observe(box, { attributes: true, attributeFilter: ['class'] });
        mo.observe(title, { attributes: true, attributeFilter: ['class'] });
    }

    /* ---------------- Back to top: shuttlecock ---------------- */
    function setupBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'shuttle-top';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Back to top');
        btn.title = 'Back to top';
        btn.innerHTML = BALLS.shuttle;
        document.body.appendChild(btn);
        const toggle = () => btn.classList.toggle('show', window.scrollY > 900);
        window.addEventListener('scroll', toggle, { passive: true });
        toggle();
        btn.addEventListener('click', () => {
            if (!reduce) {
                btn.classList.add('fly');
                setTimeout(() => btn.classList.remove('fly'), 700);
            }
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        });
    }

    /* ---------------- Cards rise in on scroll ---------------- */
    function setupReveal() {
        if (reduce || !('IntersectionObserver' in window)) return;
        document.documentElement.classList.add('fx');
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                const el = en.target;
                const siblings = el.parentElement ? [...el.parentElement.children] : [];
                const i = Math.max(0, siblings.indexOf(el)) % 4;
                el.style.transitionDelay = (i * 60) + 'ms';
                el.classList.add('shown');
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        const SEL = '.card, .member, .win-card, .board, .leader-card, .trivia, .rulebook-card, .form-card, .tile';
        const scan = (root) => root.querySelectorAll(SEL).forEach(el => {
            if (!el.dataset.fx) { el.dataset.fx = '1'; el.classList.add('reveal'); io.observe(el); }
        });
        scan(document);
        new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.matches && n.matches(SEL)) scan(n.parentElement || document); else scan(n); } })))
            .observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupProgress();
        setupBatSwing();
        setupTriviaKick();
        setupBackToTop();
        setupReveal();
    });
})();
