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
export const rssSources = [
  "https://techcrunch.com/feed/",
  "https://venturebeat.com/feed/",
  "https://feeds.arstechnica.com/arstechnica/technology-lab",
  "https://www.theverge.com/rss/index.xml",
  "https://www.wired.com/feed/tag/artificial-intelligence/latest/rss",
  "https://feeds.feedburner.com/AIWeekly",             
];

// HTML pages to scrape for deep content
export const htmlSources: string[] = [
  // intentionally empty for now — add only pages you know are scrapable
];