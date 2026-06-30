import React, { useState } from 'react';
import { Filter, Plus, Globe, X, SlidersHorizontal, ArrowRightLeft } from 'lucide-react';
import LeadCard from '@/components/leads/LeadCard';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { mockLeads } from '@/data/mockData';
// const MOCK_LEADS = [
//   {
//     id: 1,
//     platform: 'reddit',
//     author: 'u/TechGuru_42',
//     channel: 'r/SaaS',
//     timeAgo: '2 hours ago',
//     keyword: 'competitor monitoring',
//     intentScore: 96,
//     title: "Looking for an alternative to Brand24 that doesn't cost a fortune.",
//     content: "Currently paying for their enterprise tier but the data quality has been slipping lately. Does anyone know a tool that captures more real-time conversational data from niche tech forums? RedArky was mentioned but I'm not sure if it handles multi-platform monitoring yet...",
//     sourceUrl: '#'
//   },
//   {
//     id: 2,
//     platform: 'twitter',
//     author: '@growth_lead',
//     channel: 'Twitter',
//     timeAgo: '5 hours ago',
//     keyword: 'lead signal scraper',
//     intentScore: 84,
//     title: "B2B sales teams: how are you automating your cold outreach signals?",
//     content: "Manual prospecting is dead. We need to find people talking about outbound scaling pain points the second they tweet it. What's the stack for 2024? Looking for recommendations.",
//     sourceUrl: '#'
//   },
//   {
//     id: 3,
//     platform: 'hn',
//     author: 'alexm_dev',
//     channel: 'Hacker News',
//     timeAgo: '10 hours ago',
//     keyword: 'SaaS automation',
//     intentScore: 91,
//     title: "Show HN: Scaling social listening with vector DBs",
//     content: "We've been building a tool to bridge the gap between simple keyword alerts and deep semantic intent. Current solutions are too noisy or too expensive. We're looking for feedback from people running similar pipelines.",
//     sourceUrl: '#'
//   }
// ];

export default function ActionQueue() {
  const [intentThreshold, setIntentThreshold] = useState([75]);
  const [onlyUnread, setOnlyUnread] = useState(false);

  // Scrollbar-hiding utility class string
  const noScrollbarClass = "[&-::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    // <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden -mx-6 -my-6">
    <div className="flex h-[calc(100vh-64px)] w-[calc(100%+48px)] bg-slate-50 overflow-hidden -mx-6 -my-6">
    
      {/* Central Feed */}
      <section className={`flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar ${noScrollbarClass}`}>
        
        {/* Filter Pills Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-200">
              <Filter className="w-3.5 h-3.5" /> Intent &gt; 80 <X className="w-3.5 h-3.5 cursor-pointer hover:text-indigo-950" />
            </span>
            <span className="bg-indigo-100 text-indigo-900 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-200">
              <Globe className="w-3.5 h-3.5" /> Twitter & Reddit <X className="w-3.5 h-3.5 cursor-pointer hover:text-indigo-950" />
            </span>
            <button className="text-blue-600 hover:text-blue-800 transition text-sm font-bold flex items-center gap-1 ml-2">
              <Plus className="w-4 h-4" /> Add filter
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="unread-toggle" className="text-sm font-medium text-slate-500 cursor-pointer">
              Only unread
            </Label>
            <Switch 
              id="unread-toggle"
              checked={onlyUnread}
              onCheckedChange={setOnlyUnread}
            />
          </div>
        </div>

        {/* Lead Cards */}
        <div className="space-y-4 max-w-4xl">
          {mockLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </section>

      {/* Right Column Context Filters */}
      <aside className={`w-80 border-l border-slate-200 bg-white p-6 hidden xl:block overflow-y-auto ${noScrollbarClass}`}>
        <h2 className="text-lg font-bold text-slate-900 mb-8">Contextual Filters</h2>
        
        {/* Intent Slider */}
        <div className="mb-10">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
            Intent Threshold
          </Label>
          <div className="px-1">
            <Slider 
              value={intentThreshold} 
              onValueChange={setIntentThreshold} 
              max={100} 
              min={0} 
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0</span>
              <span className="text-blue-600 font-bold">{intentThreshold[0]} (Current)</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Platform Exclusions */}
        <div className="mb-10">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
            Platform Exclusions
          </Label>
          <div className="space-y-3">
            {['Reddit', 'Twitter (X)', 'Hacker News'].map((platform) => (
              <div key={platform} className="flex items-center space-x-3">
                <Checkbox id={platform} defaultChecked className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                <label htmlFor={platform} className="text-sm font-medium text-slate-700 cursor-pointer leading-none">
                  {platform}
                </label>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <Checkbox id="linkedin" className="border-slate-300" />
              <label htmlFor="linkedin" className="text-sm font-medium text-slate-700 cursor-pointer leading-none">
                LinkedIn Groups
              </label>
            </div>
            <div className="flex items-center space-x-3 opacity-50">
              <Checkbox id="slack" disabled className="border-slate-300" />
              <label htmlFor="slack" className="text-sm font-medium text-slate-500 italic leading-none">
                Slack Communities (Pro)
              </label>
            </div>
          </div>
        </div>

        {/* Live Stats Widget */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-8">
          <h3 className="text-xs font-bold mb-4 uppercase tracking-wider text-slate-500">
            Session Insights
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Daily Leads</p>
              <p className="text-lg font-black text-slate-900">142</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Avg Intent</p>
              <p className="text-lg font-black text-emerald-600">87.4</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Reply Rate</p>
              <p className="text-lg font-black text-blue-600">12%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Saved Time</p>
              <p className="text-lg font-black text-slate-900">4.2h</p>
            </div>
          </div>
        </div>

        {/* Promo Box */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-bold text-blue-800 mb-1">Scale your outreach</p>
            <p className="text-xs text-blue-600/80 leading-relaxed mb-4">
              Connect to Salesforce or HubSpot to sync leads automatically.
            </p>
            <Button variant="outline" className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-bold text-xs h-9">
              Enable CRM Sync
            </Button>
          </div>
          <ArrowRightLeft className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-5" />
        </div>
      </aside>
    </div>
  );
}