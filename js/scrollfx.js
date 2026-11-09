/**
 * AVAHAN 2027 · scroll motion, built from sports ideas
 *  1. Dribble: a football bounces along in the page margin as you scroll.
 *  2. Mowed pitch: coloured sections roll in as grass-mower lanes.
 *  3. Floodlights: the dark section's stadium lights switch on and sweep.
 *  4. Scoreboard flip: headline letters flicker through characters, then lock in.
 *  5. VAR line: a glowing offside line scans under highlighted words.
 *  6. Crowd wave: the department jerseys do a Mexican wave.
 * Everything is switched off for people who ask their device for less motion.
 */
(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const FOOTBALL = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/><g fill="#16130e"><polygon points="50,36.5 62.8,45.8 57.9,60.9 42.1,60.9 37.2,45.8"/><path d="M42.7 4.5 57.3 4.5 61.9 14.9 50 23.5 38.1 14.9Z"/><path d="M75.2 41.8 79.7 27.8 92 29 95.5 41.8 87.1 50.4Z"/><path d="M65.6 71.4 80.3 71.4 84.8 82 72.9 92 61 85.4Z"/><path d="M34.4 71.4 39 85.4 27.1 92 15.2 82 19.7 71.4Z"/><path d="M24.8 41.8 12.9 50.4 4.5 41.8 8 29 20.3 27.8Z"/></g><g stroke="#16130e" stroke-width="2.4"><path d="M50 36.5V23.5M62.8 45.8 75.2 41.8M57.9 60.9 65.6 71.4M42.1 60.9 34.4 71.4M37.2 45.8 24.8 41.8"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#16130e" stroke-width="5"/></svg>';

    /* ---------------- 1. Dribble ---------------- */
    let dribble = null;
    function setupDribble() {
        const wrap = document.createElement('div');
        wrap.className = 'dribble';
        wrap.setAttribute('aria-hidden', 'true');
        wrap.innerHTML = `<span class="dribble-shadow"></span><span class="dribble-ball">${FOOTBALL}</span>`;
        document.body.appendChild(wrap);
        dribble = { wrap, ball: wrap.querySelector('.dribble-ball'), shadow: wrap.querySelector('.dribble-shadow') };
    }
    function updateDribble() {
        if (!dribble) return;
        const y = window.scrollY;
        const hero = document.querySelector('.hero, .win-hero, .team-hero');
        const start = hero ? hero.offsetHeight * 0.6 : 300;
        const show = y > start && y < document.documentElement.scrollHeight - window.innerHeight - 40;
        dribble.wrap.classList.toggle('on', show);
        const t = (y / 260) % 1;                         // one bounce every 260px of scrolling
        const height = 4 * t * (1 - t);                  // 0 on the ground, 1 at the top
        const lift = height * 150;
        const squash = t < 0.08 || t > 0.92 ? 0.82 : 1;  // flattens as it hits the ground
        dribble.ball.style.transform = `translateY(${-lift}px) rotate(${y * 0.9}deg) scale(${2 - squash}, ${squash})`;
        dribble.shadow.style.transform = `scaleX(${1 - height * 0.55})`;
        dribble.shadow.style.opacity = String(0.5 - height * 0.3);
    }

    /* ---------------- 2. Mowed pitch: sections roll in as stripes ---------------- */
    const pitches = [];
    function setupPitch() {
        document.querySelectorAll('.section-blue, .section-yellow').forEach(sec => {
            sec.classList.add('mowed');
            const lanes = document.createElement('div');
            lanes.className = 'mow-lanes';
            lanes.setAttribute('aria-hidden', 'true');
            const n = window.innerWidth < 700 ? 6 : 12;
            for (let i = 0; i < n; i++) {
                const l = document.createElement('span');
                if (i % 2) l.className = 'dark';
                lanes.appendChild(l);
            }
            sec.prepend(lanes);
            pitches.push({ sec, lanes: [...lanes.children] });
        });
    }
    function updatePitch() {
        const vh = window.innerHeight;
        pitches.forEach(({ sec, lanes }) => {
            const r = sec.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.8)));
            lanes.forEach((l, i) => {
                // the mower runs lane by lane, alternating from top and bottom
                const lp = Math.max(0, Math.min(1, p * 1.9 - i * (0.9 / lanes.length)));
                l.style.transform = `scaleY(${(1 - Math.pow(1 - lp, 3)).toFixed(3)})`;
            });
        });
    }

    /* ---------------- 3. Floodlights on the dark section ---------------- */
    const lights = [];
    function setupFloodlights() {
        document.querySelectorAll('.section-night').forEach(sec => {
            const rig = document.createElement('div');
            rig.className = 'floodlights';
            rig.setAttribute('aria-hidden', 'true');
            rig.innerHTML = '<span class="beam left"></span><span class="beam right"></span><span class="lamp left"></span><span class="lamp right"></span>';
            sec.prepend(rig);
            lights.push({ sec, rig });
        });
    }
    function updateFloodlights() {
        const vh = window.innerHeight;
        lights.forEach(({ sec, rig }) => {
            const r = sec.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9)));
            rig.style.setProperty('--on', p > 0.25 ? 1 : 0);
            rig.style.setProperty('--sweep', ((p - 0.5) * 18).toFixed(2) + 'deg');
        });
    }

    /* ---------------- 4. Scoreboard flip headlines ---------------- */
    const GLYPHS = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';
    function wrapLetters(el, list) {
        [...el.childNodes].forEach(node => {
            if (node.nodeType === 3) {
                const frag = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                    const word = document.createElement('span');
                    word.className = 'flip-word';
                    [...part].forEach(ch => {
                        const s = document.createElement('span');
                        s.className = 'flip';
                        s.textContent = ch;
                        s.dataset.ch = ch;
                        word.appendChild(s);
                        list.push(s);
                    });
                    frag.appendChild(word);
                });
                node.replaceWith(frag);
            } else if (node.nodeType === 1 && !node.matches('svg, i, [data-lucide]')) {
                wrapLetters(node, list);
            }
        });
    }
    function runFlip(h, letters) {
        // lock each letter's width so flicking characters never shift the line
        letters.forEach(s => { s.style.width = s.getBoundingClientRect().width + 'px'; });
        h.classList.add('flipping');
        const t0 = performance.now();
        const step = (now) => {
            const t = now - t0;
            let busy = false;
            letters.forEach((s, i) => {
                const lockAt = 180 + i * 38;
                if (t < lockAt) {
                    busy = true;
                    if (!/[A-Za-z0-9]/.test(s.dataset.ch)) return;
                    if (Math.random() < 0.55) {
                        s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
                        s.classList.remove('tick'); void s.offsetWidth; s.classList.add('tick');
                    }
                } else if (!s.classList.contains('locked')) {
                    s.textContent = s.dataset.ch;
                    s.classList.add('locked');
                }
            });
            if (busy) requestAnimationFrame(step);
            else { h.classList.remove('flipping'); h.classList.add('flipped'); letters.forEach(s => { s.style.width = ''; }); }
        };
        requestAnimationFrame(step);
    }
    function setupScoreboardHeadlines() {
        const hs = document.querySelectorAll('.section h2');
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (!en.isIntersecting) return;
            io.unobserve(en.target);
            runFlip(en.target, en.target._letters);
        }), { threshold: 0.45 });
        hs.forEach(h => {
            h.classList.remove('h-rise');
            const list = [];
            wrapLetters(h, list);
            h._letters = list;
            h.classList.add('flip-head');
            h.querySelectorAll('.hl').forEach(hl => {
                const line = document.createElement('span');
                line.className = 'var-line';
                line.setAttribute('aria-hidden', 'true');
                line.innerHTML = '<i></i>';
                hl.appendChild(line);
            });
            io.observe(h);
        });
    }

    /* ---------------- 6. Crowd wave on the jersey board ---------------- */
    function setupCrowdWave() {
        const board = document.getElementById('deptJerseys');
        if (!board) return;
        let busy = false;
        const wave = () => {
            if (busy) return;
            busy = true;
            [...board.children].forEach((j, i) => {
                j.style.setProperty('--w', i);
                j.classList.remove('wave'); void j.offsetWidth; j.classList.add('wave');
            });
            setTimeout(() => { busy = false; }, 1400);
        };
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { setTimeout(wave, 1500); io.disconnect(); }
        }), { threshold: 0.6 });
        io.observe(board);
        board.addEventListener('mouseenter', wave);
    }

    /* ---------------- Wiring ---------------- */
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateDribble(); updatePitch(); updateFloodlights(); ticking = false; });
    }
    document.addEventListener('DOMContentLoaded', () => {
        setupScoreboardHeadlines();
        setupPitch();
        setupFloodlights();
        setupDribble();
        setupCrowdWave();
        updatePitch(); updateFloodlights(); updateDribble();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
    });
})();
