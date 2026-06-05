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
 *    file: "filename.zip" or "filename.setting" 
 * }
 */

const projectData = [
    /**
    {
        id: "rect_v3",
        type: "plugin",
        name: "Rectangle_V3",
        description: "Professional Rectangle Animation Tool for Davinci Resolve.",
        file: "Plugin/New folder.zip" // Ensure this file exists in your Plugin folder
    },
     */

    //Macros

    {
        id: "Rectangle_V3",
        type: "macro",
        name: "Rectangle_V3",
        description: "Rectangle_V3 has full directional control: left, right, top, and bottom.",
        file: "Macro/Rectangle_V3.zip",
        youtube: "https://www.youtube.com/watch?v=6-72PyQli1Q"
    },

    {
        id: "Text_Infinite_Scroller",
        type: "macro",
        name: "Text_Infinite_Scroller",
        description: "Text Infinite Scroller is a simple DaVinci Resolve (Fusion) macro that creates smooth, continuous scrolling text with a seamless infinite loop. Easily control speed and direction for clean, professional animations.",
        file: "Macro/Text_Infinite_Scroller.zip",
        youtube: "https://www.youtube.com/watch?v=T9TPsAN91DI"
    },

    //Plugins

    {
        id: "TextSelector",
        type: "plugin",
        name: "TextSelector",
        description: "This is a text highlighter tool, not a standard text selector.",
        file: "Plugin/Text Selector.zip",
        youtube: "https://www.youtube.com/watch?v=A0PVe1OZxas"
    },
    {
        id: "CinemaBar",
        type: "plugin",
        name: "Cinema_Bar",
        description: "Professional Cinema Bar plugin for cinematic aspect ratios.",
        file: "Plugin/CinemaBar.zip"
    },
    {
        id: "SafeZoneForReels",
        type: "plugin",
        name: "Safe_Zone_For_Reels",
        description: "Reels Safe Zone (9/16) vertical format",
        file: "Plugin/Safe Zone for Reels.zip" // Ensure this file exists in your Macro folder
    },
    {
        id: "SafeZoneForAD",
        type: "plugin",
        name: "Safe_Zone_For_AD",
        description: "AD Safe Zone (9/16) vertical format",
        file: "Plugin/Safe Zone For AD.zip" // Ensure this file exists in your Macro folder
    },
    // Projects
    {
         id: "4SmoothAnimation",
         type: "project",
         name: "4 Smooth Animation",
         description: "4 Customizable Text Animations for DaVinci Resolve Fusion Take your titles and text to the next level with these 4 smooth, professional text animations built inside DaVinci Resolve Fusion — fully controlled by a single custom Modifier.No complex node setups. No manual keyframing. Just plug in and customize everything directly from the Modifier panel.",
         file: "Project's/4 Smooth Animation For Free.zip",
         youtube: "https://www.youtube.com/watch?v=0YbUnSy6zJw"
     },
    // Scripting Plugins
    {
        id: "AutoFileOrganizer",
        type: "scripting",
        name: "Auto File Organizer",
        description: "Stop wasting time dragging clips into folders manually. Auto File Organizer scans your entire DaVinci Resolve media pool and sorts every file into the right bin in seconds — Video, Audio, Images, Timelines, Compound Clips, Subtitles, Documents, and more. Works on any project size. Just run the script and your media pool is clean and organized, instantly.",
        file: "Davinci Scripting Plugin/Auto FileOrganizer.zip",
        youtube: "https://www.youtube.com/watch?v=Xr_tLO3KySo"
    },
    {
        id: "CopyPasta_2",
        type: "scripting",
        name: "Copy Pasta V2",
        description: "Coming Soon",
        file: "Davinci Scripting Plugin/#"
    }
];
