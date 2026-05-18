import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Minus, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const NEWS_TEMPLATES = [
  {
    id: "mbappe_injury",
    title: "Mbappé Hamstring Strain in Practice Session",
    team: "France",
    code: "FRA",
    impact: -4.2,
    description: "Star forward Kylian Mbappé walked off the pitch during a closed training session. Team doctors expect a 3-week rehabilitation, leaving him questionable for group opener matches.",
    category: "Injury"
  },
  {
    id: "brazil_tactics",
    title: "Brazil Dominates Warmup Match 6-0",
    team: "Brazil",
    code: "BRA",
    impact: 3.5,
    description: "Absolute masterclass from the Seleção in Lisbon. Vini Jr. scored a hat-trick, triggering a massive inflow of 'YES' winner share purchases on Polymarket.",
    category: "Performance"
  },
  {
    id: "messi_announcement",
    title: "Messi Declares 2026 World Cup 'The Final Dance'",
    team: "Argentina",
    code: "ARG",
    impact: 3.0,
    description: "Lionel Messi officially confirms this will be his final professional tournament. Institutional sports capital is flowing heavily into Argentina YES contracts.",
    category: "Sentiment"
  },
  {
    id: "spain_midfield",
    title: "Gavi and Pedri Cleared with 100% Fitness",
    team: "Spain",
    code: "ESP",
    impact: 2.5,
    description: "Medical staff delivers full clearance for Spain's elite midfield engine. Speculators are aggressively covering short positions.",
    category: "Medical"
  },
  {
    id: "england_dispute",
    title: "England Squad Internal Dispute Leaked",
    team: "England",
    code: "ENG",
    impact: -3.0,
    description: "Tabloid reports details of a heated training camp argument between coaching staff and senior players, causing panic selling of England outright contracts.",
    category: "Internal"
  }
];

export default function SentimentTracker({ teams, onApplyShifts }) {
  const [activeEvents, setActiveEvents] = useState({});

  const toggleEvent = (evt) => {
    const nextActive = { ...activeEvents };
    if (nextActive[evt.id]) {
      delete nextActive[evt.id];
    } else {
      nextActive[evt.id] = evt;
    }
    setActiveEvents(nextActive);

    // Calculate aggregated shifts per team code
    const shifts = teams.map(t => {
      // Find all active news events impacting this specific team
      const teamEvents = Object.values(nextActive).filter(e => e.code === t.code);
      const totalShift = teamEvents.reduce((acc, curr) => acc + curr.impact, 0);
      return {
        code: t.code,
        shift: totalShift
      };
    });

    onApplyShifts(shifts, Object.values(nextActive));
  };

  const resetAll = () => {
    setActiveEvents({});
    const emptyShifts = teams.map(t => ({ code: t.code, shift: 0 }));
    onApplyShifts(emptyShifts, []);
  };

  const activeCount = Object.keys(activeEvents).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Black Swan News Simulator
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Simulate breaking news, tournament conditions, and squad updates to see how the Polymarket odds recalculate.
          </p>
        </div>

        {activeCount > 0 && (
          <button 
            onClick={resetAll}
            className="btn-primary" 
            style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.2)' }}
          >
            <RefreshCw size={14} />
            <span>Reset All Events</span>
          </button>
        )}
      </div>

      {/* Grid: Events Panel (Left) & Live Recalculator Index (Right) */}
      <div className="grid-main">
        {/* News Feed Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Flame size={16} className="glow-text-emerald" />
            BREAKING SCENARIO GENERATOR
          </h3>

          {NEWS_TEMPLATES.map((evt) => {
            const isActive = !!activeEvents[evt.id];
            const isNegative = evt.impact < 0;

            return (
              <div 
                key={evt.id}
                className="glass-panel"
                style={{ 
                  borderColor: isActive 
                    ? (isNegative ? 'rgba(244,63,94,0.4)' : 'rgba(16,185,129,0.4)') 
                    : 'rgba(255,255,255,0.05)',
                  background: isActive 
                    ? (isNegative ? 'rgba(244,63,94,0.02)' : 'rgba(16,185,129,0.02)') 
                    : 'rgba(13,20,38,0.45)',
                  boxShadow: isActive 
                    ? (isNegative ? '0 0 20px rgba(244,63,94,0.1)' : '0 0 20px rgba(16,185,129,0.1)') 
                    : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => toggleEvent(evt)}
              >
                {/* Visual Accent indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: isNegative ? 'var(--color-danger)' : 'var(--color-success)'
                  }}></div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: isActive ? '8px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge" style={{ 
                        background: isNegative ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', 
                        color: isNegative ? '#f43f5e' : '#10b981',
                        border: `1px solid ${isNegative ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)'}`
                      }}>
                        {evt.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Impacts {evt.team} ({evt.code})</span>
                    </div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>
                      {evt.title}
                    </h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="data-mono" style={{ 
                      fontSize: '14px', 
                      fontWeight: '700', 
                      color: isNegative ? '#f43f5e' : '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                      {isNegative ? '' : '+'}{evt.impact}%
                    </span>

                    {isActive ? (
                      <ToggleRight size={28} style={{ color: isNegative ? '#f43f5e' : '#10b981' }} />
                    ) : (
                      <ToggleLeft size={28} style={{ color: '#475569' }} />
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', paddingLeft: isActive ? '8px' : '0' }}>
                  {evt.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Probability Comparison Index */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <AlertTriangle size={16} className="glow-text-gold" />
            SIMULATED ODDS COMPARISON
          </h3>

          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>Market Alteration Index</h4>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Comparing original Polymarket outright prices against the simulated sentiment model.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {teams.map(t => {
                const isShifted = t.probability !== t.baseProbability;
                const shiftAmt = parseFloat((t.probability - t.baseProbability).toFixed(1));

                return (
                  <div key={t.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '10px', background: isShifted ? 'rgba(255,255,255,0.01)' : 'transparent', border: isShifted ? '1px solid rgba(255,255,255,0.03)' : '1px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>{t.flag}</span>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{t.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>Original:</span>
                          <span className="data-mono" style={{ fontSize: '10px', color: '#94a3b8' }}>{t.baseProbability}%</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right' }}>
                      <div>
                        <span className="data-mono" style={{ 
                          fontSize: '14px', 
                          fontWeight: '800', 
                          color: isShifted ? (shiftAmt > 0 ? '#10b981' : '#f43f5e') : '#f8fafc'
                        }}>
                          {t.probability}%
                        </span>
                        
                        {isShifted && (
                          <div className="data-mono" style={{ 
                            fontSize: '9px', 
                            fontWeight: '600', 
                            color: shiftAmt > 0 ? '#10b981' : '#f43f5e',
                            marginTop: '1px'
                          }}>
                            {shiftAmt > 0 ? `+${shiftAmt}` : shiftAmt}% delta
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.02)', border: '1px solid rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#eab308', lineHeight: '1.4' }}>
              <strong>Calculations Engine Notes:</strong> Odds shifts sum up exponentially based on active sentiment coefficients, which adjusts standard market curves. In real markets, sudden drops of 3% or more trigger high frequency order liquidations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
