import React from 'react';
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
  TrendingUp, 
  DollarSign, 
  Layers, 
  Users, 
  Flame,
  AlertCircle
} from 'lucide-react';

// Generates smooth, realistic historic probability data for the favorite teams
const MOCK_HISTORICAL_DATA = [
  { day: 'May 4', FRA: 17.5, BRA: 16.5, ESP: 12.0, ENG: 11.0 },
  { day: 'May 5', FRA: 17.8, BRA: 16.2, ESP: 12.2, ENG: 11.2 },
  { day: 'May 6', FRA: 17.6, BRA: 16.0, ESP: 12.5, ENG: 11.5 },
  { day: 'May 7', FRA: 18.0, BRA: 15.8, ESP: 12.4, ENG: 11.8 },
  { day: 'May 8', FRA: 18.2, BRA: 15.5, ESP: 12.8, ENG: 11.6 },
  { day: 'May 9', FRA: 18.1, BRA: 15.7, ESP: 13.0, ENG: 11.4 },
  { day: 'May 10', FRA: 18.4, BRA: 15.9, ESP: 13.2, ENG: 11.5 },
  { day: 'May 11', FRA: 18.3, BRA: 16.1, ESP: 13.5, ENG: 11.2 },
  { day: 'May 12', FRA: 18.5, BRA: 16.0, ESP: 13.8, ENG: 11.5 }
];

export default function DashboardOverview({ teams, fetching, newsEvents }) {
  // Take top 4 favorites for our line chart
  const favorites = teams.slice(0, 4);

  // Dynamic price data mapping for Recharts
  const chartData = MOCK_HISTORICAL_DATA.map(d => {
    // If there is active live data, we slightly blend the last day's data with the current state
    if (d.day === 'May 12') {
      const updated = { ...d };
      teams.forEach(t => {
        if (t.code === 'FRA') updated.FRA = t.probability;
        if (t.code === 'BRA') updated.BRA = t.probability;
        if (t.code === 'ESP') updated.ESP = t.probability;
        if (t.code === 'ENG') updated.ENG = t.probability;
      });
      return updated;
    }
    return d;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Active News Alerts Banner if any simulated events are running */}
      {newsEvents.length > 0 && (
        <div className="glass-panel" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle className="glow-text-gold" size={20} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f59e0b' }}>ACTIVE SENTIMENT ALTERS</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {newsEvents.map((evt, idx) => (
              <span key={idx} className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={12} /> {evt.title} ({evt.impact > 0 ? `+${evt.impact}%` : `${evt.impact}%`} on {evt.team})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <section className="grid-3">
        <div className="glass-panel glass-panel-emerald" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
            <DollarSign size={24} className="glow-text-emerald" />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>TOTAL POOL SIZE</p>
            <h3 className="data-mono" style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>$847,219,305</h3>
            <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: '600' }}>
              <TrendingUp size={12} /> +12.4% this week
            </span>
          </div>
        </div>

        <div className="glass-panel glass-panel-cyan" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '12px', borderRadius: '12px', color: '#06b6d4' }}>
            <Layers size={24} className="glow-text-cyan" />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>24H TRADING VOLUME</p>
            <h3 className="data-mono" style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>$34,182,549</h3>
            <span style={{ fontSize: '11px', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: '600' }}>
              <TrendingUp size={12} /> Active order flows
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', color: '#94a3b8' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', letterSpacing: '0.05em' }}>ACTIVE TRADING ACCOUNTS</p>
            <h3 className="data-mono" style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>142,903</h3>
            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: '500' }}>
              Live positions monitored
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Outright Winner Leaderboard + Probability Evolution Chart */}
      <div className="grid-main">
        {/* Outright Leaderboard */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>Outright Winner Probabilities</h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Real-time implied odds extracted from Polymarket token prices</p>
            </div>
            {fetching && (
              <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-indicator"></span> Fetching...
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {teams.map((t) => (
              <div key={t.code} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="data-mono" style={{ color: '#64748b', fontWeight: '700', width: '20px' }}>#{t.rank}</span>
                    <span style={{ fontSize: '18px' }}>{t.flag}</span>
                    <span style={{ fontWeight: '600', color: '#f8fafc' }}>{t.name}</span>
                    <span className="data-mono" style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: '4px' }}>
                      {t.code}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="data-mono" style={{ color: '#10b981', fontWeight: '700' }}>
                      {t.probability}%
                    </span>
                    <span className="data-mono" style={{ color: '#64748b', fontSize: '12px', width: '60px', textAlign: 'right' }}>
                      ${t.price.toFixed(3)}
                    </span>
                    <span className="data-mono" style={{ color: '#64748b', fontSize: '12px', width: '70px', textAlign: 'right' }}>
                      {t.volume}
                    </span>
                  </div>
                </div>

                {/* Glassy Progress Bar */}
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.02)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${t.probability}%`, 
                      background: `linear-gradient(to right, ${t.color}, #10b981)`,
                      borderRadius: '9999px',
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Evolution Chart */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>Favorites Evolution</h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Track daily shifts in outright winner probabilities</p>
          </div>

          <div style={{ width: '100%', height: '350px', background: 'rgba(0, 0, 0, 0.1)', padding: '16px 8px 8px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Outfit' }}
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
                {favorites.map((fav) => (
                  <Line 
                    key={fav.code}
                    type="monotone" 
                    dataKey={fav.code} 
                    name={fav.name}
                    stroke={fav.color} 
                    strokeWidth={3}
                    dot={{ r: 2, strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel" style={{ padding: '14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>MARKET INSIGHT</h4>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
              France holds the outright favorite spot on Polymarket at <strong style={{ color: '#10b981' }}>{favorites[0]?.probability}%</strong>, followed closely by Brazil at <strong style={{ color: '#eab308' }}>{favorites[1]?.probability}%</strong>. Volume remains heavily concentrated on top-tier national squads, with Spain seeing a surge in buying activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
