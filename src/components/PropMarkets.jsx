import React, { useState } from 'react';
import { 
  Trophy, 
  User, 
  Map, 
  Percent, 
  Coins, 
  ChevronRight, 
  Flag,
  Calendar
} from 'lucide-react';

const SCORER_DATA = [
  { name: "Kylian Mbappé", team: "France", code: "FRA", flag: "🇫🇷", probability: 22.0, price: 0.220, goals: 7, color: "#3b82f6" },
  { name: "Erling Haaland", team: "Norway", code: "NOR", flag: "🇳🇴", probability: 18.5, price: 0.185, goals: 6, color: "#ef4444" },
  { name: "Vinícius Júnior", team: "Brazil", code: "BRA", flag: "🇧🇷", probability: 15.0, price: 0.150, goals: 6, color: "#eab308" },
  { name: "Jude Bellingham", team: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", probability: 12.0, price: 0.120, goals: 5, color: "#ffffff" },
  { name: "Lamine Yamal", team: "Spain", code: "ESP", flag: "🇪🇸", probability: 9.5, price: 0.095, goals: 4, color: "#ea580c" }
];

const STAGE_ELIMINATION_DATA = {
  FRA: {
    name: "France",
    flag: "🇫🇷",
    path: [
      { stage: "Group Stage Exit", prob: 3.5, active: false },
      { stage: "Round of 16", prob: 12.5, active: false },
      { stage: "Quarter-Finals", prob: 25.0, active: false },
      { stage: "Semi-Finals", prob: 40.5, active: true },
      { stage: "Reach Final", prob: 28.5, active: true },
      { stage: "Champion", prob: 18.5, active: true }
    ]
  },
  BRA: {
    name: "Brazil",
    flag: "🇧🇷",
    path: [
      { stage: "Group Stage Exit", prob: 4.0, active: false },
      { stage: "Round of 16", prob: 14.0, active: false },
      { stage: "Quarter-Finals", prob: 28.0, active: false },
      { stage: "Semi-Finals", prob: 38.0, active: true },
      { stage: "Reach Final", prob: 26.0, active: true },
      { stage: "Champion", prob: 16.0, active: true }
    ]
  },
  ESP: {
    name: "Spain",
    flag: "🇪🇸",
    path: [
      { stage: "Group Stage Exit", prob: 5.5, active: false },
      { stage: "Round of 16", prob: 16.5, active: false },
      { stage: "Quarter-Finals", prob: 30.5, active: true },
      { stage: "Semi-Finals", prob: 32.5, active: true },
      { stage: "Reach Final", prob: 21.0, active: true },
      { stage: "Champion", prob: 13.8, active: true }
    ]
  },
  ARG: {
    name: "Argentina",
    flag: "🇦🇷",
    path: [
      { stage: "Group Stage Exit", prob: 6.0, active: false },
      { stage: "Round of 16", prob: 18.0, active: false },
      { stage: "Quarter-Finals", prob: 35.0, active: true },
      { stage: "Semi-Finals", prob: 28.0, active: true },
      { stage: "Reach Final", prob: 16.5, active: true },
      { stage: "Champion", prob: 9.2, active: true }
    ]
  }
};

export default function PropMarkets() {
  const [selectedTeamCode, setSelectedTeamCode] = useState('FRA');
  const activePathData = STAGE_ELIMINATION_DATA[selectedTeamCode];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          FIFA World Cup Prop Markets
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Explore secondary prediction contracts, player performance indexes, and tournament stage progressions.
        </p>
      </div>

      {/* Grid Layout: Golden Boot (Left) & Path to Glory (Right) */}
      <div className="grid-main">
        {/* Golden Boot Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy className="glow-text-gold" size={18} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>Golden Boot Winner Outrights</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SCORER_DATA.map((player, idx) => (
              <div 
                key={player.name}
                className="glass-panel"
                style={{ 
                  padding: '14px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.02)', 
                  background: 'rgba(255,255,255,0.01)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Player Avatar */}
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    background: `linear-gradient(135deg, ${player.color}, #080c1a)`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#f8fafc',
                    fontWeight: '700',
                    fontSize: '12px'
                  }}>
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
                      {player.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '12px' }}>{player.flag}</span>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '500' }}>{player.team}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>YES Price</p>
                    <p className="data-mono" style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>
                      ${player.price.toFixed(3)}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '70px' }}>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>Probability</p>
                    <p className="data-mono" style={{ fontSize: '13px', fontWeight: '700', color: '#10b981', marginTop: '2px' }}>
                      {player.probability}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Path to Glory Stage Progression */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map className="glow-text-cyan" size={18} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>Stage of Elimination Path</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Track the team-specific threshold levels based on outright order liquidity.
            </p>
          </div>

          {/* Team Tabs Selector */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.1)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
            {Object.keys(STAGE_ELIMINATION_DATA).map((code) => {
              const item = STAGE_ELIMINATION_DATA[code];
              const isSelected = selectedTeamCode === code;

              return (
                <button
                  key={code}
                  onClick={() => setSelectedTeamCode(code)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                    color: isSelected ? '#f8fafc' : '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: '0.2s ease'
                  }}
                >
                  <span>{item.flag}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Stage Progress Timeline Nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {activePathData.path.map((node, idx) => (
              <div 
                key={node.stage}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: node.active ? 'rgba(6, 182, 212, 0.02)' : 'transparent',
                  border: node.active ? '1px solid rgba(6, 182, 212, 0.15)' : '1px solid rgba(255,255,255,0.02)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Glowing timeline dot */}
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: node.active ? 'var(--color-secondary)' : '#334155',
                    boxShadow: node.active ? '0 0 10px var(--color-secondary)' : 'none'
                  }}></div>

                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: node.active ? '700' : '500', 
                    color: node.active ? '#f8fafc' : '#94a3b8' 
                  }}>
                    {node.stage}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="data-mono" style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: node.active ? 'var(--color-secondary)' : '#64748b' 
                  }}>
                    {node.prob}%
                  </span>
                  {node.active && (
                    <span style={{ fontSize: '10px', color: 'rgba(6, 182, 212, 0.6)', fontWeight: '700' }}>
                      HIGH LIQUIDITY
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', alignItems: 'flex-start' }}>
            <Calendar size={14} style={{ color: '#64748b', marginTop: '2px' }} />
            <p style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.4' }}>
              All stage elimination YES/NO contracts resolve chronologically as teams exit the tournament bracket. Real-time liquidity increases during live-action match states.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
