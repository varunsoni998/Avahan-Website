/**
 * AVAHAN 2027 · scroll-driven motion
 *  1. The ball's journey: a thick red ribbon winds down the page as you scroll,
 *     with a football rolling along its tip.
 *  2. Circle wipes: coloured sections burst open from a circle as they arrive.
 *  3. Headlines drop in letter by letter, and highlighted words get a chalk
 *     underline that scribbles itself in.
 * Everything is switched off for people who ask their device for less motion.
 */
(function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const SVGNS = 'http://www.w3.org/2000/svg';

    const FOOTBALL = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/><g fill="#16130e"><polygon points="50,36.5 62.8,45.8 57.9,60.9 42.1,60.9 37.2,45.8"/><path d="M42.7 4.5 57.3 4.5 61.9 14.9 50 23.5 38.1 14.9Z"/><path d="M75.2 41.8 79.7 27.8 92 29 95.5 41.8 87.1 50.4Z"/><path d="M65.6 71.4 80.3 71.4 84.8 82 72.9 92 61 85.4Z"/><path d="M34.4 71.4 39 85.4 27.1 92 15.2 82 19.7 71.4Z"/><path d="M24.8 41.8 12.9 50.4 4.5 41.8 8 29 20.3 27.8Z"/></g><g stroke="#16130e" stroke-width="2.4"><path d="M50 36.5V23.5M62.8 45.8 75.2 41.8M57.9 60.9 65.6 71.4M42.1 60.9 34.4 71.4M37.2 45.8 24.8 41.8"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#16130e" stroke-width="5"/></svg>';

    /* ---------------- 1. The ball's journey ---------------- */
    let ribbon = null;
    function buildRibbon() {
        const sections = [...document.querySelectorAll('main .section, body > .section')];
        if (sections.length < 2) return;
        const W = document.documentElement.clientWidth;
        const docH = document.documentElement.scrollHeight;
        const small = W < 700;
        const gutter = Math.max(small ? 10 : 26, (W - 1280) / 4 + 6);
        const left = gutter, right = W - gutter;
        const top = sections[0].offsetTop + 40;

        let d = `M ${right} ${top}`;
        let x = right, y = top;
        sections.forEach((sec, i) => {
            const bottom = sec.offsetTop + sec.offsetHeight;
            const runEnd = bottom - (i === sections.length - 1 ? 120 : 70);
            // run down this side with a gentle wave
            const steps = Math.max(1, Math.round((runEnd - y) / 380));
            const stepH = (runEnd - y) / steps;
            for (let k = 0; k < steps; k++) {
                const y2 = y + stepH, wob = (k % 2 ? -1 : 1) * (small ? 6 : 26) * (x === right ? -1 : 1);
                d += ` C ${x + wob} ${y + stepH * 0.33}, ${x + wob} ${y + stepH * 0.66}, ${x} ${y2}`;
                y = y2;
            }
            // swing across to the other side through the gap between sections
            if (i < sections.length - 1) {
                const nx = x === right ? left : right;
                const ny = sections[i + 1].offsetTop + 110;
                d += ` C ${x} ${y + (ny - y) * 0.55}, ${nx} ${y + (ny - y) * 0.45}, ${nx} ${ny}`;
                x = nx; y = ny;
            }
        });

        if (!ribbon) {
            const svg = document.createElementNS(SVGNS, 'svg');
            svg.setAttribute('class', 'ribbon');
            svg.setAttribute('aria-hidden', 'true');
            const under = document.createElementNS(SVGNS, 'path'); under.setAttribute('class', 'ribbon-edge');
            const main = document.createElementNS(SVGNS, 'path'); main.setAttribute('class', 'ribbon-line');
            const shine = document.createElementNS(SVGNS, 'path'); shine.setAttribute('class', 'ribbon-shine');
            svg.append(under, main, shine);
            const ball = document.createElement('div');
            ball.className = 'ribbon-ball';
            ball.innerHTML = FOOTBALL;
            document.body.append(svg, ball);
            ribbon = { svg, under, main, shine, ball };
        }
        ribbon.svg.setAttribute('width', W);
        ribbon.svg.setAttribute('height', docH);
        ribbon.svg.setAttribute('viewBox', `0 0 ${W} ${docH}`);
        [ribbon.under, ribbon.main, ribbon.shine].forEach(p => p.setAttribute('d', d));
        const L = ribbon.main.getTotalLength();
        // sample length → y so the tip can follow the reader's eye line
        const samples = [];
        for (let s = 0; s <= L; s += 24) samples.push([s, ribbon.main.getPointAtLength(s).y]);
        samples.push([L, ribbon.main.getPointAtLength(L).y]);
        Object.assign(ribbon, { L, samples, top, end: samples[samples.length - 1][1], small });
        [ribbon.under, ribbon.main, ribbon.shine].forEach(p => { p.style.strokeDasharray = `${L} ${L}`; });
        ribbon.ball.style.width = ribbon.ball.style.height = (small ? 26 : 44) + 'px';
        updateRibbon();
    }
    function lengthAtY(ty) {
        const s = ribbon.samples;
        if (ty <= s[0][1]) return 0;
        // samples are in path order; find the first point that reaches the target height
        for (let i = 1; i < s.length; i++) {
            if (s[i][1] >= ty) {
                const [l0, y0] = s[i - 1], [l1, y1] = s[i];
                return l0 + (l1 - l0) * (y1 === y0 ? 0 : (ty - y0) / (y1 - y0));
            }
        }
        return ribbon.L;
    }
    let lastLen = 0;
    function updateRibbon() {
        if (!ribbon) return;
        const eye = window.scrollY + window.innerHeight * 0.62;
        const len = Math.max(0, Math.min(ribbon.L, lengthAtY(eye)));
        const off = ribbon.L - len;
        ribbon.under.style.strokeDashoffset = off;
        ribbon.main.style.strokeDashoffset = off;
        ribbon.shine.style.strokeDashoffset = off;
        const pt = ribbon.main.getPointAtLength(len);
        const size = ribbon.small ? 26 : 44;
        const spin = (len / (size * 0.5)) * (180 / Math.PI);
        ribbon.ball.style.transform = `translate(${pt.x - size / 2}px, ${pt.y - size / 2}px) rotate(${spin}deg)`;
        ribbon.ball.style.opacity = len > 4 && len < ribbon.L - 2 ? '1' : '0';
        lastLen = len;
    }

    /* ---------------- 2. Circle wipes into coloured sections ---------------- */
    const wipes = [];
    function setupWipes() {
        document.querySelectorAll('.section-blue, .section-yellow, .section-night').forEach((sec, i) => {
            sec.classList.add('wipe');
            sec.style.setProperty('--wx', i % 2 ? '18%' : '82%');
            wipes.push(sec);
        });
    }
    function updateWipes() {
        const vh = window.innerHeight;
        wipes.forEach(sec => {
            const r = sec.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
            const eased = 1 - Math.pow(1 - p, 2);
            sec.style.setProperty('--r', (eased * 160).toFixed(2) + '%');
        });
    }

    /* ---------------- 3. Headlines letter by letter + chalk underline ---------------- */
    function splitLetters(el, startIndex) {
        let i = startIndex;
        [...el.childNodes].forEach(node => {
            if (node.nodeType === 3) {
                const frag = document.createDocumentFragment();
                node.textContent.split(/(\s+)/).forEach(part => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                    const word = document.createElement('span');
                    word.className = 'hw';
                    [...part].forEach(ch => {
                        const s = document.createElement('span');
                        s.className = 'hl-ch';
                        s.style.setProperty('--i', i++);
                        s.textContent = ch;
                        word.appendChild(s);
                    });
                    frag.appendChild(word);
                });
                node.replaceWith(frag);
            } else if (node.nodeType === 1 && !node.matches('svg, i, [data-lucide]')) {
                i = splitLetters(node, i);
            }
        });
        return i;
    }
    function setupHeadlines() {
        const hs = document.querySelectorAll('.section h2');
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        }), { threshold: 0.35 });
        hs.forEach(h => {
            h.classList.remove('h-rise');
            const count = splitLetters(h, 0);
            h.classList.add('letters');
            h.style.setProperty('--n', count);
            h.querySelectorAll('.hl').forEach(hl => {
                const svg = document.createElementNS(SVGNS, 'svg');
                svg.setAttribute('class', 'chalk-line');
                svg.setAttribute('viewBox', '0 0 200 20');
                svg.setAttribute('preserveAspectRatio', 'none');
                svg.setAttribute('aria-hidden', 'true');
                const wob = () => (Math.random() * 6 - 3).toFixed(1);
                svg.innerHTML = `<path d="M4 ${12 + +wob()} C 50 ${6 + +wob()}, 110 ${16 + +wob()}, 196 ${8 + +wob()}" pathLength="1"/>`;
                hl.appendChild(svg);
            });
            io.observe(h);
        });
    }

    /* ---------------- Wiring ---------------- */
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateRibbon(); updateWipes(); ticking = false; });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupHeadlines();
        setupWipes();
        updateWipes();
        // build the ribbon once the page has its real height (cards render after load)
        const rebuild = () => { try { buildRibbon(); } catch (e) {} };
        setTimeout(rebuild, 300);
        window.addEventListener('load', rebuild);
        if ('ResizeObserver' in window) {
            let t;
            new ResizeObserver(() => { clearTimeout(t); t = setTimeout(rebuild, 200); }).observe(document.body);
        } else {
            window.addEventListener('resize', rebuild);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
    });
})();
