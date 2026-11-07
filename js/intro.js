/**
 * Intro screen · shown once per visit (per browser tab session).
 * Live countdown to AVAHAN 2027. Clicking "Kick off" kicks the ball into the
 * screen; it smashes it like glass, cracks spread from the impact, and the
 * shards fall away to reveal the website.
 *
 * Performance: the intro is snapshotted once into an image, and all cracks and
 * shards are drawn on ONE canvas (like a game), so it stays smooth even on
 * laptops and phones without strong graphics.
 */
(function () {
    const root = document.documentElement;
    const intro = document.getElementById('intro');
    if (!intro) return;
    if (!root.classList.contains('show-intro')) { intro.remove(); return; }

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FEST_START = new Date('2027-01-09T00:00:00+05:30');
    const BALL_SVG = '<svg viewBox="0 0 100 100"><defs><clipPath id="fbClipFly"><circle cx="50" cy="50" r="46"/></clipPath><radialGradient id="fbShadeFly" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".65" stop-color="#f2f0ea"/><stop offset="1" stop-color="#bdb7aa"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#fbShadeFly)"/><g clip-path="url(#fbClipFly)"><g fill="#16130e"><polygon points="50.0,36.5 62.8,45.8 57.9,60.9 42.1,60.9 37.2,45.8"/><polygon points="50.0,23.5 38.1,14.9 42.7,0.9 57.3,0.9 61.9,14.9"/><polygon points="75.2,41.8 79.7,27.8 94.4,27.8 99.0,41.8 87.1,50.4"/><polygon points="65.6,71.4 80.3,71.4 84.8,85.4 72.9,94.1 61.0,85.4"/><polygon points="34.4,71.4 39.0,85.4 27.1,94.1 15.2,85.4 19.7,71.4"/><polygon points="24.8,41.8 12.9,50.4 1.0,41.8 5.6,27.8 20.3,27.8"/></g><g stroke="#16130e" stroke-width="2.2" stroke-linecap="round"><line x1="50.0" y1="36.5" x2="50.0" y2="23.5"/><line x1="62.8" y1="45.8" x2="75.2" y2="41.8"/><line x1="57.9" y1="60.9" x2="65.6" y2="71.4"/><line x1="42.1" y1="60.9" x2="34.4" y2="71.4"/><line x1="37.2" y1="45.8" x2="24.8" y2="41.8"/><line x1="61.9" y1="14.9" x2="74.1" y2="16.8"/><line x1="79.7" y1="27.8" x2="74.1" y2="16.8"/><line x1="74.1" y1="16.8" x2="82.9" y2="4.7"/><line x1="87.1" y1="50.4" x2="89.0" y2="62.7"/><line x1="80.3" y1="71.4" x2="89.0" y2="62.7"/><line x1="89.0" y1="62.7" x2="103.3" y2="67.3"/><line x1="61.0" y1="85.4" x2="50.0" y2="91.0"/><line x1="39.0" y1="85.4" x2="50.0" y2="91.0"/><line x1="50.0" y1="91.0" x2="50.0" y2="106.0"/><line x1="19.7" y1="71.4" x2="11.0" y2="62.7"/><line x1="12.9" y1="50.4" x2="11.0" y2="62.7"/><line x1="11.0" y1="62.7" x2="-3.3" y2="67.3"/><line x1="20.3" y1="27.8" x2="25.9" y2="16.8"/><line x1="38.1" y1="14.9" x2="25.9" y2="16.8"/><line x1="25.9" y1="16.8" x2="17.1" y2="4.7"/><line x1="42.7" y1="0.9" x2="41.7" y2="-5.4"/><line x1="57.3" y1="0.9" x2="58.3" y2="-5.4"/><line x1="94.4" y1="27.8" x2="100.1" y2="25.0"/><line x1="99.0" y1="41.8" x2="105.2" y2="40.8"/><line x1="84.8" y1="85.4" x2="89.3" y2="89.9"/><line x1="72.9" y1="94.1" x2="75.9" y2="99.7"/><line x1="27.1" y1="94.1" x2="24.1" y2="99.7"/><line x1="15.2" y1="85.4" x2="10.7" y2="89.9"/><line x1="1.0" y1="41.8" x2="-5.2" y2="40.8"/><line x1="5.6" y1="27.8" x2="-0.1" y2="25.0"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="9"/><ellipse cx="35" cy="27" rx="11" ry="5.5" fill="#fff" fill-opacity=".5" transform="rotate(-32 35 27)"/></g><circle cx="50" cy="50" r="46" fill="none" stroke="#16130e" stroke-width="4.5"/></svg>';

    /* ---------------- Countdown ---------------- */
    const els = {
        d: document.getElementById('icDays'), h: document.getElementById('icHours'),
        m: document.getElementById('icMins'), s: document.getElementById('icSecs')
    };
    const pad = n => String(n).padStart(2, '0');
    let timer;
    function tick() {
        const diff = FEST_START - new Date();
        if (diff <= 0) {
            const box = document.getElementById('introCount');
            if (box) box.innerHTML = '<p class="intro-live">Matches are on. See you on the ground</p>';
            clearInterval(timer);
            return;
        }
        const s = Math.floor(diff / 1000);
        if (els.d) els.d.textContent = pad(Math.floor(s / 86400));
        if (els.h) els.h.textContent = pad(Math.floor(s % 86400 / 3600));
        if (els.m) els.m.textContent = pad(Math.floor(s % 3600 / 60));
        if (els.s) els.s.textContent = pad(s % 60);
    }
    tick();
    timer = setInterval(tick, 1000);

    /* ---------------- Helpers ---------------- */
    const rand = (a, b) => a + Math.random() * (b - a);
    const wait = ms => new Promise(r => setTimeout(r, ms));
    let finished = false;

    function finish() {
        if (finished) return;
        finished = true;
        clearInterval(timer);
        root.classList.remove('show-intro');
        intro.remove();
        document.querySelectorAll('.intro-fly-ball, .intro-flash').forEach(e => e.remove());
        // replay the hero entrance now that the page is visible
        document.querySelectorAll('.bounce-in .ltr, .bounce-in .stamp, .hang-in .jersey svg, .enter').forEach(el => {
            el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
        });
    }

    /* ---------------- Glass geometry ----------------
       Jagged rays out from the impact point, cut by uneven rings. Shared edges
       use the same jittered points, so cracks and shards line up. */
    function buildGlass(cx, cy, W, H) {
        const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.3;
        const rays = 11;
        const base = rand(0, Math.PI * 2);
        const angles = Array.from({ length: rays }, (_, i) => base + (i + rand(-0.3, 0.3)) * (Math.PI * 2 / rays));
        const rings = [0, rand(40, 65), rand(110, 160), rand(230, 310), rand(400, 520), R];
        const P = rings.map((r, j) => angles.map(a => {
            const jr = j === 0 || j === rings.length - 1 ? r : r * rand(0.8, 1.2);
            const ja = j === 0 ? a : a + rand(-0.06, 0.06);
            return [cx + Math.cos(ja) * jr, cy + Math.sin(ja) * jr];
        }));
        const M = rings.slice(0, -1).map((_, j) => angles.map((a, i) => {
            const p = P[j][i], q = P[j + 1][i];
            const t = rand(0.35, 0.65), off = rand(-14, 14) * (j + 1) * 0.6;
            return [p[0] + (q[0] - p[0]) * t - Math.sin(a) * off, p[1] + (q[1] - p[1]) * t + Math.cos(a) * off];
        }));
        const shards = [];
        for (let j = 0; j < rings.length - 1; j++) {
            for (let i = 0; i < rays; i++) {
                const n = (i + 1) % rays;
                let polys;
                if (j === 0) polys = [[P[0][i], M[0][i], P[1][i], P[1][n], M[0][n]]];
                else {
                    const quad = [P[j][i], M[j][i], P[j + 1][i], P[j + 1][n], M[j][n], P[j][n]];
                    polys = Math.random() < 0.65
                        ? (Math.random() < 0.5
                            ? [[P[j][i], M[j][i], P[j + 1][i], P[j + 1][n]], [P[j][i], P[j + 1][n], M[j][n], P[j][n]]]
                            : [[P[j][i], M[j][i], P[j + 1][i], P[j][n]], [P[j + 1][i], P[j + 1][n], M[j][n], P[j][n]]])
                        : [quad];
                }
                polys.forEach(poly => {
                    const c = poly.reduce((acc, p) => [acc[0] + p[0] / poly.length, acc[1] + p[1] / poly.length], [0, 0]);
                    const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
                    shards.push({ poly, c, ring: j,
                        bx: Math.min(...xs), by: Math.min(...ys), bw: Math.max(...xs) - Math.min(...xs), bh: Math.max(...ys) - Math.min(...ys) });
                });
            }
        }
        // crack lines: zig-zag rays, uneven web rings, hairline splinters at the centre
        const cracks = [];
        angles.forEach((a, i) => {
            const line = [];
            for (let j = 0; j < rings.length - 2; j++) line.push(P[j][i], M[j][i]);
            line.push(P[rings.length - 2][i]);
            cracks.push({ pts: line, delay: rand(0, 60), w: 2.2, a: 0.95 });
        });
        for (let j = 1; j < rings.length - 1; j++) cracks.push({ pts: P[j].concat([P[j][0]]), delay: 80 + j * 70, w: 1.6, a: 0.75 });
        for (let k = 0; k < 14; k++) {
            const a = rand(0, Math.PI * 2), r1 = rand(4, 30), r2 = r1 + rand(20, 90);
            cracks.push({ pts: [[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], delay: 0, w: 1, a: 0.6 });
        }
        cracks.forEach(cr => {   // pre-compute lengths so they can "grow"
            let L = 0; cr.seg = [];
            for (let k = 1; k < cr.pts.length; k++) { const d = Math.hypot(cr.pts[k][0] - cr.pts[k - 1][0], cr.pts[k][1] - cr.pts[k - 1][1]); cr.seg.push(d); L += d; }
            cr.len = L;
        });
        return { shards, cracks };
    }

    /* ---------------- Snapshot the intro into an image ----------------
       Draws what is on screen (background, stripes, text, boxes, crest) onto a
       canvas, once. Everything after that animates this single image. */
    function parseColor(c) { return c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c) ? c : null; }
    function roundRect(ctx, x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function isRotated(tf) {
        const m = tf && tf.match(/matrix\(([^)]+)\)/);
        if (!m) return false;
        const v = m[1].split(',').map(Number);
        return Math.abs(v[1]) > 1e-3 || Math.abs(v[2]) > 1e-3;
    }
    function withElementTransform(ctx, el, draw) {
        // apply the element's own CSS rotation around its centre
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        const w = el.offsetWidth, h = el.offsetHeight;
        const cxE = b.left + b.width / 2, cyE = b.top + b.height / 2;
        ctx.save();
        ctx.translate(cxE, cyE);
        if (cs.transform && cs.transform !== 'none') {
            const m = cs.transform.match(/matrix\(([^)]+)\)/);
            if (m) { const v = m[1].split(',').map(Number); ctx.transform(v[0], v[1], v[2], v[3], 0, 0); }
        }
        draw(-w / 2, -h / 2, w, h, cs);
        ctx.restore();
    }
    function snapshotIntro(W, H, dpr) {
        const cv = document.createElement('canvas');
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        const ctx = cv.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#16130e';
        ctx.fillRect(0, 0, W, H);
        // department-colour hem where the two halves meet
        const top = intro.querySelector('.intro-half.top');
        if (top) {
            const y = top.getBoundingClientRect().bottom;
            ['#d7263d', '#6a3fb5', '#f26a1b', '#3d4654', '#2346c8', '#0f9b8e', '#1f9e5a', '#ffc82c'].forEach((c, i) => {
                ctx.fillStyle = c; ctx.fillRect(i * W / 8, y - 8, W / 8 + 1, 8); ctx.fillRect(i * W / 8, y, W / 8 + 1, 8);
            });
        }
        // diagonal stripes
        intro.querySelectorAll('.intro-stripes span').forEach(s => {
            withElementTransform(ctx, s, (x, y, w, h, cs) => { ctx.fillStyle = cs.backgroundColor; ctx.fillRect(x, y, w, h); });
        });
        const inner = intro.querySelector('.intro-inner');
        const visible = el => {
            for (let n = el; n && n !== intro; n = n.parentElement) {
                const cs = getComputedStyle(n);
                if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) return false;
            }
            return true;
        };
        const drawBox = el => {
            const cs = getComputedStyle(el);
            const bg = parseColor(cs.backgroundColor), bw = parseFloat(cs.borderTopWidth) || 0, bc = parseColor(cs.borderTopColor);
            const sh = cs.boxShadow && cs.boxShadow !== 'none' ? cs.boxShadow.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px/) : null;
            if (!bg && !(bw && bc) && !sh) return;
            withElementTransform(ctx, el, (x, y, w, h) => {
                const r = parseFloat(cs.borderTopLeftRadius) || 0;
                if (sh) { roundRect(ctx, x + parseFloat(sh[2]), y + parseFloat(sh[3]), w, h, r); ctx.fillStyle = sh[1]; ctx.fill(); }
                roundRect(ctx, x, y, w, h, r);
                if (bg) { ctx.fillStyle = bg; ctx.fill(); }
                if (bw && bc) { ctx.lineWidth = bw; ctx.strokeStyle = bc; roundRect(ctx, x + bw / 2, y + bw / 2, w - bw, h - bw, Math.max(0, r - bw / 2)); ctx.stroke(); }
            });
        };
        const drawText = (node) => {
            const el = node.parentElement;
            const text = node.textContent.replace(/\s+/g, ' ').trim();
            if (!text) return;
            const cs = getComputedStyle(el);
            const range = document.createRange(); range.selectNodeContents(node);
            const r = range.getBoundingClientRect();
            if (!r.width) return;
            const t = cs.textTransform === 'uppercase' ? text.toUpperCase() : text;
            ctx.save();
            ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
            try { ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing; } catch (e) {}
            ctx.fillStyle = cs.color;
            ctx.globalAlpha = parseFloat(cs.opacity) || 1;
            const m = ctx.measureText(t);
            const asc = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8, desc = m.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.2;
            // a rotated parent (the yellow tag) rotates its text too
            let rot = null;
            for (let n = el; n && n !== inner; n = n.parentElement) { if (isRotated(getComputedStyle(n).transform)) { rot = n; break; } }
            if (rot) {
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                withElementTransform(ctx, rot, () => { ctx.fillText(t, 0, 1); });
            } else {
                ctx.textBaseline = 'alphabetic';
                ctx.fillText(t, r.left, r.top + (r.height - (asc + desc)) / 2 + asc);
            }
            ctx.restore();
        };
        if (inner) {
            drawBox(inner);
            const walk = (el) => {
                if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return;
                if (el.classList && (el.classList.contains('kick-ball-btn') || el.classList.contains('kickoff') || el.classList.contains('intro-hint'))) return;
                if (!visible(el)) return;
                if (el !== inner) drawBox(el);
                if (el.tagName === 'IMG' && el.complete) {
                    const b = el.getBoundingClientRect();
                    try { ctx.drawImage(el, b.left, b.top, b.width, b.height); } catch (e) {}
                }
                el.childNodes.forEach(n => { if (n.nodeType === 3) drawText(n); else if (n.nodeType === 1) walk(n); });
            };
            walk(inner);
        }
        return cv;
    }

    /* ---------------- The smash ---------------- */
    async function smash() {
        if (intro.dataset.state) { finish(); return; }   // second click skips
        intro.dataset.state = 'kicking';
        try { sessionStorage.setItem('avahan_intro_seen', '1'); } catch (e) {}
        clearInterval(timer);

        if (reduce) { intro.classList.add('fade-out'); await wait(300); finish(); return; }

        const W = window.innerWidth, H = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const btnBall = intro.querySelector('.kick-ball-btn');
        const r = btnBall.getBoundingClientRect();
        const sx = r.left + r.width / 2, sy = r.top + r.height / 2;
        const cx = W / 2 + rand(-W * 0.06, W * 0.06), cy = H * 0.4;

        // 1. Kick: the same ball you clicked squashes, then flies up and away into the screen
        const ball = document.createElement('div');
        ball.className = 'intro-fly-ball';
        ball.innerHTML = BALL_SVG;
        ball.style.width = ball.style.height = r.width + 'px';
        ball.style.left = r.left + 'px';
        ball.style.top = r.top + 'px';
        document.body.appendChild(ball);
        btnBall.style.visibility = 'hidden';

        // snapshot the screen now (ball hidden, label still crisp), while the ball flies
        let snap = null;
        try { snap = snapshotIntro(W, H, dpr); } catch (e) { snap = null; }
        intro.classList.add('kicked');

        const dx = cx - sx, dy = cy - sy;
        const curve = rand(-1, 1) * Math.min(W * 0.06, 70);
        const end = 0.42;
        const flight = ball.animate([
            { transform: 'translate(0,0) scale(1) rotate(0deg)', easing: 'ease-out' },
            { transform: 'translate(0,5px) scale(1.12,.86) rotate(0deg)', offset: 0.1, easing: 'cubic-bezier(.3,.25,.6,.95)' },
            { transform: `translate(${dx * 0.45 + curve}px, ${dy * 0.5}px) scale(.72) rotate(-300deg)`, offset: 0.55, easing: 'cubic-bezier(.35,.3,.65,.95)' },
            { transform: `translate(${dx}px, ${dy}px) scale(${end}) rotate(-620deg)` }
        ], { duration: 950, fill: 'forwards' });

        const glass = buildGlass(cx, cy, W, H);
        await flight.finished.catch(() => {});
        if (finished) return;

        if (!snap) {   // could not snapshot: simple, smooth fallback
            ball.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
            intro.classList.add('fade-out'); await wait(320); finish(); return;
        }

        // From here on, everything is one canvas
        const cv = document.createElement('canvas');
        cv.className = 'intro-canvas';
        cv.width = snap.width; cv.height = snap.height;
        cv.style.width = W + 'px'; cv.style.height = H + 'px';
        const ctx = cv.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(snap, 0, 0, W, H);
        intro.appendChild(cv);
        [...intro.children].forEach(el => { if (el !== cv) el.style.visibility = 'hidden'; });
        intro.classList.add('broken');

        // 2. Impact: ball punches through, flash, shake, cracks race out
        ball.animate([
            { transform: `translate(${dx}px, ${dy}px) scale(${end}) rotate(-620deg)`, opacity: 1 },
            { transform: `translate(${dx}px, ${dy - 6}px) scale(${end * 0.4}) rotate(-700deg)`, opacity: 0 }
        ], { duration: 260, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' });
        const flash = document.createElement('div');
        flash.className = 'intro-flash';
        flash.style.setProperty('--x', cx + 'px');
        flash.style.setProperty('--y', cy + 'px');
        document.body.appendChild(flash);

        const drawCracks = (t, alpha) => {
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            glass.cracks.forEach(cr => {
                const prog = Math.max(0, Math.min(1, (t - cr.delay) / 360));
                if (prog <= 0) return;
                let left = cr.len * (1 - Math.pow(1 - prog, 3));
                ctx.beginPath(); ctx.moveTo(cr.pts[0][0], cr.pts[0][1]);
                for (let k = 1; k < cr.pts.length && left > 0; k++) {
                    const d = cr.seg[k - 1], f = Math.min(1, left / d);
                    ctx.lineTo(cr.pts[k - 1][0] + (cr.pts[k][0] - cr.pts[k - 1][0]) * f, cr.pts[k - 1][1] + (cr.pts[k][1] - cr.pts[k - 1][1]) * f);
                    left -= d;
                }
                ctx.strokeStyle = `rgba(0,0,0,${0.45 * alpha})`; ctx.lineWidth = cr.w + 1.6; ctx.stroke();
                ctx.strokeStyle = `rgba(240,248,255,${cr.a * alpha})`; ctx.lineWidth = cr.w; ctx.stroke();
            });
        };

        const t0 = performance.now();
        await new Promise(res => {
            const step = (now) => {
                if (finished) return res();
                const t = now - t0;
                const shake = t < 380 ? Math.sin(t / 22) * 7 * (1 - t / 380) : 0;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.clearRect(0, 0, W, H);
                ctx.setTransform(dpr, 0, 0, dpr, shake * dpr, shake * 0.4 * dpr);
                ctx.drawImage(snap, 0, 0, W, H);
                drawCracks(t, 1);
                if (t < 460) requestAnimationFrame(step); else res();
            };
            requestAnimationFrame(step);
        });
        if (finished) return;

        // 3. Shatter: glass blows inward (away from you), tumbles, glints, and falls
        const PERSP = 1400, maxD = Math.hypot(W, H);
        const pieces = glass.shards.map(sh => {
            const dist = Math.hypot(sh.c[0] - cx, sh.c[1] - cy);
            const near = 1 - Math.min(1, dist / (maxD * 0.6));
            const away = Math.atan2(sh.c[1] - cy, sh.c[0] - cx);
            const out = rand(30, 90) + near * rand(120, 280);
            return {
                sh, ox: Math.cos(away) * out, oy: Math.sin(away) * out,
                z: -(rand(40, 140) + near * rand(160, 420)),
                rx: rand(-2.6, 2.6), ry: rand(-2.6, 2.6), rz: rand(-2, 2),
                delay: (dist / maxD) * 180 + rand(0, 60), dur: rand(1400, 1850),
                sheen: rand(0.03, 0.1)
            };
        });
        const bits = Array.from({ length: 30 }, () => {
            const a = rand(0, Math.PI * 2), d = rand(80, 520);
            return { x: cx + rand(-25, 25), y: cy + rand(-25, 25), ox: Math.cos(a) * d, oy: Math.sin(a) * d, s: rand(3, 9), rz: rand(-12, 12), dur: rand(900, 1300), delay: rand(0, 80) };
        });
        const easeOut = p => 1 - Math.pow(1 - p, 3);
        const t1 = performance.now();
        await new Promise(res => {
            const step = (now) => {
                if (finished) return res();
                const t = now - t1;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.clearRect(0, 0, W, H);
                let alive = false;
                // draw far-flung (outer) pieces first so near ones sit on top
                for (let i = pieces.length - 1; i >= 0; i--) {
                    const pc = pieces[i], sh = pc.sh;
                    const p = Math.max(0, Math.min(1, (t - pc.delay) / pc.dur));
                    if (p < 1) alive = true;
                    const burst = easeOut(Math.min(1, p / 0.24));
                    const fall = Math.max(0, (p - 0.18) / 0.82);
                    const x = pc.ox * burst + pc.ox * 0.35 * p;
                    const y = pc.oy * burst + pc.oy * 0.2 * p + H * 1.1 * fall * fall;
                    const z = pc.z * easeOut(p);
                    const s = PERSP / (PERSP - z);                       // smaller as it moves away
                    const ax = pc.rx * p, ay = pc.ry * p;
                    const fx = Math.max(0.08, Math.abs(Math.cos(ay))), fy = Math.max(0.08, Math.abs(Math.cos(ax)));
                    const glint = Math.pow(Math.abs(Math.sin(ax * 1.3 + ay)), 6);   // flashes as it turns to the light
                    const alpha = p > 0.85 ? (1 - p) / 0.15 : 1;
                    if (alpha <= 0) continue;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    ctx.translate(cx + (sh.c[0] - cx) * s + x * s, cy + (sh.c[1] - cy) * s + y * s);
                    ctx.rotate(pc.rz * p);
                    ctx.scale(s * fx, s * fy);
                    ctx.translate(-sh.c[0], -sh.c[1]);
                    ctx.beginPath();
                    sh.poly.forEach((pt, k) => k ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]));
                    ctx.closePath();
                    ctx.save();
                    ctx.clip();
                    if (sh.ring === 0) { ctx.fillStyle = 'rgba(200,220,240,.35)'; ctx.fill(); }
                    else {
                        const sx0 = Math.max(0, sh.bx - 2), sy0 = Math.max(0, sh.by - 2);
                        const sw = Math.min(W - sx0, sh.bw + 4), shh = Math.min(H - sy0, sh.bh + 4);
                        if (sw > 0 && shh > 0) ctx.drawImage(snap, sx0 * dpr, sy0 * dpr, sw * dpr, shh * dpr, sx0, sy0, sw, shh);
                    }
                    ctx.fillStyle = `rgba(255,255,255,${pc.sheen + glint * 0.45})`;
                    ctx.fill();
                    ctx.restore();
                    ctx.lineWidth = 2 / (s * Math.min(fx, fy));
                    ctx.strokeStyle = `rgba(235,245,255,${0.55 + glint * 0.45})`;
                    ctx.stroke();
                    ctx.restore();
                }
                bits.forEach(b => {
                    const p = Math.max(0, Math.min(1, (t - b.delay) / b.dur));
                    if (p >= 1) return; alive = true;
                    const e = easeOut(p);
                    ctx.save();
                    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                    ctx.globalAlpha = 1 - p;
                    ctx.translate(b.x + b.ox * e, b.y + b.oy * e + 300 * p * p);
                    ctx.rotate(b.rz * p);
                    const k = 1 - p * 0.5;
                    ctx.beginPath(); ctx.moveTo(0, -b.s * k); ctx.lineTo(b.s * 0.8 * k, b.s * 0.6 * k); ctx.lineTo(-b.s * 0.6 * k, b.s * 0.7 * k); ctx.closePath();
                    ctx.fillStyle = 'rgba(235,245,255,.9)'; ctx.fill();
                    ctx.restore();
                });
                if (t < 260) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); drawCracks(9999, 1 - t / 260); }
                if (alive) requestAnimationFrame(step); else res();
            };
            requestAnimationFrame(step);
        });
        finish();
    }

    const btn = document.getElementById('kickoffBtn');
    if (btn) btn.addEventListener('click', smash);
    document.addEventListener('keydown', (e) => {
        if (finished || !document.getElementById('intro')) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); smash(); }
    });
})();
