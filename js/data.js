/**
 * AVAHAN Sports Committee - Official VCET Data Store
 * Vidyavardhini's College of Engineering & Technology (VCET), Vasai
 * Slogan: #MORE THAN A GAME
 */

const AVAHAN_DEPARTMENTS = [
    "EXTC",
    "VLSI",
    "CIVIL",
    "MECHANICAL",
    "IT",
    "AIDS",
    "CSE-DS",
    "COMPS"
];

/* Department team colours. Each department plays as a team with its own kit. */
const DEPT_INFO = {
    'EXTC':       { name: 'Electronics and Telecom',       color: '#d7263d', text: '#ffffff' },
    'VLSI':       { name: 'VLSI Design',                   color: '#6a3fb5', text: '#ffffff' },
    'CIVIL':      { name: 'Civil Engineering',             color: '#f26a1b', text: '#ffffff' },
    'MECHANICAL': { name: 'Mechanical Engineering',        color: '#3d4654', text: '#ffffff' },
    'IT':         { name: 'Information Technology',        color: '#2346c8', text: '#ffffff' },
    'AIDS':       { name: 'AI and Data Science',           color: '#0f9b8e', text: '#ffffff' },
    'CSE-DS':     { name: 'Computer Science, Data Science', color: '#1f9e5a', text: '#ffffff' },
    'COMPS':      { name: 'Computer Engineering',          color: '#ffc82c', text: '#16130e' }
};
const DEPT_SHORT = { 'MECHANICAL': 'MECH' };

/* Court diagrams, one per sport, in bold poster colours. Drawn in code so
   every card shows the real playing surface. */
const COURT_ART = (() => {
    const draw = (bg, inner, opts = {}) => {
        const stroke = opts.stroke || '#ffffff';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice"><rect width="800" height="450" fill="${bg}"/><g fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="40">${[0,1,2,3,4,5,6].map(i => `<line x1="${i*128+20}" y1="0" x2="${i*128+20}" y2="450"/>`).join('')}</g>${opts.extra || ''}<g fill="none" stroke="${stroke}" stroke-opacity="0.95" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    };
    const lanes = () => {
        let p = '';
        for (let i = 0; i < 6; i++) {
            const r = 56 + i * 28;
            p += `<path d="M800 ${225 - r} H330 A${r} ${r} 0 0 0 330 ${225 + r} H800"/>`;
        }
        return p + '<line x1="650" y1="40" x2="650" y2="410" stroke-dasharray="4 10"/>';
    };
    const chessSquares = () => {
        let s = '';
        for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
            if ((r + c) % 2) s += `<rect x="${236 + c * 41}" y="${61 + r * 41}" width="41" height="41" fill="#16130e"/>`;
        }
        return s;
    };
    return {
        cricket: draw('#2b9a4f', '<circle cx="400" cy="225" r="360"/><circle cx="400" cy="225" r="180" stroke-dasharray="10 14"/><rect x="250" y="206" width="300" height="38" fill="#d9c58f" fill-opacity="0.55"/><line x1="276" y1="186" x2="276" y2="264"/><line x1="524" y1="186" x2="524" y2="264"/>'),
        football: draw('#127a52', '<rect x="60" y="45" width="680" height="360" rx="40"/><line x1="400" y1="45" x2="400" y2="405"/><circle cx="400" cy="225" r="62"/><rect x="60" y="135" width="100" height="180"/><rect x="640" y="135" width="100" height="180"/>'),
        kabaddi: draw('#f26a1b', '<rect x="110" y="70" width="580" height="310"/><line x1="400" y1="70" x2="400" y2="380" stroke-width="8"/><line x1="296" y1="70" x2="296" y2="380"/><line x1="504" y1="70" x2="504" y2="380"/><line x1="254" y1="70" x2="254" y2="380" stroke-dasharray="12 10"/><line x1="546" y1="70" x2="546" y2="380" stroke-dasharray="12 10"/><line x1="110" y1="100" x2="690" y2="100"/><line x1="110" y1="350" x2="690" y2="350"/>'),
        volleyball: draw('#2346c8', '<rect x="130" y="80" width="540" height="290"/><line x1="400" y1="55" x2="400" y2="395" stroke-width="9" stroke="#ffc82c"/><line x1="310" y1="80" x2="310" y2="370"/><line x1="490" y1="80" x2="490" y2="370"/>'),
        badminton: draw('#6a3fb5', '<rect x="110" y="90" width="580" height="270"/><line x1="110" y1="110" x2="690" y2="110"/><line x1="110" y1="340" x2="690" y2="340"/><line x1="400" y1="70" x2="400" y2="380" stroke-width="8" stroke="#ffc82c"/><line x1="332" y1="90" x2="332" y2="360"/><line x1="468" y1="90" x2="468" y2="360"/><line x1="140" y1="90" x2="140" y2="360"/><line x1="660" y1="90" x2="660" y2="360"/><line x1="110" y1="225" x2="332" y2="225"/><line x1="468" y1="225" x2="690" y2="225"/>'),
        tugofwar: draw('#d7263d', '<line x1="400" y1="60" x2="400" y2="390" stroke-width="7"/><line x1="310" y1="130" x2="310" y2="320"/><line x1="490" y1="130" x2="490" y2="320"/><path d="M30 230 C120 214 210 240 300 226 S470 212 560 230 S700 242 770 222" stroke="#f3d9a4" stroke-width="12"/><rect x="392" y="210" width="16" height="36" fill="#ffc82c" stroke="#16130e" stroke-width="3"/>'),
        athletics: draw('#c8462b', lanes()),
        chess: draw('#ffc82c', '<rect x="236" y="61" width="328" height="328"/>', { stroke: '#16130e', extra: chessSquares() }),
        tabletennis: draw('#1a5fb4', '<rect x="150" y="100" width="500" height="250"/><line x1="150" y1="225" x2="650" y2="225" stroke-width="3"/><line x1="400" y1="75" x2="400" y2="375" stroke-width="9" stroke="#16130e"/>'),
        carrom: draw('#e8b26a', '<rect x="220" y="30" width="390" height="390" rx="8" stroke-width="7"/><rect x="280" y="90" width="270" height="270"/><circle cx="415" cy="225" r="54" stroke="#d7263d"/><circle cx="415" cy="225" r="14" fill="#d7263d" stroke="#d7263d"/><circle cx="244" cy="54" r="16" fill="#16130e"/><circle cx="586" cy="54" r="16" fill="#16130e"/><circle cx="244" cy="396" r="16" fill="#16130e"/><circle cx="586" cy="396" r="16" fill="#16130e"/>', { stroke: '#16130e' }),
        armwrestling: draw('#16130e', '<rect x="190" y="100" width="420" height="250" rx="16"/><line x1="400" y1="100" x2="400" y2="350" stroke-dasharray="8 12"/><circle cx="325" cy="225" r="34" stroke="#ffc82c"/><circle cx="475" cy="225" r="34" stroke="#ffc82c"/><rect x="214" y="186" width="40" height="78" rx="8" stroke="#d7263d"/><rect x="546" y="186" width="40" height="78" rx="8" stroke="#d7263d"/>'),
        ground: draw('#2346c8', '<ellipse cx="400" cy="225" rx="350" ry="180"/><ellipse cx="400" cy="225" rx="305" ry="145"/><ellipse cx="400" cy="225" rx="260" ry="112" stroke="#ffc82c"/><rect x="368" y="182" width="64" height="86" fill="#ffc82c" fill-opacity="0.35"/>')
    };
})();

function artForSport(sport) {
    const s = String(sport || '').toLowerCase();
    if (s.includes('cricket')) return COURT_ART.cricket;
    if (s.includes('football') || s.includes('soccer') || s.includes('futsal')) return COURT_ART.football;
    if (s.includes('kabaddi')) return COURT_ART.kabaddi;
    if (s.includes('volley') || s.includes('throw')) return COURT_ART.volleyball;
    if (s.includes('badminton')) return COURT_ART.badminton;
    if (s.includes('tug')) return COURT_ART.tugofwar;
    if (s.includes('athlet') || s.includes('relay') || s.includes('track')) return COURT_ART.athletics;
    if (s.includes('chess')) return COURT_ART.chess;
    if (s.includes('table')) return COURT_ART.tabletennis;
    if (s.includes('carrom')) return COURT_ART.carrom;
    if (s.includes('arm')) return COURT_ART.armwrestling;
    return COURT_ART.ground;
}

/* Old generated artwork and empty images fall back to the court diagram.
   Real photos and URLs are kept as they are. */
function resolveArt(src, sport) {
    if (!src || String(src).startsWith('data:image/svg+xml')) return artForSport(sport);
    return src;
}

const SPORTS_ART = {
    cricket: COURT_ART.cricket,
    football: COURT_ART.football,
    kabaddi: COURT_ART.kabaddi,
    volleyball: COURT_ART.volleyball,
    badminton: COURT_ART.badminton,
    tugofwar: COURT_ART.tugofwar,
    athletics: COURT_ART.athletics,
    chess: COURT_ART.chess,
    tabletennis: COURT_ART.tabletennis,
    carrom: COURT_ART.carrom,
    armwrestling: COURT_ART.armwrestling,
    torch: COURT_ART.ground
};

/* Department standings. Every edition starts at 0 for every department.
   The committee enters real points and medals from the admin screen. */
function makeEmptyLeaderboard(editions) {
    const board = { editions: editions.slice(), points: {} };
    editions.forEach(y => {
        board.points[y] = {};
        AVAHAN_DEPARTMENTS.forEach(d => { board.points[y][d] = { points: 0, gold: 0, silver: 0, bronze: 0 }; });
    });
    return board;
}

const AVAHAN_DEFAULT_DATA = {
    committee: {
        name: "VCET Sports Committee",
        festName: "AVAHAN 2027",
        slogan: "#MORE THAN A GAME",
        university: "Vidyavardhini's College of Engineering and Technology",
        address: "K.T. Marg, Vasai (W) - 401201",
        dates: "09th Jan to 11th Jan 2027",
        email: "sports.avahan@vcet.edu.in",
        instagram: "https://www.instagram.com/avahan_vcet?exln=Ync0bjRrNHZ3Mm41",
        whatsapp: "https://chat.whatsapp.com/KCJFNR4DXec84xSB6KgYnB",
        youtube: "https://youtube.com/@vcetavahan4508",
        coordinators: [
            { name: "Milind Sonkar", phone: "+91 99230 16679", role: "Sports Secretary" }
        ],
        rulebookPdf: "assets/AVAHAN_2027_Rulebook.pdf"
    },
    ticker: [
        "AVAHAN 2027 runs 9–11 January on the VCET campus",
        "Box and overarm cricket registrations are open for all 8 departments",
        "Join the AVAHAN WhatsApp community for fixture alerts and slot updates",
        "The 2027 rulebook PDF is on the portal"
    ],
    news: [
        {
            id: "news-1",
            title: "VCET AVAHAN 2027 Official Rulebook and Dates Released",
            category: "Mega Event",
            badge: "Jan 09-11",
            date: "2026-11-04",
            summary: "Vidyavardhini's College of Engineering and Technology (VCET) announces the flagship annual sports fest AVAHAN 2027 scheduled from 09th Jan to 11th Jan.",
            content: "AVAHAN 2027 is back with 15 intense sports disciplines across 3 days of high-octane sporting action. Inter-department bragging rights are up for grabs across all 8 branches: EXTC, VLSI, CIVIL, MECHANICAL, IT, AIDS, CSE-DS, and COMPS. Register your team before slots close.",
            image: SPORTS_ART.torch,
            author: "Milind Sonkar",
            likes: 248
        },
        {
            id: "news-2",
            title: "Inter-Department Box & Overarm Cricket Trophy Details Unveiled",
            category: "Tournament Alert",
            badge: "Registrations Open",
            date: "2026-11-03",
            summary: "Box Cricket (8+2 players) and Overarm Cricket (11+3 players) format announced. White ball knockout rounds with 4 overs per match (2,1,1).",
            content: "Event Heads Pratham Shetty (+91 81084 58431) and Vedant Chaudhari (+91 84079 54583) have announced that teams must report to the ground 30 minutes prior to match time. Girls Cricket format will feature 6+3 players across 3 overs.",
            image: SPORTS_ART.cricket,
            author: "Cricket Event Desk",
            likes: 185
        },
        {
            id: "news-3",
            title: "Rink Football & Kabaddi on Pro Mat: Slots Open for Branch Squads",
            category: "Tournament Alert",
            badge: "High Octane",
            date: "2026-11-02",
            summary: "Kabaddi will be played on professional mats (7+5 players). Rink Football features 6 players on pitch + 3 substitutes with sudden-death tiebreakers.",
            content: "College ID cards and shoes are mandatory for all participants. Event heads Dhruv Save & Soham Patkar (Kabaddi) and Yash Patil & Nirmit Breed (Rink Football) confirm tight schedules with rolling substitutions.",
            image: SPORTS_ART.football,
            author: "Football & Kabaddi Heads",
            likes: 192
        },
        {
            id: "news-4",
            title: "COMPS & IT Take Top Honors in Intra-College Autumn Pre-Season Clash",
            category: "College Victory",
            badge: "Pre-Season",
            date: "2026-10-28",
            summary: "COMPS lifted the Pre-Season Table Tennis cup while AIDS and MECHANICAL battled in a memorable Volleyball nail-biter.",
            content: "With the main AVAHAN fest arriving in January, teams across all departments have entered rigorous training regimens on the VCET campus grounds.",
            image: SPORTS_ART.volleyball,
            author: "VCET Sports Council",
            likes: 145
        }
    ],
    tournaments: [
        {
            id: "tourn-box-cricket",
            name: "Box Cricket Championship 2027",
            sport: "Box Cricket",
            tag: "Flagship Event",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Box Arena",
            teamSize: "8 Playing + 2 Subs",
            minPlayers: 8,
            maxPlayers: 10,
            fee: "Free for VCET Students",
            rules: "First knockout round of 4 overs (2,1,1). Both teams report 30 mins prior. Umpire & Event Head decision final.",
            heads: "Vinayak Kokkul (+91 87677 76929) | Viresh Rathod (+91 78750 54595)",
            status: "OPEN",
            banner: SPORTS_ART.cricket
        },
        {
            id: "tourn-overarm-cricket",
            name: "Overarm Cricket League 2027",
            sport: "Overarm Cricket",
            tag: "Main Oval",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Main Sports Ground",
            teamSize: "11 Playing + 3 Subs",
            minPlayers: 11,
            maxPlayers: 14,
            fee: "Free for VCET Students",
            rules: "11+3 players per team. 4 overs (2,1,1). Players allowed to carry own bats. All basic ICC cricket rules apply.",
            heads: "Pratham Shetty (+91 81084 58431) | Vedant Chaudhari (+91 84079 54583)",
            status: "OPEN",
            banner: SPORTS_ART.cricket
        },
        {
            id: "tourn-rink-football",
            name: "Rink Football Cup 2027",
            sport: "Rink Football",
            tag: "Fast & Furious",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Turf Court",
            teamSize: "6 Playing + 3 Subs",
            minPlayers: 6,
            maxPlayers: 9,
            fee: "Free for VCET Students",
            rules: "10 min per half with 5 min break. In tie: 3 penalties each, then sudden death. Shoes mandatory.",
            heads: "Yash Patil (+91 84212 01306) | Nirmit Breed (+91 93569 87841)",
            status: "OPEN",
            banner: SPORTS_ART.football
        },
        {
            id: "tourn-kabaddi",
            name: "Pro Kabaddi Championship 2027",
            sport: "Kabaddi",
            tag: "Mat Battle",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Indoor Mat Arena",
            teamSize: "7 Playing + 5 Subs",
            minPlayers: 7,
            maxPlayers: 12,
            fee: "Free for VCET Students",
            rules: "Played on mat in accordance with Pro Kabaddi rules. Two halves of 10 mins each with 3 min break. Shoes compulsory.",
            heads: "Dhruv Save (+91 98238 25212) | Soham Patkar (+91 87884 91221)",
            status: "OPEN",
            banner: SPORTS_ART.kabaddi
        },
        {
            id: "tourn-volleyball",
            name: "Volleyball Spikers Clash 2027",
            sport: "Volleyball",
            tag: "Best of 3 Sets",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Volleyball Court",
            teamSize: "6 Playing + 3 Subs",
            minPlayers: 6,
            maxPlayers: 9,
            fee: "Free for VCET Students",
            rules: "Best of 3 sets of 15/21 points. No rotation rules. Full leg crossing center line is foul.",
            heads: "Chaitanya Waingankar (+91 82370 32905) | Harshal Patil (+91 85308 68739)",
            status: "OPEN",
            banner: SPORTS_ART.volleyball
        },
        {
            id: "tourn-badminton",
            name: "Badminton Smash Championship 2027",
            sport: "Badminton",
            tag: "Singles & Doubles",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Indoor Wooden Courts",
            teamSize: "1 to 2 Players",
            minPlayers: 1,
            maxPlayers: 2,
            fee: "Free for VCET Students",
            rules: "Mavis 350 shuttles provided. Carry own rackets. Gum soled shoes required (or barefoot). Diagonal serve compulsory.",
            heads: "Shreyas Pathe (+91 86377 17076) | Bhargavi Atre (+91 90213 25349)",
            status: "OPEN",
            banner: SPORTS_ART.badminton
        },
        {
            id: "tourn-tugofwar",
            name: "Tug of War Heavyweight Clash",
            sport: "Tug of War",
            tag: "Strength & Unity",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Central Ground",
            teamSize: "6 Playing + 3 Subs",
            minPlayers: 6,
            maxPlayers: 9,
            fee: "Free for VCET Students",
            rules: "Weight limit: 540kg (Boys), 480kg (Girls). Best 2 of 3 wins. Both hands on rope at all times. Shoes compulsory.",
            heads: "Paras Jadhav (+91 70715 22444) | Milind Sonkar (+91 99230 16679)",
            status: "OPEN",
            banner: SPORTS_ART.tugofwar
        },
        {
            id: "tourn-girls-cricket",
            name: "Girls Cricket Cup 2027",
            sport: "Girls Cricket",
            tag: "Empower & Strike",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Semicircular Ground",
            teamSize: "6 Playing + 3 Subs",
            minPlayers: 6,
            maxPlayers: 9,
            fee: "Free for VCET Students",
            rules: "Max 2 teams per department. 6+3 players. 3 overs (1,1,1). Super over on tie.",
            heads: "Aditi Rasal (+91 89836 27852) | Viresh Rathod (+91 78750 54595)",
            status: "OPEN",
            banner: SPORTS_ART.cricket
        },
        {
            id: "tourn-throwball",
            name: "Girls Throwball Championship",
            sport: "Throwball",
            tag: "Fast Action",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Throwball Court",
            teamSize: "7 Active + 2 Subs",
            minPlayers: 7,
            maxPlayers: 9,
            fee: "Free for VCET Students",
            rules: "3 sets for 11 points. Ball thrown within 3 seconds of catching with one hand above shoulder.",
            heads: "Arya Vartak (+91 93224 03223) | Mehek Rajput (+91 93269 64177)",
            status: "OPEN",
            banner: SPORTS_ART.volleyball
        },
        {
            id: "tourn-athletics",
            name: "VCET Athletics Meet 2027",
            sport: "Athletics",
            tag: "Track & Field",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Athletic Track",
            teamSize: "Individual / 4x100m Relay",
            minPlayers: 1,
            maxPlayers: 4,
            fee: "Free for VCET Students",
            rules: "Events: 100m, 200m, 4x100m Relay, Shotput. Assigned lanes. False start leads to immediate disqualification.",
            heads: "Anuj Newalkar (+91 88578 60259) | Pranav Balgude (+91 92211 01444)",
            status: "OPEN",
            banner: SPORTS_ART.athletics
        },
        {
            id: "tourn-chess",
            name: "AVAHAN Chess Championship 2027",
            sport: "Chess",
            tag: "Brain Duel",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Auditorium",
            teamSize: "Singles (1) / Dept Team (3)",
            minPlayers: 1,
            maxPlayers: 3,
            fee: "Free for VCET Students",
            rules: "FIDE rules apply. 10 min rapid games (finals 15 min). Departmental Team of 3 or Singles.",
            heads: "Atharva Sane (+91 87677 35084) | Aarya Jadhav (+91 99873 71146)",
            status: "OPEN",
            banner: SPORTS_ART.chess
        },
        {
            id: "tourn-table-tennis",
            name: "Table Tennis Smash Cup 2027",
            sport: "Table Tennis",
            tag: "Singles & Doubles",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "Indoor TT Hall",
            teamSize: "1 to 2 Players",
            minPlayers: 1,
            maxPlayers: 2,
            fee: "Free for VCET Students",
            rules: "Best of 3 sets to 11 points (deuce at 10-all). 2 consecutive serves per player.",
            heads: "Atharv Chavan (+91 77580 47564) | Rohan Parab (+91 76665 88933)",
            status: "OPEN",
            banner: SPORTS_ART.tabletennis
        },
        {
            id: "tourn-carrom",
            name: "VCET Carrom Championship 2027",
            sport: "Carrom",
            tag: "Doubles Showdown",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "VCET Common Room",
            teamSize: "Team of 2",
            minPlayers: 2,
            maxPlayers: 2,
            fee: "Free for VCET Students",
            rules: "Standard carrom federation rules. Team of 2 members must be from the same class/department.",
            heads: "Ganesh Joshi (+91 87679 59024) | Tanvi Patil (+91 76203 90416)",
            status: "OPEN",
            banner: SPORTS_ART.carrom
        },
        {
            id: "tourn-armwrestling",
            name: "Arm Wrestling Showdown 2027",
            sport: "Arm Wrestling",
            tag: "Pure Strength",
            deadline: "2026-12-28",
            eventDates: "Jan 09 - Jan 11, 2027",
            venue: "Main Stage Arena",
            teamSize: "Individual (1)",
            minPlayers: 1,
            maxPlayers: 1,
            fee: "Free for VCET Students",
            rules: "Shoulders square before start. At least one foot on ground. Touchpad pin required to win.",
            heads: "Dhruv Gharat (+91 72761 28403) | Dhruv Kotian (+91 92842 19008)",
            status: "OPEN",
            banner: SPORTS_ART.armwrestling
        }
    ],
    registrations: [
        {
            id: "AVH-2027-CRIC-101",
            tournamentId: "tourn-box-cricket",
            tournamentName: "Box Cricket Championship 2027",
            sport: "Box Cricket",
            teamName: "COMPS Thunder Strikers",
            department: "COMPS",
            year: "3rd Year",
            captainName: "Aditya Raut",
            captainEmail: "aditya.comps@vcet.edu.in",
            captainPhone: "9876501234",
            playerCount: 10,
            playerNames: "Aditya Raut (C), Sahil Kulkarni, Devendra Patil, Rohan Naik, Pranav S, Varun M, Chinmay G, Tanmay D, Harsh V, Omkar P",
            submittedAt: "2026-11-04 15:30"
        },
        {
            id: "AVH-2027-KBD-102",
            tournamentId: "tourn-kabaddi",
            tournamentName: "Pro Kabaddi Championship 2027",
            sport: "Kabaddi",
            teamName: "Mechanical Raiders",
            department: "MECHANICAL",
            year: "4th Year",
            captainName: "Siddhesh More",
            captainEmail: "siddhesh.mech@vcet.edu.in",
            captainPhone: "9811223344",
            playerCount: 12,
            playerNames: "Siddhesh More (C), Gaurav Tare, Yashwant P, Balraj Gill, Sanket D, Roshan K, Aniket W, Mayur S, Tejas P, Hitesh B, Sumit J, Prathamesh R",
            submittedAt: "2026-11-04 16:45"
        },
        {
            id: "AVH-2027-FB-103",
            tournamentId: "tourn-rink-football",
            tournamentName: "Rink Football Cup 2027",
            sport: "Rink Football",
            teamName: "AIDS Dynamo FC",
            department: "AIDS",
            year: "2nd Year",
            captainName: "Farhan Qureshi",
            captainEmail: "farhan.aids@vcet.edu.in",
            captainPhone: "9822334455",
            playerCount: 8,
            playerNames: "Farhan Qureshi (C), Kevin D'souza, Samar Patel, Ayush Roy, Neil Fernandes, Shlok Sharma, Manasvi K, Rohit G",
            submittedAt: "2026-11-05 10:15"
        }
    ],
    trivia: [
        {
            id: 1,
            sport: "Cricket",
            question: "Who holds the record for the highest individual score in Men's One Day Internationals (ODIs)?",
            options: ["Martin Guptill (237*)", "Rohit Sharma (264)", "Virender Sehwag (219)", "Chris Gayle (215)"],
            answer: 1,
            explanation: "Rohit Sharma smashed a legendary 264 runs off 173 balls against Sri Lanka at Eden Gardens, Kolkata on 13 November 2014."
        },
        {
            id: 2,
            sport: "Kabaddi",
            question: "In standard Pro Kabaddi rules, what is the maximum duration permitted for an individual raid?",
            options: ["20 seconds", "25 seconds", "30 seconds", "40 seconds"],
            answer: 2,
            explanation: "Each raid in standard kabaddi has a strict time limit of 30 seconds."
        },
        {
            id: 3,
            sport: "Football",
            question: "Which nation won the FIFA Men's World Cup 2022 held in Qatar in a memorable penalty shootout?",
            options: ["France", "Argentina", "Croatia", "Morocco"],
            answer: 1,
            explanation: "Lionel Messi led Argentina to a 4-2 penalty shootout victory over France following an exhilarating 3-3 draw."
        },
        {
            id: 4,
            sport: "Olympics",
            question: "What was Neeraj Chopra's gold medal-winning javelin throw distance at Tokyo 2020?",
            options: ["86.48 m", "87.58 m", "88.13 m", "89.94 m"],
            answer: 1,
            explanation: "Neeraj Chopra threw 87.58 m on August 7, 2021, winning India's historic first-ever Olympic track and field gold medal."
        },
        {
            id: 5,
            sport: "Badminton",
            question: "How many points does a player or pair need to win a standard BWF international badminton game?",
            options: ["15 points", "21 points", "25 points", "11 points"],
            answer: 1,
            explanation: "Standard BWF badminton matches are played as best-of-three games to 21 points with a 2-point clear margin required in case of deuce (capped at 30)."
        },
        {
            id: 6,
            sport: "Basketball",
            question: "Which player has scored the most total regular-season points in NBA history?",
            options: ["Michael Jordan", "Kareem Abdul-Jabbar", "LeBron James", "Kobe Bryant"],
            answer: 2,
            explanation: "LeBron James surpassed Kareem Abdul-Jabbar's 38,387 points on February 7, 2023, becoming the NBA's all-time scoring leader."
        },
        {
            id: 7,
            sport: "Athletics",
            question: "In what year did Usain Bolt set the unbroken 100m world record of 9.58 seconds?",
            options: ["2008 Beijing", "2009 Berlin", "2012 London", "2016 Rio"],
            answer: 1,
            explanation: "Usain Bolt ran 9.58s at the World Athletics Championships in Berlin on 16 August 2009."
        },
        {
            id: 8,
            sport: "Volleyball",
            question: "How many maximum ball touches are allowed per side before the ball must cross the net in volleyball?",
            options: ["2 touches", "3 touches", "4 touches", "5 touches"],
            answer: 1,
            explanation: "Teams have up to 3 touches (not counting a block contact) to return the ball over the net."
        }
    ],
    leaderboard: makeEmptyLeaderboard(['2027', '2026', '2025', '2024', '2023', '2022']),
    gallery: [
        {
            id: "gal-2025-aftermovie",
            year: "2025",
            sport: "Fest Aftermovie",
            type: "video",
            title: "VCET AVAHAN 2025 Official Aftermovie",
            caption: "Relive 3 electric days of passion, athleticism, adrenaline, and triumphs from AVAHAN 2025.",
            videoEmbedUrl: "https://www.youtube-nocookie.com/embed/H1Qt0MZ2cLQ",
            videoDirectUrl: "https://youtu.be/H1Qt0MZ2cLQ?si=58g2Ego_L3TFR-az",
            thumb: "https://img.youtube.com/vi/H1Qt0MZ2cLQ/hqdefault.jpg"
        },
        {
            id: "gal-2023-aftermovie",
            year: "2023",
            sport: "Fest Aftermovie",
            type: "video",
            title: "VCET AVAHAN 2023 Highlights & Triumphs",
            caption: "The spirit of sportsmanship, roar of the crowd, and iconic championship moments from AVAHAN 2023.",
            videoEmbedUrl: "https://www.youtube-nocookie.com/embed/83ZDYcDFFkU",
            videoDirectUrl: "https://youtu.be/83ZDYcDFFkU?si=99_A1XjU5rlprpj0",
            thumb: "https://img.youtube.com/vi/83ZDYcDFFkU/hqdefault.jpg"
        },
        {
            id: "gal-2022-aftermovie",
            year: "2022",
            sport: "Fest Aftermovie",
            type: "video",
            title: "VCET AVAHAN 2022 Memories & Action",
            caption: "Throwback to the high-voltage return of AVAHAN sports festival on the VCET campus ground in 2022.",
            videoEmbedUrl: "https://www.youtube-nocookie.com/embed/v5vAzR6UEYE",
            videoDirectUrl: "https://youtu.be/v5vAzR6UEYE?si=_GjVsFX7p0s7DoMV",
            thumb: "https://img.youtube.com/vi/v5vAzR6UEYE/hqdefault.jpg"
        },
        {
            id: "gal-cricket-2025",
            year: "2025",
            sport: "Box Cricket",
            type: "image",
            title: "Final Over Super Thriller - Avahan 2025",
            caption: "Nail-biting box cricket finale under the floodlights at VCET Box Arena.",
            url: SPORTS_ART.cricket,
            thumb: SPORTS_ART.cricket
        },
        {
            id: "gal-kabaddi-2025",
            year: "2025",
            sport: "Kabaddi",
            type: "image",
            title: "Super Tackle on Mat - Avahan 2025",
            caption: "High impact defense during the final moments of the Inter-Department Kabaddi title clash.",
            url: SPORTS_ART.kabaddi,
            thumb: SPORTS_ART.kabaddi
        },
        {
            id: "gal-football-2024",
            year: "2024",
            sport: "Rink Football",
            type: "image",
            title: "Sudden Death Penalty Decider - Avahan 2024",
            caption: "Tense moments as the winning penalty kick sealed the Rink Football championship trophy.",
            url: SPORTS_ART.football,
            thumb: SPORTS_ART.football
        },
        {
            id: "gal-tugofwar-2024",
            year: "2024",
            sport: "Tug of War",
            type: "image",
            title: "The Battle of Grit & Power - Avahan 2024",
            caption: "Roar of the VCET crowd during the 540kg heavyweight Tug of War final pull.",
            url: SPORTS_ART.tugofwar,
            thumb: SPORTS_ART.tugofwar
        },
        {
            id: "gal-badminton-2023",
            year: "2023",
            sport: "Badminton",
            type: "image",
            title: "Badminton Smash Finale - Avahan 2023",
            caption: "Incredible rallies at the VCET Indoor Wooden Court with Mavis 350 shuttles.",
            url: SPORTS_ART.badminton,
            thumb: SPORTS_ART.badminton
        }
    ]
};

// Initialize localStorage with VCET AVAHAN data
function initializeStore() {
    const existing = localStorage.getItem('avahan_data_2027');
    if (!existing || existing.includes('tourn-cricket-2027-legacy') || !existing.includes('EXTC')) {
        localStorage.setItem('avahan_data_2027', JSON.stringify(AVAHAN_DEFAULT_DATA));
    }
}

function getStore() {
    initializeStore();
    try {
        const data = JSON.parse(localStorage.getItem('avahan_data_2027')) || AVAHAN_DEFAULT_DATA;
        // Older saved data has no standings yet
        if (!data.leaderboard) data.leaderboard = makeEmptyLeaderboard(['2027', '2026', '2025', '2024', '2023', '2022']);
        return data;
    } catch (e) {
        console.error("Error reading store", e);
        return AVAHAN_DEFAULT_DATA;
    }
}

function saveStore(data) {
    localStorage.setItem('avahan_data_2027', JSON.stringify(data));
}
