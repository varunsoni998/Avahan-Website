/**
 * Committee page · Faculty Coordinator → Heads → Deputy Heads (js/committee.js)
 */

function slugify(name) {
    return String(name || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function photoFor(m) { return m.photo || `assets/committee/${slugify(m.name)}.jpg`; }
function initialsOf(name) {
    return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}
function telHref(phone) { return 'tel:' + String(phone || '').replace(/[^\d+]/g, ''); }

function avatar(m, cls) {
    return `<span class="avatar ${cls || ''}">
        <span class="avatar-initials">${escapeHtml(initialsOf(m.name))}</span>
        <img src="${escapeHtml(photoFor(m))}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.remove()">
    </span>`;
}

function personCard(m, lvl, big) {
    return `
    <article class="bearer ${big ? 'big' : ''}" style="--grp:${lvl.color}">
        ${avatar(m, big ? 'lg' : 'md')}
        <span class="bearer-role">${escapeHtml(m.post || lvl.title)}</span>
        <h3>${escapeHtml(m.name)}</h3>
        ${m.phone ? `<a class="member-phone mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
    </article>`;
}

/* Each post gets its own tag colour, so people with the same post match */
const POST_COLORS = ['#d7263d', '#2346c8', '#1f9e5a', '#f26a1b', '#6a3fb5', '#0f9b8e', '#c8462b', '#1a5fb4', '#3d4654', '#b5179e'];
const postColorMap = {};
function postColor(post) {
    const k = String(post || '').toLowerCase();
    if (!(k in postColorMap)) postColorMap[k] = POST_COLORS[Object.keys(postColorMap).length % POST_COLORS.length];
    return postColorMap[k];
}

/* Compact card, used when a level has many people */
function chipCard(m, lvl) {
    return `
    <article class="member-chip">
        ${avatar(m, 'sm')}
        <div class="head-info">
            <b>${escapeHtml(m.name)}</b>
            <span class="post-tag" style="background:${postColor(m.post || lvl.title)}">${escapeHtml(m.post || lvl.title)}</span>
            ${m.phone ? `<a class="mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

/* Photo-first card: every head gets the same size */
function headshotCard(m, lvl, inCluster) {
    const color = postColor(m.post || lvl.title);
    return `
    <article class="headshot">
        <div class="hs-photo" style="--tint:${color}">
            <span class="hs-initials">${escapeHtml(initialsOf(m.name))}</span>
            <img src="${escapeHtml(photoFor(m))}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.remove()">
        </div>
        <div class="hs-body">
            <h3>${escapeHtml(m.name)}</h3>
            ${inCluster ? '' : `<span class="post-tag" style="background:${color}">${escapeHtml(m.post || lvl.title)}</span>`}
            ${m.phone ? `<a class="hs-phone mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

/* Hero feature for the faculty coordinator(s) */
function facultyCard(m, lvl) {
    return `
    <article class="member lead faculty-card">
        <div class="member-top">
            <img class="member-court" src="${artForSport('ground')}" alt="" aria-hidden="true">
            ${avatar(m)}
        </div>
        <div class="member-body">
            <span class="member-role">${escapeHtml(m.post || lvl.title)}</span>
            <h3>${escapeHtml(m.name)}</h3>
            <span class="faculty-note">Guides the AVAHAN 2027 Sports Committee</span>
            ${m.phone ? `<a class="member-phone mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

/* Group a level's people by post, keeping the order they are listed in */
function postPlural(post, n) {
    if (n === 1) return post;
    if (/secretary$/i.test(post)) return post.replace(/y$/i, 'ies');
    if (/liaison$/i.test(post)) return post + 's';
    if (/head$/i.test(post)) return post + 's';
    if (/treasurer$/i.test(post)) return post + 's';
    return post;
}
function renderClusters(list, lvl) {
    const groups = [];
    list.forEach(m => {
        const post = m.post || lvl.title;
        let g = groups.find(x => x.post === post);
        if (!g) { g = { post, people: [] }; groups.push(g); }
        g.people.push(m);
    });
    return `<div class="post-clusters">${groups.map(g => `
        <div class="cluster" style="--n:${g.people.length};--c:${postColor(g.post)}">
            <div class="cluster-label"><span>${escapeHtml(postPlural(g.post, g.people.length))}</span></div>
            <div class="cluster-cards">${g.people.map(m => headshotCard(m, lvl, true)).join('')}</div>
        </div>`).join('')}</div>`;
}

function renderCommittee() {
    const groupsEl = document.getElementById('teamGroups');
    const facultyEl = document.getElementById('facultyFeature');
    const countEl = document.getElementById('teamCount');
    if (!groupsEl) return;
    const people = typeof COMMITTEE !== 'undefined' ? COMMITTEE : [];
    const levels = typeof COMMITTEE_LEVELS !== 'undefined' ? COMMITTEE_LEVELS : [];
    if (countEl) countEl.textContent = `${people.length} ${people.length === 1 ? 'member' : 'members'}`;
    const norm = s => String(s || '').trim().toLowerCase().replace(/s$/, '');

    const [facultyLvl, ...rest] = levels;
    const faculty = facultyLvl ? people.filter(p => norm(p.level) === norm(facultyLvl.level)) : [];
    if (facultyEl) {
        facultyEl.innerHTML = faculty.map(m => facultyCard(m, facultyLvl)).join('');
        facultyEl.classList.toggle('hidden', faculty.length === 0);
    }

    const sections = rest.map((lvl, i) => {
        const inLevel = people.filter(p => norm(p.level) === norm(lvl.level));
        if (!inLevel.length) return '';
        return `
        <section class="section team-level ${i % 2 ? 'section-paper2' : ''}">
            <div class="wrap">
                <div class="section-head">
                    <div>
                        <p class="eyebrow"><span class="level-dot" style="background:${lvl.color}"></span>AVAHAN 2027 Sports Committee</p>
                        <h2>${escapeHtml(inLevel.length === 1 ? lvl.title : lvl.plural)} <span class="hl num">${inLevel.length}</span></h2>
                    </div>
                </div>
                ${renderClusters(inLevel, lvl)}
            </div>
        </section>`;
    }).filter(Boolean);

    groupsEl.innerHTML = sections.join('');
    refreshIcons();
}

document.addEventListener('DOMContentLoaded', renderCommittee);
