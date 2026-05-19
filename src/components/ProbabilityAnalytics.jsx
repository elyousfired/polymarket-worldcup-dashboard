import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Search, 
  Users, 
  Activity, 
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2,
  X
} from 'lucide-react';

const DAYS = ['May 4', 'May 5', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10', 'May 11', 'May 12'];

// Seeded trend factors to make historical paths realistic and consistent
const TREND_FACTORS = {
  FRA: [0.94, 0.96, 0.95, 0.97, 0.98, 0.98, 0.99, 0.99, 1.0],
  BRA: [1.03, 1.01, 1.00, 0.99, 0.97, 0.98, 0.99, 1.01, 1.0],
  ESP: [0.87, 0.88, 0.91, 0.90, 0.93, 0.94, 0.96, 0.98, 1.0],
  ENG: [0.96, 0.97, 1.00, 1.03, 1.01, 0.99, 1.00, 0.97, 1.0],
  ARG: [1.05, 1.02, 1.03, 1.01, 0.99, 0.98, 0.99, 1.00, 1.0],
  GER: [0.90, 0.92, 0.94, 0.96, 0.97, 0.96, 0.98, 0.99, 1.0],
  POR: [0.93, 0.95, 0.93, 0.96, 0.98, 0.97, 0.99, 1.01, 1.0],
  NED: [1.04, 1.02, 0.99, 0.97, 0.96, 0.98, 1.00, 0.99, 1.0]
};

// Fallback multiplier generator for any of the other 40 teams
function getTrendFactors(code, index) {
  if (TREND_FACTORS[code]) {
    return TREND_FACTORS[code][index];
  }
  // Deterministic noise based on character codes
  const charSum = code.charCodeAt(0) + code.charCodeAt(1) + code.charCodeAt(2);
  const phase = (charSum % 10) * 0.1;
  const amp = 0.05 + (charSum % 5) * 0.01;
  return 1.0 + Math.sin(index * 0.6 + phase) * amp;
}

export default function ProbabilityAnalytics({ teams }) {
  // Select top 4 teams by default
  const [selectedCodes, setSelectedCodes] = useState(['FRA', 'BRA', 'ESP', 'ENG']);
  const [hoveredTeamCode, setHoveredTeamCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  // Available groups A to L
  const groups = ['ALL', 'Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Group I', 'Group J', 'Group K', 'Group L'];

  // 1. Generate full dataset (Prices and daily changes)
  const fullChartData = useMemo(() => {
    return DAYS.map((day, dayIdx) => {
      const dataRow = { day };
      teams.forEach(t => {
        const factor = getTrendFactors(t.code, dayIdx);
        // Blending today's live probability as the final point
        const probability = day === 'May 12' ? t.probability : parseFloat((t.probability * factor).toFixed(2));
        dataRow[t.code] = probability;
        
        // Calculate slope (velocity) as day-on-day change: y_i - y_(i-1)
        if (dayIdx === 0) {
          dataRow[`${t.code}_slope`] = 0;
        } else {
          const prevFactor = getTrendFactors(t.code, dayIdx - 1);
          const prevProb = parseFloat((t.probability * prevFactor).toFixed(2));
          dataRow[`${t.code}_slope`] = parseFloat((probability - prevProb).toFixed(2));
        }
      });
      return dataRow;
    });
  }, [teams]);

  // 2. Filter teams based on search & group selection
  const filteredTeamsList = useMemo(() => {
    return teams.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroup === 'ALL' || t.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [teams, searchQuery, selectedGroup]);

  // Handle multi-select toggling
  const toggleTeamSelection = (code) => {
    setSelectedCodes(prev => {
      if (prev.includes(code)) {
        // Prevent clearing all selections to keep charts functional
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== code);
      } else {
        // Enforce maximum comparison cap of 8 lines to prevent visual clutter
        if (prev.length >= 8) return prev;
        return [...prev, code];
      }
    });
  };

  const selectTopFavorites = () => {
    setSelectedCodes(teams.slice(0, 5).map(t => t.code));
  };

  const selectAllFiltered = () => {
    const codes = filteredTeamsList.slice(0, 8).map(t => t.code);
    if (codes.length > 0) {
      setSelectedCodes(codes);
    }
  };

  const clearAllSelections = () => {
    // Falls back to top favorite
    setSelectedCodes([teams[0].code]);
  };

  // Compile active selected teams details
  const activeComparisonTeams = useMemo(() => {
    return teams.filter(t => selectedCodes.includes(t.code));
  }, [teams, selectedCodes]);

  // 3. Compute advanced metrics for selected teams
  const teamMetrics = useMemo(() => {
    return activeComparisonTeams.map(t => {
      const history = fullChartData.map(d => d[t.code]);
      const ath = Math.max(...history);
      const atl = Math.min(...history);
      const current = t.probability;
      const initial = history[0];
      const delta24h = parseFloat((current - history[history.length - 2]).toFixed(2));
      const totalDelta = parseFloat((current - initial).toFixed(2));

      // Calculate recent velocity slope
      const recentSlopes = fullChartData.slice(-3).map(d => d[`${t.code}_slope`]);
      const avgRecentSlope = recentSlopes.reduce((a, b) => a + b, 0) / recentSlopes.length;

      let momentum = 'Stable';
      let momentumColor = '#94a3b8';
      if (avgRecentSlope > 0.25) {
        momentum = 'Strong Breakout';
        momentumColor = '#10b981';
      } else if (avgRecentSlope > 0.05) {
        momentum = 'Gradual Uptrend';
        momentumColor = '#34d399';
      } else if (avgRecentSlope < -0.25) {
        momentum = 'Negative Reversal';
        momentumColor = '#f43f5e';
      } else if (avgRecentSlope < -0.05) {
        momentum = 'Decline';
        momentumColor = '#f87171';
      }

      return {
        ...t,
        ath,
        atl,
        delta24h,
        totalDelta,
        momentum,
        momentumColor
      };
    });
  }, [activeComparisonTeams, fullChartData]);

  const isAnyLineHovered = hoveredTeamCode !== null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Trend Terminal & Slope Analytics
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Analyze outright odds history, compare curves, and visualize rate-of-change momentum across all 48 teams.
        </p>
      </div>

      <div className="grid-main">
        
        {/* Left Column: Selection Panel (1/3rd width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            
            {/* Header / Select Actions */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} className="glow-text-emerald" />
                Team Selection
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Select up to 8 teams to plot simultaneously.
              </p>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={selectTopFavorites} className="badge" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', padding: '4px 8px' }}>
                Top 5 Favorites
              </button>
              <button onClick={selectAllFiltered} className="badge" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', padding: '4px 8px' }}>
                Select Filtered (Max 8)
              </button>
              <button onClick={clearAllSelections} className="badge" style={{ cursor: 'pointer', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', color: '#f43f5e', padding: '4px 8px' }}>
                Reset Selections
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', color: '#475569' }} />
              <input 
                type="text"
                placeholder="Search team or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '13px',
                  fontFamily: 'Outfit',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <X size={14} onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', color: '#64748b', cursor: 'pointer' }} />
              )}
            </div>

            {/* Group Tabs Filter */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  style={{
                    flexShrink: 0,
                    background: selectedGroup === g ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                    color: selectedGroup === g ? '#10b981' : '#64748b',
                    border: `1px solid ${selectedGroup === g ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: '0.15s'
                  }}
                >
                  {g === 'ALL' ? 'All Groups' : g.replace('Group ', '')}
                </button>
              ))}
            </div>

            {/* Scrollable Teams Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredTeamsList.map(t => {
                const isSelected = selectedCodes.includes(t.code);
                return (
                  <div 
                    key={t.code}
                    onClick={() => toggleTeamSelection(t.code)}
                    onMouseEnter={() => setHoveredTeamCode(t.code)}
                    onMouseLeave={() => setHoveredTeamCode(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                      border: `1px solid ${isSelected ? 'rgba(255,255,255,0.05)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: '0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '4px', 
                        border: `1px solid ${isSelected ? t.color : '#475569'}`, 
                        background: isSelected ? t.color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isSelected ? `0 0 6px ${t.color}` : 'none'
                      }}>
                        {isSelected && <CheckCircle2 size={10} color="#060813" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '14px' }}>{t.flag}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: isSelected ? '#f8fafc' : '#94a3b8' }}>
                        {t.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.03)', color: '#64748b', fontSize: '10px' }}>
                        {t.group}
                      </span>
                      <span className="data-mono" style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? t.color : '#475569' }}>
                        {t.probability}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {filteredTeamsList.length === 0 && (
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', padding: '32px 0' }}>
                  No matching teams found
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Dual Analytics Charts & Metrics Grid (2/3rd width) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Curves Block */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Maximize2 size={16} className="glow-text-emerald" />
                  Absolute Probability Curves
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b' }}>Outright Winner market pricing (0.01$ to 0.99$ contract value equivalent)</p>
              </div>
            </div>

            {/* Absolute Odds Chart */}
            <div style={{ width: '100%', height: '240px', background: 'rgba(0, 0, 0, 0.1)', padding: '16px 8px 8px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fullChartData}>
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
                    padding={{ top: 15, bottom: 15 }}
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
                  {activeComparisonTeams.map((fav) => {
                    const isCurrentlyHovered = hoveredTeamCode === fav.code;
                    const opacity = isAnyLineHovered ? (isCurrentlyHovered ? 1 : 0.08) : 1;
                    
                    return (
                      <Line 
                        key={fav.code}
                        type="monotone" 
                        dataKey={fav.code} 
                        name={fav.name}
                        stroke={fav.color} 
                        strokeWidth={isCurrentlyHovered ? 4.0 : 2.5}
                        strokeOpacity={opacity}
                        dot={isCurrentlyHovered || !isAnyLineHovered ? { r: 2, strokeWidth: 1, fill: fav.color } : false}
                        activeDot={{ r: 5 }}
                        style={{ transition: 'stroke-opacity 0.2s ease-in-out, stroke-width 0.15s ease' }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Odds Slope / Velocity Chart */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} className="glow-text-emerald" />
                Odds Velocity & Slope (Momentum Rate of Change)
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Daily percentage delta shift (pente). Positive values indicate accelerating bullish buyers.</p>
            </div>

            {/* Velocity Slope Chart */}
            <div style={{ width: '100%', height: '180px', background: 'rgba(0, 0, 0, 0.1)', padding: '16px 8px 8px 8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fullChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="#475569" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Outfit' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  />
                  <YAxis 
                    stroke="#475569" 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Outfit' }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                    tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
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
                  {/* Zero Baseline indicator */}
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />

                  {activeComparisonTeams.map((fav) => {
                    const isCurrentlyHovered = hoveredTeamCode === fav.code;
                    const opacity = isAnyLineHovered ? (isCurrentlyHovered ? 1 : 0.08) : 1;
                    
                    return (
                      <Line 
                        key={fav.code}
                        type="monotone" 
                        dataKey={`${fav.code}_slope`}
                        name={`${fav.name} Velocity`}
                        stroke={fav.color} 
                        strokeWidth={isCurrentlyHovered ? 3.5 : 2.0}
                        strokeOpacity={opacity}
                        dot={false}
                        activeDot={{ r: 4 }}
                        style={{ transition: 'stroke-opacity 0.2s ease-in-out, stroke-width 0.15s ease' }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Legend Wrapper */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '-4px' }}>
            {activeComparisonTeams.map((fav) => {
              const isHovered = hoveredTeamCode === fav.code;
              return (
                <div 
                  key={fav.code}
                  onMouseEnter={() => setHoveredTeamCode(fav.code)}
                  onMouseLeave={() => setHoveredTeamCode(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    opacity: isAnyLineHovered ? (isHovered ? 1 : 0.25) : 1,
                    transition: '0.2s',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: isHovered ? 'rgba(255,255,255,0.02)' : 'transparent',
                    border: `1px solid ${isHovered ? 'rgba(255,255,255,0.05)' : 'transparent'}`
                  }}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: fav.color, boxShadow: `0 0 8px ${fav.color}` }}></div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: isHovered ? '#f8fafc' : '#94a3b8' }}>
                    {fav.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Team Detailed Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {teamMetrics.map(m => (
              <div 
                key={m.code} 
                className="glass-panel animate-fade-in" 
                style={{ 
                  padding: '14px', 
                  borderRadius: '10px', 
                  border: `1px solid ${hoveredTeamCode === m.code ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)'}`,
                  background: hoveredTeamCode === m.code ? 'rgba(255,255,255,0.02)' : 'rgba(13, 20, 38, 0.3)',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{m.flag}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{m.name}</span>
                  </div>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.03)', color: m.color, border: `1px solid ${m.color}20` }}>
                    {m.code}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#64748b' }}>Current Probability:</span>
                    <span className="data-mono" style={{ color: m.color, fontWeight: '700' }}>{m.probability}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#64748b' }}>24h Net Delta:</span>
                    <span className="data-mono" style={{ color: m.delta24h >= 0 ? '#10b981' : '#f43f5e', fontWeight: '600' }}>
                      {m.delta24h >= 0 ? `+${m.delta24h}` : m.delta24h}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#64748b' }}>Peak Odds (ATH):</span>
                    <span className="data-mono" style={{ color: '#94a3b8' }}>{m.ath}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px', marginTop: '4px' }}>
                    <span style={{ color: '#64748b' }}>Slope Momentum:</span>
                    <span style={{ color: m.momentumColor, fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Activity size={10} />
                      {m.momentum}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
