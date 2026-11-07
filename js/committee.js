/**
 * AVAHAN 2027 · Sports Committee members
 *
 * HOW TO ADD PHOTOS (no code needed)
 * Put each person's photo in the folder  assets/committee/
 * named after them in lowercase with dashes, as a .jpg:
 *     Milind Sonkar   →  assets/committee/milind-sonkar.jpg
 *     Aarya Jadhav    →  assets/committee/aarya-jadhav.jpg
 * The page picks it up automatically. Until a photo is there, the card
 * shows the person's initials. Square photos (e.g. 600 × 600) look best.
 * To use a different file name, set  photo: "assets/committee/anything.png"
 *
 * HOW TO EDIT MEMBERS
 * Change names, roles or phone numbers below. Keep the quotes and commas.
 * role     The person's title on the committee
 * sports   Event(s) they head, shown as tags (leave [] for none)
 * phone    Shown on the card and tappable to call (leave "" to hide)
 */

const COMMITTEE_LEADS = [
    { name: "Milind Sonkar", role: "Sports Secretary", sports: ["Tug of War"], phone: "+91 99230 16679" }
];

const COMMITTEE_EVENT_HEADS = [
    { name: "Vinayak Kokkul",        role: "Event Head", sports: ["Box Cricket"],                   phone: "+91 87677 76929" },
    { name: "Viresh Rathod",         role: "Event Head", sports: ["Box Cricket", "Girls Cricket"],  phone: "+91 78750 54595" },
    { name: "Pratham Shetty",        role: "Event Head", sports: ["Overarm Cricket"],               phone: "+91 81084 58431" },
    { name: "Vedant Chaudhari",      role: "Event Head", sports: ["Overarm Cricket"],               phone: "+91 84079 54583" },
    { name: "Aditi Rasal",           role: "Event Head", sports: ["Girls Cricket"],                 phone: "+91 89836 27852" },
    { name: "Yash Patil",            role: "Event Head", sports: ["Rink Football"],                 phone: "+91 84212 01306" },
    { name: "Nirmit Breed",          role: "Event Head", sports: ["Rink Football"],                 phone: "+91 93569 87841" },
    { name: "Dhruv Save",            role: "Event Head", sports: ["Kabaddi"],                       phone: "+91 98238 25212" },
    { name: "Soham Patkar",          role: "Event Head", sports: ["Kabaddi"],                       phone: "+91 87884 91221" },
    { name: "Chaitanya Waingankar",  role: "Event Head", sports: ["Volleyball"],                    phone: "+91 82370 32905" },
    { name: "Harshal Patil",         role: "Event Head", sports: ["Volleyball"],                    phone: "+91 85308 68739" },
    { name: "Arya Vartak",           role: "Event Head", sports: ["Throwball"],                     phone: "+91 93224 03223" },
    { name: "Mehek Rajput",          role: "Event Head", sports: ["Throwball"],                     phone: "+91 93269 64177" },
    { name: "Shreyas Pathe",         role: "Event Head", sports: ["Badminton"],                     phone: "+91 86377 17076" },
    { name: "Bhargavi Atre",         role: "Event Head", sports: ["Badminton"],                     phone: "+91 90213 25349" },
    { name: "Paras Jadhav",          role: "Event Head", sports: ["Tug of War"],                    phone: "+91 70715 22444" },
    { name: "Anuj Newalkar",         role: "Event Head", sports: ["Athletics"],                     phone: "+91 88578 60259" },
    { name: "Pranav Balgude",        role: "Event Head", sports: ["Athletics"],                     phone: "+91 92211 01444" },
    { name: "Atharva Sane",          role: "Event Head", sports: ["Chess"],                         phone: "+91 87677 35084" },
    { name: "Aarya Jadhav",          role: "Event Head", sports: ["Chess"],                         phone: "+91 99873 71146" },
    { name: "Atharv Chavan",         role: "Event Head", sports: ["Table Tennis"],                  phone: "+91 77580 47564" },
    { name: "Rohan Parab",           role: "Event Head", sports: ["Table Tennis"],                  phone: "+91 76665 88933" },
    { name: "Ganesh Joshi",          role: "Event Head", sports: ["Carrom"],                        phone: "+91 87679 59024" },
    { name: "Tanvi Patil",           role: "Event Head", sports: ["Carrom"],                        phone: "+91 76203 90416" },
    { name: "Dhruv Gharat",          role: "Event Head", sports: ["Arm Wrestling"],                 phone: "+91 72761 28403" },
    { name: "Dhruv Kotian",          role: "Event Head", sports: ["Arm Wrestling"],                 phone: "+91 92842 19008" }
];
