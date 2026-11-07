/**
 * AVAHAN Sports Committee - Main Client Logic
 */

let currentNewsCategory = 'ALL';
let currentNewsSearch = '';
let currentGalleryYear = 'ALL';
let currentGalleryType = 'ALL';

// Trivia State
let currentTriviaIndex = 0;
let triviaScore = 0;
let triviaStreak = 0;
let triviaAnswered = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeStore();
    renderTicker();
    renderJerseys();
    renderSportsTape();
    renderLeaderboard();
    renderNews();
    renderTournaments();
    renderTriviaQuestion();
    renderGallery();
    setupEventListeners();
    lucide.createIcons();
});

// Strip emoji from stored text so older saved notices render cleanly
function plainText(str) {
    return String(str || '').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/!+/g, '').replace(/\s{2,}/g, ' ').trim();
}

function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const CATEGORY_CLASS = {
    'Mega Event': 'fest',
    'Tournament Alert': 'tournament',
    'College Victory': 'result',
    'Trial Notice': 'trial'
};

const CATEGORY_LABEL = {
    'Mega Event': 'Fest',
    'Tournament Alert': 'Tournament',
    'College Victory': 'Result',
    'Trial Notice': 'Trial notice'
};

// Refresh Lucide icons whenever DOM elements change
function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// =========================================================================
// 1. LIVE TICKER
// =========================================================================
function renderTicker() {
    const store = getStore();
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    if (!store.ticker || store.ticker.length === 0) {
        track.innerHTML = '<span class="tick">Match schedules will be posted here</span>';
        return;
    }

    const items = store.ticker.map(plainText).filter(Boolean);
    let i = 0;
    const show = () => {
        track.innerHTML = `<span class="tick">${escapeHtml(items[i % items.length])}</span>`;
        i += 1;
    };
    show();
    clearInterval(window.__tickerTimer);
    if (items.length > 1) window.__tickerTimer = setInterval(show, 5000);
}

// =========================================================================
// 1b. DEPARTMENT JERSEYS, SPORTS TAPE AND STANDINGS
// =========================================================================
function jerseySVG(code, size) {
    const info = DEPT_INFO[code] || { color: '#2346c8', text: '#ffffff' };
    const label = DEPT_SHORT[code] || code;
    const fs = label.length > 5 ? 13 : label.length > 4 ? 15 : 18;
    return `<svg viewBox="0 0 120 128" ${size ? `width="${size}" height="${size}"` : ''} aria-hidden="true">
        <path d="M40 6 L18 14 L3 36 L18 50 L28 43 L28 122 L92 122 L92 43 L102 50 L117 36 L102 14 L80 6 C77 16 70 22 60 22 C50 22 43 16 40 6 Z"
              fill="${info.color}" stroke="#16130e" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M40 6 C43 16 50 22 60 22 C70 22 77 16 80 6" fill="none" stroke="${info.text}" stroke-width="4" stroke-opacity="0.9"/>
        <path d="M7 31 L20 44 M113 31 L100 44" stroke="${info.text}" stroke-width="4" stroke-opacity="0.85"/>
        <text x="60" y="${size ? 62 : 52}" text-anchor="middle" font-family="Barlow, sans-serif" font-weight="700" font-size="${size ? 0 : fs}" fill="${info.text}">${size ? '' : label}</text>
        <text x="60" y="${size ? 92 : 98}" text-anchor="middle" font-family="Graduate, serif" font-size="${size ? 40 : 34}" fill="${info.text}">27</text>
    </svg>`;
}

function renderJerseys() {
    const el = document.getElementById('deptJerseys');
    if (!el) return;
    el.innerHTML = AVAHAN_DEPARTMENTS.map(code => `
        <a class="jersey" href="#registrations" title="${escapeHtml(DEPT_INFO[code] ? DEPT_INFO[code].name : code)}">
            ${jerseySVG(code)}
            <b>${escapeHtml(DEPT_SHORT[code] || code)}</b>
            <span>${escapeHtml(DEPT_INFO[code] ? DEPT_INFO[code].name : '')}</span>
        </a>
    `).join('');
}

function renderSportsTape() {
    const el = document.getElementById('sportsTape');
    if (!el) return;
    const store = getStore();
    const sports = [...new Set((store.tournaments || []).map(t => t.sport))];
    const run = sports.map(s => `<span>${escapeHtml(s)}</span>`).join('');
    el.innerHTML = run + run;
}

let currentBoardYear = 'ALL';

function boardEditionsWithData(board) {
    return (board.editions || []).filter(y => {
        const rows = board.points[y] || {};
        return Object.values(rows).some(r => (r.points || 0) + (r.gold || 0) + (r.silver || 0) + (r.bronze || 0) > 0);
    });
}

function boardTotals(board, year) {
    const years = year === 'ALL' ? boardEditionsWithData(board) : [year];
    return AVAHAN_DEPARTMENTS.map(code => {
        const t = { code, points: 0, gold: 0, silver: 0, bronze: 0 };
        years.forEach(y => {
            const r = (board.points[y] || {})[code];
            if (!r) return;
            t.points += +r.points || 0; t.gold += +r.gold || 0; t.silver += +r.silver || 0; t.bronze += +r.bronze || 0;
        });
        return t;
    }).sort((a, b) => b.points - a.points || b.gold - a.gold || b.silver - a.silver || a.code.localeCompare(b.code));
}

function renderLeaderboard() {
    const listEl = document.getElementById('leaderboard');
    const sideEl = document.getElementById('boardSide');
    const tabsEl = document.getElementById('boardYearFilters');
    if (!listEl) return;
    const store = getStore();
    const board = store.leaderboard;
    const withData = boardEditionsWithData(board);
    const current = (board.editions || [])[0] || '2027';
    const tabs = ['ALL', ...new Set([current, ...withData])];
    if (!tabs.includes(currentBoardYear)) currentBoardYear = 'ALL';

    if (tabsEl) {
        tabsEl.innerHTML = tabs.map(y => `<button class="${y === currentBoardYear ? 'active' : ''}" onclick="currentBoardYear='${y}'; renderLeaderboard()">${y === 'ALL' ? 'All time' : y}</button>`).join('');
    }

    const rows = boardTotals(board, currentBoardYear);
    const max = Math.max(1, ...rows.map(r => r.points));
    const empty = rows.every(r => r.points === 0 && r.gold === 0);
    let rank = 0, prev = null;

    listEl.innerHTML = `
        <div class="board-row board-head">
            <span>#</span><span>Department</span><span class="medals-h">Medals</span><span class="pts-h">Points</span>
        </div>
        ${rows.map((r, i) => {
            if (prev === null || r.points !== prev) rank = i + 1;
            prev = r.points;
            const info = DEPT_INFO[r.code] || {};
            const top = !empty && rank <= 3;
            return `
            <div class="board-row ${top ? 'top top-' + rank : ''}" style="--dept:${info.color}">
                <span class="rank">${empty ? '–' : rank}</span>
                <span class="dept">
                    <span class="mini-jersey">${jerseySVG(r.code, 34)}</span>
                    <span><b>${escapeHtml(DEPT_SHORT[r.code] || r.code)}</b><small>${escapeHtml(info.name || '')}</small></span>
                </span>
                <span class="medals">
                    <i class="medal g" title="Gold">${r.gold}</i><i class="medal s" title="Silver">${r.silver}</i><i class="medal b" title="Bronze">${r.bronze}</i>
                </span>
                <span class="pts">
                    <b class="num">${r.points}</b>
                    <span class="bar"><span style="width:${empty ? 0 : Math.round(r.points / max * 100)}%"></span></span>
                </span>
            </div>`;
        }).join('')}
    `;

    if (sideEl) {
        if (empty) {
            sideEl.innerHTML = `
                <div class="leader-card waiting">
                    <span class="kick">${currentBoardYear === 'ALL' ? 'All-time table' : 'AVAHAN ' + currentBoardYear}</span>
                    <h3>Everyone starts on zero</h3>
                    <p>${currentBoardYear === 'ALL'
                        ? 'Past results have not been added yet. The table fills up as the committee enters each edition.'
                        : 'Matches start on 9 January. Every win earns your department points, and this table updates as results come in.'}</p>
                    <a href="#registrations" class="btn btn-yellow">Register your squad</a>
                </div>`;
        } else {
            const lead = rows[0];
            const info = DEPT_INFO[lead.code] || {};
            sideEl.innerHTML = `
                <div class="leader-card" style="--dept:${info.color};--dept-text:${info.text}">
                    <span class="kick">${currentBoardYear === 'ALL' ? 'All-time leaders' : 'Top of AVAHAN ' + currentBoardYear}</span>
                    <div class="leader-jersey">${jerseySVG(lead.code)}</div>
                    <h3>${escapeHtml(info.name || lead.code)}</h3>
                    <p><b class="num">${lead.points}</b> points · <b class="num">${lead.gold}</b> gold</p>
                    ${rows[1] ? `<p class="gap">${lead.points - rows[1].points} points clear of ${escapeHtml(DEPT_SHORT[rows[1].code] || rows[1].code)}</p>` : ''}
                </div>`;
        }
    }
}

// =========================================================================
// 2. DAILY SPORTS NEWS & COLLEGE UPDATES
// =========================================================================
function renderNews() {
    const store = getStore();
    const container = document.getElementById('newsGrid');
    if (!container) return;

    let newsItems = store.news || [];

    // Filter by category
    if (currentNewsCategory !== 'ALL') {
        newsItems = newsItems.filter(item => item.category === currentNewsCategory);
    }

    // Filter by search query
    if (currentNewsSearch.trim()) {
        const query = currentNewsSearch.toLowerCase();
        newsItems = newsItems.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.summary.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }

    if (newsItems.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <i data-lucide="newspaper"></i>
                <p>No bulletins match this filter</p>
                <button onclick="resetNewsFilter()" class="btn btn-secondary btn-sm">Show all bulletins</button>
            </div>
        `;
        refreshIcons();
        return;
    }

    container.innerHTML = newsItems.map((item, i) => `
        <article class="card news-card ${i === 0 && currentNewsCategory === 'ALL' && !currentNewsSearch.trim() ? 'lead' : ''}" onclick="openArticleModal('${item.id}')">
            <div class="news-media">
                <img src="${resolveArt(item.image, item.title)}" alt="" loading="lazy"
                     onerror="this.onerror=null; this.src=artForSport('${escapeHtml(item.title).replace(/'/g, '')}')">
            </div>
            <div class="news-body">
                <div class="meta-line">
                    <span class="cat ${CATEGORY_CLASS[item.category] || ''}">${CATEGORY_LABEL[item.category] || escapeHtml(item.category)}</span>
                    <span class="sep"></span>
                    <span class="num">${formatDate(item.date)}</span>
                </div>
                <h3>${escapeHtml(plainText(item.title))}</h3>
                <p>${escapeHtml(item.summary)}</p>
                <div class="news-foot">
                    <span>${escapeHtml(item.author || 'Sports committee')}</span>
                    <span class="link">Read <i data-lucide="arrow-right"></i></span>
                </div>
            </div>
        </article>
    `).join('');

    refreshIcons();
}

function resetNewsFilter() {
    currentNewsCategory = 'ALL';
    currentNewsSearch = '';
    const searchInput = document.getElementById('newsSearchInput');
    if (searchInput) searchInput.value = '';
    
    document.querySelectorAll('#newsCategoryFilters .filter-pill').forEach(btn => {
        if (btn.dataset.category === 'ALL') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderNews();
}

function openArticleModal(newsId) {
    const store = getStore();
    const item = store.news.find(n => n.id === newsId);
    if (!item) return;

    const modal = document.getElementById('articleModal');
    const content = document.getElementById('articleModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="article-media">
            <img src="${resolveArt(item.image, item.title)}" alt="">
        </div>
        <div class="meta-line">
            <span class="cat ${CATEGORY_CLASS[item.category] || ''}">${CATEGORY_LABEL[item.category] || escapeHtml(item.category)}</span>
            <span class="sep"></span>
            <span class="num">${formatDate(item.date)}</span>
            <span class="sep"></span>
            <span>${escapeHtml(item.author || 'Sports committee')}</span>
        </div>
        <h2>${escapeHtml(plainText(item.title))}</h2>
        <p class="body">${escapeHtml(item.content || item.summary)}</p>
        <div class="actions">
            <button onclick="likeArticle('${item.id}')" class="btn btn-ghost btn-sm">
                <i data-lucide="heart"></i>
                <span id="likeCount-${item.id}" class="num">${item.likes || 0} cheers</span>
            </button>
            <button onclick="shareArticle(${JSON.stringify(plainText(item.title)).replace(/"/g, '&quot;')})" class="btn btn-ghost btn-sm">
                <i data-lucide="share-2"></i>
                Share
            </button>
        </div>
    `;

    modal.classList.remove('hidden');
    refreshIcons();
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    if (modal) modal.classList.add('hidden');
}

function likeArticle(newsId) {
    const store = getStore();
    const item = store.news.find(n => n.id === newsId);
    if (!item) return;

    item.likes = (item.likes || 100) + 1;
    saveStore(store);

    const span = document.getElementById(`likeCount-${newsId}`);
    if (span) {
        span.textContent = `${item.likes} cheers`;
    }
}

function shareArticle(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this sports update from AVAHAN College Sports Committee: ${title}`,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(`${title} - Read more on AVAHAN Sports Portal: ${window.location.href}`);
        alert('Link copied');
    }
}

// =========================================================================
// 3. REGISTRATIONS & TOURNAMENTS
// =========================================================================
function renderTournaments() {
    const store = getStore();
    const grid = document.getElementById('tournamentsGrid');
    const select = document.getElementById('regTournamentSelect');
    if (!grid) return;

    const tournaments = store.tournaments || [];

    grid.innerHTML = tournaments.map(tourn => {
        const open = tourn.status === 'OPEN';
        const heads = (tourn.heads || '').split('|').map(h => h.trim()).filter(Boolean);
        return `
        <article class="card tourn-card">
            <div class="tourn-art">
                <img src="${resolveArt(tourn.banner, tourn.sport)}" alt="" loading="lazy">
                <span class="status ${open ? '' : 'closed'}">${open ? 'Open' : 'Closed'}</span>
            </div>
            <div class="tourn-body">
                <div>
                    <span class="sport">${escapeHtml(tourn.sport)}</span>
                    <h3>${escapeHtml(tourn.name)}</h3>
                </div>
                <ul class="facts">
                    <li><i data-lucide="users"></i><span>${escapeHtml(tourn.teamSize || 'Open squad')}</span></li>
                    <li><i data-lucide="map-pin"></i><span>${escapeHtml(tourn.venue || 'VCET ground')}</span></li>
                    <li><i data-lucide="calendar"></i><span>${escapeHtml(tourn.eventDates || 'Jan 09 - Jan 11, 2027')}</span></li>
                </ul>
                ${heads.length ? `<div class="heads"><b>Event heads</b>${heads.map(escapeHtml).join('<br>')}</div>` : ''}
                <button onclick="openRegistrationModal('${tourn.id}')" class="btn btn-block" ${open ? '' : 'disabled'}>
                    ${open ? 'Register squad' : 'Registration closed'}
                </button>
            </div>
        </article>`;
    }).join('');

    // Populate registration form select dropdown
    if (select) {
        select.innerHTML = tournaments.map(t => `
            <option value="${t.id}" data-sport="${t.sport}" data-min="${t.minPlayers || 1}">${t.name}</option>
        `).join('');
    }

    refreshIcons();
}

function openRegistrationModal(tournamentId) {
    const store = getStore();
    const modal = document.getElementById('registrationModal');
    const select = document.getElementById('regTournamentSelect');
    const hiddenId = document.getElementById('regTournamentId');
    const sportTag = document.getElementById('regModalSportTag');
    const title = document.getElementById('regModalTitle');
    const limitHint = document.getElementById('regSquadLimitHint');

    if (!modal) return;

    if (tournamentId) {
        const tourn = store.tournaments.find(t => t.id === tournamentId);
        if (tourn) {
            if (select) select.value = tourn.id;
            if (hiddenId) hiddenId.value = tourn.id;
            if (sportTag) sportTag.textContent = `${tourn.sport} · squad registration`;
            if (title) title.textContent = tourn.name;
            if (limitHint) limitHint.textContent = `${tourn.teamSize || 'At least ' + (tourn.minPlayers || 1) + ' players'}`;
        }
    }

    modal.classList.remove('hidden');
    refreshIcons();
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) modal.classList.add('hidden');
}

// When tournament dropdown changes in registration form
const regTournamentSelect = document.getElementById('regTournamentSelect');
if (regTournamentSelect) {
    regTournamentSelect.addEventListener('change', (e) => {
        const store = getStore();
        const tourn = store.tournaments.find(t => t.id === e.target.value);
        if (tourn) {
            document.getElementById('regModalSportTag').textContent = `${tourn.sport} · squad registration`;
            document.getElementById('regModalTitle').textContent = tourn.name;
            document.getElementById('regSquadLimitHint').textContent = `${tourn.teamSize || 'At least ' + (tourn.minPlayers || 1) + ' players'}`;
        }
    });
}

// Handle Team Registration Submission
const teamRegistrationForm = document.getElementById('teamRegistrationForm');
if (teamRegistrationForm) {
    teamRegistrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const store = getStore();
        const tournSelect = document.getElementById('regTournamentSelect');
        const tournId = tournSelect.value;
        const tourn = store.tournaments.find(t => t.id === tournId) || { name: 'Sports Tournament', sport: 'General' };

        const teamName = document.getElementById('regTeamName').value.trim();
        const department = document.getElementById('regDepartment').value;
        const year = document.getElementById('regYear').value;
        const captainName = document.getElementById('regCaptainName').value.trim();
        const captainEmail = document.getElementById('regCaptainEmail').value.trim();
        const captainPhone = document.getElementById('regCaptainPhone').value.trim();
        const playerNamesRaw = document.getElementById('regPlayerNames').value.trim();

        const playersList = playerNamesRaw.split(',').map(p => p.trim()).filter(Boolean);
        const minReq = tourn.minPlayers || 1;

        if (playersList.length < minReq) {
            alert(`${tourn.sport} needs at least ${minReq} players. You entered ${playersList.length}.`);
            return;
        }

        // Generate unique Registration Code
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const sportCode = (tourn.sport || 'SPT').substring(0, 4).toUpperCase();
        const regId = `AVH-2027-${sportCode}-${randNum}`;
        const submittedAt = new Date().toLocaleString();

        const newRegistration = {
            id: regId,
            tournamentId: tournId,
            tournamentName: tourn.name,
            sport: tourn.sport,
            teamName,
            department,
            year,
            captainName,
            captainEmail,
            captainPhone,
            playerCount: playersList.length,
            playerNames: playerNamesRaw,
            submittedAt
        };

        // Save into LocalStorage store
        store.registrations = store.registrations || [];
        store.registrations.unshift(newRegistration);
        saveStore(store);

        // Reset form & close form modal
        teamRegistrationForm.reset();
        closeRegistrationModal();

        // One celebration, for the moment that matters: a squad is in
        if (window.confetti && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#d7263d', '#2346c8', '#ffc82c', '#1f9e5a']
            });
        }

        // Display Official Match Slip Modal
        showRegistrationSlip(newRegistration);
    });
}

function showRegistrationSlip(reg) {
    document.getElementById('slipRegId').textContent = reg.id;
    document.getElementById('slipTournament').textContent = reg.tournamentName;
    document.getElementById('slipTeamName').textContent = reg.teamName;
    document.getElementById('slipDepartment').textContent = `${reg.department} (${reg.year})`;
    document.getElementById('slipCaptain').textContent = `${reg.captainName} (${reg.captainPhone})`;
    document.getElementById('slipPlayerCount').textContent = `${reg.playerCount}`;
    document.getElementById('slipTimestamp').textContent = reg.submittedAt;

    const modal = document.getElementById('slipModal');
    if (modal) modal.classList.remove('hidden');
    refreshIcons();
}

function closeSlipModal() {
    const modal = document.getElementById('slipModal');
    if (modal) modal.classList.add('hidden');
}

function printSlip() {
    window.print();
}

// Check Registration status lookup
function openCheckRegistrationModal() {
    const modal = document.getElementById('checkRegModal');
    const result = document.getElementById('checkRegResult');
    const input = document.getElementById('checkRegInput');
    if (result) result.classList.add('hidden');
    if (input) input.value = '';
    if (modal) modal.classList.remove('hidden');
    refreshIcons();
}

function closeCheckRegistrationModal() {
    const modal = document.getElementById('checkRegModal');
    if (modal) modal.classList.add('hidden');
}

function findRegistration() {
    const query = document.getElementById('checkRegInput').value.trim().toLowerCase();
    const resultDiv = document.getElementById('checkRegResult');
    if (!query) return;

    const store = getStore();
    const match = (store.registrations || []).find(r => 
        r.id.toLowerCase() === query || 
        r.captainName.toLowerCase().includes(query) ||
        r.teamName.toLowerCase().includes(query)
    );

    resultDiv.classList.remove('hidden');
    if (match) {
        resultDiv.innerHTML = `
            <div class="ok" style="display:flex;justify-content:space-between;gap:12px">
                <span>Entry confirmed</span>
                <span class="mono">${escapeHtml(match.id)}</span>
            </div>
            <div style="margin-top:8px">${escapeHtml(match.teamName)} · ${escapeHtml(match.tournamentName)}</div>
            <div class="muted">Captain ${escapeHtml(match.captainName)} · ${escapeHtml(match.department)}</div>
            <button onclick="closeCheckRegistrationModal(); showRegistrationSlip(${JSON.stringify(match).replace(/"/g, '&quot;')})"
                    class="btn btn-secondary btn-block" style="margin-top:12px">
                <i data-lucide="ticket"></i>
                View and print slip
            </button>
        `;
        refreshIcons();
    } else {
        resultDiv.innerHTML = `
            <div class="no">No registration found for "${escapeHtml(query)}"</div>
            <div class="muted" style="margin-top:4px">Check the ID on your slip, or try the captain's name.</div>
        `;
    }
}

// =========================================================================
// 4. SPORTS TRIVIA ZONE
// =========================================================================
function renderTriviaQuestion() {
    const store = getStore();
    const questions = store.trivia || [];
    if (questions.length === 0) return;

    if (currentTriviaIndex >= questions.length) {
        currentTriviaIndex = 0; // Loop or shuffle
    }

    const q = questions[currentTriviaIndex];
    triviaAnswered = false;

    // Badges & Counters
    const sportBadge = document.getElementById('triviaSportBadge');
    const counter = document.getElementById('triviaCounter');
    const questionText = document.getElementById('triviaQuestionText');
    const optionsGrid = document.getElementById('triviaOptionsGrid');
    const explanationBox = document.getElementById('triviaExplanationBox');

    if (sportBadge) sportBadge.textContent = q.sport || 'Sports Trivia';
    if (counter) counter.textContent = `Question ${currentTriviaIndex + 1} of ${questions.length}`;
    if (questionText) questionText.textContent = q.question;
    if (explanationBox) explanationBox.classList.add('hidden');

    // Render Options
    if (optionsGrid) {
        optionsGrid.innerHTML = q.options.map((opt, idx) => `
            <button onclick="handleTriviaAnswer(${idx})" id="triviaOpt-${idx}" class="trivia-opt-btn">
                <span class="key">${String.fromCharCode(65 + idx)}</span>
                <span>${escapeHtml(opt)}</span>
                <span class="mark"></span>
            </button>
        `).join('');
    }

    refreshIcons();
}

function handleTriviaAnswer(selectedIdx) {
    if (triviaAnswered) return;
    triviaAnswered = true;

    const store = getStore();
    const q = store.trivia[currentTriviaIndex];
    const isCorrect = (selectedIdx === q.answer);

    const explanationBox = document.getElementById('triviaExplanationBox');
    const resultTitle = document.getElementById('triviaResultTitle');
    const explanationText = document.getElementById('triviaExplanationText');
    const streakEl = document.getElementById('streakCount');
    const scoreEl = document.getElementById('scoreCount');

    // Highlight options
    q.options.forEach((_, idx) => {
        const btn = document.getElementById(`triviaOpt-${idx}`);
        if (!btn) return;
        btn.disabled = true;

        const mark = btn.querySelector('.mark');
        if (idx === q.answer) {
            btn.classList.add('correct');
            if (mark) mark.innerHTML = '<i data-lucide="check"></i>';
        } else if (idx === selectedIdx && !isCorrect) {
            btn.classList.add('wrong');
            if (mark) mark.innerHTML = '<i data-lucide="x"></i>';
        }
    });

    if (isCorrect) {
        triviaStreak += 1;
        triviaScore += 10;

        if (resultTitle) {
            resultTitle.className = 'result ok';
            resultTitle.textContent = 'Correct, +10 points';
        }
    } else {
        triviaStreak = 0;
        if (resultTitle) {
            resultTitle.className = 'result no';
            resultTitle.textContent = `Not quite. The answer is ${q.options[q.answer]}`;
        }
    }

    if (streakEl) streakEl.textContent = triviaStreak;
    if (scoreEl) scoreEl.textContent = triviaScore;
    if (explanationText) explanationText.textContent = q.explanation || '';
    if (explanationBox) explanationBox.classList.remove('hidden');

    refreshIcons();
}

// Next question button
const triviaNextBtn = document.getElementById('triviaNextBtn');
if (triviaNextBtn) {
    triviaNextBtn.addEventListener('click', () => {
        const store = getStore();
        currentTriviaIndex = (currentTriviaIndex + 1) % store.trivia.length;
        renderTriviaQuestion();
    });
}

// Reset quiz button
const triviaResetBtn = document.getElementById('triviaResetBtn');
if (triviaResetBtn) {
    triviaResetBtn.addEventListener('click', () => {
        currentTriviaIndex = 0;
        triviaScore = 0;
        triviaStreak = 0;
        const streakEl = document.getElementById('streakCount');
        const scoreEl = document.getElementById('scoreCount');
        if (streakEl) streakEl.textContent = '0';
        if (scoreEl) scoreEl.textContent = '0';
        renderTriviaQuestion();
    });
}

// =========================================================================
// 5. GLIMPSES OF PAST YEARS (GALLERY)
// =========================================================================
function renderGallery() {
    const store = getStore();
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    let items = store.gallery || [];

    // Filter by year
    if (currentGalleryYear !== 'ALL') {
        items = items.filter(g => g.year === currentGalleryYear);
    }

    // Filter by type
    if (currentGalleryType !== 'ALL') {
        items = items.filter(g => g.type === currentGalleryType);
    }

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="empty">
                <i data-lucide="image"></i>
                <p>Nothing from this edition yet</p>
            </div>
        `;
        refreshIcons();
        return;
    }

    // On the 4-column desktop grid, stretch the last tile so the final row has no hole
    const smalls = items.length - 1;
    const rem = smalls > 4 ? (smalls - 4) % 4 : 0;
    const lastFill = rem ? `fill-${5 - rem}` : '';

    grid.innerHTML = items.map((item, i) => `
        <button onclick="openMediaModal('${item.id}')" class="tile ${i === 0 ? 'feature' : ''} ${i === items.length - 1 ? lastFill : ''}">
            <img src="${resolveArt(item.thumb || item.url, item.sport)}" alt="" loading="lazy"
                 onerror="this.onerror=null; this.src=artForSport('${escapeHtml(item.sport || '').replace(/'/g, '')}')">
            ${item.type === 'video' ? `<span class="play"><i data-lucide="play"></i></span>` : ''}
            <div class="tile-info">
                <div class="meta-line"><span class="num">${escapeHtml(item.year)}</span><span class="sep"></span><span>${escapeHtml(item.sport || 'Fest')}</span></div>
                <h4>${escapeHtml(item.title)}</h4>
                <p>${escapeHtml(item.caption || '')}</p>
            </div>
        </button>
    `).join('');

    refreshIcons();
}

function getYouTubeEmbedUrl(url) {
    if (!url) return 'https://www.youtube-nocookie.com/embed/H1Qt0MZ2cLQ';
    if (url.includes('embed/')) return url;
    let videoId = '';
    const matchShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (matchShort) videoId = matchShort[1];
    const matchWatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (matchWatch) videoId = matchWatch[1];
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : url;
}

function openRulebookModal() {
    const modal = document.getElementById('rulebookModal');
    if (modal) modal.classList.remove('hidden');
    refreshIcons();
}

function closeRulebookModal() {
    const modal = document.getElementById('rulebookModal');
    if (modal) modal.classList.add('hidden');
}

function openMediaModal(itemId) {
    const store = getStore();
    const item = store.gallery.find(g => g.id === itemId);
    if (!item) return;

    const modal = document.getElementById('mediaModal');
    const container = document.getElementById('mediaContainer');
    const info = document.getElementById('mediaInfo');
    if (!modal || !container || !info) return;

    if (item.type === 'video') {
        const embedUrl = getYouTubeEmbedUrl(item.videoEmbedUrl || item.videoDirectUrl);
        container.innerHTML = `
            <div class="player">
                <iframe src="${embedUrl}" title="${escapeHtml(item.title)}"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
            </div>
        `;
    } else {
        container.innerHTML = `<img src="${resolveArt(item.url || item.thumb, item.sport)}" class="photo" alt="${escapeHtml(item.title)}">`;
    }

    info.innerHTML = `
        <div class="meta-line"><span class="num">AVAHAN ${escapeHtml(item.year)}</span><span class="sep"></span><span>${escapeHtml(item.sport || 'Fest')}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.caption || '')}</p>
        ${item.videoDirectUrl ? `<a href="${item.videoDirectUrl}" target="_blank" rel="noopener" class="link" style="margin-top:12px">Watch on YouTube <i data-lucide="external-link"></i></a>` : ''}
    `;

    modal.classList.remove('hidden');
    refreshIcons();
}

function closeMediaModal() {
    const modal = document.getElementById('mediaModal');
    const container = document.getElementById('mediaContainer');
    if (container) container.innerHTML = '';
    if (modal) modal.classList.add('hidden');
}

// =========================================================================
// 6. EVENT LISTENERS & NAVIGATION
// =========================================================================
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        document.querySelectorAll('.mobile-link, .mobile-link-btn').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // News category filters
    document.querySelectorAll('#newsCategoryFilters .filter-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#newsCategoryFilters .filter-pill').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentNewsCategory = e.currentTarget.dataset.category;
            renderNews();
        });
    });

    // News search input
    const newsSearchInput = document.getElementById('newsSearchInput');
    if (newsSearchInput) {
        newsSearchInput.addEventListener('input', (e) => {
            currentNewsSearch = e.target.value;
            renderNews();
        });
    }

    // Gallery year filters
    document.querySelectorAll('#galleryYearFilters .gallery-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#galleryYearFilters .gallery-pill').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentGalleryYear = e.currentTarget.dataset.year;
            renderGallery();
        });
    });

    // Gallery type filters
    document.querySelectorAll('#galleryTypeFilters .type-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#galleryTypeFilters .type-pill').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentGalleryType = e.currentTarget.dataset.type;
            renderGallery();
        });
    });

    // Contact form submit
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent. The committee will reply on WhatsApp.');
            contactForm.reset();
        });
    }

    // Check registration Enter key
    const checkRegInput = document.getElementById('checkRegInput');
    if (checkRegInput) {
        checkRegInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                findRegistration();
            }
        });
    }

    // Modal background click close
    // Escape closes any open modal
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        ['registrationModal', 'slipModal', 'checkRegModal', 'articleModal', 'rulebookModal', 'adminModal'].forEach(id => {
            const m = document.getElementById(id);
            if (m) m.classList.add('hidden');
        });
        closeMediaModal();
    });

    ['registrationModal', 'slipModal', 'checkRegModal', 'articleModal', 'mediaModal', 'rulebookModal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                    if (modalId === 'mediaModal') {
                        document.getElementById('mediaContainer').innerHTML = '';
                    }
                }
            });
        }
    });
}

// Utility: Format Date nicely
function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}
