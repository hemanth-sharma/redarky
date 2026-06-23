// ─── Product Profile (Onboarding / Settings) ───────────────────────────
export const productProfile = {
    product_name: 'ScrapeFlow',
    tagline: 'JavaScript-rendered web scraping at scale',
    description:
      'ScrapeFlow is a developer-first web scraping API that handles JavaScript rendering, anti-bot bypass, and proxy rotation out of the box. Built for teams who need reliable data extraction without managing browser infrastructure.',
    target_audience:
      'Backend engineers, data teams, and indie hackers building data pipelines, price monitoring, or lead enrichment tools.',
    pain_points: [
      'Existing scraping tools fail on JavaScript-heavy sites',
      'Managing headless browser infrastructure is expensive and complex',
      'Anti-bot detection blocks legitimate data collection',
      'Proxy rotation and IP management is a headache',
    ],
    keywords: [
      'web scraping tool',
      'javascript rendering scraping',
      'anti-bot bypass',
      'headless browser api',
      'scraping api',
      'proxy rotation scraping',
    ],
    subreddits: [
      'r/webscraping',
      'r/webdev',
      'r/programming',
      'r/SaaS',
      'r/datascience',
      'r/learnpython',
    ],
    hn_enabled: true,
    competitors: ['ZenRows', 'ScrapingBee', 'Bright Data', 'Apify', 'Octoparse'],
  };
  
  // ─── Action Queue Leads ───────────────────────────────────────────────
  export const mockLeads = [
    {
      id: 'lead-1',
      thread_title:
        'Looking for a web scraping tool that actually handles JavaScript rendering',
      source: 'reddit',
      subreddit: 'r/webscraping',
      post_score: 47,
      time_ago: '2h ago',
      author: 'u/devscraper123',
      pain_point:
        "User needs to scrape JS-heavy SPAs for a price monitoring project. BeautifulSoup isn't enough — they need rendered DOM. They're actively comparing paid tools and asking the community for recommendations.",
      intent_score: 92,
      intent_reasoning:
        'Explicitly asking for tool recommendations, comparing paid options, mentions budget and timeline — strong purchase intent signals.',
      drafted_reply:
        "Hey! I ran into the exact same issue with JS-heavy sites last year. We ended up building ScrapeFlow specifically for this — it handles JS rendering, anti-bot bypass, and proxy rotation out of the box so you don't have to manage headless browsers yourself.\n\nFor price monitoring specifically, the rotating proxies are a lifesaver because e-commerce sites rate-limit aggressively. There's a free tier if you want to test it on your target sites first. Happy to share a sample script for your use case if that helps!",
      thread_url: 'https://reddit.com/r/webscraping/comments/example1',
      status: 'pending',
      matched_keyword: 'web scraping tool',
    },
    {
      id: 'lead-2',
      thread_title: 'ZenRows pricing is getting insane — any cheaper alternatives?',
      source: 'reddit',
      subreddit: 'r/SaaS',
      post_score: 89,
      time_ago: '4h ago',
      author: 'u/saas_builder',
      pain_point:
        "User is a paying ZenRows customer frustrated by a recent price increase. They're actively looking to switch to a cheaper alternative and asking the community for recommendations.",
      intent_score: 87,
      intent_reasoning:
        'Existing customer of a direct competitor, frustrated with pricing, explicitly asking for alternatives — high churn-capture opportunity.',
      drafted_reply:
        "Feel your pain — we've heard this from a lot of folks lately. If you're looking for a cheaper alternative, ScrapeFlow has a similar feature set (JS rendering, anti-bot, proxies) at roughly 40% less than ZenRows' current pricing.\n\nWe also don't gate API credits behind higher tiers, so you only pay for successful requests. There's a migration guide if you're coming from ZenRows — the API structure is pretty similar. Let me know if you want a pricing comparison for your specific usage.",
      thread_url: 'https://reddit.com/r/SaaS/comments/example2',
      status: 'pending',
      matched_keyword: 'ZenRows',
    },
    {
      id: 'lead-3',
      thread_title: 'Ask HN: Best tool for monitoring competitor mentions online?',
      source: 'hackernews',
      subreddit: 'Ask HN',
      post_score: 34,
      time_ago: '6h ago',
      author: 'throwaway_founder',
      pain_point:
        "Founder wants to monitor when their competitors are mentioned in developer communities. They're evaluating social listening tools and asking HN for recommendations.",
      intent_score: 78,
      intent_reasoning:
        'Founder-level decision maker, evaluating tools, but the need is adjacent to scraping — moderate intent for our core product.',
      drafted_reply:
        "For monitoring competitor mentions specifically in dev communities (Reddit, HN, etc.), you might want to look at a social listening tool rather than a raw scraping API. That said, if you're comfortable writing a bit of code, ScrapeFlow can power the data collection layer — you'd set up scheduled scrapes of relevant subreddits/HN threads and run sentiment/keyword analysis on the results.\n\nWe have a few customers using us this way. Happy to share an architecture sketch if that's the direction you're leaning.",
      thread_url: 'https://news.ycombinator.com/item?id=example3',
      status: 'pending',
      matched_keyword: 'social listening tool',
    },
    {
      id: 'lead-4',
      thread_title: 'How do you actually find leads on Reddit without getting banned?',
      source: 'reddit',
      subreddit: 'r/Entrepreneur',
      post_score: 156,
      time_ago: '8h ago',
      author: 'u/indie_hacker_jan',
      pain_point:
        "Indie hacker wants to use Reddit for lead generation but is worried about getting banned for self-promotion. They're asking for strategies and tools to find relevant conversations.",
      intent_score: 85,
      intent_reasoning:
        'Directly asking about Reddit lead generation strategies — this is our exact ICP. High engagement post (156 upvotes) means broad visibility.',
      drafted_reply:
        "Great question — the key is finding conversations where people are already describing the problem your product solves, then responding with genuine value (not a pitch). The mistake most people make is keyword-spamming their product link.\n\nWhat worked for us: monitor subreddits where your ICP hangs out, look for posts where someone is complaining about a problem or asking for tool recommendations, and respond with a helpful answer that naturally mentions your product only if it's genuinely relevant. We actually built an internal tool for this (finding high-intent conversations) — if you're curious I can share more about the workflow.",
      thread_url: 'https://reddit.com/r/Entrepreneur/comments/example4',
      status: 'pending',
      matched_keyword: 'find leads on Reddit',
    },
    {
      id: 'lead-5',
      thread_title: 'Anti-bot detection is killing my scraping project — solutions?',
      source: 'reddit',
      subreddit: 'r/webdev',
      post_score: 62,
      time_ago: '12h ago',
      author: 'u/fullstack_dev',
      pain_point:
        "Developer's scraping project is being blocked by Cloudflare and similar anti-bot systems. They're looking for bypass solutions and willing to pay for a reliable service.",
      intent_score: 71,
      intent_reasoning:
        'Active pain point directly related to our anti-bot feature, willing to pay, but might be looking for free/DIY solutions first.',
      drafted_reply:
        "Anti-bot detection is genuinely one of the hardest parts of web scraping — Cloudflare's Turnstile and similar systems are getting aggressive. A few things that helped us:\n\n1. Real browser fingerprints (not just header spoofing)\n2. Residential proxies instead of datacenter IPs\n3. Human-like request patterns (delays, mouse movements if using headless)\n\nIf you don't want to build all that yourself, ScrapeFlow handles anti-bot bypass as part of the API — we use real browser instances with residential proxy rotation. There's a free tier to test against your target site before committing.",
      thread_url: 'https://reddit.com/r/webdev/comments/example5',
      status: 'pending',
      matched_keyword: 'anti-bot bypass',
    },
    {
      id: 'lead-6',
      thread_title: 'Show HN: I built a no-code scraping tool with visual workflows',
      source: 'hackernews',
      subreddit: 'Show HN',
      post_score: 23,
      time_ago: '1d ago',
      author: 'competitor_dev',
      pain_point:
        'A competitor launched a no-code scraping tool. The thread has discussion about limitations and what users wish it could do — potential opportunity to engage with users expressing unmet needs.',
      intent_score: 45,
      intent_reasoning:
        'Competitor launch thread — users in comments may express unmet needs, but the post itself is not a buying signal. Low direct intent.',
      drafted_reply:
        "Congrats on the launch! The visual workflow approach is really interesting for non-technical users. One thing I noticed in the comments — a few folks mentioned needing JS rendering for SPAs, which can be tricky with no-code tools.\n\nWe took a different approach with ScrapeFlow (API-first for developers), but I think there's room for both. The no-code space for scraping is underserved. Curious how you're handling anti-bot detection in the visual builder?",
      thread_url: 'https://news.ycombinator.com/item?id=example6',
      status: 'pending',
      matched_keyword: 'scraping api',
    },
    {
      id: 'lead-7',
      thread_title: 'Best social listening tools for developer-focused products?',
      source: 'reddit',
      subreddit: 'r/softwaredevelopment',
      post_score: 41,
      time_ago: '1d ago',
      author: 'u/devtool_marketer',
      pain_point:
        "Marketing person at a dev tool company needs social listening specifically for developer communities (Reddit, HN, Discord). General tools like Brandwatch don't cover these well.",
      intent_score: 89,
      intent_reasoning:
        'Marketing professional with budget, specific need for dev community monitoring, comparing tools — very high intent for our broader value proposition.',
      drafted_reply:
        "Most general social listening tools (Brandwatch, Mention, etc.) are built for Twitter/LinkedIn and don't cover Reddit/HN well — which is exactly where developer conversations happen.\n\nFor dev-focused monitoring, you're looking at either: (1) a specialized tool, or (2) building it yourself with a scraping API + keyword filtering. We see a lot of dev tool companies go the DIY route with ScrapeFlow as the data layer — you get full control over which subreddits/threads to monitor and can build custom intent scoring on top.\n\nHappy to share how a couple of our customers set this up if useful.",
      thread_url: 'https://reddit.com/r/softwaredevelopment/comments/example7',
      status: 'pending',
      matched_keyword: 'social listening tool',
    },
    {
      id: 'lead-8',
      thread_title: 'Need to scrape 10K+ pages daily — what infrastructure do I need?',
      source: 'reddit',
      subreddit: 'r/datascience',
      post_score: 28,
      time_ago: '1d ago',
      author: 'u/data_engineer',
      pain_point:
        "Data engineer needs to scrape 10K+ pages daily for a data pipeline. They're asking about infrastructure requirements (proxies, rate limiting, concurrency) and considering managed services.",
      intent_score: 83,
      intent_reasoning:
        'Enterprise-scale need, infrastructure decision maker, considering managed services — strong intent for our proxy/infrastructure features.',
      drafted_reply:
        "At 10K+ pages/day, the main challenges are: (1) proxy rotation to avoid IP bans, (2) concurrency management, and (3) handling failures/retries gracefully.\n\nYou've got two paths: self-host with a proxy provider + your own orchestration, or use a managed scraping API that handles all of it. At that scale, managed usually works out cheaper once you factor in infra + maintenance time.\n\nScrapeFlow handles the proxy rotation, concurrency, and retries automatically — you just send URLs and get HTML/JSON back. At 10K/day you'd be on our Pro plan. Happy to run the numbers with you if you share the target sites.",
      thread_url: 'https://reddit.com/r/datascience/comments/example8',
      status: 'pending',
      matched_keyword: 'scraping api',
    },
    {
      id: 'lead-9',
      thread_title: 'BeautifulSoup vs Scrapy for sites that need JavaScript?',
      source: 'reddit',
      subreddit: 'r/learnpython',
      post_score: 19,
      time_ago: '2d ago',
      author: 'u/python_beginner',
      pain_point:
        "Beginner is comparing BeautifulSoup and Scrapy but realizes neither handles JavaScript rendering. They're learning and may not have budget yet.",
      intent_score: 62,
      intent_reasoning:
        'Relevant pain point (JS rendering) but beginner-level user, likely no budget. Good for brand awareness but lower direct purchase intent.',
      drafted_reply:
        "Good question! The key thing to know: BeautifulSoup and Scrapy are both HTML parsers — neither of them renders JavaScript. If the page loads content via JS (React/Vue SPAs, infinite scroll, etc.), you need a browser to render it first.\n\nFor learning, Playwright or Puppeteer (headless Chrome) is the way to go. For production scraping at scale, managing your own browser farm gets painful fast — that's where managed APIs like ScrapeFlow come in (we handle the browser + proxy layer for you). Start with Playwright to learn the concepts, then graduate to a managed service when you hit scale or anti-bot issues.",
      thread_url: 'https://reddit.com/r/learnpython/comments/example9',
      status: 'pending',
      matched_keyword: 'javascript rendering scraping',
    },
    {
      id: 'lead-10',
      thread_title: 'Ask HN: Alternatives to Octoparse that are developer-friendly?',
      source: 'hackernews',
      subreddit: 'Ask HN',
      post_score: 52,
      time_ago: '2d ago',
      author: 'hn_user_42',
      pain_point:
        "Developer is frustrated with Octoparse's no-code limitations and wants a developer-friendly alternative with an API. Actively looking to switch.",
      intent_score: 81,
      intent_reasoning:
        "Developer frustrated with competitor's limitations, wants API-first solution, actively looking to switch — strong intent.",
      drafted_reply:
        "If you're finding Octoparse's no-code approach limiting, you're probably looking for something API-first. The main developer-friendly alternatives are:\n\n- ScrapeFlow (us) — API-first, JS rendering + anti-bot + proxies, good for devs who want control without infra overhead\n- ScrapingBee — similar API approach, solid\n- Roll your own with Playwright + a proxy provider\n\nThe tradeoff is always: how much infra do you want to manage yourself vs. pay a managed service. If you're scraping more than a few hundred pages/day or hitting anti-bot walls, managed usually wins. Happy to share a quick API comparison if helpful.",
      thread_url: 'https://news.ycombinator.com/item?id=example10',
      status: 'pending',
      matched_keyword: 'Octoparse',
    },
    {
      id: 'lead-11',
      thread_title: 'Browser automation for scraping — Selenium vs Playwright vs Puppeteer?',
      source: 'reddit',
      subreddit: 'r/automation',
      post_score: 73,
      time_ago: '3d ago',
      author: 'u/automation_nerd',
      pain_point:
        "User is comparing browser automation tools for scraping. They're technical and building their own solution, so lower intent for a managed service.",
      intent_score: 55,
      intent_reasoning:
        'Technical user building their own solution — relevant topic but they may prefer DIY over a managed API. Moderate intent.',
      drafted_reply:
        "All three work, but in 2026 the landscape is pretty clear:\n\n- **Playwright** — best overall for new projects. Multi-language, fast, great debugging.\n- **Puppeteer** — solid if you're Node-only, but Playwright has mostly superseded it.\n- **Selenium** — still widely used in enterprise, but heavier and slower for scraping.\n\nOne thing to watch: if you're scraping at any real scale, you'll hit anti-bot detection and IP bans. That's where managing your own browser instances gets painful. A lot of folks start with Playwright, then move to a managed API (like ScrapeFlow) once they're spending more time on proxy/anti-bot infrastructure than on their actual product.",
      thread_url: 'https://reddit.com/r/automation/comments/example11',
      status: 'pending',
      matched_keyword: 'headless browser api',
    },
    {
      id: 'lead-12',
      thread_title: 'Building a lead gen pipeline — how do you find high-intent conversations?',
      source: 'reddit',
      subreddit: 'r/softwaredevelopment',
      post_score: 38,
      time_ago: '3d ago',
      author: 'u/founder_2026',
      pain_point:
        "Founder is building a lead gen pipeline and asking how to find high-intent conversations in developer communities. This is exactly what RedArky does — meta opportunity.",
      intent_score: 76,
      intent_reasoning:
        "Founder asking about lead gen pipelines in dev communities — this is our exact value proposition. They might be a customer OR a competitor, but either way high relevance.",
      drafted_reply:
        "This is a problem we think about a lot — finding high-intent conversations in dev communities is genuinely hard because most 'social listening' tools are built for Twitter/LinkedIn, not Reddit/HN.\n\nThe approach that works: (1) monitor specific subreddits/HN for keywords related to your product, (2) filter out noise (most keyword matches are irrelevant), (3) score each conversation for actual purchase intent, (4) draft a value-first response. The filtering + intent scoring is the hard part — raw keyword alerts have ~90% false positive rate.\n\nWe actually built an internal tool for this (it's how we find our own customers). Happy to share more about the workflow if you're building something similar.",
      thread_url: 'https://reddit.com/r/softwaredevelopment/comments/example12',
      status: 'pending',
      matched_keyword: 'find leads on Reddit',
    },
  ];
  
  // ─── Pipeline Stats (Dashboard) ──────────────────────────────────────
  export const pipelineStats = {
    raw_matches: 342,
    passed_filter_1: 89,
    passed_filter_2: 31,
    passed_filter_3: 18,
    reached_ai: 18,
    leads_generated: 12,
  };
  
  export const pipelineStages = [
    { label: 'Raw Keyword Matches', value: 342, color: '#94A3B8' },
    { label: 'Passed Relevance Filter', value: 89, color: '#6366F1' },
    { label: 'Passed Intent Filter', value: 31, color: '#7C3AED' },
    { label: 'Leads Generated', value: 12, color: '#A855F7' },
  ];
  
  // ─── Intent Score Distribution (Dashboard) ───────────────────────────
  export const intentDistribution = [
    { range: '0-20', count: 0 },
    { range: '20-40', count: 1 },
    { range: '40-60', count: 2 },
    { range: '60-80', count: 4 },
    { range: '80-100', count: 5 },
  ];
  
  // ─── Dashboard Stat Cards ─────────────────────────────────────────────
  export const dashboardStats = [
    {
      label: 'Leads Today',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: 'Target',
    },
    {
      label: 'Avg Intent Score',
      value: '75',
      change: '+5',
      changeType: 'positive',
      icon: 'Gauge',
    },
    {
      label: 'Approval Rate',
      value: '68%',
      change: '+12%',
      changeType: 'positive',
      icon: 'CheckCircle',
    },
    {
      label: 'Pipeline Efficiency',
      value: '3.5%',
      change: '-0.2%',
      changeType: 'negative',
      icon: 'Filter',
      progress: 3.5,
      footer: '12 Leads generated from 342 raw keyword matches today',
    },
  ];
  
  // ─── AI Visibility Tracker (Dashboard) ───────────────────────────────
  export const aiVisibilityPrompts = [
    {
      id: 'prompt-1',
      prompt: 'best alternative to ZenRows for Python',
      results: {
        chatgpt: { appeared: true, rank: 2, response_snippet: '...ScrapeFlow and ScrapingBee are solid alternatives...' },
        claude: { appeared: false, winner: 'ZenRows', response_snippet: '...ZenRows remains the top choice for Python...' },
        perplexity: { appeared: true, rank: 1, response_snippet: '...ScrapeFlow offers the best value for Python scraping...' },
      },
    },
    {
      id: 'prompt-2',
      prompt: 'web scraping API with JavaScript rendering',
      results: {
        chatgpt: { appeared: true, rank: 1, response_snippet: '...ScrapeFlow is purpose-built for JS rendering...' },
        claude: { appeared: true, rank: 3, response_snippet: '...consider ScrapeFlow, ScrapingBee, or Bright Data...' },
        perplexity: { appeared: true, rank: 2, response_snippet: '...ScrapeFlow and ZenRows both handle JS well...' },
      },
    },
    {
      id: 'prompt-3',
      prompt: 'cheapest scraping API for large scale',
      results: {
        chatgpt: { appeared: false, winner: 'ScrapingBee', response_snippet: '...ScrapingBee offers the most competitive pricing...' },
        claude: { appeared: false, winner: 'Bright Data', response_snippet: '...Bright Data for large-scale operations...' },
        perplexity: { appeared: true, rank: 3, response_snippet: '...ScrapeFlow, ScrapingBee, and Bright Data for scale...' },
      },
    },
    {
      id: 'prompt-4',
      prompt: 'anti-bot bypass web scraping tool',
      results: {
        chatgpt: { appeared: true, rank: 1, response_snippet: '...ScrapeFlow excels at anti-bot bypass...' },
        claude: { appeared: true, rank: 2, response_snippet: '...ScrapeFlow and ZenRows for anti-bot...' },
        perplexity: { appeared: true, rank: 1, response_snippet: '...ScrapeFlow is the top choice for anti-bot bypass...' },
      },
    },
    {
      id: 'prompt-5',
      prompt: 'developer friendly web scraping service',
      results: {
        chatgpt: { appeared: true, rank: 2, response_snippet: '...ScrapeFlow is very developer-friendly...' },
        claude: { appeared: false, winner: 'Apify', response_snippet: '...Apify for developer-friendly scraping...' },
        perplexity: { appeared: true, rank: 2, response_snippet: '...ScrapeFlow and Apify are both dev-friendly...' },
      },
    },
  ];
  
  export const aiVisibilitySummary = {
    total_prompts: 5,
    brand_appearances: 11,
    total_checks: 15,
    win_rate: '73%',
  };
  
  // ─── Recent Activity (Dashboard) ──────────────────────────────────────
  export const recentActivity = [
    {
      id: 'act-1',
      type: 'approved',
      lead_title: 'Looking for a web scraping tool that handles JavaScript rendering',
      source: 'r/webscraping',
      intent_score: 92,
      time: '10 min ago',
    },
    {
      id: 'act-2',
      type: 'approved',
      lead_title: 'ZenRows pricing is getting insane — any cheaper alternatives?',
      source: 'r/SaaS',
      intent_score: 87,
      time: '35 min ago',
    },
    {
      id: 'act-3',
      type: 'rejected',
      lead_title: 'Show HN: I built a no-code scraping tool with visual workflows',
      source: 'Show HN',
      intent_score: 45,
      time: '1h ago',
    },
    {
      id: 'act-4',
      type: 'approved',
      lead_title: 'How do you actually find leads on Reddit without getting banned?',
      source: 'r/Entrepreneur',
      intent_score: 85,
      time: '2h ago',
    },
    {
      id: 'act-5',
      type: 'rejected',
      lead_title: 'BeautifulSoup vs Scrapy for sites that need JavaScript?',
      source: 'r/learnpython',
      intent_score: 62,
      time: '3h ago',
    },
    {
      id: 'act-6',
      type: 'approved',
      lead_title: 'Best social listening tools for developer-focused products?',
      source: 'r/softwaredevelopment',
      intent_score: 89,
      time: '5h ago',
    },
  ];
  
  // ─── Top Keywords Performance (Dashboard) ────────────────────────────
  export const topKeywords = [
    { keyword: 'web scraping tool', leads: 4, avg_intent: 82 },
    { keyword: 'ZenRows', leads: 3, avg_intent: 87 },
    { keyword: 'social listening tool', leads: 2, avg_intent: 89 },
    { keyword: 'anti-bot bypass', leads: 2, avg_intent: 71 },
    { keyword: 'find leads on Reddit', leads: 2, avg_intent: 80 },
  ];
  
  // ─── Tracked Keywords (Sidebar) ───────────────────────────────────────
  export const trackedKeywords = [
    { id: 1, keyword: 'web scraping tool', reddit: true, hackernews: true },
    { id: 2, keyword: 'javascript rendering', reddit: true, hackernews: false },
    { id: 3, keyword: 'anti-bot bypass', reddit: true, hackernews: true },
    { id: 4, keyword: 'headless browser api', reddit: true, hackernews: true },
    { id: 5, keyword: 'proxy rotation', reddit: true, hackernews: false },
    { id: 6, keyword: 'scraping api', reddit: true, hackernews: true },
    { id: 7, keyword: 'ZenRows alternative', reddit: true, hackernews: false },
    { id: 8, keyword: 'vector database bottleneck', reddit: true, hackernews: true },
    { id: 9, keyword: 'brand monitoring', reddit: false, hackernews: true },
    { id: 10, keyword: 'google alerts', reddit: false, hackernews: false },
  ];
  
  // ─── System Log Events (TopBar Bell Popover) ──────────────────────────
  export const systemLogEvents = [
    { id: 1, time: '14:32:08', text: '● Scraper Run Complete: 142 new posts evaluated on r/rust.' },
    { id: 2, time: '14:31:45', text: '🔥 High-Intent Signal Captured: Match found for keyword "vector database bottleneck".' },
    { id: 3, time: '14:30:12', text: '⚠️ Rate Limit Warning: Reddit scraper pacing adjusted automatically.' },
    { id: 4, time: '14:28:33', text: '● Scraper Run Complete: 87 new posts evaluated on r/webdev.' },
    { id: 5, time: '14:27:09', text: '✓ AI Draft Generated: Reply drafted for lead #lead-1 (intent: 92).' },
    { id: 6, time: '14:25:51', text: '● Relevance Filter: 89 posts passed from 342 raw matches.' },
    { id: 7, time: '14:24:17', text: '⚠️ Rate Limit Warning: HN API throttling detected, backing off 30s.' },
    { id: 8, time: '14:22:03', text: '🔥 High-Intent Signal Captured: Match found for keyword "ZenRows alternative".' },
    { id: 9, time: '14:20:44', text: '● Intent Filter: 31 posts passed from 89 relevance-matched.' },
    { id: 10, time: '14:18:29', text: '✓ Pipeline Cycle Complete: 12 leads generated in run #482.' },
  ];