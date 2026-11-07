# AVAHAN 2027 - VCET Sports Committee Web Portal
> **Vidyavardhini's College of Engineering and Technology (VCET)**, K.T. Marg, Vasai (W) - 401201  
> **Fest Dates:** 09th Jan to 11th Jan 2027  
> **Motto / Slogan:** #MORE THAN A GAME

---

## Eligible Departments
The registration forms, squad rosters, and leaderboards strictly support all 8 VCET departments:
1. **EXTC** (Electronics & Telecommunication)
2. **VLSI** (VLSI Design)
3. **CIVIL** (Civil Engineering)
4. **MECHANICAL** (Mechanical Engineering)
5. **IT** (Information Technology)
6. **AIDS** (Artificial Intelligence & Data Science)
7. **CSE-DS** (Computer Science & Engineering - Data Science)
8. **COMPS** (Computer Engineering)

---

## Quick Start (Run Locally)

You can run the website immediately without any software dependencies:
- **Option 1 (Easiest):** Double-click `index.html` in your file explorer. It will open in Google Chrome, Microsoft Edge, or any modern web browser.
- **Option 2 (Python Local Server):**
  ```powershell
  python -m http.server 3000
  ```
  Then open `http://localhost:3000` in your browser.

---

## Design
- **Direction:** varsity sports poster. Cream paper, ink outlines, bold blocks of red, royal blue, yellow and green
- **Departments as teams:** each of the 8 departments has its own jersey colour (`DEPT_INFO` in `js/data.js`), used in the hero, the standings and the admin tables
- **Type:** Anton for headlines, Graduate for jersey numbers, Barlow for everything else, JetBrains Mono for registration IDs
- **Sport artwork:** each sport card draws its own court in code (`COURT_ART` in `js/data.js`). Uploaded photos replace it automatically
- Redesign pass based on unslop by Damir Sokolovsky (@heydamir), CC BY 4.0

## Department standings (leaderboard)
- Shows an all-time table plus one table per edition, ranked by points, then gold medals
- Every edition starts at 0. Nothing is made up
- To update: Committee login → **Standings** tab → pick the edition → type each department's points and medals → **Save standings**
- Use **Add an edition** to enter results from older years, so the all-time table builds up

---

## Official Sports & Events Included (from VCET Rulebook)
1. **Box Cricket** (8+2 players, 4 overs 2,1,1)
2. **Overarm Cricket** (11+3 players, 4 overs 2,1,1)
3. **Rink Football** (6+3 players, 10 min halves)
4. **Pro Kabaddi** (7+5 players, Mat surface)
5. **Volleyball** (6+3 players, Best of 3 sets)
6. **Badminton** (Singles & Doubles, Mavis 350)
7. **Tug of War** (6+3 players, 540kg Boys / 480kg Girls)
8. **Girls Cricket** (6+3 players, 3 overs 1,1,1)
9. **Girls Throwball** (7+2 players, 3 sets for 11 pts)
10. **Athletics** (100m, 200m, 4x100m Relay, Shotput)
11. **Chess** (Rapid Singles & Departmental Team of 3)
12. **Table Tennis** (Singles & Doubles)
13. **Carrom** (Classwise Doubles)
14. **Arm Wrestling** (Knockout Pin)
15. **Footvolley** (3+1 players)

---

## Official Social & Community Links
- **WhatsApp Community:** [https://chat.whatsapp.com/KCJFNR4DXec84xSB6KgYnB](https://chat.whatsapp.com/KCJFNR4DXec84xSB6KgYnB)
- **Instagram:** [@avahan_vcet](https://www.instagram.com/avahan_vcet?exln=Ync0bjRrNHZ3Mm41)
- **YouTube:** [@vcetavahan4508](https://youtube.com/@vcetavahan4508)
- **Official Rulebook PDF:** Located at `assets/AVAHAN_2027_Rulebook.pdf`
- **Past Video Highlights:**
  - 2025: `https://youtu.be/H1Qt0MZ2cLQ`
  - 2023: `https://youtu.be/83ZDYcDFFkU`
  - 2022: `https://youtu.be/v5vAzR6UEYE`

---

## Sports Secretary
- **Milind Sonkar:** +91 99230 16679

---

## Committee Admin Portal
- **Default PIN:** `avahan@2027`
- **Features:** Post bulletins, launch new tournament forms, download all team registrations to CSV/Excel, add photos/YouTube videos, and update trivia.
