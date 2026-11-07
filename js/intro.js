/**
 * Intro screen · shown once per visit (per browser tab session).
 * Live countdown to AVAHAN 2027. Clicking "Kick off" kicks the ball toward
 * the viewer; it smashes the screen like glass, cracks spread from the impact,
 * and the shards fall away to reveal the website.
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

    /* Glass geometry: jagged rays out from the impact point, cut by uneven rings.
       Shared edges use the same jittered points, so cracks and shards line up. */
    function buildGlass(cx, cy, W, H) {
        const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.3;
        const rays = 10;
        const base = rand(0, Math.PI * 2);
        const angles = Array.from({ length: rays }, (_, i) => base + (i + rand(-0.3, 0.3)) * (Math.PI * 2 / rays));
        const rings = [0, rand(45, 70), rand(120, 170), rand(240, 320), rand(420, 540), R];
        const P = rings.map((r, j) => angles.map(a => {
            const jr = j === 0 || j === rings.length - 1 ? r : r * rand(0.8, 1.2);
            const ja = j === 0 ? a : a + rand(-0.06, 0.06);
            return [cx + Math.cos(ja) * jr, cy + Math.sin(ja) * jr];
        }));
        // jittered midpoint on each ray segment, so radial cracks zig-zag
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
                if (j === 0) {
                    polys = [[P[0][i], M[0][i], P[1][i], P[1][n], M[0][n]]];
                } else {
                    const quad = [P[j][i], M[j][i], P[j + 1][i], P[j + 1][n], M[j][n], P[j][n]];
                    // split most pieces along a diagonal into long, sharp triangles
                    polys = Math.random() < 0.6
                        ? (Math.random() < 0.5
                            ? [[P[j][i], M[j][i], P[j + 1][i], P[j + 1][n]], [P[j][i], P[j + 1][n], M[j][n], P[j][n]]]
                            : [[P[j][i], M[j][i], P[j + 1][i], P[j][n]], [P[j + 1][i], P[j + 1][n], M[j][n], P[j][n]]])
                        : [quad];
                }
                polys.forEach(poly => {
                    const c = poly.reduce((acc, p) => [acc[0] + p[0] / poly.length, acc[1] + p[1] / poly.length], [0, 0]);
                    shards.push({ poly, c, ring: j });
                });
            }
        }
        // cracks: zig-zag rays, uneven web rings, and hairline splinters at the centre
        let cracks = '';
        angles.forEach((a, i) => {
            const line = [];
            for (let j = 0; j < rings.length - 2; j++) { line.push(P[j][i], M[j][i]); }
            line.push(P[rings.length - 2][i]);
            cracks += `<polyline points="${line.map(p => p.join(',')).join(' ')}" pathLength="1" style="--d:${rand(0, 60)}ms"/>`;
        });
        for (let j = 1; j < rings.length - 1; j++) {
            const ring = P[j].concat([P[j][0]]);
            cracks += `<polyline class="ring" points="${ring.map(p => p.join(',')).join(' ')}" pathLength="1" style="--d:${80 + j * 70}ms"/>`;
        }
        for (let k = 0; k < 26; k++) {
            const a = rand(0, Math.PI * 2), r1 = rand(4, 30), r2 = r1 + rand(20, 90);
            cracks += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" pathLength="1" class="hair"/>`;
        }
        return { shards, cracks };
    }

    /* One shard: only as big as its own bounding box (keeps it light on phones),
       showing its slice of the intro, with a glinting glass edge on top */
    function makeShard(sh, sceneHTML, W, H, uid) {
        const xs = sh.poly.map(p => p[0]), ys = sh.poly.map(p => p[1]);
        const bx = Math.max(-40, Math.floor(Math.min(...xs))), by = Math.max(-40, Math.floor(Math.min(...ys)));
        const bw = Math.min(W + 40, Math.ceil(Math.max(...xs))) - bx, bh = Math.min(H + 40, Math.ceil(Math.max(...ys))) - by;
        if (bw <= 1 || bh <= 1) return null;
        const rel = sh.poly.map(p => [(p[0] - bx).toFixed(1), (p[1] - by).toFixed(1)]);
        const el = document.createElement('div');
        el.className = 'intro-shard';
        el.style.left = bx + 'px'; el.style.top = by + 'px';
        el.style.width = bw + 'px'; el.style.height = bh + 'px';
        el.style.clipPath = `polygon(${rel.map(p => `${p[0]}px ${p[1]}px`).join(',')})`;
        el.style.transformOrigin = `${sh.c[0] - bx}px ${sh.c[1] - by}px`;
        const tiny = sh.ring === 0;
        el.innerHTML = (tiny ? '' : `<div class="shard-scene" style="left:${-bx}px;top:${-by}px;width:${W}px;height:${H}px">${sceneHTML}</div>`) +
            `<svg class="shard-glint" width="${bw}" height="${bh}" viewBox="0 0 ${bw} ${bh}">
                <defs><linearGradient id="g${uid}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#fff" stop-opacity="${tiny ? .55 : rand(.12, .26).toFixed(2)}"/>
                    <stop offset=".45" stop-color="#cfe3ff" stop-opacity="${tiny ? .2 : .03}"/>
                    <stop offset="1" stop-color="#fff" stop-opacity="${tiny ? .4 : rand(.06, .14).toFixed(2)}"/>
                </linearGradient></defs>
                <polygon points="${rel.map(p => p.join(',')).join(' ')}" fill="url(#g${uid})" stroke="rgba(235,245,255,.95)" stroke-width="${tiny ? 2 : 3}"/>
            </svg>`;
        return el;
    }

    /* ---------------- The smash ---------------- */
    async function smash() {
        if (intro.dataset.state) { finish(); return; }   // second click skips
        intro.dataset.state = 'kicking';
        try { sessionStorage.setItem('avahan_intro_seen', '1'); } catch (e) {}
        clearInterval(timer);

        if (reduce) { intro.classList.add('fade-out'); await wait(300); finish(); return; }

        const W = window.innerWidth, H = window.innerHeight;
        const btnBall = intro.querySelector('.kick-ball-btn');
        const r = btnBall.getBoundingClientRect();
        const sx = r.left + r.width / 2, sy = r.top + r.height / 2;
        const cx = W / 2 + rand(-W * 0.06, W * 0.06), cy = H * 0.4;

        // 1. Kick: the same ball you clicked takes off. A quick squash as it's struck,
        //    then it flies up and away into the screen, shrinking with distance, at a steady pace.
        const ball = document.createElement('div');
        ball.className = 'intro-fly-ball';
        ball.innerHTML = BALL_SVG;
        ball.style.width = ball.style.height = r.width + 'px';
        ball.style.left = r.left + 'px';
        ball.style.top = r.top + 'px';
        document.body.appendChild(ball);
        btnBall.style.visibility = 'hidden';            // swap happens in the same spot, so it's seamless
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

        // While the ball is in the air, prepare the glass so the shatter starts without a hitch
        const { shards, cracks } = buildGlass(cx, cy, W, H);
        const scene = [...intro.children];
        const sceneHTML = scene.map(el => el.outerHTML).join('').replace(/\sid="[^"]*"/g, '');
        const layer = document.createElement('div');
        layer.className = 'intro-shards';
        layer.style.perspectiveOrigin = `${cx}px ${cy}px`;
        layer.style.visibility = 'hidden';
        const maxD = Math.hypot(W, H);
        const anims = [];
        shards.forEach((sh, k) => {
            const el = makeShard(sh, sceneHTML, W, H, k);
            if (!el) return;
            layer.appendChild(el);
            const dist = Math.hypot(sh.c[0] - cx, sh.c[1] - cy);
            const near = 1 - Math.min(1, dist / (maxD * 0.6));
            const away = Math.atan2(sh.c[1] - cy, sh.c[0] - cx);
            const out = rand(30, 90) + near * rand(120, 280);
            anims.push({
                el,
                ox: Math.cos(away) * out, oy: Math.sin(away) * out,
                z: -(rand(40, 140) + near * rand(160, 420)),
                rx: rand(-160, 160), ry: rand(-160, 160), rz: rand(-120, 120),
                delay: (dist / maxD) * 180 + rand(0, 60),
                dur: rand(1400, 1850)
            });
        });
        for (let k = 0; k < 45; k++) {
            const el = document.createElement('div');
            el.className = 'glass-bit';
            const s = rand(3, 11);
            el.style.width = s + 'px'; el.style.height = s * rand(0.6, 1.8) + 'px';
            el.style.left = (cx + rand(-30, 30)) + 'px'; el.style.top = (cy + rand(-30, 30)) + 'px';
            layer.appendChild(el);
            const a = rand(0, Math.PI * 2), d = rand(80, 520);
            anims.push({ el, ox: Math.cos(a) * d, oy: Math.sin(a) * d, z: -rand(80, 600), rx: rand(-540, 540), ry: rand(-540, 540), rz: rand(-360, 360), delay: rand(0, 80), dur: rand(900, 1300), bit: true });
        }
        intro.appendChild(layer);

        await flight.finished.catch(() => {});
        if (finished) return;

        // 2. Impact: the ball punches straight through, the screen shakes, cracks race out
        ball.animate([
            { transform: `translate(${dx}px, ${dy}px) scale(${end}) rotate(-620deg)`, opacity: 1 },
            { transform: `translate(${dx}px, ${dy - 6}px) scale(${end * 0.4}) rotate(-700deg)`, opacity: 0 }
        ], { duration: 260, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' });
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'intro-cracks');
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.innerHTML = cracks;
        intro.appendChild(svg);
        const flash = document.createElement('div');
        flash.className = 'intro-flash';
        flash.style.setProperty('--x', cx + 'px');
        flash.style.setProperty('--y', cy + 'px');
        document.body.appendChild(flash);
        intro.classList.add('impact');

        await wait(440);
        if (finished) return;

        // 3. Shatter: the ball came from the viewer's side, so the glass blows inward,
        //    away from the viewer, tumbling in 3D as gravity takes it
        intro.dataset.state = 'shattering';
        layer.appendChild(svg);
        layer.style.visibility = '';
        scene.forEach(el => el.remove());
        intro.classList.add('broken');
        svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' });

        const falls = anims.map(a => a.el.animate([
            { transform: 'translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(0)', opacity: 1, easing: 'cubic-bezier(.2,.7,.4,1)' },
            { transform: `translate3d(${a.ox}px, ${a.oy}px, ${a.z}px) rotateX(${a.rx * .3}deg) rotateY(${a.ry * .3}deg) rotateZ(${a.rz * .3}deg)`, opacity: 1, offset: a.bit ? 0.45 : 0.24, easing: 'cubic-bezier(.4,.05,.8,.6)' },
            { transform: `translate3d(${a.ox * 1.35}px, ${a.oy * 1.2 + H * 1.1}px, ${a.z * 1.15}px) rotateX(${a.rx}deg) rotateY(${a.ry}deg) rotateZ(${a.rz}deg)`, opacity: a.bit ? 0 : 0.85 }
        ], { duration: a.dur, delay: a.delay, fill: 'forwards' }).finished.catch(() => {}));

        await Promise.all(falls);
        finish();
    }

    const btn = document.getElementById('kickoffBtn');
    if (btn) btn.addEventListener('click', smash);
    document.addEventListener('keydown', (e) => {
        if (finished || !document.getElementById('intro')) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); smash(); }
    });
})();
