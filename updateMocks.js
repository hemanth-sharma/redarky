import fs from 'fs';
import path from 'path';

const WEBSCRAPER_JSON_PATH = path.join(process.cwd(), 'mocked_webscraper.json');
const MOCK_DATA_JS_PATH = path.join(process.cwd(), 'src', 'data', 'mockData.js');

function runUpdate() {
  try {
    if (!fs.existsSync(WEBSCRAPER_JSON_PATH)) {
      console.error(`Error: Data source file not found at ${WEBSCRAPER_JSON_PATH}`);
      return;
    }
    const rawScraperData = JSON.parse(fs.readFileSync(WEBSCRAPER_JSON_PATH, 'utf-8'));
    const totalItems = rawScraperData.length;

    console.log(`Processing ${totalItems} raw items from JSON...`);

    // ─── 1. PROCESS AND TRANSFORMS ALL 91 LEADS ───────────────────────
    let totalScore = 0;
    const subredditSet = new Set();
    const keywordStatsMap = {};
    const intentRanges = { '0-20': 0, '20-40': 0, '40-60': 0, '60-80': 0, '80-100': 0 };

    const processedLeads = rawScraperData.map((item, index) => {
      const idNumber = index + 1;
      totalScore += item.score || 0;
      
      if (item.subreddit) subredditSet.add(item.subreddit);

      // Synthesize realistic intent data
      let intentScore = Math.floor(Math.random() * (98 - 65 + 1)) + 65;
      if (item.score > 10) intentScore = Math.min(intentScore + 5, 100);

      if (intentScore <= 20) intentRanges['0-20']++;
      else if (intentScore <= 40) intentRanges['20-40']++;
      else if (intentScore <= 60) intentRanges['40-60']++;
      else if (intentScore <= 80) intentRanges['60-80']++;
      else intentRanges['80-100']++;

      const kw = item.matched_keyword || 'web scraping tool';
      if (!keywordStatsMap[kw]) {
        keywordStatsMap[kw] = { count: 0, totalIntent: 0 };
      }
      keywordStatsMap[kw].count++;
      keywordStatsMap[kw].totalIntent += intentScore;

      const formattedAuthor = item.author && item.author !== 'unknown' 
        ? (item.source === 'reddit' ? `u/${item.author}` : item.author)
        : 'u/anonymous_dev';

      const channelName = item.subreddit ? `r/${item.subreddit}` : 'r/webscraping';

      // Spread ALL original keys so zero data is dropped, then overwrite/inject frontend requirements
      return {
        ...item, 
        id: `lead-${idNumber}`,
        
        // --- LEAD CARD COMPONENT EXACT KEY MATCHES ---
        platform: item.source || 'reddit',
        author: formattedAuthor,
        channel: channelName,
        timeAgo: `${Math.floor(idNumber * 1.5)}h ago`,
        keyword: kw,
        intentScore: intentScore,
        title: item.title || 'No Title Provided',
        content: item.content || 'No content provided...',
        sourceUrl: item.url || 'https://reddit.com',
        
        // --- BACKWARD COMPATIBILITY KEYS (Keep old layouts intact) ---
        thread_title: item.title || 'No Title Provided',
        source: item.source || 'reddit',
        subreddit: channelName,
        post_score: item.score || 0,
        time_ago: `${Math.floor(idNumber * 1.5)}h ago`,
        pain_point: `User matching keyword "${kw}" is posting in ${channelName}.`,
        intent_score: intentScore,
        intent_reasoning: `Extracted intent flags found matching context parameter: "${kw}".`,
        drafted_reply: `Hey ${formattedAuthor}! Saw you ran into some issues regarding ${kw}.\n\nWe built ScrapeFlow to natively handle headless browser processing, premium proxy rotations, and anti-bot bypass workflows out of the box so you don't have to manage raw cluster scaling. Let me know if you want a sample template structure!`,
        thread_url: item.url || 'https://reddit.com',
        status: 'pending'
      };
    });

    // ─── 2. CALCULATE DYNAMIC SYSTEM PERFORMANCE EXPORTS ─────────────
    const uniqueSubredditsList = Array.from(subredditSet).map(s => `r/${s}`).slice(0, 8);
    const passedFilter1 = Math.floor(totalItems * 0.26);
    const passedFilter2 = Math.floor(passedFilter1 * 0.35);
    const leadsGenerated = Math.floor(passedFilter2 * 0.6);

    const pipelineStats = {
      raw_matches: totalItems * 3,
      passed_filter_1: totalItems,
      passed_filter_2: passedFilter1,
      passed_filter_3: passedFilter2,
      reached_ai: passedFilter2,
      leads_generated: leadsGenerated,
    };

    const pipelineStages = [
      { label: 'Raw Keyword Matches', value: pipelineStats.raw_matches, color: '#94A3B8' },
      { label: 'Passed Relevance Filter', value: pipelineStats.passed_filter_1, color: '#6366F1' },
      { label: 'Passed Intent Filter', value: pipelineStats.passed_filter_2, color: '#7C3AED' },
      { label: 'Leads Generated', value: pipelineStats.leads_generated, color: '#A855F7' },
    ];

    const intentDistribution = Object.keys(intentRanges).map(range => ({
      range,
      count: intentRanges[range]
    }));

    const averageIntent = Math.round(processedLeads.reduce((acc, l) => acc + l.intentScore, 0) / totalItems) || 75;
    const dashboardStats = [
      { label: 'Leads Today', value: String(leadsGenerated), change: `+${Math.floor(leadsGenerated/4)}`, changeType: 'positive', icon: 'Target' },
      { label: 'Avg Intent Score', value: String(averageIntent), change: '+3', changeType: 'positive', icon: 'Gauge' },
      { label: 'Approval Rate', value: '72%', change: '+5%', changeType: 'positive', icon: 'CheckCircle' },
      {
        label: 'Pipeline Efficiency',
        value: `${((leadsGenerated / (totalItems * 3)) * 100).toFixed(1)}%`,
        change: '+0.4%',
        changeType: 'positive',
        icon: 'Filter',
        progress: parseFloat(((leadsGenerated / (totalItems * 3)) * 100).toFixed(1)),
        footer: `${leadsGenerated} Leads generated from ${totalItems * 3} raw keyword matches today`
      }
    ];

    const recentActivity = processedLeads.slice(0, 6).map((l, i) => ({
      id: `act-${i + 1}`,
      type: l.intentScore > 80 ? 'approved' : 'rejected',
      lead_title: l.title,
      source: l.channel,
      intent_score: l.intentScore,
      time: `${(i + 1) * 5} min ago`
    }));

    const topKeywords = Object.keys(keywordStatsMap).map(kw => ({
      keyword: kw,
      leads: keywordStatsMap[kw].count,
      avg_intent: Math.round(keywordStatsMap[kw].totalIntent / keywordStatsMap[kw].count)
    })).sort((a, b) => b.leads - a.leads).slice(0, 5);

    // ─── 3. STRIP AND REWRITE THE TARGET MOCK_DATA.JS FILE ───────────────
    let existingMockContent = fs.readFileSync(MOCK_DATA_JS_PATH, 'utf-8');

    // Update productProfile's subreddits subarray cleanly
    const subredditsRegex = /(subreddits:\s*\[)([\s\S]*?)(\])/;
    if (uniqueSubredditsList.length > 0) {
      existingMockContent = existingMockContent.replace(subredditsRegex, `$1\n      ${uniqueSubredditsList.map(s => `'${s}'`).join(',\n      ')}\n    $3`);
    }

    // Helper to dynamically overwrite export statements inside mockData.js
    const replaceExportVariable = (content, variableName, data) => {
      const regex = new RegExp(`(export\\s+const\\s+${variableName}\\s*=\\s*)[\\s\\S]*?;`);
      return content.replace(regex, `$1${JSON.stringify(data, null, 2)};`);
    };

    existingMockContent = replaceExportVariable(existingMockContent, 'mockLeads', processedLeads);
    existingMockContent = replaceExportVariable(existingMockContent, 'pipelineStats', pipelineStats);
    existingMockContent = replaceExportVariable(existingMockContent, 'pipelineStages', pipelineStages);
    existingMockContent = replaceExportVariable(existingMockContent, 'intentDistribution', intentDistribution);
    existingMockContent = replaceExportVariable(existingMockContent, 'dashboardStats', dashboardStats);
    existingMockContent = replaceExportVariable(existingMockContent, 'recentActivity', recentActivity);
    existingMockContent = replaceExportVariable(existingMockContent, 'topKeywords', topKeywords);

    fs.writeFileSync(MOCK_DATA_JS_PATH, existingMockContent, 'utf-8');
    console.log(`\n🎉 Success! Synchronized all dashboard metrics and card parameters for ${totalItems} posts successfully.`);

  } catch (error) {
    console.error("Pipeline Sync aborted via execution error:", error);
  }
}

runUpdate();