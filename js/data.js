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
    // Macros
    {
        id: "CamAlign",
        type: "macro",
        name: "Cam Align",
        description: "Free 4-in-1 Macro suite for Podcast editors, Reels creators, and multi-cam workflows. Easily align camera angles, framing, and layouts.",
        link: "https://payhip.com/b/kvUWJ",
        file: "Macro/Cam Plugin.zip",
        youtube: "https://www.youtube.com/watch?v=DOLq86U8F0A",
        tags: ["macro", "camera", "alignment", "podcast", "reels", "multi-camera", "framing"],
        features: [
            "4-in-1 multi-angle alignment presets",
            "Optimized for podcast and interview layouts",
            "Easy inspector controls inside DaVinci Resolve",
            "Works on Edit and Fusion pages"
        ]
    },

    {
        id: "Rectangle_V3",
        type: "macro",
        name: "Rectangle V3",
        description: "Rectangle V3 features full directional control: left, right, top, and bottom. Clean customizable shape animations with inspector UI controls.",
        link: "https://payhip.com/b/ShYuP",
        file: "Macro/Rectangle_V3.zip",
        youtube: "https://www.youtube.com/watch?v=6-72PyQli1Q",
        downloads: 3000,
        tags: ["macro", "rectangle", "shape", "animation", "motion graphics", "titles", "direction"],
        features: [
            "Full Directional Control (Left, Right, Top, Bottom)",
            "Smooth Custom Animation curves",
            "Inspector UI integration",
            "Easy drag-and-drop installation"
        ]
    },

    {
        id: "Opacity",
        type: "macro",
        name: "Opacity",
        description: "Quickly control transparency with an easy-to-use opacity slider. Perfect for fades, overlays, and smooth visibility adjustments.",
        link: "https://payhip.com/b/8umA2",
        file: "Macro/Opacity.zip",
        youtube: "https://www.youtube.com/watch?v=_9g2Y3iJXeY",
        tags: ["macro", "opacity", "transparency", "fade", "overlay", "transition"],
        features: [
            "Instant single-slider opacity control",
            "Eliminates complex node graph adjustments",
            "Perfect for cinematic fades and overlays"
        ]
    },

    {
        id: "Text_Infinite_Scroller",
        type: "macro",
        name: "Text Infinite Scroller",
        description: "Text Infinite Scroller is a DaVinci Resolve (Fusion) macro that creates smooth, continuous scrolling text with a seamless infinite loop. Easily control speed and direction.",
        link: "https://payhip.com/b/0RPKN",
        file: "Macro/Text_Infinite_Scroller.zip",
        youtube: "https://www.youtube.com/watch?v=T9TPsAN91DI",
        tags: ["macro", "text", "scroller", "infinite", "loop", "ticker", "kinetic typography"],
        features: [
            "Seamless infinite looping animation",
            "Bidirectional control (Left/Right, Up/Down)",
            "Customizable scroll speed and font styles",
            "Great for broadcast tickers and modern reels"
        ]
    },

    {
        id: "AlokWebText_Macro",
        type: "macro",
        name: "Alok Web Text (Macro)",
        description: "Free Fusion macro that adds a realistic blinking cursor typing animation to any text — just like code editors, search fields, or terminal screens.",
        link: "https://payhip.com/b/Oz9CZ",
        file: "Macro/Alok Web Text.zip",
        youtube: "https://youtu.be/Zg_fqEhPDVc",
        tags: ["macro", "typing", "cursor", "typewriter", "terminal", "code", "text animation"],
        features: [
            "Authentic blinking cursor typing effect",
            "Adjustable typing speed and cursor blink rate",
            "Plug-and-play Fusion macro format"
        ]
    },

    {
        id: "TextSelectorMacro",
        type: "macro",
        name: "Text Selector (Macro)",
        description: "A fast text highlighter and emphasis tool for DaVinci Resolve Fusion. Draw viewer attention to key words and quotes instantly.",
        link: "https://payhip.com/b/jeOM7",
        file: "Macro/Text Selector.zip",
        youtube: "https://www.youtube.com/watch?v=A0PVe1OZxas",
        tags: ["macro", "highlight", "marker", "text selector", "emphasis", "quotes"],
        features: [
            "Dynamic text highlight marker",
            "Customizable highlight colors and padding",
            "Smooth animated reveal options"
        ]
    },

    // Plugins
    {
        id: "CineMotionFX",
        type: "plugin",
        name: "CineMotion FX Suite",
        description: "The ultimate DaVinci Resolve post-production suite packed with seamless video transitions, cinematic effects, camera moves, and drag-and-drop motion presets. Coming soon!",
        comingSoon: true,
        isNew: true,
        tags: ["plugin", "transitions", "effects", "motion graphics", "cinematic", "zoom transition", "whip", "glitch", "camera shake", "vfx", "edit page", "coming soon"],
        features: [
            "All-in-one Video Transitions & Effects library for DaVinci Resolve",
            "Seamless dynamic transitions: Zoom, Whip, Pan, Spin, Glitch & Roll",
            "Cinematic video effects: Lens Blur, Chromatic Glow, Camera Shakes & Film Overlays",
            "Instant 1-click drag-and-drop workflow on the Edit Page",
            "Fully optimized GPU acceleration for smooth real-time playback",
            "Compatible across Windows, macOS, and Linux (Free & Studio)"
        ]
    },
    {
        id: "TextSelector",
        type: "plugin",
        name: "Text Selector (Plugin)",
        description: "Text highlighter and emphasis tool in plugin format for easy timeline application on the Edit Page.",
        link: "https://payhip.com/b/jeOM7",
        file: "Plugin/Text Selector.zip",
        youtube: "https://www.youtube.com/watch?v=A0PVe1OZxas",
        tags: ["plugin", "highlight", "text selector", "edit page", "marker"],
        features: [
            "Edit page drag-and-drop tool",
            "Customizable highlighter box and colors",
            "Instant timeline integration"
        ]
    },

    {
        id: "AlokWebText_Plugin",
        type: "plugin",
        name: "Alok Web Text (Plugin)",
        description: "Free Edit page plugin that adds a realistic blinking typing cursor to any title or lower third.",
        link: "https://payhip.com/b/Oz9CZ",
        file: "Plugin/Alok Web Text.zip",
        youtube: "https://youtu.be/Zg_fqEhPDVc",
        tags: ["plugin", "typing", "typewriter", "blinking cursor", "titles"],
        features: [
            "Edit page title preset with realistic typing cursor",
            "Full font, size, tracking, and color customization",
            "Zero keyframing required"
        ]
    },

    {
        id: "CinemaBar",
        type: "plugin",
        name: "Cinema Bar",
        description: "Professional Cinema Bar plugin for cinematic aspect ratios (2.35:1, 2.39:1, 1.85:1) with custom bar animations and guides.",
        link: "https://payhip.com/b/cOsrS",
        file: "Plugin/CinemaBar.zip",
        image: "images/cinema_bar.png",
        tags: ["plugin", "cinema bar", "letterbox", "aspect ratio", "cinematic", "anamorphic"],
        features: [
            "Standard anamorphic & cinematic letterbox ratios",
            "Smooth intro and outro bar opening transitions",
            "Lightweight, zero-render performance impact"
        ]
    },

    {
        id: "SafeZoneForReels",
        type: "plugin",
        name: "Safe Zone For Reels",
        description: "Official Instagram Reels, TikTok, and YouTube Shorts 9:16 safe zone overlays. Keep your titles and hooks out of UI buttons.",
        link: "https://payhip.com/b/v4PKa",
        file: "Plugin/Safe Zone for Reels.zip",
        image: "images/safe_zone_for_reels.png",
        tags: ["plugin", "safe zone", "reels", "shorts", "tiktok", "9:16", "vertical"],
        features: [
            "Accurate 2026 social media UI guide boundaries",
            "Works for Instagram Reels, TikTok, and YouTube Shorts",
            "Toggleable opacity guide for precision layout"
        ]
    },

    {
        id: "SafeZoneForAD",
        type: "plugin",
        name: "Safe Zone For AD",
        description: "Vertical 9:16 safe guide specifically measured for paid social ads (Meta / TikTok Ads) where sponsored CTAs and disclaimers render.",
        link: "https://payhip.com/b/fx5EW",
        file: "Plugin/Safe Zone For AD.zip",
        image: "images/safe_zone_for_ad.png",
        tags: ["plugin", "safe zone", "ads", "sponsored", "meta ads", "tiktok ads", "commercial"],
        features: [
            "Ad-specific sponsored overlay safety boundaries",
            "Prevents CTAs and buttons from covering essential copy",
            "1-click timeline toggle"
        ]
    },

    // Projects
    {
        id: "4SmoothAnimation",
        type: "project",
        name: "4 Smooth Animation",
        description: "4 customizable text animations for DaVinci Resolve Fusion. Controlled by a single custom modifier with zero complex node setups.",
        file: "Project's/4 Smooth Animation For Free.zip",
        youtube: "https://www.youtube.com/watch?v=0YbUnSy6zJw",
        tags: ["project", "animation", "text animation", "fusion modifier", "typography", "free pack"],
        features: [
            "4 smooth, professional text animation presets",
            "Controlled by a single custom Fusion modifier",
            "Zero keyframing or complex node connections needed",
            "100% free direct download"
        ]
    },

    // Scripting Plugins
    {
        id: "AutoFileOrganizerPro",
        type: "scripting",
        name: "Auto File Organizer Pro",
        description: "The ultimate DaVinci Resolve organization suite. Automatically sorts media into labeled bins by file type, detects camera brands, separates compound clips and timelines, applies color coding, handles SFX/music, and deep scans sub-folders.",
        price: 30,
        payhipKey: "HbZKp",
        file: "Davinci Scripting Plugin/Auto File Organizer Pro.zip",
        youtube: "https://www.youtube.com/watch?v=AzpsRdPtvtw",
        image: "images/auto_file_organizer_pro.png",
        isNew: true,
        tags: ["scripting", "python", "organizer", "bins", "media pool", "sony", "canon", "blackmagic", "automation", "workflow", "pro"],
        features: [
            "Auto Bin Sorting — separates Video, Audio, Images, Documents, SRT subtitles & Design files",
            "Camera Brand Detection — auto-sorts Sony, Canon, Blackmagic, RED, GoPro, DJI, iPhone & more",
            "Clip Type Sorting — separates Timelines, Compound Clips, Multicam & Fusion Compositions",
            "Color Coding — applies instant color labels based on file type or camera brand",
            "SFX & Music Folders — scans custom library paths and organizes them into dedicated bins",
            "Deep Scan Mode — organizes deeply nested clips inside existing sub-folders",
            "Offline Clip Support — can organize offline and missing clips seamlessly"
        ]
    },

    {
        id: "AutoCapsStyle",
        type: "scripting",
        name: "Auto Cap's Style",
        description: "Generate viral, high-retention animated captions for TikTok, Reels, and Shorts directly inside DaVinci Resolve with 1-click presets. Save hours of manual keyframing running 100% offline.",
        link: "https://payhip.com/b/kpJtj",
        file: "Davinci Scripting Plugin/Auto Cap's Style.zip",
        youtube: "https://www.youtube.com/watch?v=yOxGSA35InI",
        image: "images/auto_caps_style.png",
        isNew: true,
        tags: ["scripting", "captions", "subtitles", "viral", "reels", "shorts", "hormozi", "mrbeast", "retention"],
        features: [
            "1-click animated caption rendering for vertical videos",
            "Retention-boosting presets (MrBeast & Hormozi typography styles)",
            "No animation skills required — loaded with viral presets",
            "Runs 100% offline on CPU — no GPU or external cloud required"
        ]
    },

    {
        id: "AutoFileOrganizer",
        type: "scripting",
        name: "Auto File Organizer",
        description: "Stop wasting time dragging clips into bins manually. Scans your entire DaVinci Resolve media pool and sorts every file into the right bin in seconds.",
        link: "https://payhip.com/b/ADoaL",
        file: "Davinci Scripting Plugin/Auto File Organizer.zip",
        youtube: "https://www.youtube.com/watch?v=Xr_tLO3KySo",
        downloads: 500,
        tags: ["scripting", "organizer", "media pool", "bins", "sort", "free", "python", "automation"],
        features: [
            "1-click media pool organization",
            "Sorts video, audio, images, and timelines into dedicated bins",
            "Works on any project size in seconds",
            "Compatible with DaVinci Resolve 18 and 19"
        ]
    },

    {
        id: "CopyPasta_2",
        type: "scripting",
        name: "Copy Pasta V2",
        description: "Instantly copy any frame from the Edit or Fusion page straight to your clipboard — and paste external images directly into your timeline without exporting.",
        link: "https://payhip.com/b/xXmh7",
        file: "Davinci Scripting Plugin/Copy Pasta V2.zip",
        youtube: "https://www.youtube.com/watch?v=U9BA1XNA9dE",
        tags: ["scripting", "copy pasta", "clipboard", "frame grab", "snapshot", "paste image", "workflow"],
        features: [
            "Instant 1-click frame copy to OS clipboard",
            "Paste clipboard images directly into timeline as clips",
            "No Color page grab-still or export dialogs required"
        ]
    },

    {
        id: "EnnerTextFinder",
        type: "scripting",
        name: "Enner Text Finder",
        description: "Quickly locate and extract nested text content from complex Text+ and Fusion node structures in DaVinci Resolve.",
        link: "https://payhip.com/b/AWO0l",
        file: "Davinci Scripting Plugin/Enner Text finder.zip",
        youtube: "https://www.youtube.com/watch?v=OR2BBdPkz3o",
        tags: ["scripting", "text finder", "nodes", "fusion", "search", "inspector"],
        features: [
            "Scans active composition for Text+ nodes",
            "Extracts and modifies inner text strings rapidly",
            "Ideal for large template localization and batch edits"
        ]
    },

    {
        id: "AutoConnectNodes",
        type: "scripting",
        name: "Auto Connect Nodes",
        description: "A fast and efficient DaVinci Resolve scripting plugin to automatically connect nodes in your Fusion compositions, saving time on repetitive node cabling.",
        link: "https://payhip.com/b/ubvjH",
        file: "Davinci Scripting Plugin/Auto Connect Nodes.zip",
        youtube: "https://www.youtube.com/watch?v=QmZiph-ef0s",
        isNew: true,
        tags: ["scripting", "fusion", "node graph", "auto connect", "cable", "vfx", "compositing"],
        features: [
            "Auto-connects selected node inputs and outputs",
            "Smart input detection for Merge, Transform, and Mask nodes",
            "Accelerates repetitive Fusion comp construction"
        ]
    },

    {
        id: "FusionExpressionEditor",
        type: "scripting",
        name: "Fusion Expression Editor",
        description: "A powerful scripting tool designed to make writing and managing Fusion expressions inside DaVinci Resolve faster and more intuitive with live auto-suggest. Works seamlessly on Windows, macOS, and Linux.",
        file: "Davinci Scripting Plugin/Fusion Expression Editor.zip",
        youtube: "https://www.youtube.com/watch?v=VF5uD26zJmQ",
        price: 30,
        salePrice: 15,
        payhipKey: "YXOTP",
        isNew: true,
        tags: ["scripting", "expression editor", "fusion", "math", "code", "auto suggest", "sale", "windows", "mac", "linux", "cross-platform"],
        features: [
            "Works on all operating systems: Windows, macOS, and Linux",
            "Dedicated code editor window for Fusion expressions",
            "Live node and property auto-suggestions",
            "Built-in library of saved common mathematical expressions",
            "1-click apply directly into node inspector properties"
        ]
    },

    {
        id: "AlignAndPivot",
        type: "scripting",
        name: "Align & Pivot",
        description: "A massive time-saver for DaVinci Resolve Fusion. Automate layout and animation workflows with a sleek UI for 9-point alignment, smart pivot control, and auto keyframing.",
        file: "Davinci Scripting Plugin/Align & Pivot.zip",
        youtube: "https://www.youtube.com/watch?v=P2aT-7h7JY8",
        price: 5,
        payhipKey: "dFOVz",
        isNew: true,
        tags: ["scripting", "align", "pivot", "9-point", "canvas", "keyframing", "layout", "fusion"],
        features: [
            "9-point interactive alignment grid (Top, Center, Bottom, Left, Right)",
            "Independent pivot position control without shifting layout",
            "Canvas and bounding-box alignment modes",
            "Auto-keyframe alignment helper"
        ]
    },

    // Expressions
    {
        id: "CurrencyNumberFormatter",
        type: "expression",
        name: "Currency Number Formatter",
        description: "A Fusion expression to easily format dynamic numbers into neat currency strings with commas, decimal precision, and currency symbols.",
        file: "Fusion Expression/Currency Number Formatter.zip",
        youtube: "https://www.youtube.com/watch?v=xg8Lbu3WKkg",
        tags: ["expression", "currency", "number formatter", "commas", "decimals", "infographics"],
        features: [
            "Converts raw numerical values into formatted currency strings",
            "Supports US ($1,234.56) and International numbering conventions",
            "Connects seamlessly to Text+ styled text modifiers",
            "100% free direct download"
        ]
    }
];

function applyFlashSaleAutoReset() {
    // Regular default pricing active
}

