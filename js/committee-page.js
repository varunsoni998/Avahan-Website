/**
 * Committee page · members grouped by designation (js/committee.js).
 * The top post (e.g. Sports Secretary) gets the feature card in the hero.
 * Office bearers show as large cards, bigger groups (e.g. Event Heads) as a compact grid.
 */

const SPORT_COLOR = {
    'cricket': '#2b9a4f', 'football': '#127a52', 'kabaddi': '#f26a1b', 'volley': '#2346c8',
    'throw': '#2346c8', 'badminton': '#6a3fb5', 'tug': '#d7263d', 'athlet': '#c8462b',
    'chess': '#ffc82c', 'table': '#1a5fb4', 'carrom': '#e8b26a', 'arm': '#16130e'
};
const LIGHT_SPORTS = ['chess', 'carrom'];
const GROUP_COLORS = ['#2346c8', '#1f9e5a', '#f26a1b', '#6a3fb5', '#0f9b8e', '#d7263d'];

let teamQuery = '';

function sportKey(sport) {
    const s = String(sport || '').toLowerCase();
    return Object.keys(SPORT_COLOR).find(k => s.includes(k)) || '';
}
function sportTag(sport) {
    const k = sportKey(sport);
    const bg = SPORT_COLOR[k] || '#2346c8';
    const fg = LIGHT_SPORTS.includes(k) ? '#16130e' : '#ffffff';
    return `<span class="sport-tag" style="background:${bg};color:${fg}">${escapeHtml(sport)}</span>`;
}
function slugify(name) {
    return String(name || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function photoFor(m) { return m.photo || `assets/committee/${slugify(m.name)}.jpg`; }
function initialsOf(name) {
    return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}
function telHref(phone) { return 'tel:' + String(phone || '').replace(/[^\d+]/g, ''); }
function plural(designation, n) {
    if (n === 1) return designation;
    if (/head$/i.test(designation)) return designation + 's';
    if (/member$/i.test(designation)) return designation + 's';
    if (/secretary$/i.test(designation)) return designation.replace(/y$/i, 'ies');
    if (/treasurer$/i.test(designation)) return designation + 's';
    return designation;
}

function avatar(m, cls) {
    return `<span class="avatar ${cls || ''}">
        <span class="avatar-initials">${escapeHtml(initialsOf(m.name))}</span>
        <img src="${escapeHtml(photoFor(m))}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.remove()">
    </span>`;
}

/* Hero feature card for the top post */
function leadCard(m) {
    const first = (m.sports || [])[0];
    return `
    <article class="member lead">
        <div class="member-top">
            <img class="member-court" src="${artForSport(first || 'ground')}" alt="" aria-hidden="true">
            ${avatar(m)}
        </div>
        <div class="member-body">
            <span class="member-role">${escapeHtml(m.designation || '')}</span>
            <h3>${escapeHtml(m.name)}</h3>
            ${(m.sports || []).length ? `<div class="member-sports"><span class="also">Also heads</span>${m.sports.map(sportTag).join('')}</div>` : ''}
            ${m.phone ? `<a class="member-phone mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

/* Large card for office bearers */
function bearerCard(m, color) {
    return `
    <article class="bearer" style="--grp:${color}">
        ${avatar(m, 'md')}
        <span class="bearer-role">${escapeHtml(m.designation || '')}</span>
        <h3>${escapeHtml(m.name)}</h3>
        ${(m.sports || []).length ? `<div class="member-sports">${m.sports.map(sportTag).join('')}</div>` : ''}
        ${m.phone ? `<a class="member-phone mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
    </article>`;
}

/* Compact card for big groups like Event Heads */
function compactCard(m) {
    return `
    <article class="member-chip">
        ${avatar(m, 'sm')}
        <div class="head-info">
            <b>${escapeHtml(m.name)}</b>
            ${(m.sports || []).length ? `<div class="person-sports">${m.sports.map(sportTag).join('')}</div>` : ''}
            ${m.phone ? `<a class="mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

function groupByDesignation(list) {
    const order = typeof DESIGNATION_ORDER !== 'undefined' ? DESIGNATION_ORDER : [];
    const map = new Map();
    list.forEach(m => {
        const d = (m.designation || 'Committee Member').trim();
        if (!map.has(d)) map.set(d, []);
        map.get(d).push(m);
    });
    const rank = d => { const i = order.findIndex(o => o.toLowerCase() === d.toLowerCase()); return i === -1 ? order.length : i; };
    return [...map.entries()].sort((a, b) => rank(a[0]) - rank(b[0]));
}

function renderCommittee() {
    const leadsEl = document.getElementById('teamLeads');
    const groupsEl = document.getElementById('teamGroups');
    const countEl = document.getElementById('teamCount');
    if (!groupsEl) return;

    const all = typeof COMMITTEE !== 'undefined' ? COMMITTEE : [];
    const groups = groupByDesignation(all);
    if (countEl) countEl.textContent = `${all.length} members`;

    // The first designation (if 1 or 2 people) becomes the hero feature
    let rest = groups;
    if (groups.length && groups[0][1].length <= 2) {
        if (leadsEl && !leadsEl.dataset.done) { leadsEl.innerHTML = groups[0][1].map(leadCard).join(''); leadsEl.dataset.done = '1'; }
        rest = groups.slice(1);
    }

    const q = teamQuery.trim().toLowerCase();
    const match = m => !q || m.name.toLowerCase().includes(q) || (m.designation || '').toLowerCase().includes(q) || (m.sports || []).some(s => s.toLowerCase().includes(q));

    // Small posts (up to 4 people each) share one "Office bearers" row, in designation order.
    // Big groups (e.g. Event Heads) get their own section with compact cards.
    const small = rest.filter(([, p]) => p.length <= 4);
    const big = rest.filter(([, p]) => p.length > 4);
    const sections = [];

    const bearers = small.flatMap(([, p], gi) => p.map(m => ({ m, color: GROUP_COLORS[gi % GROUP_COLORS.length] }))).filter(x => match(x.m));
    if (bearers.length) {
        sections.push(`
        <section class="desig-group">
            <div class="desig-head">
                <h3><span class="desig-dot" style="background:var(--red)"></span>Office bearers</h3>
                <span class="desig-count num">${small.reduce((n, [, p]) => n + p.length, 0)}</span>
            </div>
            <div class="bearer-grid">${bearers.map(x => bearerCard(x.m, x.color)).join('')}</div>
        </section>`);
    }

    big.forEach(([designation, people], gi) => {
        const shown = people.filter(match);
        if (!shown.length) return;
        const color = GROUP_COLORS[(gi + 1) % GROUP_COLORS.length];
        sections.push(`
        <section class="desig-group">
            <div class="desig-head">
                <h3><span class="desig-dot" style="background:${color}"></span>${escapeHtml(plural(designation, people.length))}</h3>
                <span class="desig-count num">${people.length}</span>
            </div>
            <div class="people-grid">${shown.map(compactCard).join('')}</div>
        </section>`);
    });
    const html = sections.join('');

    groupsEl.innerHTML = html || `<div class="empty"><i data-lucide="search"></i><p>No member matches "${escapeHtml(teamQuery)}"</p></div>`;
    refreshIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCommittee();
    const search = document.getElementById('teamSearch');
    if (search) search.addEventListener('input', (e) => { teamQuery = e.target.value; renderCommittee(); });
});
