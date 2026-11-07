/**
 * Committee admin · Winners tab
 * Add students and teams who won competitions for VCET, then download an
 * updated js/winners.js to publish them on the website.
 */

function publishedWinners() {
    return (typeof VCET_WINNERS !== 'undefined' ? VCET_WINNERS : []);
}

function renderAdminWinners() {
    const list = document.getElementById('adminWinnersList');
    if (!list) return;
    const drafts = getStore().winners || [];
    const rows = publishedWinners().map(w => ({ w, draft: false })).concat(drafts.map((w, i) => ({ w, draft: true, i })));
    if (rows.length === 0) {
        list.innerHTML = '<p class="muted" style="font-size:14px;font-weight:600">No winners yet. Add the first one above.</p>';
        return;
    }
    list.innerHTML = rows.map(({ w, draft, i }) => {
        const info = DEPT_INFO[w.department] || { color: '#2346c8', text: '#fff' };
        return `
        <div class="row">
            <div class="main">
                <span class="dept-chip" style="background:${info.color};color:${info.text}">${escapeHtml(DEPT_SHORT[w.department] || w.department || '')}</span>
                <div style="min-width:0">
                    <b>${escapeHtml(w.name)} · ${escapeHtml(w.position || '')}</b>
                    <span>${escapeHtml(w.sport || '')} · ${escapeHtml(w.competition || '')} · ${escapeHtml(w.level || '')} · <span class="num">${escapeHtml(w.date || '')}</span></span>
                </div>
            </div>
            <div class="tools">
                ${draft
                    ? `<span class="draft-tag static">Not published</span><button onclick="deleteWinnerDraft(${i})" class="icon-btn danger" title="Delete draft" aria-label="Delete draft"><i data-lucide="trash-2"></i></button>`
                    : '<span class="muted" style="font-size:13px;font-weight:600">On the website</span>'}
            </div>
        </div>`;
    }).join('');
    refreshIcons();
}

const adminWinnerForm = document.getElementById('adminWinnerForm');
if (adminWinnerForm) {
    adminWinnerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = id => document.getElementById(id).value.trim();
        const store = getStore();
        store.winners = store.winners || [];
        store.winners.push({
            name: val('admWinName'),
            members: val('admWinMembers'),
            department: val('admWinDept'),
            studyYear: val('admWinYear'),
            sport: val('admWinSport'),
            competition: val('admWinComp'),
            level: val('admWinLevel'),
            position: val('admWinPos'),
            date: val('admWinDate'),
            photo: val('admWinPhoto'),
            note: val('admWinNote')
        });
        saveStore(store);
        adminWinnerForm.reset();
        renderAdminWinners();
        alert('Winner added. Download winners.js to publish it on the website.');
    });
}

function deleteWinnerDraft(i) {
    if (!confirm('Delete this draft winner?')) return;
    const store = getStore();
    (store.winners || []).splice(i, 1);
    saveStore(store);
    renderAdminWinners();
}

function downloadWinnersFile() {
    const key = w => [w.name, w.competition, w.date].join('|').toLowerCase();
    const merged = publishedWinners().slice();
    const seen = new Set(merged.map(key));
    (getStore().winners || []).forEach(w => { if (!seen.has(key(w))) { merged.push(w); seen.add(key(w)); } });
    const fields = ['name', 'members', 'department', 'studyYear', 'sport', 'competition', 'level', 'position', 'date', 'photo', 'note'];
    const clean = merged.map(w => {
        const o = {};
        fields.forEach(k => { if (w[k]) o[k] = w[k]; });
        return o;
    });
    const body = `/**
 * VCET Winners · students and teams who won competitions for the college.
 * Generated from the committee admin on ${new Date().toISOString().split('T')[0]}.
 * To add more: Committee login → Winners → add → Download winners.js → replace this file → push.
 */

const VCET_WINNERS = ${JSON.stringify(clean, null, 4)};
`;
    const blob = new Blob([body], { type: 'text/javascript;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'winners.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
