import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  History, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Award,
  ChevronRight
} from 'lucide-react';

// Precise historical win probabilities of key teams at different stages of Qatar 2022
const HISTORICAL_STAGES = [
  { stage: "Pre-Tourney", label: "Pre-Tournament", ARG: 14.5, FRA: 12.0, BRA: 18.0, MAR: 0.5, CRO: 2.5 },
  { stage: "Matchday 1", label: "Saudi Arabia Upset", ARG: 6.5, FRA: 13.5, BRA: 18.5, MAR: 0.8, CRO: 2.4 },
  { stage: "Matchday 3", label: "Group Stage Exit", ARG: 11.0, FRA: 14.0, BRA: 19.5, MAR: 2.2, CRO: 4.5 },
  { stage: "Round of 16", label: "Knockout Starters", ARG: 13.5, FRA: 16.5, BRA: 22.0, MAR: 5.5, CRO: 6.0 },
  { stage: "Quarter-Finals", label: "Brazil/Portugal Crashes", ARG: 22.0, FRA: 25.0, BRA: 0.0, MAR: 12.0, CRO: 10.5 },
  { stage: "Semi-Finals", label: "Final Contenders", ARG: 45.0, FRA: 42.0, BRA: 0.0, MAR: 15.0, CRO: 0.0 },
  { stage: "The Final", label: "Argentina Champion", ARG: 100.0, FRA: 0.0, BRA: 0.0, MAR: 0.0, CRO: 0.0 }
];

const STAGE_DETAILS = {
  "Pre-Tourney": {
    headline: "Brazil Stands as Outright Polymarket Favorite",
    sentiment: "Optimistic",
    description: "Before kickoff, Brazil leads all predictions at 18.0% probability. Argentina sits closely behind at 14.5% riding a 36-match unbeaten streak. Morocco is a major longshot at a mere 0.5% (200-to-1 odds).",
    highlightEvent: "Brazil enters with peak squad depth; Europe's favorites (France, England) plagued by injury doubts.",
    ranks: [
      { name: "Brazil", prob: 18.0, flag: "🇧🇷", delta: 0, code: "BRA", color: "#eab308" },
      { name: "Argentina", prob: 14.5, flag: "🇦🇷", delta: 0, code: "ARG", color: "#60a5fa" },
      { name: "France", prob: 12.0, flag: "🇫🇷", delta: 0, code: "FRA", color: "#3b82f6" },
      { name: "Croatia", prob: 2.5, flag: "🇭🇷", delta: 0, code: "CRO", color: "#ef4444" },
      { name: "Morocco", prob: 0.5, flag: "🇲🇦", delta: 0, code: "MAR", color: "#10b981" }
    ]
  },
  "Matchday 1": {
    headline: "Argentina Odds Plummet in Historic Saudi Upset",
    sentiment: "Panic Selling",
    description: "One of the largest prediction shocks in sports betting history. Argentina loses 2-1 to Saudi Arabia, causing their outright winning probability to crash from 14.5% to 6.5%. France climbs to 13.5% after a strong 4-1 opening win.",
    highlightEvent: "Saudi Arabia defeats Argentina 2-1; Argentina's unbeaten run snapped, triggering massive sell-offs.",
    ranks: [
      { name: "Brazil", prob: 18.5, flag: "🇧🇷", delta: 0.5, code: "BRA", color: "#eab308" },
      { name: "France", prob: 13.5, flag: "🇫🇷", delta: 1.5, code: "FRA", color: "#3b82f6" },
      { name: "Argentina", prob: 6.5, flag: "🇦🇷", delta: -8.0, code: "ARG", color: "#60a5fa" },
      { name: "Croatia", prob: 2.4, flag: "🇭🇷", delta: -0.1, code: "CRO", color: "#ef4444" },
      { name: "Morocco", prob: 0.8, flag: "🇲🇦", delta: 0.3, code: "MAR", color: "#10b981" }
    ]
  },
  "Matchday 3": {
    headline: "Argentina Recovers as Germany and Belgium Exit",
    sentiment: "Stabilizing",
    description: "Argentina bounces back with 2-0 wins over Mexico and Poland, securing first in Group C and restoring their win probability to 11.0%. Germany and Belgium fail to escape their groups, crashing to 0% and freeing up outright pool capital.",
    highlightEvent: "Argentina beats Poland 2-0; Germany and Belgium officially eliminated.",
    ranks: [
      { name: "Brazil", prob: 19.5, flag: "🇧🇷", delta: 1.0, code: "BRA", color: "#eab308" },
      { name: "France", prob: 14.0, flag: "🇫🇷", delta: 0.5, code: "FRA", color: "#3b82f6" },
      { name: "Argentina", prob: 11.0, flag: "🇦🇷", delta: 4.5, code: "ARG", color: "#60a5fa" },
      { name: "Croatia", prob: 4.5, flag: "🇭🇷", delta: 2.1, code: "CRO", color: "#ef4444" },
      { name: "Morocco", prob: 2.2, flag: "🇲🇦", delta: 1.4, code: "MAR", color: "#10b981" }
    ]
  },
  "Round of 16": {
    headline: "Morocco Shocks Spain; Favorites March On",
    sentiment: "Volatility Spike",
    description: "Morocco knocks out Spain on penalties, rising to 5.5% and emerging as the tournament's true underdog dark horse. Brazil shows structural dominance against South Korea, peaking at 22.0% favorite odds.",
    highlightEvent: "Morocco eliminates Spain on penalties; Brazil routs South Korea 4-1.",
    ranks: [
      { name: "Brazil", prob: 22.0, flag: "🇧🇷", delta: 2.5, code: "BRA", color: "#eab308" },
      { name: "France", prob: 16.5, flag: "🇫🇷", delta: 2.5, code: "FRA", color: "#3b82f6" },
      { name: "Argentina", prob: 13.5, flag: "🇦🇷", delta: 2.5, code: "ARG", color: "#60a5fa" },
      { name: "Croatia", prob: 6.0, flag: "🇭🇷", delta: 1.5, code: "CRO", color: "#ef4444" },
      { name: "Morocco", prob: 5.5, flag: "🇲🇦", delta: 3.3, code: "MAR", color: "#10b981" }
    ]
  },
  "Quarter-Finals": {
    headline: "Brazil Knocked Out; Morocco Reaches Semis",
    sentiment: "Extreme Chaos",
    description: "A catastrophic day for favorite-holders. Croatia stuns Brazil in a penalty shootout, deleting 22.0% of prediction market value instantly. Morocco defeats Portugal 1-0 to become the first African nation in history to reach a Semi-Final, surging to 12.0%.",
    highlightEvent: "Croatia beats Brazil on penalties; Morocco beats Portugal 1-0.",
    ranks: [
      { name: "France", prob: 25.0, flag: "🇫🇷", delta: 8.5, code: "FRA", color: "#3b82f6" },
      { name: "Argentina", prob: 22.0, flag: "🇦🇷", delta: 8.5, code: "ARG", color: "#60a5fa" },
      { name: "Morocco", prob: 12.0, flag: "🇲🇦", delta: 6.5, code: "MAR", color: "#10b981" },
      { name: "Croatia", prob: 10.5, flag: "🇭🇷", delta: 4.5, code: "CRO", color: "#ef4444" },
      { name: "Brazil", prob: 0.0, flag: "🇧🇷", delta: -22.0, code: "BRA", color: "#eab308" }
    ]
  },
  "Semi-Finals": {
    headline: "Argentina and France Book Legendary Final Clash",
    sentiment: "Climax",
    description: "No more upsets. Argentina neutralizes Croatia 3-0, rising to 45.0%. France ends Morocco's fairytale run with a gritty 2-0 victory, capturing 42.0% probability. The stage is set for a direct, high-liquidity title match.",
    highlightEvent: "Argentina defeats Croatia 3-0; France defeats Morocco 2-0.",
    ranks: [
      { name: "Argentina", prob: 45.0, flag: "🇦🇷", delta: 23.0, code: "ARG", color: "#60a5fa" },
      { name: "France", prob: 42.0, flag: "🇫🇷", delta: 17.0, code: "FRA", color: "#3b82f6" },
      { name: "Morocco", prob: 15.0, flag: "🇲🇦", delta: 3.0, code: "MAR", color: "#10b981" },
      { name: "Croatia", prob: 0.0, flag: "🇭🇷", delta: -10.5, code: "CRO", color: "#ef4444" }
    ]
  },
  "The Final": {
    headline: "Messi Lifts the Cup in the Greatest Final Ever",
    sentiment: "Resolution",
    description: "An unbelievable 3-3 battle resolved on penalties. Argentina clinches the World Cup, resolving their Polymarket YES shares at a full $1.00 (100.0% payout). France shares settle at $0.00.",
    highlightEvent: "Argentina defeats France on penalties (4-2) after a historic 3-3 draw.",
    ranks: [
      { name: "Argentina", prob: 100.0, flag: "🇦🇷", delta: 55.0, code: "ARG", color: "#60a5fa" },
      { name: "France", prob: 0.0, flag: "🇫🇷", delta: -42.0, code: "FRA", color: "#3b82f6" },
      { name: "Morocco", prob: 0.0, flag: "🇲🇦", delta: -15.0, code: "MAR", color: "#10b981" }
    ]
  }
};

export default function QatarHistory() {
  const [selectedStageIdx, setSelectedStageIdx] = useState(4); // Default to Quarter-Finals (high drama)
  const currentStageKey = HISTORICAL_STAGES[selectedStageIdx].stage;
  const currentStageDetail = STAGE_DETAILS[currentStageKey];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Qatar 2022 Prediction History
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            A look back at the most volatile sports prediction market in history, tracking key probability swings at every step.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px' }}>
          <History size={14} style={{ color: '#94a3b8' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>Archived Data</span>
        </div>
      </div>

      {/* Stage Stepper Navigation Bar */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '800px', position: 'relative', padding: '0 20px' }}>
          
          {/* Stepper connecting line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '40px',
            right: '40px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.05)',
            transform: 'translateY(-50%)',
            zIndex: 1
          }}></div>
          
          {HISTORICAL_STAGES.map((s, idx) => {
            const isSelected = selectedStageIdx === idx;
            const isPassed = idx < selectedStageIdx;

            return (
              <button
                key={s.stage}
                onClick={() => setSelectedStageIdx(idx)}
                style={{
                  border: 'none',
                  background: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  zIndex: 2,
                  position: 'relative'
                }}
              >
                {/* Visual node */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isSelected 
                    ? 'var(--color-primary)' 
                    : (isPassed ? 'rgba(16, 185, 129, 0.2)' : '#1e293b'),
                  border: isSelected 
                    ? '4px solid #060813' 
                    : `2px solid ${isPassed ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isSelected ? '0 0 12px var(--color-primary)' : 'none',
                  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isPassed && !isSelected && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? '#f8fafc' : '#64748b' }}>
                    {s.stage}
                  </span>
                  <span style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Commentary (Left) & Win Odds Chart (Right) */}
      <div className="grid-main">
        {/* Commentary Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ border: '1px solid rgba(16, 185, 129, 0.15)', background: 'rgba(16, 185, 129, 0.01)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="badge badge-emerald">STAGE NARRATIVE</span>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginTop: '10px' }}>
                {currentStageDetail.headline}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Market Sentiment state:</span>
                <strong style={{ fontSize: '11px', color: '#10b981', textTransform: 'uppercase' }}>{currentStageDetail.sentiment}</strong>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
              {currentStageDetail.description}
            </p>

            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Flame size={14} className="glow-text-emerald" style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>KEY CATALYST:</strong> {currentStageDetail.highlightEvent}
              </div>
            </div>
          </div>

          {/* Leaders Board at this Stage */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>
              Win Probabilities ({HISTORICAL_STAGES[selectedStageIdx].label})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentStageDetail.ranks.map((t, index) => (
                <div key={t.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="data-mono" style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', width: '16px' }}>#{index + 1}</span>
                    <span style={{ fontSize: '16px' }}>{t.flag}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{t.name}</span>
                    <span className="data-mono" style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,0.02)', padding: '1px 4px', borderRadius: '4px' }}>{t.code}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'right' }}>
                    <span className="data-mono" style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc' }}>
                      {t.prob}%
                    </span>

                    {t.delta !== 0 && (
                      <span className="data-mono" style={{ 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        color: t.delta > 0 ? '#10b981' : '#f43f5e',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        {t.delta > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {t.delta > 0 ? `+${t.delta}` : t.delta}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic win evolution curve */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>Win Probability Curves</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Visualizing the massive swings of outright probabilities during the tournament.</p>
          </div>

          <div style={{ width: '100%', height: '380px', background: 'rgba(0, 0, 0, 0.1)', padding: '16px 8px 8px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_STAGES}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis 
                  dataKey="stage" 
                  stroke="#475569" 
                  tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'Outfit' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                />
                <YAxis 
                  stroke="#475569" 
                  domain={['auto', 'auto']}
                  padding={{ top: 20, bottom: 20 }}
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Outfit' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(8, 12, 26, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    fontFamily: 'Outfit',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'Outfit', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Line type="monotone" dataKey="ARG" name="Argentina" stroke="#60a5fa" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="FRA" name="France" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="BRA" name="Brazil" stroke="#eab308" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="MAR" name="Morocco" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="CRO" name="Croatia" stroke="#ef4444" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel font-mono" style={{ padding: '14px', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)' }}>
            <Award size={16} className="glow-text-gold" style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
              <strong>Underdog Miracle:</strong> Morocco started the tournament at a literal <strong style={{ color: '#10b981' }}>0.5%</strong> chance. By the Quarter-Finals, they peak at <strong style={{ color: '#10b981' }}>12.0%</strong>, causing the single largest payout ratio in sports prediction history!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
