// export const sources = [
//   "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
//   "https://feeds.feedburner.com/TechCrunch/",
// ];
 
 
// export const rssSources = [
//   "https://hnrss.org/frontpage",                              // Hacker News
//   "https://www.theverge.com/rss/index.xml",                  // The Verge
//   "https://feeds.arstechnica.com/arstechnica/technology-lab", // Ars Technica AI/Tech
//   "https://venturebeat.com/feed/",                           // VentureBeat AI
//   "https://techcrunch.com/feed/",                            // TechCrunch (direct, not feedburner)
// ];

// // Direct HTML pages for deep content (non-RSS)
// export const htmlSources = [
//   "https://openai.com/news/",
//   "https://deepmind.google/discover/blog/",
//   "https://huggingface.co/blog",
// ];  



// RSS feeds that include full article body in the feed itself
// export const rssSources = [
//   "https://techcrunch.com/feed/",
//   "https://venturebeat.com/feed/",
//   "https://feeds.arstechnica.com/arstechnica/technology-lab",
//   "https://www.theverge.com/rss/index.xml",
//   "https://www.wired.com/feed/tag/artificial-intelligence/latest/rss",
//   "https://feeds.feedburner.com/AIWeekly",             
// ];

// // HTML pages to scrape for deep content
// export const htmlSources: string[] = [
//   // intentionally empty for now — add only pages you know are scrapable
// ];     

 export const SOURCE_MAP = {
  // 🧪 AI RESEARCH (top-tier + stable)
  ai_research: [
    "https://arxiv.org/rss/cs.AI",
    "https://huggingface.co/blog/feed.xml",
    "https://www.technologyreview.com/topic/artificial-intelligence/feed",
  ],

  // 🏢 AI INDUSTRY (real-world + startups)
  ai_industry: [
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://feeds.arstechnica.com/arstechnica/technology-lab",
  ],

  // 🏢 ENTERPRISE SOFTWARE (SaaS, cloud, infra)
  enterprise_software: [
    "https://www.zdnet.com/topic/cloud/rss.xml",
    "https://www.cio.com/feed/",
    "https://www.infoworld.com/index.rss",
  ],

  // 🔐 CYBERSECURITY
  cybersecurity: [
    "https://feeds.feedburner.com/TheHackersNews",
    "https://krebsonsecurity.com/feed/",
    "https://www.darkreading.com/rss.xml",
  ],

  // 💾 SEMICONDUCTORS (chips, Nvidia, TSMC, supply chain)
  semiconductors: [
    "https://www.anandtech.com/rss/",
    "https://www.tomshardware.com/feeds/all",
    "https://www.eetimes.com/feed/",
  ],

  // 🌍 GEOPOLITICS (clean + reliable)
  geopolitics: [
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://feeds.skynews.com/feeds/rss/world.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
  ],

  // ⚡ ENERGY (markets + policy)
  energy: [
    "https://oilprice.com/rss/main",
    "https://www.energy.gov/rss/articles.xml",
    "https://www.eia.gov/rss/press.xml",
  ],

  // 🇮🇳 INDIA AI / TECH
  india_ai: [
    "https://economictimes.indiatimes.com/rssfeeds/13357270.cms",
    "https://www.livemint.com/rss/technology",
    "https://www.business-standard.com/rss/technology",
  ],
};


export const htmlSources: string[] = [
  // intentionally empty for now — add only pages you know are scrapable
];