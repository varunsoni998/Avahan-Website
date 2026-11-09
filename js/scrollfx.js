/**
 * AVAHAN 2027 · scroll motion, built from sports ideas
 *  1. Mowed pitch: coloured sections roll in as grass-mower lanes.
 *  2. Floodlights: the dark section's stadium lights switch on and sweep slowly.
 *  3. Scoreboard flip: headline letters flip down one after another.
 *  4. VAR line: a glowing offside line scans under highlighted words.
 *  5. Crowd wave: the department jerseys do a Mexican wave.
 * Each effect starts as soon as its section begins to appear and then plays on its
 * own timer, so it runs at the same smooth pace however fast someone scrolls.
 * Everything is switched off for people who ask their device for less motion.
 */
(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Fires once, as soon as the element starts to come into view.
    function whenSeen(el, fn, margin) {
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (!en.isIntersecting) return;
            io.unobserve(en.target);
            fn(en.target);
        }), { rootMargin: margin || '0px 0px -12% 0px', threshold: 0 });
        io.observe(el);
    }

    /* ---------------- 1. Mowed pitch ---------------- */
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
                l.style.setProperty('--i', i);
                lanes.appendChild(l);
            }
            sec.prepend(lanes);
            whenSeen(sec, s => s.classList.add('in'), '0px 0px 0px 0px');
        });
    }

    /* ---------------- 2. Floodlights ---------------- */
    function setupFloodlights() {
        document.querySelectorAll('.section-night').forEach(sec => {
            const rig = document.createElement('div');
            rig.className = 'floodlights';
            rig.setAttribute('aria-hidden', 'true');
            rig.innerHTML = '<span class="beam left"></span><span class="beam right"></span><span class="lamp left"></span><span class="lamp right"></span>';
            sec.prepend(rig);
            whenSeen(sec, () => rig.classList.add('on'));
        });
    }

    /* ---------------- 3 + 4. Scoreboard flip headlines with VAR line ---------------- */
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
    function setupScoreboardHeadlines() {
        document.querySelectorAll('.section h2').forEach(h => {
            h.classList.remove('h-rise');
            const letters = [];
            wrapLetters(h, letters);
            letters.forEach((s, i) => s.style.setProperty('--i', i));
            h.style.setProperty('--vd', Math.min(letters.length * 28, 900) + 'ms');
            h.classList.add('flip-head');
            h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
            h.querySelectorAll('.hl').forEach(hl => {
                const line = document.createElement('span');
                line.className = 'var-line';
                line.setAttribute('aria-hidden', 'true');
                line.innerHTML = '<i></i>';
                hl.appendChild(line);
            });
            whenSeen(h, el => el.classList.add('flipped'));
        });
    }

    /* ---------------- 5. Crowd wave on the jersey board ---------------- */
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
        whenSeen(board, () => setTimeout(wave, 1500));
        board.addEventListener('mouseenter', wave);
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupScoreboardHeadlines();
        setupPitch();
        setupFloodlights();
        setupCrowdWave();
    });
})();
