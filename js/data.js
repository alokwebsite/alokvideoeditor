/**
 * ALOK VIDEO EDITOR - DATA CONFIGURATION
 * 
 * Add your Plugins and Macros here.
 * 
 * Format:
 * {
 *    id: "unique_id",
 *    type: "plugin" OR "macro",
 *    name: "Name of the Tool",
 *    description: "Short description",
 *    url: "YOUR_GOOGLE_DRIVE_LINK_HERE" 
 * }
 */

const projectData = [
    /**
    {
        id: "rect_v3",
        type: "plugin",
        name: "Rectangle_V3",
        description: "Professional Rectangle Animation Tool for Davinci Resolve.",
        url: "YOUR_GOOGLE_DRIVE_LINK_HERE"
    },
     */

    //Macros

    {
        id: "Rectangle_V3",
        type: "macro",
        name: "Rectangle_V3",
        description: "Rectangle_V3 has full directional control: left, right, top, and bottom.",
        url: "https://drive.google.com/file/d/1botSkytotUsodBGwMHPk_nqrS2OOBOHp/view?usp=sharing",
        youtube: "https://www.youtube.com/watch?v=6-72PyQli1Q"
    },

    {
        id: "Text_Infinite_Scroller",
        type: "macro",
        name: "Text_Infinite_Scroller",
        description: "Text Infinite Scroller is a simple DaVinci Resolve (Fusion) macro that creates smooth, continuous scrolling text with a seamless infinite loop. Easily control speed and direction for clean, professional animations.",
        url: "https://drive.google.com/file/d/1-nvKwiXPIEbQubM6srCnBylbo131HiSB/view?usp=sharing",
        youtube: "https://www.youtube.com/watch?v=T9TPsAN91DI"
    },

    //Plugins

    {
        id: "TextSelector",
        type: "plugin",
        name: "TextSelector",
        description: "This is a text highlighter tool, not a standard text selector.",
        url: "https://drive.google.com/file/d/1peL-s3wZfZjar6MTH9H2Kn_NS6HYwhM-/view?usp=sharing",
        youtube: "https://www.youtube.com/watch?v=A0PVe1OZxas"
    },
    {
        id: "CinemaBar",
        type: "plugin",
        name: "Cinema_Bar",
        description: "Professional Cinema Bar plugin for cinematic aspect ratios.",
        url: "https://drive.google.com/file/d/1Z1LDRiFlaDZoqDJZuPbhGrIvaDh-Z7bl/view?usp=sharing"
    },
    {
        id: "SafeZoneForReels",
        type: "plugin",
        name: "Safe_Zone_For_Reels",
        description: "Reels Safe Zone (9/16) vertical format",
        url: "https://drive.google.com/file/d/11d2jtBsv3U-GSHdT-pm3DbcPyFPP7Xbh/view?usp=sharing"
    },
    {
        id: "SafeZoneForAD",
        type: "plugin",
        name: "Safe_Zone_For_AD",
        description: "AD Safe Zone (9/16) vertical format",
        url: "https://drive.google.com/file/d/1DY31RMpgUf4mBk60l7x0x0kulxZgsVmT/view?usp=sharing"
    },
    // Projects
    {
         id: "4SmoothAnimation",
         type: "project",
         name: "4 Smooth Animation",
         description: "4 Customizable Text Animations for DaVinci Resolve Fusion Take your titles and text to the next level with these 4 smooth, professional text animations built inside DaVinci Resolve Fusion — fully controlled by a single custom Modifier.No complex node setups. No manual keyframing. Just plug in and customize everything directly from the Modifier panel.",
         url: "https://drive.google.com/file/d/1worZUNaoc3C5oMu5bO_temF4fWLH4Pv_/view?usp=drive_link",
         youtube: "https://www.youtube.com/watch?v=0YbUnSy6zJw"
     },
    // Scripting Plugins
    {
        id: "AutoFileOrganizer",
        type: "scripting",
        name: "Auto File Organizer",
        description: "Stop wasting time dragging clips into folders manually. Auto File Organizer scans your entire DaVinci Resolve media pool and sorts every file into the right bin in seconds — Video, Audio, Images, Timelines, Compound Clips, Subtitles, Documents, and more. Works on any project size. Just run the script and your media pool is clean and organized, instantly.",
        url: "https://drive.google.com/file/d/1u93ko0FMAT3Rryz0S5U5mB-dBYajMrQa/view?usp=drive_link",
        youtube: "https://www.youtube.com/watch?v=Xr_tLO3KySo"
    },
    {
        id: "CopyPasta",
        type: "scripting",
        name: "Copy Pasta",
        description: "Important: Please File name well be (Copy Pasta) This free DaVinci Resolve plugin lets you instantly paste copied images directly into your timeline without downloading or importing files manually. Just copy an image from Google, ChatGPT, Discord, or any app, then paste it straight into DaVinci Resolve to speed up your editing workflow. ✅ Works on Windows and macOS. 📁 Inside the zip you will find 2 folders: Folder 1 → Windows | Folder 2 → Mac",
        url: "",
        youtube: "https://youtu.be/mxKvsxQB4SI"
    }
];
