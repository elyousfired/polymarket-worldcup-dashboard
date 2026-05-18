import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Layers,
  CircleDot
} from 'lucide-react';

// Generates simulated order prints
const TEAM_PRICE_RANGES = {
  FRA: 0.185,
  BRA: 0.160,
  ESP: 0.138,
  ENG: 0.115,
  ARG: 0.092,
  GER: 0.075,
  POR: 0.058,
  ITA: 0.042
};

const TEAM_FLAGS = {
  FRA: "🇫🇷",
  BRA: "🇧🇷",
  ESP: "🇪🇸",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ARG: "🇦🇷",
  GER: "🇩🇪",
  POR: "🇵🇹",
  ITA: "🇮🇹"
};

const INITIAL_TRADES = [
  { time: "18:44:20", code: "FRA", type: "BUY", price: 0.185, shares: 14500, value: 2682.5 },
  { time: "18:44:18", code: "BRA", type: "SELL", price: 0.161, shares: 8200, value: 1320.2 },
  { time: "18:44:15", code: "ESP", type: "BUY", price: 0.138, shares: 25000, value: 3450.0 },
  { time: "18:44:12", code: "ARG", type: "BUY", price: 0.092, shares: 11000, value: 1012.0 },
  { time: "18:44:08", code: "ENG", type: "SELL", price: 0.114, shares: 19500, value: 2223.0 }
];

export default function OrderBookScanner({ teams }) {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [selectedTeamCode, setSelectedTeamCode] = useState('FRA');

  // Push new simulated order print every 1.5 seconds to make the UI look extremely active
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick random team
      const codes = Object.keys(TEAM_PRICE_RANGES);
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      
      // Get base price from active team state
      const matchingTeam = teams.find(t => t.code === randomCode);
      const basePrice = matchingTeam ? matchingTeam.price : TEAM_PRICE_RANGES[randomCode];
      
      // Calculate random price fluctuation
      const priceDelta = (Math.random() - 0.5) * 0.004;
      const finalPrice = Math.max(0.01, parseFloat((basePrice + priceDelta).toFixed(3)));
      
      // Calculate shares & volume
      const shares = Math.floor(Math.random() * 250) * 100 + 1000; // 1,000 to 26,000 shares
      const value = parseFloat((shares * finalPrice).toFixed(1));
      
      const type = Math.random() > 0.4 ? "BUY" : "SELL";
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];

      const newTrade = {
        time: timeString,
        code: randomCode,
        type,
        price: finalPrice,
        shares,
        value
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 9)]);
    }, 1500);

    return () => clearInterval(interval);
  }, [teams]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CLOB Order Book Scanner
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          High-frequency trading logs, spread monitoring, and sentiment distribution indexes.
        </p>
      </div>

      {/* Grid: Order Book Spreads (Left) & Live Transaction Stream (Right) */}
      <div className="grid-main">
        {/* Spreads Terminal */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers className="glow-text-cyan" size={18} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>YES / NO Contract Spreads</h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <th style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', padding: '12px 8px' }}>TEAM</th>
                <th style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', padding: '12px 8px', textAlign: 'right' }}>BID YES</th>
                <th style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', padding: '12px 8px', textAlign: 'right' }}>ASK YES</th>
                <th style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', padding: '12px 8px', textAlign: 'right' }}>SPREAD</th>
                <th style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', padding: '12px 8px', textAlign: 'right' }}>BID DEPTH</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(t => {
                // Generate simulated tight spreads around the team price
                const spread = 0.002;
                const bid = parseFloat((t.price - spread / 2).toFixed(3));
                const ask = parseFloat((t.price + spread / 2).toFixed(3));
                // Simulated depth sizes
                const depth = t.code === 'FRA' ? '184K' : t.code === 'BRA' ? '142K' : t.code === 'ESP' ? '109K' : '45K';

                return (
                  <tr 
                    key={t.code} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.02)',
                      background: selectedTeamCode === t.code ? 'rgba(255,255,255,0.01)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedTeamCode(t.code)}
                  >
                    <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{t.flag}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{t.name}</span>
                      <span className="data-mono" style={{ fontSize: '10px', color: '#64748b', background: 'rgba(255,255,255,0.02)', padding: '2px 4px', borderRadius: '4px' }}>
                        {t.code}
                      </span>
                    </td>
                    <td className="data-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                      ${bid.toFixed(3)}
                    </td>
                    <td className="data-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', color: '#f43f5e', fontWeight: '600' }}>
                      ${ask.toFixed(3)}
                    </td>
                    <td className="data-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                      ${spread.toFixed(3)}
                    </td>
                    <td className="data-mono" style={{ padding: '12px 8px', textAlign: 'right', fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                      {depth}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Transaction Prints */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity className="glow-text-emerald" size={18} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>Live Market Trades</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CircleDot size={8} className="glow-text-emerald" style={{ color: '#10b981' }} />
              <span className="data-mono" style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', letterSpacing: '0.05em' }}>TICKER ACTIVE</span>
            </div>
          </div>

          {/* Trade Prints Ticker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '320px', overflowY: 'hidden' }}>
            {trades.map((tr, idx) => {
              const isBuy = tr.type === "BUY";
              return (
                <div 
                  key={idx}
                  className="data-mono animate-fade-in"
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.02)',
                    fontSize: '12px',
                    animationDelay: `${idx * 0.05}s`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '32%' }}>
                    <span style={{ color: '#475569', fontSize: '10px' }}>{tr.time}</span>
                    <span style={{ fontSize: '14px' }}>{TEAM_FLAGS[tr.code]}</span>
                    <strong style={{ color: '#f8fafc' }}>{tr.code}</strong>
                  </div>

                  <div style={{ width: '22%', color: isBuy ? '#10b981' : '#f43f5e', fontWeight: '800', fontSize: '11px', textAlign: 'center' }}>
                    {tr.type} YES
                  </div>

                  <div style={{ width: '22%', textAlign: 'right', fontWeight: '600', color: '#94a3b8' }}>
                    ${tr.price.toFixed(3)}
                  </div>

                  <div style={{ width: '24%', textAlign: 'right', fontWeight: '700', color: '#f8fafc' }}>
                    {tr.shares.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Trade Statistics */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '10px', color: '#64748b' }}>Buy / Sell Ratio (5m)</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span className="data-mono" style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>64%</span>
                <span style={{ color: '#64748b', fontSize: '11px' }}>vs</span>
                <span className="data-mono" style={{ fontSize: '14px', fontWeight: '800', color: '#f43f5e' }}>36%</span>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '10px', color: '#64748b', textAlign: 'right' }}>Active Liquid Pool</p>
              <p className="data-mono" style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', marginTop: '4px', textAlign: 'right' }}>
                $4.82M YES
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
