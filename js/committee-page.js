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

/* Compact card, used when a level has many people */
function chipCard(m, lvl) {
    return `
    <article class="member-chip">
        ${avatar(m, 'sm')}
        <div class="head-info">
            <b>${escapeHtml(m.name)}</b>
            <span class="chip-level">${escapeHtml(lvl.title)}</span>
            ${m.phone ? `<a class="mono" href="${telHref(m.phone)}"><i data-lucide="phone"></i>${escapeHtml(m.phone)}</a>` : ''}
        </div>
    </article>`;
}

function renderCommittee() {
    const el = document.getElementById('teamGroups');
    const countEl = document.getElementById('teamCount');
    if (!el) return;
    const people = typeof COMMITTEE !== 'undefined' ? COMMITTEE : [];
    const levels = typeof COMMITTEE_LEVELS !== 'undefined' ? COMMITTEE_LEVELS : [];
    if (countEl) countEl.textContent = `${people.length} ${people.length === 1 ? 'member' : 'members'}`;

    const norm = s => String(s || '').trim().toLowerCase().replace(/s$/, '');
    const sections = levels.map((lvl, i) => {
        const inLevel = people.filter(p => norm(p.level) === norm(lvl.level));
        if (!inLevel.length) return '';
        const big = i === 0;
        return `
        <section class="desig-group level-${i + 1}">
            <div class="desig-head">
                <span class="level-step" style="background:${lvl.color}">${i + 1}</span>
                <h3>${escapeHtml(inLevel.length === 1 ? lvl.title : lvl.plural)}</h3>
                <span class="desig-count num">${inLevel.length}</span>
            </div>
            ${inLevel.length > 8
                ? `${inLevel.some(m => m.post) ? `<div class="bearer-grid">${inLevel.filter(m => m.post).map(m => personCard(m, lvl, false)).join('')}</div>` : ''}
                   <div class="people-grid">${inLevel.filter(m => !m.post).map(m => chipCard(m, lvl)).join('')}</div>`
                : `<div class="bearer-grid ${big ? 'faculty' : ''}">${inLevel.map(m => personCard(m, lvl, big)).join('')}</div>`}
        </section>`;
    }).filter(Boolean);

    el.innerHTML = sections.join('') || '<div class="empty"><p>Committee members will be announced soon</p></div>';
    refreshIcons();
}

document.addEventListener('DOMContentLoaded', renderCommittee);
