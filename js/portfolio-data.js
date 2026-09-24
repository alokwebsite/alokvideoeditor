/**
 * ALOK VIDEO EDITOR - PORTFOLIO DATA CONFIGURATION
 * 
 * Edit or add your portfolio projects, services, stats, and client reviews here.
 */

const portfolioConfig = {
    // Top Hero Details
    hero: {
        badge: "Available for Freelance & Contract",
        title: "Crafting High-Retention, Cinematic Video Edits",
        subtitle: "Professional Video Editor & DaVinci Resolve Specialist based in Nepal. Transforming raw footage into compelling stories that drive millions of views.",
        primaryCTA: { text: "Watch Showreel", href: "#showreel" },
        secondaryCTA: { text: "Hire Me / Contact", href: "#contact" },
        stats: [
            { number: "5M+", label: "Views Generated" },
            { number: "150+", label: "Videos Delivered" },
            { number: "100%", label: "Client Satisfaction" },
            { number: "4+ Yrs", label: "Professional Experience" }
        ],
        // Featured Showreel Video (YouTube ID or direct video link)
        showreel: {
            title: "Surkhet",
            youtubeId: "TzZOhtPVOqY",
            description: "Cinematic landscape and cultural documentary edit capturing the beauty of Surkhet with rich color grading and smooth pacing."
        }
    },

    // Categories for filter tabs
    categories: [
        { id: "all", label: "All Projects" },
        { id: "motion-graphics", label: "Motion Graphics" },
        { id: "reels", label: "Reels & Shorts (9:16)" },
        { id: "youtube", label: "YouTube & Long-Form" }
    ],

    // Individual Portfolio Projects
    projects: [
        {
            id: "motion-graphics-sera",
            title: "Sera Graphics",
            category: "motion-graphics",
            categories: ["motion-graphics"],
            client: "Sera Graphics",
            format: "horizontal", // 16:9 widescreen
            duration: "0:14",
            videoFile: "Video/Portfolio/Motion Graphics 1.mp4",
            thumbnail: "images/motion_graphics_1_thumb.jpg",
            description: "Clean, modern 2D/3D motion graphics brand reveal with fluid typography transitions and vibrant aesthetic design.",
            tags: ["Motion Graphics", "Logo Reveal", "Brand Identity"]
        },
        {
            id: "motion-graphics-smart-sikshya",
            title: "Smart Sikshya",
            category: "motion-graphics",
            categories: ["motion-graphics"],
            client: "Smart Sikshya",
            format: "horizontal", // 16:9 widescreen
            duration: "0:27",
            videoFile: "Video/Portfolio/Motion Graphics 2.mp4",
            thumbnail: "images/motion_graphics_2_thumb.jpg",
            description: "Dynamic brand identity and educational motion graphics animation featuring colorful iconography, kinetic layout, and audio sync.",
            tags: ["Motion Graphics", "Typography", "Animation"]
        },
        {
            id: "fusion-logo-animation-1",
            title: "3D Fusion Logo Animation",
            category: "motion-graphics",
            categories: ["motion-graphics"],
            client: "Logo Animation",
            format: "vertical",
            platform: "instagram",
            instagramId: "DYhqDswyLCr",
            instagramUrl: "https://www.instagram.com/reel/DYhqDswyLCr/",
            thumbnail: "images/reel_fusion_logo.jpg",
            description: "Smooth 3D logo reveal and motion animation designed natively inside DaVinci Resolve Fusion with lighting and depth.",
            tags: ["Logo Animation", "Fusion 3D", "Motion Graphics"]
        },
        {
            id: "brittanta-logo-animation",
            title: "Brittanta Brand Logo Animation",
            category: "motion-graphics",
            categories: ["motion-graphics"],
            client: "Logo Animation",
            format: "vertical",
            platform: "instagram",
            instagramId: "DbqvrvdSbyX",
            instagramUrl: "https://www.instagram.com/reel/DbqvrvdSbyX/",
            thumbnail: "images/reel_client_project.jpg",
            description: "Dynamic brand identity logo animation with custom typography, motion graphics, and sound design for client Brittanta.",
            tags: ["Logo Animation", "Brand Identity", "Fusion"]
        },
        {
            id: "fusion-logo-reveal-animation",
            title: "Creative Fusion Logo Reveal",
            category: "motion-graphics",
            categories: ["motion-graphics"],
            client: "Logo Animation",
            format: "vertical",
            platform: "instagram",
            instagramId: "DUdfq4-EonO",
            instagramUrl: "https://www.instagram.com/reel/DUdfq4-EonO/",
            thumbnail: "images/reel_fusion_vfx.jpg",
            description: "Creative logo reveal animation and compositing breakdown using advanced node tree workflows in DaVinci Resolve Fusion.",
            tags: ["Logo Animation", "Motion Design", "DaVinci Resolve"]
        },
        {
            id: "surkhet",
            title: "Surkhet",
            category: "youtube",
            categories: ["youtube"],
            client: "Travel & Culture",
            format: "horizontal", // 16:9 widescreen
            duration: "Full HD",
            youtubeId: "TzZOhtPVOqY",
            thumbnail: "https://i.ytimg.com/vi/TzZOhtPVOqY/maxresdefault.jpg",
            description: "Cinematic landscape and cultural documentary edit capturing the beauty of Surkhet with rich color grading and smooth pacing.",
            tags: ["Cinematic", "Color Grading", "Documentary"]
        },
        {
            id: "aef-cas-interview",
            title: "AEF CAS Interview",
            category: "reels",
            categories: ["reels"],
            client: "AEF CAS",
            format: "vertical", // 9:16 vertical reel
            duration: "0:59",
            youtubeId: "dj_CCpnam0s",
            thumbnail: "https://i.ytimg.com/vi/dj_CCpnam0s/hqdefault.jpg",
            description: "Engaging vertical interview reel with crisp audio cleanup, animated typography captions, and pacing optimized for mobile retention.",
            tags: ["Interview", "Shorts", "Subtitles"]
        },
        {
            id: "ale-dental-hospital",
            title: "Ale Dental Hospital",
            category: "reels",
            categories: ["reels"],
            client: "Ale Dental Hospital",
            format: "vertical", // 9:16 vertical reel
            duration: "0:55",
            youtubeId: "WqmiSOhqcFE",
            thumbnail: "https://i.ytimg.com/vi/WqmiSOhqcFE/maxresdefault.jpg",
            description: "Healthcare commercial promotional reel highlighting clinic facilities, doctor interviews, and patient care with clean transitions and brand consistency.",
            tags: ["Commercial", "Hospital", "Promo"]
        },
        {
            id: "massimo-inverter",
            title: "Massimo Inverter",
            category: "reels",
            categories: ["reels"],
            client: "Massimo Inverter",
            format: "vertical", // 9:16 vertical reel
            duration: "0:45",
            youtubeId: "XHdyNAzRzh4",
            thumbnail: "https://i.ytimg.com/vi/XHdyNAzRzh4/maxresdefault.jpg",
            description: "High-impact product commercial short featuring key product benefits, dynamic motion graphics, sound design, and compelling call to action.",
            tags: ["Product Video", "Commercial", "Motion Graphics"]
        }
    ],

    // Editing Services
    services: [
        {
            icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
            title: "Short-Form Video (Reels/TikTok/Shorts)",
            description: "Engineered for maximum retention and algorithmic reach. Includes viral captions, sound design, fast pacing, visual hook in the first 3 seconds, and seamless looping."
        },
        {
            icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
            title: "YouTube & Long-Form Video",
            description: "Engaging narrative storytelling, multi-cam synchronization, customized graphics, B-roll sourcing, pacing adjustments, and music curation to maintain audience watch time."
        },
        {
            icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20z"/></svg>`,
            title: "Color Grading & Correction",
            description: "Professional Hollywood-standard color grading inside DaVinci Resolve Studio. Color balancing, shot matching, custom LUT creation, skin tone perfection, and film looks."
        },
        {
            icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
            title: "Motion Graphics",
            description: "Custom lower thirds, title animations, 3D element integration, logo animations, tracking, and seamless visual effects created natively in DaVinci Resolve Fusion."
        }
    ],

    // Workflow Steps
    workflow: [
        {
            step: "01",
            title: "Footage Ingest & Concept",
            desc: "You upload your raw footage and brief. We establish the target audience, tone, pacing, and visual style."
        },
        {
            step: "02",
            title: "Assembly & Story Cut",
            desc: "Trimming fluff, crafting narrative momentum, tightening pacing, and locking in the primary story structure."
        },
        {
            step: "03",
            title: "Color, Sound & Motion Magic",
            desc: "Applying DaVinci Resolve studio color grading, dynamic sound design, audio EQ/cleanup, motion graphics, and titles."
        },
        {
            step: "04",
            title: "Review & Fast Delivery",
            desc: "Collaborative review rounds until you are 100% satisfied, followed by final high-bitrate exports in any required format."
        }
    ],

    // Tools & Software
    skills: [
        { name: "DaVinci Resolve Studio" },
        { name: "Fusion Compositing" },
        { name: "Fairlight Audio" },
        { name: "DaVinci Python/Lua Scripting" }
    ],

    // Contact info
    contact: {
        email: "alokmahatowork@gmail.com",
        discord: "https://discord.gg/32pW6BtjFy",
        instagram: "https://www.instagram.com/alokvideoeditornp",
        youtube: "https://youtube.com/@alokvideoeditornp",
        location: "Bardibas & Kathmandu, Nepal (Available Worldwide Remote)"
    }
};
