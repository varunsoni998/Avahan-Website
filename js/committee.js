/**
 * AVAHAN 2027 · Sports Committee, arranged by designation
 *
 * HOW TO ADD OR EDIT MEMBERS
 * Add one line per person to COMMITTEE below. Keep the quotes and commas.
 *   name         Full name
 *   designation  Their post, e.g. "Joint Sports Secretary", "Treasurer"
 *   phone        Shown on the card and tappable to call (leave "" to hide)
 *   sports       Optional, the sport(s) an Event Head runs, e.g. ["Kabaddi"]
 *   photo        Optional, only if the photo file name is different (see below)
 *
 * The page groups people by designation in the order of DESIGNATION_ORDER.
 * A designation not in that list still shows, after the listed ones.
 * Designations with nobody in them are hidden automatically.
 *
 * HOW TO ADD PHOTOS (no code needed)
 * Put each photo in  assets/committee/  named after the person in lowercase
 * with dashes, as a .jpg:   Milind Sonkar  →  assets/committee/milind-sonkar.jpg
 * Until a photo is there, the card shows the person's initials.
 */

const DESIGNATION_ORDER = [
    "Faculty In-charge",
    "Sports Secretary",
    "Joint Sports Secretary",
    "General Secretary",
    "Treasurer",
    "Joint Treasurer",
    "Technical Head",
    "Publicity Head",
    "Design Head",
    "Event Head",
    "Committee Member"
];

const COMMITTEE = [
    { name: "Milind Sonkar",        designation: "Sports Secretary", phone: "+91 99230 16679", sports: ["Tug of War"] },

    { name: "Vinayak Kokkul",       designation: "Event Head", phone: "+91 87677 76929", sports: ["Box Cricket"] },
    { name: "Viresh Rathod",        designation: "Event Head", phone: "+91 78750 54595", sports: ["Box Cricket", "Girls Cricket"] },
    { name: "Pratham Shetty",       designation: "Event Head", phone: "+91 81084 58431", sports: ["Overarm Cricket"] },
    { name: "Vedant Chaudhari",     designation: "Event Head", phone: "+91 84079 54583", sports: ["Overarm Cricket"] },
    { name: "Aditi Rasal",          designation: "Event Head", phone: "+91 89836 27852", sports: ["Girls Cricket"] },
    { name: "Yash Patil",           designation: "Event Head", phone: "+91 84212 01306", sports: ["Rink Football"] },
    { name: "Nirmit Breed",         designation: "Event Head", phone: "+91 93569 87841", sports: ["Rink Football"] },
    { name: "Dhruv Save",           designation: "Event Head", phone: "+91 98238 25212", sports: ["Kabaddi"] },
    { name: "Soham Patkar",         designation: "Event Head", phone: "+91 87884 91221", sports: ["Kabaddi"] },
    { name: "Chaitanya Waingankar", designation: "Event Head", phone: "+91 82370 32905", sports: ["Volleyball"] },
    { name: "Harshal Patil",        designation: "Event Head", phone: "+91 85308 68739", sports: ["Volleyball"] },
    { name: "Arya Vartak",          designation: "Event Head", phone: "+91 93224 03223", sports: ["Throwball"] },
    { name: "Mehek Rajput",         designation: "Event Head", phone: "+91 93269 64177", sports: ["Throwball"] },
    { name: "Shreyas Pathe",        designation: "Event Head", phone: "+91 86377 17076", sports: ["Badminton"] },
    { name: "Bhargavi Atre",        designation: "Event Head", phone: "+91 90213 25349", sports: ["Badminton"] },
    { name: "Paras Jadhav",         designation: "Event Head", phone: "+91 70715 22444", sports: ["Tug of War"] },
    { name: "Anuj Newalkar",        designation: "Event Head", phone: "+91 88578 60259", sports: ["Athletics"] },
    { name: "Pranav Balgude",       designation: "Event Head", phone: "+91 92211 01444", sports: ["Athletics"] },
    { name: "Atharva Sane",         designation: "Event Head", phone: "+91 87677 35084", sports: ["Chess"] },
    { name: "Aarya Jadhav",         designation: "Event Head", phone: "+91 99873 71146", sports: ["Chess"] },
    { name: "Atharv Chavan",        designation: "Event Head", phone: "+91 77580 47564", sports: ["Table Tennis"] },
    { name: "Rohan Parab",          designation: "Event Head", phone: "+91 76665 88933", sports: ["Table Tennis"] },
    { name: "Ganesh Joshi",         designation: "Event Head", phone: "+91 87679 59024", sports: ["Carrom"] },
    { name: "Tanvi Patil",          designation: "Event Head", phone: "+91 76203 90416", sports: ["Carrom"] },
    { name: "Dhruv Gharat",         designation: "Event Head", phone: "+91 72761 28403", sports: ["Arm Wrestling"] },
    { name: "Dhruv Kotian",         designation: "Event Head", phone: "+91 92842 19008", sports: ["Arm Wrestling"] }
];
