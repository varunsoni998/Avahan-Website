/**
 * Intro screen · shown once per visit (per browser tab session).
 * Live countdown to AVAHAN 2027, then "Kick off" kicks the ball away and the
 * screen splits open to reveal the site.
 */
(function () {
    const root = document.documentElement;
    const intro = document.getElementById('intro');
    if (!intro) return;
    if (!root.classList.contains('show-intro')) { intro.remove(); return; }

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FEST_START = new Date('2027-01-09T00:00:00+05:30');

    /* Countdown */
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

    /* Enter the site */
    const btn = document.getElementById('kickoffBtn');
    let done = false;
    function enter() {
        if (done) return;
        done = true;
        try { sessionStorage.setItem('avahan_intro_seen', '1'); } catch (e) {}
        clearInterval(timer);
        const finish = () => {
            root.classList.remove('show-intro');
            intro.remove();
            // replay the hero entrance now that the page is visible
            document.querySelectorAll('.bounce-in .ltr, .bounce-in .stamp, .hang-in .jersey svg, .enter').forEach(el => {
                el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
            });
        };
        if (reduce) { finish(); return; }
        intro.classList.add('kicked');
        setTimeout(() => intro.classList.add('opening'), 420);
        setTimeout(finish, 1300);
    }
    if (btn) {
        btn.addEventListener('click', enter);
    }
    document.addEventListener('keydown', (e) => {
        if (!done && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) { e.preventDefault(); enter(); }
    });
})();
