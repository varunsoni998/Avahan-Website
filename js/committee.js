/**
 * AVAHAN 2027 · Sports Committee
 *
 * The page shows three levels, in this order:
 *     Faculty Coordinator  →  Heads  →  Deputy Heads
 *
 * HOW TO ADD OR EDIT MEMBERS
 * Add one line per person to COMMITTEE below. Keep the quotes and commas.
 *   name    Full name
 *   level   "Faculty Coordinator", "Head" or "Deputy Head"
 *   post    Optional, their specific post, e.g. "Sports Secretary", "Treasurer".
 *           Shown on their card. Leave "" if they have none.
 *   phone   Optional, shown on the card and tappable to call ("" to hide)
 *   photo   Optional, only if the photo file name is different (see below)
 *
 * People appear in the order you list them. A level with nobody in it is hidden.
 *
 * HOW TO ADD PHOTOS (no code needed)
 * Put each photo in  assets/committee/  named after the person in lowercase
 * with dashes, as a .jpg:   Milind Sonkar  →  assets/committee/milind-sonkar.jpg
 * Until a photo is there, the card shows the person's initials.
 *
 * Example lines (copy, remove the //, fill in):
 *   // { name: "Full Name", level: "Faculty Coordinator", post: "", phone: "" },
 *   // { name: "Full Name", level: "Deputy Head", post: "Deputy Sports Secretary", phone: "" },
 */

const COMMITTEE_LEVELS = [
    { level: "Faculty Coordinator", title: "Faculty Coordinator", plural: "Faculty Coordinators", color: "#2346c8" },
    { level: "Head",                title: "Head",                plural: "Heads",                color: "#d7263d" },
    { level: "Deputy Head",         title: "Deputy Head",         plural: "Deputy Heads",         color: "#1f9e5a" }
];

const COMMITTEE = [
    { name: "Jaydeep Chougule", level: "Faculty Coordinator", post: "", phone: "" },

    { name: "Milind Sonkar", level: "Head", post: "Sports Secretary", phone: "+91 99230 16679" },
    { name: "Aadi", level: "Head", post: "", phone: "" },
    { name: "Akshat", level: "Head", post: "", phone: "" },
    { name: "Chetan", level: "Head", post: "", phone: "" },
    { name: "Dhruv Kotian", level: "Head", post: "", phone: "" },
    { name: "Farhan", level: "Head", post: "", phone: "" },
    { name: "Harsh Uradya", level: "Head", post: "", phone: "" },
    { name: "Hassan", level: "Head", post: "", phone: "" },
    { name: "Jheel", level: "Head", post: "", phone: "" },
    { name: "Khushtar", level: "Head", post: "", phone: "" },
    { name: "Kimayaa", level: "Head", post: "", phone: "" },
    { name: "Mehek Rajput", level: "Head", post: "", phone: "" },
    { name: "Parth", level: "Head", post: "", phone: "" },
    { name: "Pranav Balgude", level: "Head", post: "", phone: "" },
    { name: "Prasath", level: "Head", post: "", phone: "" },
    { name: "Seon D'Silva", level: "Head", post: "", phone: "" },
    { name: "Shravan", level: "Head", post: "", phone: "" },
    { name: "Shruti", level: "Head", post: "", phone: "" },
    { name: "Yash Patil", level: "Head", post: "", phone: "" }
];
