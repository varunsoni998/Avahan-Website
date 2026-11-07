/**
 * Winners page · renders the wall of champions from js/winners.js
 * plus any drafts the committee added on this device.
 */

const POSITION_ORDER = { 'Gold': 0, 'Winner': 0, 'Silver': 1, 'Runner-up': 1, 'Bronze': 2, 'Finalist': 3 };
const POSITION_CLASS = { 'Gold': 'gold', 'Winner': 'gold', 'Silver': 'silver', 'Runner-up': 'silver', 'Bronze': 'bronze', 'Finalist': 'finalist' };
const LEVELS = ['International', 'National', 'State', 'Zonal', 'University', 'Inter-college'];

let winLevel = 'ALL';
let winYear = 'ALL';

function allWinners() {
    const published = (typeof VCET_WINNERS !== 'undefined' ? VCET_WINNERS : []).map(w => ({ ...w, _draft: false }));
    let drafts = [];
    try { drafts = (getStore().winners || []).map(w => ({ ...w, _draft: true })); } catch (e) { drafts = []; }
    // A draft that has already been published (same name, competition and date) is not shown twice
    const key = w => [w.name, w.competition, w.date].join('|').toLowerCase();
    const seen = new Set(published.map(key));
    return published.concat(drafts.filter(d => !seen.has(key(d))));
}

function winYearOf(w) { return String(w.date || '').slice(0, 4); }

function formatWinDate(d) {
    if (!d) return '';
    const [y, m] = String(d).split('-');
    if (!m) return y;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[(+m || 1) - 1]} ${y}`;
}

function initials(name) {
    return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

function renderWinnerStats(list) {
    const el = document.getElementById('winStats');
    if (!el) return;
    const count = (pos) => list.filter(w => POSITION_CLASS[w.position] === pos).length;
    const top = list.filter(w => ['National', 'International', 'State'].includes(w.level)).length;
    el.innerHTML = `
        <div><b class="num">${list.length}</b><span>Podium finishes</span></div>
        <div><b class="num">${count('gold')}</b><span>Gold or winner</span></div>
        <div><b class="num">${count('silver') + count('bronze')}</b><span>Silver and bronze</span></div>
        <div><b class="num">${top}</b><span>State level and above</span></div>
    `;
}

function renderWinnerFilters(list) {
    const lv = document.getElementById('winLevelFilters');
    const yr = document.getElementById('winYearFilters');
    const levels = LEVELS.filter(l => list.some(w => w.level === l));
    const years = [...new Set(list.map(winYearOf).filter(Boolean))].sort((a, b) => b.localeCompare(a));
    if (lv) lv.innerHTML = ['ALL', ...levels].map(l => `<button class="${l === winLevel ? 'active' : ''}" onclick="winLevel='${l}'; renderWinners()">${l === 'ALL' ? 'All levels' : l}</button>`).join('');
    if (yr) yr.innerHTML = ['ALL', ...years].map(y => `<button class="${y === winYear ? 'active' : ''}" onclick="winYear='${y}'; renderWinners()">${y === 'ALL' ? 'All years' : y}</button>`).join('');
    const bar = document.getElementById('winToolbar');
    if (bar) bar.classList.toggle('hidden', list.length === 0);
}

function renderWinners() {
    const grid = document.getElementById('winnersGrid');
    if (!grid) return;
    const list = allWinners();
    renderWinnerStats(list);
    renderWinnerFilters(list);

    let items = list.slice();
    if (winLevel !== 'ALL') items = items.filter(w => w.level === winLevel);
    if (winYear !== 'ALL') items = items.filter(w => winYearOf(w) === winYear);
    items.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || (POSITION_ORDER[a.position] ?? 9) - (POSITION_ORDER[b.position] ?? 9));

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="wall-empty">
                <div class="trophy-art" aria-hidden="true">
                    <svg viewBox="0 0 160 160"><path d="M48 24h64v34c0 22-14 38-32 38S48 80 48 58V24z" fill="#ffc82c" stroke="#16130e" stroke-width="5" stroke-linejoin="round"/><path d="M48 34H26c0 22 10 34 26 36M112 34h22c0 22-10 34-26 36" fill="none" stroke="#16130e" stroke-width="5" stroke-linecap="round"/><path d="M70 96h20v20H70z" fill="#d7263d" stroke="#16130e" stroke-width="5"/><path d="M50 116h60v18H50z" fill="#2346c8" stroke="#16130e" stroke-width="5" stroke-linejoin="round"/><path d="M80 40l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="#fff" stroke="#16130e" stroke-width="3" stroke-linejoin="round"/></svg>
                </div>
                <div>
                <h3>The wall is ready for its first champions</h3>
                <p>Every student and team who brings home a medal or a trophy for VCET goes up here. Won something at an inter-college, university, state or national event? Tell the committee and we'll add you.</p>
                <div class="actions">
                    <a href="https://chat.whatsapp.com/KCJFNR4DXec84xSB6KgYnB" target="_blank" rel="noopener" class="btn btn-primary"><i data-lucide="message-circle"></i>Send us your result</a>
                    <a href="index.html#contact" class="btn btn-secondary">Contact the committee</a>
                </div>
                </div>
            </div>`;
        refreshIcons();
        return;
    }

    if (items.length === 0) {
        grid.innerHTML = `<div class="empty"><i data-lucide="search"></i><p>No winners match this filter</p><button class="btn btn-secondary btn-sm" onclick="winLevel='ALL'; winYear='ALL'; renderWinners()">Show all winners</button></div>`;
        refreshIcons();
        return;
    }

    grid.innerHTML = items.map(w => {
        const info = DEPT_INFO[w.department] || { color: '#2346c8', text: '#ffffff', name: w.department || '' };
        const pos = POSITION_CLASS[w.position] || 'finalist';
        return `
        <article class="win-card ${pos}">
            <div class="win-top" style="--dept:${info.color};--dept-text:${info.text}">
                ${w.photo
                    ? `<img class="win-photo" src="${escapeHtml(w.photo)}" alt="${escapeHtml(w.name)}" loading="lazy">`
                    : `<span class="win-initials">${escapeHtml(initials(w.name))}</span>`}
                <span class="medal-badge ${pos}">
                    <svg viewBox="0 0 48 60" aria-hidden="true"><path d="M12 0h10l6 18H18zM36 0H26l-6 18h10z" fill="#d7263d" stroke="#16130e" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="38" r="18" stroke="#16130e" stroke-width="3"/></svg>
                    <b>${escapeHtml(w.position || '')}</b>
                </span>
                ${w._draft ? '<span class="draft-tag">Draft on this device</span>' : ''}
            </div>
            <div class="win-body">
                <span class="win-level">${escapeHtml(w.level || '')}${w.date ? ` · ${escapeHtml(formatWinDate(w.date))}` : ''}</span>
                <h3>${escapeHtml(w.name)}</h3>
                <p class="win-dept"><span class="dept-chip" style="background:${info.color};color:${info.text}">${escapeHtml(DEPT_SHORT[w.department] || w.department || '')}</span>${w.studyYear ? `<span>${escapeHtml(w.studyYear)}</span>` : ''}</p>
                ${w.members ? `<p class="win-members">${escapeHtml(w.members)}</p>` : ''}
                <p class="win-event"><b>${escapeHtml(w.sport || '')}</b>${w.competition ? ` at ${escapeHtml(w.competition)}` : ''}</p>
                ${w.note ? `<p class="win-note">${escapeHtml(w.note)}</p>` : ''}
            </div>
        </article>`;
    }).join('');

    refreshIcons();
}

document.addEventListener('DOMContentLoaded', renderWinners);
