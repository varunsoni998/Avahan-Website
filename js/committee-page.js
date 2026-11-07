/**
 * Committee page · Sports Secretary up top, then one compact block per sport
 * with that sport's event heads side by side. Data comes from js/committee.js.
 */

const SPORT_COLOR = {
    'cricket': '#2b9a4f', 'football': '#127a52', 'kabaddi': '#f26a1b', 'volley': '#2346c8',
    'throw': '#2346c8', 'badminton': '#6a3fb5', 'tug': '#d7263d', 'athlet': '#c8462b',
    'chess': '#ffc82c', 'table': '#1a5fb4', 'carrom': '#e8b26a', 'arm': '#16130e'
};
const LIGHT_SPORTS = ['chess', 'carrom'];

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

function avatar(m, cls) {
    return `<span class="avatar ${cls || ''}">
        <span class="avatar-initials">${escapeHtml(initialsOf(m.name))}</span>
        <img src="${escapeHtml(photoFor(m))}" alt="${escapeHtml(m.name)}" loading="lazy" onerror="this.remove()">
    </span>`;
}

/* The Sports Secretary and any other leads: big feature card */
function leadCard(m) {
    const first = (m.sports || [])[0];
    return `
    <article class="member lead">
        <div class="member-top">
            <img class="member-court" src="${artForSport(first || 'ground')}" alt="" aria-hidden="true">
            ${avatar(m)}
        </div>
        <div class="member-body">
            <span class="member-role">${escapeHtml(m.role || '')}</span>
            <h3>${escapeHtml(m.name)}</h3>
            ${(m.sports || []).length ? `<div class="member-sports"><span class="also">Also heads</span>${m.sports.map(sportTag).join('')}</div>` : ''}
            ${m.phone ? `<a class="member-phone mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

/* One person inside a sport block */
function headRow(m) {
    return `
    <div class="head">
        ${avatar(m, 'sm')}
        <div class="head-info">
            <b>${escapeHtml(m.name)}</b>
            ${m.role && m.role !== 'Event Head' ? `<span class="head-role">${escapeHtml(m.role)}</span>` : ''}
            ${m.phone ? `<a class="mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </div>`;
}

function renderCommittee() {
    const leadsEl = document.getElementById('teamLeads');
    const gridEl = document.getElementById('teamGrid');
    const countEl = document.getElementById('teamCount');
    if (!gridEl) return;

    const leads = typeof COMMITTEE_LEADS !== 'undefined' ? COMMITTEE_LEADS : [];
    const heads = typeof COMMITTEE_EVENT_HEADS !== 'undefined' ? COMMITTEE_EVENT_HEADS : [];

    if (leadsEl && !leadsEl.dataset.done) { leadsEl.innerHTML = leads.map(leadCard).join(''); leadsEl.dataset.done = '1'; }
    if (countEl) countEl.textContent = `${new Set(leads.concat(heads).map(m => m.name)).size} members`;

    // Group everyone by the sport they head, in the order sports first appear
    const groups = new Map();
    leads.concat(heads).forEach(m => (m.sports || []).forEach(s => {
        if (!groups.has(s)) groups.set(s, []);
        if (!groups.get(s).some(x => x.name === m.name)) groups.get(s).push(m);
    }));

    const q = teamQuery.trim().toLowerCase();
    const blocks = [...groups.entries()].filter(([sport, people]) =>
        !q || sport.toLowerCase().includes(q) || people.some(p => p.name.toLowerCase().includes(q)));

    if (blocks.length === 0) {
        gridEl.innerHTML = `<div class="empty"><i data-lucide="search"></i><p>No sport or member matches "${escapeHtml(teamQuery)}"</p></div>`;
        refreshIcons();
        return;
    }

    gridEl.innerHTML = blocks.map(([sport, people]) => {
        const k = sportKey(sport);
        const light = LIGHT_SPORTS.includes(k);
        return `
        <article class="sport-block">
            <header class="sport-head ${light ? 'light' : ''}">
                <img src="${artForSport(sport)}" alt="" aria-hidden="true">
                <h3>${escapeHtml(sport)}</h3>
            </header>
            <div class="heads-list">${people.map(headRow).join('')}</div>
        </article>`;
    }).join('');
    refreshIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCommittee();
    const search = document.getElementById('teamSearch');
    if (search) search.addEventListener('input', (e) => { teamQuery = e.target.value; renderCommittee(); });
});
