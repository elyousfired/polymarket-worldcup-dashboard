import React, { useState } from 'react';
import { 
  AreaChart,
  Area,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { 
  Search, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity,
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';

// Extended database of World Cup 2026 Teams with historical Qatar 2022 points and current 2026 outright charts
const EXTENDED_TEAMS_DB = {
  FRA: {
    name: "France", code: "FRA", flag: "🇫🇷", group: "Group I", coach: "Didier Deschamps", keyPlayer: "Kylian Mbappé", fifaRank: 2, color: "#3b82f6",
    currentTrend: [
      { day: 'May 4', price: 0.175 }, { day: 'May 6', price: 0.176 }, { day: 'May 8', price: 0.182 }, { day: 'May 10', price: 0.184 }, { day: 'May 12', price: 0.185 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 12.0 }, { stage: "Matchday 1", prob: 13.5 }, { stage: "Matchday 3", prob: 14.0 }, 
      { stage: "Round of 16", prob: 16.5 }, { stage: "Quarter-Finals", prob: 25.0 }, { stage: "Semi-Finals", prob: 42.0 }, { stage: "Finals", prob: 0.0 }
    ],
    strategyTip: "French outright contract values are heavily backed by institutional traders. Recommending ACCUMULATION on minor price dips."
  },
  BRA: {
    name: "Brazil", code: "BRA", flag: "🇧🇷", group: "Group C", coach: "Dorival Júnior", keyPlayer: "Vinícius Júnior", fifaRank: 5, color: "#eab308",
    currentTrend: [
      { day: 'May 4', price: 0.165 }, { day: 'May 6', price: 0.160 }, { day: 'May 8', price: 0.155 }, { day: 'May 10', price: 0.159 }, { day: 'May 12', price: 0.160 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 18.0 }, { stage: "Matchday 1", prob: 18.5 }, { stage: "Matchday 3", prob: 19.5 }, 
      { stage: "Round of 16", prob: 22.0 }, { stage: "Quarter-Finals", prob: 0.0 }
    ],
    strategyTip: "Brazil's outright probability remains highly stable. The Seleção YES token represents a low-volatility anchor position."
  },
  ESP: {
    name: "Spain", code: "ESP", flag: "🇪🇸", group: "Group H", coach: "Luis de la Fuente", keyPlayer: "Lamine Yamal", fifaRank: 3, color: "#ef4444",
    currentTrend: [
      { day: 'May 4', price: 0.120 }, { day: 'May 6', price: 0.125 }, { day: 'May 8', price: 0.128 }, { day: 'May 10', price: 0.132 }, { day: 'May 12', price: 0.138 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 10.0 }, { stage: "Matchday 1", prob: 12.0 }, { stage: "Matchday 3", prob: 11.5 }, 
      { stage: "Round of 16", prob: 0.0 }
    ],
    strategyTip: "Extreme technical momentum spotted. Backing from domestic retail traders has pushed Spain YES contract up +15% this week."
  },
  ENG: {
    name: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "Group L", coach: "Thomas Tuchel", keyPlayer: "Jude Bellingham", fifaRank: 4, color: "#94a3b8",
    currentTrend: [
      { day: 'May 4', price: 0.110 }, { day: 'May 6', price: 0.115 }, { day: 'May 8', price: 0.116 }, { day: 'May 10', price: 0.115 }, { day: 'May 12', price: 0.115 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 11.0 }, { stage: "Matchday 1", prob: 11.8 }, { stage: "Matchday 3", prob: 12.2 }, 
      { stage: "Round of 16", prob: 13.5 }, { stage: "Quarter-Finals", prob: 0.0 }
    ],
    strategyTip: "Thomas Tuchel's tactical structural adjustments are bullish. Best suited for hedging positions against France in early knockout rounds."
  },
  ARG: {
    name: "Argentina", code: "ARG", flag: "🇦🇷", group: "Group J", coach: "Lionel Scaloni", keyPlayer: "Lionel Messi", fifaRank: 1, color: "#06b6d4",
    currentTrend: [
      { day: 'May 4', price: 0.088 }, { day: 'May 6', price: 0.090 }, { day: 'May 8', price: 0.091 }, { day: 'May 10', price: 0.092 }, { day: 'May 12', price: 0.092 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 14.5 }, { stage: "Matchday 1", prob: 6.5 }, { stage: "Matchday 3", prob: 11.0 }, 
      { stage: "Round of 16", prob: 13.5 }, { stage: "Quarter-Finals", prob: 22.0 }, { stage: "Semi-Finals", prob: 45.0 }, { stage: "Finals", prob: 100.0 }
    ],
    strategyTip: "Riding high on the legendary Qatar payout. The current valuation has a 'Messiah Premium' factored in, but solid defending makes them strong."
  },
  GER: {
    name: "Germany", code: "GER", flag: "🇩🇪", group: "Group E", coach: "Julian Nagelsmann", keyPlayer: "Jamal Musiala", fifaRank: 11, color: "#475569",
    currentTrend: [
      { day: 'May 4', price: 0.070 }, { day: 'May 6', price: 0.072 }, { day: 'May 8', price: 0.075 }, { day: 'May 10', price: 0.075 }, { day: 'May 12', price: 0.075 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 8.5 }, { stage: "Matchday 1", prob: 5.0 }, { stage: "Matchday 3", prob: 0.0 }
    ],
    strategyTip: "Germany looks to redeem the early group stage exit in Qatar. Undervalued outright target for high-risk trading."
  },
  POR: {
    name: "Portugal", code: "POR", flag: "🇵🇹", group: "Group K", coach: "Roberto Martínez", keyPlayer: "Cristiano Ronaldo", fifaRank: 6, color: "#10b981",
    currentTrend: [
      { day: 'May 4', price: 0.055 }, { day: 'May 6', price: 0.056 }, { day: 'May 8', price: 0.057 }, { day: 'May 10', price: 0.058 }, { day: 'May 12', price: 0.058 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 7.0 }, { stage: "Matchday 1", prob: 7.5 }, { stage: "Matchday 3", prob: 8.2 }, 
      { stage: "Round of 16", prob: 10.0 }, { stage: "Quarter-Finals", prob: 0.0 }
    ],
    strategyTip: "Portugal's younger roster offers massive high-yield explosive upside. YES contract pays out 17x implied return."
  },
  NED: {
    name: "Netherlands", code: "NED", flag: "🇳🇱", group: "Group F", coach: "Ronald Koeman", keyPlayer: "Virgil van Dijk", fifaRank: 7, color: "#f97316",
    currentTrend: [
      { day: 'May 4', price: 0.040 }, { day: 'May 6', price: 0.041 }, { day: 'May 8', price: 0.042 }, { day: 'May 10', price: 0.042 }, { day: 'May 12', price: 0.042 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 6.5 }, { stage: "Matchday 1", prob: 7.0 }, { stage: "Matchday 3", prob: 8.5 }, 
      { stage: "Round of 16", prob: 11.5 }, { stage: "Quarter-Finals", prob: 14.0 }, { stage: "Semi-Finals", prob: 0.0 }
    ],
    strategyTip: "Highly resilient squad with proven knockout bracket history. YES shares are an excellent mid-tier speculative hold."
  },
  MAR: {
    name: "Morocco", code: "MAR", flag: "🇲🇦", group: "Group C", coach: "Walid Regragui", keyPlayer: "Achraf Hakimi", fifaRank: 13, color: "#047857",
    currentTrend: [
      { day: 'May 4', price: 0.035 }, { day: 'May 6', price: 0.035 }, { day: 'May 8', price: 0.038 }, { day: 'May 10', price: 0.039 }, { day: 'May 12', price: 0.040 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 0.5 }, { stage: "Matchday 1", prob: 0.8 }, { stage: "Matchday 3", prob: 2.2 }, 
      { stage: "Round of 16", prob: 5.5 }, { stage: "Quarter-Finals", prob: 12.0 }, { stage: "Semi-Finals", prob: 15.0 }, { stage: "Finals", prob: 0.0 }
    ],
    strategyTip: "The legendary black swan of Qatar. Active group backing makes Morocco outright tokens excellent high-yield speculative assets."
  },
  CRO: {
    name: "Croatia", code: "CRO", flag: "🇭🇷", group: "Group L", coach: "Zlatko Dalić", keyPlayer: "Luka Modrić", fifaRank: 10, color: "#b91c1c",
    currentTrend: [
      { day: 'May 4', price: 0.030 }, { day: 'May 6', price: 0.031 }, { day: 'May 8', price: 0.032 }, { day: 'May 10', price: 0.032 }, { day: 'May 12', price: 0.033 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 2.5 }, { stage: "Matchday 1", prob: 2.4 }, { stage: "Matchday 3", prob: 4.5 }, 
      { stage: "Round of 16", prob: 6.0 }, { stage: "Quarter-Finals", prob: 10.5 }, { stage: "Semi-Finals", prob: 0.0 }
    ],
    strategyTip: "Renowned tournament bracket giants. Luka Modrić's final tournament ensures steady leadership and resilient pricing."
  },
  BEL: {
    name: "Belgium", code: "BEL", flag: "🇧🇪", group: "Group G", coach: "Domenico Tedesco", keyPlayer: "Kevin De Bruyne", fifaRank: 8, color: "#be123c",
    currentTrend: [
      { day: 'May 4', price: 0.025 }, { day: 'May 6', price: 0.026 }, { day: 'May 8', price: 0.025 }, { day: 'May 10', price: 0.026 }, { day: 'May 12', price: 0.026 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 6.8 }, { stage: "Matchday 1", prob: 7.0 }, { stage: "Matchday 3", prob: 0.0 }
    ],
    strategyTip: "Post-Golden Generation rebuilding phase. The market remains bearish, leading to heavily discounted outright pricing."
  },
  USA: {
    name: "United States", code: "USA", flag: "🇺🇸", group: "Group D", coach: "Mauricio Pochettino", keyPlayer: "Christian Pulisic", fifaRank: 16, color: "#1d4ed8",
    currentTrend: [
      { day: 'May 4', price: 0.020 }, { day: 'May 6', price: 0.022 }, { day: 'May 8', price: 0.024 }, { day: 'May 10', price: 0.024 }, { day: 'May 12', price: 0.025 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 1.0 }, { stage: "Matchday 1", prob: 1.2 }, { stage: "Matchday 3", prob: 1.8 }, 
      { stage: "Round of 16", prob: 0.0 }
    ],
    strategyTip: "Hosts of 2026 with Pochettino leading. Speculators are actively accumulating USA outright contracts for home-field advantage spikes."
  },
  JPN: {
    name: "Japan", code: "JPN", flag: "🇯🇵", group: "Group F", coach: "Hajime Moriyasu", keyPlayer: "Kaoru Mitoma", fifaRank: 18, color: "#1e3a8a",
    currentTrend: [
      { day: 'May 4', price: 0.015 }, { day: 'May 6', price: 0.018 }, { day: 'May 8', price: 0.018 }, { day: 'May 10', price: 0.019 }, { day: 'May 12', price: 0.020 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 0.8 }, { stage: "Matchday 1", prob: 2.2 }, { stage: "Matchday 3", prob: 2.5 }, 
      { stage: "Round of 16", prob: 0.0 }
    ],
    strategyTip: "Tactically elite team with strong team cohesion. Japan YES shares represent a highly undervalued, high-upside option."
  },
  MEX: {
    name: "Mexico", code: "MEX", flag: "🇲🇽", group: "Group A", coach: "Javier Aguirre", keyPlayer: "Santiago Giménez", fifaRank: 15, color: "#047857",
    currentTrend: [
      { day: 'May 4', price: 0.015 }, { day: 'May 6', price: 0.015 }, { day: 'May 8', price: 0.016 }, { day: 'May 10', price: 0.017 }, { day: 'May 12', price: 0.018 }
    ],
    qatarTrend: [
      { stage: "Pre-Tourney", prob: 1.2 }, { stage: "Matchday 1", prob: 1.2 }, { stage: "Matchday 3", prob: 0.0 }
    ],
    strategyTip: "Co-hosts of 2026 aiming for deep knockout brackets. Heavy home fan support creates explosive potential in local order volumes."
  }
};

export default function TeamsExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [activeCode, setActiveCode] = useState('FRA');

  const selectedTeam = EXTENDED_TEAMS_DB[activeCode] || EXTENDED_TEAMS_DB.FRA;
  const payoutMultiplier = selectedTeam.currentTrend[selectedTeam.currentTrend.length - 1].price > 0 
    ? (1 / selectedTeam.currentTrend[selectedTeam.currentTrend.length - 1].price).toFixed(1) 
    : 'N/A';

  // Filter team codes based on search and selected group
  const filteredCodes = Object.keys(EXTENDED_TEAMS_DB).filter(code => {
    const t = EXTENDED_TEAMS_DB[code];
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'ALL' || t.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const GROUPS_LIST = ['ALL', 'Group A', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Group I', 'Group J', 'Group K', 'Group L'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Contenders & Teams Explorer
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Browse all major squads. Click any team card to load live pricing charts, Qatar 2022 historical curves, and trading strategies.
        </p>
      </div>

      {/* Search & Filtering Navigation panel */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input 
            type="text" 
            placeholder="Search teams by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '10px 12px 10px 40px',
              fontFamily: 'inherit',
              fontSize: '13px',
              color: '#f8fafc',
              outline: 'none',
              transition: '0.2s'
            }}
          />
        </div>

        {/* Group Selector Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0 }}>
          {GROUPS_LIST.map((g) => {
            const isSelected = selectedGroup === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                style={{
                  border: 'none',
                  background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`,
                  color: isSelected ? '#10b981' : '#64748b',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: '0.2s'
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Screen Workspace: Team Cards (Left) & Extended Analytics Drawer (Right) */}
      <div className="grid-main">
        {/* Left Side: Contenders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredCodes.map((code) => {
            const t = EXTENDED_TEAMS_DB[code];
            const isActive = activeCode === code;
            const currentPrice = t.currentTrend[t.currentTrend.length - 1].price;
            const currentProb = (currentPrice * 100).toFixed(1);

            return (
              <div 
                key={code}
                className="glass-panel glass-panel-hover"
                onClick={() => setActiveCode(code)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: isActive ? t.color : 'rgba(255,255,255,0.05)',
                  background: isActive ? `linear-gradient(135deg, rgba(8,12,26,0.8), rgba(255,255,255,0.01))` : 'rgba(13,20,38,0.45)',
                  boxShadow: isActive ? `0 4px 20px -2px ${t.color}25` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                {/* Glowing Active Border Dot */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: t.color,
                    boxShadow: `0 0 8px ${t.color}`
                  }}></div>
                )}

                <span style={{ fontSize: '32px', margin: '4px 0' }}>{t.flag}</span>
                
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{t.name}</h3>
                  <span className="data-mono" style={{ fontSize: '10px', color: '#64748b' }}>{code} • {t.group}</span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <p style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outright Odds</p>
                  <p className="data-mono" style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', marginTop: '2px' }}>
                    {currentProb}%
                  </p>
                </div>
              </div>
            );
          })}

          {filteredCodes.length === 0 && (
            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: '#64748b' }}>
              <HelpCircle size={32} style={{ margin: '0 auto 12px auto', display: 'block' }} />
              <p style={{ fontSize: '13px' }}>No teams found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Right Side: Analytical Details Deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Profile Card */}
          <div className="glass-panel" style={{ border: `1px solid ${selectedTeam.color}25`, background: `linear-gradient(180deg, ${selectedTeam.color}05, transparent)`, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '16px' }}>
              <span style={{ fontSize: '42px' }}>{selectedTeam.flag}</span>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>{selectedTeam.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span className="badge badge-blue">{selectedTeam.group}</span>
                  <span className="data-mono" style={{ fontSize: '11px', color: '#64748b' }}>FIFA Rank: #{selectedTeam.fifaRank}</span>
                </div>
              </div>

              <div style={{ marginLeft: 'auto', background: `${selectedTeam.color}15`, border: `1px solid ${selectedTeam.color}35`, padding: '6px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <span className="data-mono" style={{ fontSize: '10px', color: selectedTeam.color, fontWeight: '700', textTransform: 'uppercase' }}>Multiplier</span>
                <p className="data-mono" style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc', marginTop: '2px' }}>{payoutMultiplier}x</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Squad Manager</span>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>{selectedTeam.coach}</p>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Key Catalyst</span>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>{selectedTeam.keyPlayer}</p>
              </div>
            </div>
          </div>

          {/* Current Outright Price Curve (2026) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} className="glow-text-emerald" style={{ color: '#10b981' }} />
              Current Outright Winner Trend (2026)
            </h3>
            
            <div style={{ width: '100%', height: '180px', background: 'rgba(0, 0, 0, 0.15)', padding: '16px 8px 4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedTeam.currentTrend}>
                  <defs>
                    <linearGradient id={`colorCurrent-${selectedTeam.code}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedTeam.color} stopOpacity={0.35}/>
                      <stop offset="95%" stopColor={selectedTeam.color} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} />
                  <YAxis 
                    stroke="#475569" 
                    tick={{ fill: '#64748b', fontSize: 9 }} 
                    domain={['auto', 'auto']} 
                    padding={{ top: 24, bottom: 20 }} 
                    tickFormatter={(val) => `${(val * 100).toFixed(1)}%`} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(8, 12, 26, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '11px', color: '#f8fafc' }}
                    formatter={(value) => [`${(value * 100).toFixed(2)}%`, "Implied Win Probability"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    name="Contract Value" 
                    stroke={selectedTeam.color} 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill={`url(#colorCurrent-${selectedTeam.code})`}
                  >
                    <LabelList 
                      dataKey="price" 
                      position="top" 
                      formatter={(val) => `${(val * 100).toFixed(1)}%`} 
                      style={{ fill: '#f8fafc', fontSize: '9px', fontWeight: '700', fontFamily: 'JetBrains Mono' }} 
                    />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Qatar Historical Curve (2022) */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} className="glow-text-cyan" style={{ color: '#06b6d4' }} />
              Qatar 2022 Win Probability Path
            </h3>

            {selectedTeam.qatarTrend[0]?.prob !== 0.0 ? (
              <div style={{ width: '100%', height: '180px', background: 'rgba(0, 0, 0, 0.15)', padding: '16px 8px 4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedTeam.qatarTrend}>
                    <defs>
                      <linearGradient id={`colorQatar-${selectedTeam.code}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                    <XAxis dataKey="stage" stroke="#475569" tick={{ fill: '#64748b', fontSize: 8 }} axisLine={false} />
                    <YAxis 
                      stroke="#475569" 
                      tick={{ fill: '#64748b', fontSize: 9 }} 
                      domain={['auto', 'auto']} 
                      padding={{ top: 24, bottom: 20 }} 
                      tickFormatter={(val) => `${val}%`} 
                      axisLine={false} 
                    />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(8, 12, 26, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '11px', color: '#f8fafc' }}
                      formatter={(value) => [`${value}%`, "Win Probability"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="prob" 
                      name="Win Prob %" 
                      stroke="#10b981" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill={`url(#colorQatar-${selectedTeam.code})`}
                    >
                      <LabelList 
                        dataKey="prob" 
                        position="top" 
                        formatter={(val) => `${val}%`} 
                        style={{ fill: '#f8fafc', fontSize: '9px', fontWeight: '700', fontFamily: 'JetBrains Mono' }} 
                      />
                    </Area>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                🇮🇹 Did not qualify/participate in Qatar 2022 tournament.
              </div>
            )}
          </div>

          {/* Strategy Tip Alert */}
          <div className="glass-panel font-mono" style={{ padding: '14px', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <Sparkles size={16} className="glow-text-emerald" style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', textTransform: 'uppercase' }}>TERMINAL TRADING STRATEGY</p>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4', marginTop: '4px' }}>
                {selectedTeam.strategyTip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
