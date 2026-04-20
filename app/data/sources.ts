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
  ai_research: [
    "https://arxiv.org/rss/cs.AI",
    "https://deepmind.google/discover/blog/rss.xml",
    "https://openai.com/blog/rss.xml",
    "https://huggingface.co/blog/feed.xml",
  ],

  ai_industry: [
    "https://techcrunch.com/feed/",
    "https://venturebeat.com/feed/",
    "https://www.technologyreview.com/topic/artificial-intelligence/feed",
  ],

  geopolitics: [
    "https://www.reuters.com/world/rss",
    "https://www.ft.com/technology?format=rss",
  ],

  energy: [
    "https://www.reuters.com/business/energy/rss",
    "https://www.iea.org/rss/news",
  ],

  india_ai: [
    "https://economictimes.indiatimes.com/rssfeeds/13357270.cms",
    "https://www.livemint.com/rss/technology",
  ],
};
export const htmlSources: string[] = [
  // intentionally empty for now — add only pages you know are scrapable
];