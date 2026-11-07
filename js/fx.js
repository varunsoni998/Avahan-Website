/**
 * AVAHAN 2027 · sports motion
 * - Scroll: balls fly off the hero board, and the sports strip speeds up or reverses with your scroll
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

    const BALLS_RAW = {
        football: `<svg viewBox="0 0 100 100"><defs><clipPath id="fbClip"><circle cx="50" cy="50" r="46"/></clipPath><radialGradient id="fbShade" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".65" stop-color="#f2f0ea"/><stop offset="1" stop-color="#bdb7aa"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#fbShade)"/><g clip-path="url(#fbClip)"><g fill="#16130e"><polygon points="50.0,36.5 62.8,45.8 57.9,60.9 42.1,60.9 37.2,45.8"/><polygon points="50.0,23.5 38.1,14.9 42.7,0.9 57.3,0.9 61.9,14.9"/><polygon points="75.2,41.8 79.7,27.8 94.4,27.8 99.0,41.8 87.1,50.4"/><polygon points="65.6,71.4 80.3,71.4 84.8,85.4 72.9,94.1 61.0,85.4"/><polygon points="34.4,71.4 39.0,85.4 27.1,94.1 15.2,85.4 19.7,71.4"/><polygon points="24.8,41.8 12.9,50.4 1.0,41.8 5.6,27.8 20.3,27.8"/></g><g stroke="#16130e" stroke-width="2.2" stroke-linecap="round"><line x1="50.0" y1="36.5" x2="50.0" y2="23.5"/><line x1="62.8" y1="45.8" x2="75.2" y2="41.8"/><line x1="57.9" y1="60.9" x2="65.6" y2="71.4"/><line x1="42.1" y1="60.9" x2="34.4" y2="71.4"/><line x1="37.2" y1="45.8" x2="24.8" y2="41.8"/><line x1="61.9" y1="14.9" x2="74.1" y2="16.8"/><line x1="79.7" y1="27.8" x2="74.1" y2="16.8"/><line x1="74.1" y1="16.8" x2="82.9" y2="4.7"/><line x1="87.1" y1="50.4" x2="89.0" y2="62.7"/><line x1="80.3" y1="71.4" x2="89.0" y2="62.7"/><line x1="89.0" y1="62.7" x2="103.3" y2="67.3"/><line x1="61.0" y1="85.4" x2="50.0" y2="91.0"/><line x1="39.0" y1="85.4" x2="50.0" y2="91.0"/><line x1="50.0" y1="91.0" x2="50.0" y2="106.0"/><line x1="19.7" y1="71.4" x2="11.0" y2="62.7"/><line x1="12.9" y1="50.4" x2="11.0" y2="62.7"/><line x1="11.0" y1="62.7" x2="-3.3" y2="67.3"/><line x1="20.3" y1="27.8" x2="25.9" y2="16.8"/><line x1="38.1" y1="14.9" x2="25.9" y2="16.8"/><line x1="25.9" y1="16.8" x2="17.1" y2="4.7"/><line x1="42.7" y1="0.9" x2="41.7" y2="-5.4"/><line x1="57.3" y1="0.9" x2="58.3" y2="-5.4"/><line x1="94.4" y1="27.8" x2="100.1" y2="25.0"/><line x1="99.0" y1="41.8" x2="105.2" y2="40.8"/><line x1="84.8" y1="85.4" x2="89.3" y2="89.9"/><line x1="72.9" y1="94.1" x2="75.9" y2="99.7"/><line x1="27.1" y1="94.1" x2="24.1" y2="99.7"/><line x1="15.2" y1="85.4" x2="10.7" y2="89.9"/><line x1="1.0" y1="41.8" x2="-5.2" y2="40.8"/><line x1="5.6" y1="27.8" x2="-0.1" y2="25.0"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="9"/><ellipse cx="35" cy="27" rx="11" ry="5.5" fill="#fff" fill-opacity=".5" transform="rotate(-32 35 27)"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#16130e" stroke-width="4.5"/></svg>`,
        cricket: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#c8202f" stroke="${INK}" stroke-width="4"/><path d="M20 8c10 14 10 34 0 48M27 6c10 16 10 36 0 52" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="3 4"/></svg>`,
        volleyball: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#ffc82c" stroke="${INK}" stroke-width="4"/><path d="M32 4c-4 14 0 22 10 28M8 22c12 2 20 8 24 10M10 48c10-10 16-14 22-16 8 6 12 14 12 26" fill="none" stroke="#2346c8" stroke-width="4"/></svg>`,
        shuttle: `<svg viewBox="0 0 64 64"><path d="M20 6l12 30 12-30z" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M26 8l6 26M38 8l-6 26" stroke="${INK}" stroke-width="2"/><path d="M24 36h16v6a8 8 0 01-16 0z" fill="#d7263d" stroke="${INK}" stroke-width="3.5"/></svg>`,
        tt: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20" fill="#f26a1b" stroke="${INK}" stroke-width="4"/><path d="M22 26a12 12 0 0110-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
        chess: `<svg viewBox="0 0 64 64"><path d="M22 56h20l-3-8H25zM26 48l2-16h8l2 16M24 32h16M28 24a6 6 0 118 0" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
        carrom: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#d7263d" stroke="${INK}" stroke-width="4"/><circle cx="32" cy="32" r="12" fill="none" stroke="#fff" stroke-width="3"/></svg>`
    };
    // Every ball drawing gets its own internal ids, so several on one page never clash
    let ballUid = 0;
    const BALLS = new Proxy(BALLS_RAW, {
        get: (t, k) => {
            const s = t[k];
            if (typeof s !== 'string') return s;
            const n = ++ballUid;
            return s.replace(/fb(Clip|Shade)/g, m => m + 'x' + n);
        }
    });

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
        const btn = e.target.closest('.btn-primary, .btn-yellow, .tourn-body .btn, .jersey, .wall-tile');
        if (!btn || btn.disabled) return;
        const card = btn.closest('.tourn-card');
        const kind = card ? ballForSport((card.querySelector('.sport') || {}).textContent) : (btn.dataset.sport ? ballForSport(btn.dataset.sport) : 'football');
        let x = e.clientX, y = e.clientY;
        if (!x && !y) { const r = btn.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
        launch(x, y, kind);
    });

    /* ---------------- Scroll: balls fly off the hero ---------------- */
    function setupHeroBalls() {
        const board = document.querySelector('.sport-wall') || document.querySelector('.rivalry');
        if (!board || reduce) return;
        const set = [
            { kind: 'football', cls: 'hb-1', dx: -0.3, dy: -0.55, spin: 0.8 },
            { kind: 'cricket',  cls: 'hb-2', dx: 0.4,  dy: -0.35, spin: -1.2 },
            { kind: 'shuttle',  cls: 'hb-3', dx: 0.15, dy: -0.7, spin: 0.35 }
        ];
        const els = set.map(b => {
            const el = document.createElement('span');
            el.className = 'hero-ball ' + b.cls;
            el.setAttribute('aria-hidden', 'true');
            el.innerHTML = BALLS[b.kind];
            board.appendChild(el);
            return { el, ...b };
        });
        let ticking = false;
        const update = () => {
            const y = Math.min(window.scrollY, 900);
            els.forEach(b => {
                b.el.style.transform = `translate(${y * b.dx}px, ${y * b.dy}px) rotate(${y * b.spin}deg)`;
                b.el.style.opacity = String(Math.max(0, 1 - y / 900));
            });
            ticking = false;
        };
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
        update();
    }

    /* ---------------- Scroll: the sports strip follows your scroll ---------------- */
    function setupTape() {
        const track = document.getElementById('sportsTape');
        if (!track || reduce) return;
        track.classList.add('js-driven');
        let x = 0, lastY = window.scrollY, boost = 0, half = 0;
        const measure = () => { half = track.scrollWidth / 2; };
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            boost += (y - lastY) * 0.35;
            boost = Math.max(-40, Math.min(40, boost));
            lastY = y;
        }, { passive: true });
        const tick = () => {
            if (!half) measure();
            x -= 0.6 + boost;
            boost *= 0.9;
            if (half) { if (x <= -half) x += half; if (x > 0) x -= half; }
            track.style.transform = `translateX(${x}px)`;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
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
        const SEL = '.card, .member, .win-card, .board, .leader-card, .trivia, .rulebook-card, .form-card, .tile, .headshot';
        const scan = (root) => root.querySelectorAll(SEL).forEach(el => {
            if (!el.dataset.fx) { el.dataset.fx = '1'; el.classList.add('reveal'); io.observe(el); }
        });
        scan(document);
        new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) { if (n.matches && n.matches(SEL)) scan(n.parentElement || document); else scan(n); } })))
            .observe(document.body, { childList: true, subtree: true });
    }

    /* ---------------- Hero title: letters bounce in, year stamps down ---------------- */
    function setupHeroTitle() {
        if (reduce) return;
        const h1 = document.querySelector('.hero h1, .win-hero h1, .team-hero h1');
        if (!h1) return;
        let i = 0;
        [...h1.childNodes].forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
                const frag = document.createDocumentFragment();
                [...node.textContent].forEach(ch => {
                    if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
                    const s = document.createElement('span');
                    s.className = 'ltr';
                    s.style.setProperty('--i', i++);
                    s.textContent = ch;
                    frag.appendChild(s);
                });
                node.replaceWith(frag);
            } else if (node.nodeType === 1) {
                node.classList.add('stamp');
                node.style.setProperty('--i', i + 2);
            }
        });
        h1.classList.add('bounce-in');
    }

    /* ---------------- Jerseys hang onto the board one by one ---------------- */
    function setupJerseys() {
        if (reduce) return;
        const board = document.getElementById('deptJerseys');
        if (!board) return;
        [...board.children].forEach((j, i) => j.style.setProperty('--i', i));
        board.classList.add('hang-in');
    }

    /* ---------------- Numbers count up when they come into view ---------------- */
    function countUp(el) {
        const raw = el.textContent.trim();
        const m = raw.match(/^([\d,]+)(.*)$/);
        if (!m) return;
        const target = parseInt(m[1].replace(/,/g, ''), 10);
        const suffix = m[2];
        const useComma = m[1].includes(',');
        const start = performance.now(), dur = 1100;
        const step = (t) => {
            const k = Math.min(1, (t - start) / dur);
            const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
            el.textContent = (useComma ? v.toLocaleString('en-IN') : v) + suffix;
            if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
    }
    function setupCounters() {
        if (reduce || !('IntersectionObserver' in window)) return;
        const els = document.querySelectorAll('.scoreboard b, .win-stats b');
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); }
        }), { threshold: 0.6 });
        els.forEach(el => io.observe(el));
    }

    /* ---------------- Section headings slide up into view ---------------- */
    function setupHeadings() {
        if (reduce || !('IntersectionObserver' in window)) return;
        const hs = document.querySelectorAll('.section h2');
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        }), { threshold: 0.4 });
        hs.forEach(h => {
            if (h.closest('.reveal')) return;
            h.classList.add('h-rise');
            io.observe(h);
        });
    }

    /* ---------------- Referee cards flip in on the rulebook card ---------------- */
    function setupRefCards() {
        const card = document.querySelector('.rulebook-card');
        if (!card) return;
        const wrap = document.createElement('div');
        wrap.className = 'ref-cards';
        wrap.setAttribute('aria-hidden', 'true');
        wrap.innerHTML = '<span class="ref yellow"></span><span class="ref red"></span>';
        card.appendChild(wrap);
        if (reduce || !('IntersectionObserver' in window)) { wrap.classList.add('in'); return; }
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { wrap.classList.add('in'); io.disconnect(); }
        }), { threshold: 0.5 });
        io.observe(card);
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupHeroTitle();
        setupJerseys();
        setupCounters();
        setupHeadings();
        setupRefCards();
        setupHeroBalls();
        setupTape();
        setupBatSwing();
        setupTriviaKick();
        setupBackToTop();
        setupReveal();
    });
})();
