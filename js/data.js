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
        name: "Rectangle V3",
        description: "Rectangle_V3 has full directional control: left, right, top, and bottom.",
        file: "Macro/Rectangle_V3.zip",
        youtube: "https://www.youtube.com/watch?v=6-72PyQli1Q"
    },

    {
        id: "Opacity",
        type: "macro",
        name: "Opacity",
        description: "Quickly control transparency with an easy-to-use opacity slider. Perfect for fades, overlays, and smooth visibility adjustments.",
        file: "Macro/Opacity.zip"
    },

    {
        id: "Text_Infinite_Scroller",
        type: "macro",
        name: "Text Infinite Scroller",
        description: "Text Infinite Scroller is a simple DaVinci Resolve (Fusion) macro that creates smooth, continuous scrolling text with a seamless infinite loop. Easily control speed and direction for clean, professional animations.",
        file: "Macro/Text_Infinite_Scroller.zip",
        youtube: "https://www.youtube.com/watch?v=T9TPsAN91DI"
    },

    {
        id: "AlokWebText_Macro",
        type: "macro",
        name: "Alok Web Text",
        description: "Alok Web Text is a free Fusion macro for DaVinci Resolve that adds a realistic blinking cursor animation to any text — just like the typing cursor you see in Google Search, code editors, or any text field.",
        file: "Macro/Alok Web Text.zip",
        youtube: "https://youtu.be/Zg_fqEhPDVc"
    },

    {
        id: "TextSelectorMacro",
        type: "macro",
        name: "Text Selector",
        description: "This is a text highlighter tool, not a standard text selector. Macro version for easy editing.",
        file: "Macro/Text Selector.zip",
        youtube: "https://www.youtube.com/watch?v=A0PVe1OZxas",
        isNew: true
    },

    //Plugins

    {
        id: "TextSelector",
        type: "plugin",
        name: "Text Selector",
        description: "This is a text highlighter tool, not a standard text selector.",
        file: "Plugin/Text Selector.zip",
        youtube: "https://www.youtube.com/watch?v=A0PVe1OZxas"
    },

    {
        id: "AlokWebText_Plugin",
        type: "plugin",
        name: "Alok Web Text",
        description: "Alok Web Text is a free Plugin for DaVinci Resolve that adds a realistic blinking cursor animation to any text — just like the typing cursor you see in Google Search, code editors, or any text field.",
        file: "Plugin/Alok Web Text.zip",
        youtube: "https://youtu.be/Zg_fqEhPDVc"
    },

    {
        id: "CinemaBar",
        type: "plugin",
        name: "Cinema Bar",
        description: "Professional Cinema Bar plugin for cinematic aspect ratios.",
        file: "Plugin/CinemaBar.zip"
    },
    {
        id: "SafeZoneForReels",
        type: "plugin",
        name: "Safe Zone For Reels",
        description: "Reels Safe Zone (9/16) vertical format",
        file: "Plugin/Safe Zone for Reels.zip" // Ensure this file exists in your Macro folder
    },
    {
        id: "SafeZoneForAD",
        type: "plugin",
        name: "Safe Zone For AD",
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
        file: "Davinci Scripting Plugin/Auto File Organizer.zip",
        youtube: "https://www.youtube.com/watch?v=Xr_tLO3KySo"
    },
    {
        id: "CopyPasta_2",
        type: "scripting",
        name: "Copy Pasta V2",
        description: "Copy Pasta V2 is a free DaVinci Resolve plugin that lets you instantly copy any frame from the Edit or Fusion page straight to your clipboard — and paste external images directly into your timeline. No Color Page. No export. Just one click.",
        file: "Davinci Scripting Plugin/Copy Pasta V2.zip",
        youtube: "https://www.youtube.com/watch?v=U9BA1XNA9dE"
    },
    {
        id: "AutoCapsStyle",
        type: "scripting",
        name: "Auto Cap's Style",
        description: "Instantly style and format your captions in DaVinci Resolve. Perfect for social media, YouTube shorts, and TikToks. Automatically handles capitalization, spacing, and styling with one click.",
        file: "Davinci Scripting Plugin/Auto Caps Style.zip",
        payhipKey: "kpJtj",
        isNew: true
    },
    {
        id: "EnnerTextFinder",
        type: "scripting",
        name: "Enner Text Finder",
        description: "A powerful DaVinci Resolve script to help you quickly find and manage text elements in your projects.",
        file: "Davinci Scripting Plugin/Enner Text finder.zip",
        youtube: "https://www.youtube.com/watch?v=OR2BBdPkz3o"
    },
    {
        id: "FusionExpressionEditor",
        type: "scripting",
        name: "Fusion Expression Editor",
        description: "A powerful scripting tool designed to make writing and managing Fusion expressions inside DaVinci Resolve faster and more intuitive.",
        file: "Davinci Scripting Plugin/Fusion Expression Editor.zip",
        price: 30,
        salePrice: 15,
        payhipKey: "YXOTP",
        isNew: true
    },
    {
        id: "AlignAndPivot",
        type: "scripting",
        name: "Align & Pivot",
        description: "A massive time-saver for DaVinci Resolve Fusion. Automate your layout and animation workflow instantly with a sleek UI for 9-point alignment, smart pivot control, and auto keyframing.",
        file: "Davinci Scripting Plugin/Align & Pivot.zip",
        price: 5,
        payhipKey: "dFOVz",
        isNew: true
    },
    {
        id: "CurrencyNumberFormatter",
        type: "expression",
        name: "Currency Number Formatter",
        description: "A Fusion expression to easily format numbers into neat currency strings with commas and decimal points.",
        file: "Fusion Expression/Currency Number Formatter.zip",
        isNew: true
    }
];
