/**
 * AVAHAN Sports Committee - Admin Portal & Management System
 * Allows authorized sports committee members to add news, create tournament forms,
 * export registered teams to Excel/CSV, add gallery photos/videos, and update trivia.
 */

const ADMIN_DEFAULT_PIN = "avahan@2027";
let isAdminAuthenticated = false;

// Open the Admin Portal Modal
function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;

    if (sessionStorage.getItem('avahan_admin_auth') === 'true') {
        isAdminAuthenticated = true;
        showAdminPanel();
    } else {
        showAuthScreen();
    }

    modal.classList.remove('hidden');
    refreshIcons();
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.add('hidden');
}

// Shortcut triggers for buttons in other sections
function openNewsAdminModal() {
    openAdminModal();
    if (isAdminAuthenticated) switchAdminTab('news');
}
function openTournamentAdminModal() {
    openAdminModal();
    if (isAdminAuthenticated) switchAdminTab('tournaments');
}
function openGalleryAdminModal() {
    openAdminModal();
    if (isAdminAuthenticated) switchAdminTab('gallery');
}

// Authentication verification
function verifyAdminAuth() {
    const pin = document.getElementById('adminPinInput').value;
    if (pin === ADMIN_DEFAULT_PIN || pin === "avahan2027") {
        isAdminAuthenticated = true;
        sessionStorage.setItem('avahan_admin_auth', 'true');
        showAdminPanel();
    } else {
        alert('That passcode is not right. Try again.');
    }
}

function adminLogout() {
    isAdminAuthenticated = false;
    sessionStorage.removeItem('avahan_admin_auth');
    showAuthScreen();
}

function showAuthScreen() {
    document.getElementById('adminAuthScreen').classList.remove('hidden');
    document.getElementById('adminDashboardPanel').classList.add('hidden');
    const pinInput = document.getElementById('adminPinInput');
    if (pinInput) pinInput.value = '';
}

function showAdminPanel() {
    document.getElementById('adminAuthScreen').classList.add('hidden');
    document.getElementById('adminDashboardPanel').classList.remove('hidden');
    updateAdminCounters();
    renderAdminNews();
    renderAdminRegistrations();
    renderAdminTournaments();
    renderAdminGallery();
    renderAdminTrivia();
    renderAdminStandings();
    if (typeof renderAdminWinners === 'function') renderAdminWinners();
    refreshIcons();
}

// Tab Switching inside Admin Portal
function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const activeContent = document.getElementById(`adminTab-${tabName}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }

    refreshIcons();
}

// Update badges on tabs
function updateAdminCounters() {
    const store = getStore();
    document.getElementById('adminNewsCount').textContent = (store.news || []).length;
    document.getElementById('adminRegCount').textContent = (store.registrations || []).length;
    document.getElementById('adminTournCount').textContent = (store.tournaments || []).length;
    document.getElementById('adminGalCount').textContent = (store.gallery || []).length;
    document.getElementById('adminTrivCount').textContent = (store.trivia || []).length;
}

// =========================================================================
// 1. ADMIN NEWS MANAGER
// =========================================================================
function renderAdminNews() {
    const store = getStore();
    const list = document.getElementById('adminNewsList');
    if (!list) return;

    list.innerHTML = (store.news || []).map(item => `
        <div class="row">
            <div class="main">
                <img src="${resolveArt(item.image, item.title)}" class="thumb" alt="">
                <div style="min-width:0">
                    <b>${escapeHtml(plainText(item.title))}</b>
                    <span>${CATEGORY_LABEL[item.category] || escapeHtml(item.category)} · <span class="num">${escapeHtml(item.date)}</span></span>
                </div>
            </div>
            <div class="tools">
                <button onclick="deleteNews('${item.id}')" class="icon-btn danger" title="Delete bulletin" aria-label="Delete bulletin">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

// Handle Add News Form Submit
const adminNewsForm = document.getElementById('adminNewsForm');
if (adminNewsForm) {
    adminNewsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const store = getStore();

        const title = document.getElementById('admNewsTitle').value.trim();
        const category = document.getElementById('admNewsCategory').value;
        const badge = document.getElementById('admNewsBadge').value.trim();
        let image = document.getElementById('admNewsImage').value.trim();
        const author = document.getElementById('admNewsAuthor').value.trim() || 'Sports Committee';
        const summary = document.getElementById('admNewsSummary').value.trim();
        const content = document.getElementById('admNewsContent').value.trim();

        if (!image) {
            image = '';
        }

        const newId = `news-${Date.now()}`;
        const today = new Date().toISOString().split('T')[0];

        const newArticle = {
            id: newId,
            title,
            category,
            badge,
            date: today,
            summary,
            content,
            image,
            author,
            likes: 1
        };

        store.news = store.news || [];
        store.news.unshift(newArticle);

        // Also add to ticker
        store.ticker = store.ticker || [];
        store.ticker.unshift(title);

        saveStore(store);

        // Re-render UI
        adminNewsForm.reset();
        renderAdminNews();
        updateAdminCounters();
        renderNews();
        renderTicker();

        alert('Bulletin published');
    });
}

function deleteNews(id) {
    if (!confirm('Delete this bulletin?')) return;
    const store = getStore();
    store.news = (store.news || []).filter(n => n.id !== id);
    saveStore(store);
    renderAdminNews();
    updateAdminCounters();
    renderNews();
}

// =========================================================================
// 2. ADMIN REGISTRATIONS MANAGER
// =========================================================================
function renderAdminRegistrations() {
    const store = getStore();
    const tbody = document.getElementById('adminRegTableBody');
    const filterSelect = document.getElementById('adminRegFilter');
    if (!tbody) return;

    // Populate filter select
    const selectedFilter = filterSelect ? filterSelect.value : 'ALL';
    if (filterSelect && filterSelect.options.length <= 1) {
        (store.tournaments || []).forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            filterSelect.appendChild(opt);
        });
    }

    let registrations = store.registrations || [];
    if (selectedFilter !== 'ALL') {
        registrations = registrations.filter(r => r.tournamentId === selectedFilter);
    }

    if (registrations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:32px" class="muted">
                    No registrations for this sport yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = registrations.map(reg => `
        <tr>
            <td class="mono strong">${escapeHtml(reg.id)}</td>
            <td>${escapeHtml(reg.sport || reg.tournamentName)}</td>
            <td class="strong">${escapeHtml(reg.teamName)}</td>
            <td><span class="dept-chip" style="background:${(DEPT_INFO[reg.department] || {}).color || '#2346c8'};color:${(DEPT_INFO[reg.department] || {}).text || '#fff'}">${escapeHtml(DEPT_SHORT[reg.department] || reg.department)}</span><span class="sub">${escapeHtml(reg.year)}</span></td>
            <td class="strong">${escapeHtml(reg.captainName)}<span class="sub mono">${escapeHtml(reg.captainPhone)}</span></td>
            <td>
                <button onclick="alert(${JSON.stringify('Squad: ' + reg.playerNames).replace(/"/g, '&quot;')})" class="link" style="font-size:13px">
                    <span class="num">${reg.playerCount}</span> players
                </button>
            </td>
            <td>
                <div class="tools" style="display:flex;gap:4px">
                    <button onclick="showRegistrationSlip(${JSON.stringify(reg).replace(/"/g, '&quot;')})" class="icon-btn" title="Print slip" aria-label="Print slip">
                        <i data-lucide="printer"></i>
                    </button>
                    <button onclick="deleteRegistration('${reg.id}')" class="icon-btn danger" title="Delete" aria-label="Delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    refreshIcons();
}

function deleteRegistration(regId) {
    if (!confirm(`Remove registration ${regId}?`)) return;
    const store = getStore();
    store.registrations = (store.registrations || []).filter(r => r.id !== regId);
    saveStore(store);
    renderAdminRegistrations();
    updateAdminCounters();
}

// Export All Registered Teams to CSV/Excel file
function exportRegistrationsToCSV() {
    const store = getStore();
    const data = store.registrations || [];

    if (data.length === 0) {
        alert('There are no registrations to export yet.');
        return;
    }

    const headers = ["Registration ID", "Tournament", "Sport", "Team Name", "Department", "Academic Year", "Captain Name", "Captain Email", "Captain Phone", "Player Count", "Squad Players", "Registered At"];

    const csvRows = [headers.join(',')];

    data.forEach(item => {
        const row = [
            `"${item.id}"`,
            `"${(item.tournamentName || '').replace(/"/g, '""')}"`,
            `"${(item.sport || '').replace(/"/g, '""')}"`,
            `"${(item.teamName || '').replace(/"/g, '""')}"`,
            `"${(item.department || '').replace(/"/g, '""')}"`,
            `"${(item.year || '').replace(/"/g, '""')}"`,
            `"${(item.captainName || '').replace(/"/g, '""')}"`,
            `"${(item.captainEmail || '').replace(/"/g, '""')}"`,
            `"${(item.captainPhone || '').replace(/"/g, '""')}"`,
            item.playerCount || 0,
            `"${(item.playerNames || '').replace(/"/g, '""')}"`,
            `"${item.submittedAt || ''}"`
        ];
        csvRows.push(row.join(','));
    });

    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AVAHAN_Sports_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// =========================================================================
// 3. ADMIN TOURNAMENTS MANAGER
// =========================================================================
function renderAdminTournaments() {
    const store = getStore();
    const list = document.getElementById('adminTournamentsList');
    if (!list) return;

    list.innerHTML = (store.tournaments || []).map(t => `
        <div class="row">
            <div class="main">
                <img src="${resolveArt(t.banner, t.sport)}" class="thumb" alt="">
                <div style="min-width:0">
                    <b>${escapeHtml(t.name)}</b>
                    <span>${escapeHtml(t.teamSize || '')} · closes <span class="num">${escapeHtml(t.deadline || 'TBA')}</span> · ${t.status === 'OPEN' ? 'Open' : 'Closed'}</span>
                </div>
            </div>
            <div class="tools">
                <button onclick="toggleTournamentStatus('${t.id}')" class="btn btn-ghost btn-sm">
                    ${t.status === 'OPEN' ? 'Close entries' : 'Reopen'}
                </button>
                <button onclick="deleteTournament('${t.id}')" class="icon-btn danger" title="Delete form" aria-label="Delete form">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

const adminTournForm = document.getElementById('adminTournForm');
if (adminTournForm) {
    adminTournForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const store = getStore();

        const name = document.getElementById('admTournName').value.trim();
        const sport = document.getElementById('admTournSport').value.trim();
        const deadline = document.getElementById('admTournDeadline').value;
        const eventDates = document.getElementById('admTournDates').value.trim() || 'TBA';
        const venue = document.getElementById('admTournVenue').value.trim() || 'College Grounds';
        const teamSize = document.getElementById('admTournSize').value.trim() || 'Open Squad';
        const minPlayers = parseInt(document.getElementById('admTournMin').value) || 1;
        const heads = document.getElementById('admTournHeads') ? document.getElementById('admTournHeads').value.trim() : '';
        let banner = document.getElementById('admTournBanner') ? document.getElementById('admTournBanner').value.trim() : '';

        if (!banner) {
            banner = '';
        }

        const newId = `tourn-${sport.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

        const newTourn = {
            id: newId,
            name,
            sport,
            tag: "VCET Event",
            deadline,
            eventDates,
            venue,
            teamSize,
            minPlayers,
            heads,
            status: "OPEN",
            banner
        };

        store.tournaments = store.tournaments || [];
        store.tournaments.push(newTourn);
        saveStore(store);

        adminTournForm.reset();
        renderAdminTournaments();
        updateAdminCounters();
        renderTournaments();

        alert(`Registration for ${name} is open`);
    });
}

function toggleTournamentStatus(id) {
    const store = getStore();
    const tourn = store.tournaments.find(t => t.id === id);
    if (!tourn) return;
    tourn.status = (tourn.status === 'OPEN' ? 'CLOSED' : 'OPEN');
    saveStore(store);
    renderAdminTournaments();
    renderTournaments();
}

function deleteTournament(id) {
    if (!confirm('Delete this sport form?')) return;
    const store = getStore();
    store.tournaments = (store.tournaments || []).filter(t => t.id !== id);
    saveStore(store);
    renderAdminTournaments();
    updateAdminCounters();
    renderTournaments();
}

// =========================================================================
// 4. ADMIN GALLERY MANAGER
// =========================================================================
function renderAdminGallery() {
    const store = getStore();
    const list = document.getElementById('adminGalleryList');
    if (!list) return;

    list.innerHTML = (store.gallery || []).map(item => `
        <div class="row">
            <div class="main">
                <img src="${resolveArt(item.thumb || item.url, item.sport)}" class="thumb" alt="">
                <div style="min-width:0">
                    <b>${escapeHtml(item.title)}</b>
                    <span><span class="num">${escapeHtml(item.year)}</span> · ${escapeHtml(item.sport || '')} · ${item.type === 'video' ? 'Video' : 'Photo'}</span>
                </div>
            </div>
            <div class="tools">
                <button onclick="deleteGalleryItem('${item.id}')" class="icon-btn danger" title="Delete" aria-label="Delete">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

const adminGalleryForm = document.getElementById('adminGalleryForm');
if (adminGalleryForm) {
    adminGalleryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const store = getStore();

        const title = document.getElementById('admGalTitle').value.trim();
        const year = document.getElementById('admGalYear').value;
        const sport = document.getElementById('admGalSport').value.trim() || 'General';
        const type = document.getElementById('admGalType').value;
        const mediaUrl = document.getElementById('admGalUrl').value.trim();
        const caption = document.getElementById('admGalCaption').value.trim();

        let videoEmbedUrl = '';
        let thumb = '';

        if (type === 'video') {
            let videoId = '';
            const matchShort = mediaUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (matchShort) videoId = matchShort[1];
            const matchWatch = mediaUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
            if (matchWatch) videoId = matchWatch[1];
            if (videoId) {
                videoEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
                thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            } else {
                videoEmbedUrl = mediaUrl;
            }
        } else {
            thumb = mediaUrl || '';
        }

        const newId = `gal-${Date.now()}`;
        const newItem = {
            id: newId,
            title,
            year,
            sport,
            type,
            caption,
            url: type === 'image' ? mediaUrl : '',
            videoEmbedUrl,
            videoDirectUrl: mediaUrl,
            thumb
        };

        store.gallery = store.gallery || [];
        store.gallery.unshift(newItem);
        saveStore(store);

        adminGalleryForm.reset();
        renderAdminGallery();
        updateAdminCounters();
        renderGallery();

        alert('Added to past editions');
    });
}

function deleteGalleryItem(id) {
    if (!confirm('Delete this gallery item?')) return;
    const store = getStore();
    store.gallery = (store.gallery || []).filter(g => g.id !== id);
    saveStore(store);
    renderAdminGallery();
    updateAdminCounters();
    renderGallery();
}

// =========================================================================
// 5. ADMIN TRIVIA MANAGER
// =========================================================================
function renderAdminTrivia() {
    const store = getStore();
    const list = document.getElementById('adminTriviaList');
    if (!list) return;

    list.innerHTML = (store.trivia || []).map((t, idx) => `
        <div class="row">
            <div class="main">
                <div style="min-width:0">
                    <b>${escapeHtml(t.question)}</b>
                    <span>${escapeHtml(t.sport)} · answer: ${escapeHtml(t.options[t.answer])}</span>
                </div>
            </div>
            <div class="tools">
                <button onclick="deleteTrivia(${idx})" class="icon-btn danger" title="Delete" aria-label="Delete">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `).join('');

    refreshIcons();
}

const adminTriviaForm = document.getElementById('adminTriviaForm');
if (adminTriviaForm) {
    adminTriviaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const store = getStore();

        const sport = document.getElementById('admTrivSport').value.trim();
        const answer = parseInt(document.getElementById('admTrivCorrect').value);
        const question = document.getElementById('admTrivQuestion').value.trim();
        const opt1 = document.getElementById('admTrivOpt1').value.trim();
        const opt2 = document.getElementById('admTrivOpt2').value.trim();
        const opt3 = document.getElementById('admTrivOpt3').value.trim();
        const opt4 = document.getElementById('admTrivOpt4').value.trim();
        const explanation = document.getElementById('admTrivExp').value.trim();

        const newTrivia = {
            id: Date.now(),
            sport,
            question,
            options: [opt1, opt2, opt3, opt4],
            answer,
            explanation
        };

        store.trivia = store.trivia || [];
        store.trivia.push(newTrivia);
        saveStore(store);

        adminTriviaForm.reset();
        renderAdminTrivia();
        updateAdminCounters();
        renderTriviaQuestion();

        alert('Question added');
    });
}

function deleteTrivia(idx) {
    if (!confirm('Delete this trivia question?')) return;
    const store = getStore();
    store.trivia.splice(idx, 1);
    saveStore(store);
    renderAdminTrivia();
    updateAdminCounters();
    renderTriviaQuestion();
}

// =========================================================================
// 5b. ADMIN STANDINGS (department points per edition)
// =========================================================================
function renderAdminStandings() {
    const store = getStore();
    const board = store.leaderboard;
    const yearSel = document.getElementById('admBoardYear');
    const body = document.getElementById('admBoardBody');
    if (!yearSel || !body) return;

    const chosen = yearSel.value && board.editions.includes(yearSel.value) ? yearSel.value : board.editions[0];
    yearSel.innerHTML = board.editions.map(y => `<option ${y === chosen ? 'selected' : ''}>${y}</option>`).join('');

    const rows = board.points[chosen] || {};
    body.innerHTML = AVAHAN_DEPARTMENTS.map(code => {
        const r = rows[code] || { points: 0, gold: 0, silver: 0, bronze: 0 };
        const info = DEPT_INFO[code] || {};
        const cell = (k) => `<td><input type="number" min="0" class="input board-input" data-dept="${code}" data-k="${k}" value="${+r[k] || 0}" style="width:96px;height:36px"></td>`;
        return `<tr>
            <td class="strong"><span class="dept-chip" style="background:${info.color};color:${info.text}">${escapeHtml(DEPT_SHORT[code] || code)}</span> <span class="sub">${escapeHtml(info.name || '')}</span></td>
            ${cell('points')}${cell('gold')}${cell('silver')}${cell('bronze')}
        </tr>`;
    }).join('');
}

function saveAdminStandings() {
    const store = getStore();
    const year = document.getElementById('admBoardYear').value;
    store.leaderboard.points[year] = store.leaderboard.points[year] || {};
    document.querySelectorAll('#admBoardBody .board-input').forEach(inp => {
        const d = inp.dataset.dept, k = inp.dataset.k;
        store.leaderboard.points[year][d] = store.leaderboard.points[year][d] || { points: 0, gold: 0, silver: 0, bronze: 0 };
        store.leaderboard.points[year][d][k] = Math.max(0, parseInt(inp.value, 10) || 0);
    });
    saveStore(store);
    renderLeaderboard();
    alert(`Standings for ${year} saved`);
}

function addBoardEdition() {
    const year = (prompt('Which year? For example 2021') || '').trim();
    if (!/^\d{4}$/.test(year)) return;
    const store = getStore();
    const board = store.leaderboard;
    if (!board.editions.includes(year)) {
        board.editions.push(year);
        board.editions.sort((a, b) => b.localeCompare(a));
        board.points[year] = {};
        AVAHAN_DEPARTMENTS.forEach(d => { board.points[year][d] = { points: 0, gold: 0, silver: 0, bronze: 0 }; });
        saveStore(store);
    }
    document.getElementById('admBoardYear').value = year;
    renderAdminStandings();
    document.getElementById('admBoardYear').value = year;
    renderAdminStandings();
}

// =========================================================================
// 6. CLOUD / JSON DATA BACKUP & RESTORE
// =========================================================================
function exportDataJSON() {
    const store = getStore();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `avahan_data_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
}

function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.news && data.tournaments) {
                saveStore(data);
                alert('Backup restored. The page will reload.');
                window.location.reload();
            } else {
                alert('This file is not an AVAHAN backup.');
            }
        } catch (err) {
            alert('This file could not be read.');
        }
    };
    reader.readAsText(file);
}

// Set up Admin Button triggers
document.addEventListener('DOMContentLoaded', () => {
    const openAdminBtn = document.getElementById('openAdminBtn');
    if (openAdminBtn) openAdminBtn.addEventListener('click', openAdminModal);

    const mobileAdminTrigger = document.getElementById('mobileAdminTrigger');
    if (mobileAdminTrigger) mobileAdminTrigger.addEventListener('click', openAdminModal);

    const openAdminMobileBtn = document.getElementById('openAdminMobileBtn');
    if (openAdminMobileBtn) openAdminMobileBtn.addEventListener('click', openAdminModal);

    // File input handlers for local image uploads
    const newsFileInput = document.getElementById('admNewsFileInput');
    if (newsFileInput) {
        newsFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    document.getElementById('admNewsImage').value = evt.target.result;
                    alert('Image attached');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const galFileInput = document.getElementById('admGalFileInput');
    if (galFileInput) {
        galFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    document.getElementById('admGalUrl').value = evt.target.result;
                    alert('Photo attached');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Links from other pages (e.g. winners.html) open the committee login
    if (location.hash === '#committee-login') openAdminModal();

    const pinInput = document.getElementById('adminPinInput');
    if (pinInput) {
        pinInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                verifyAdminAuth();
            }
        });
    }
});
