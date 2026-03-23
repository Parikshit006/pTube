import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-border-default rounded-lg shadow-lg p-3 outline-none">
        <p className="font-mono text-[11px] text-text-disabled mb-1">{label}</p>
        <p className="font-display font-semibold text-[15px] text-red">
          {new Intl.NumberFormat().format(payload[0].value)} Views
        </p>
      </div>
    );
  }
  return null;
};

const ViewsChart = ({ data = [] }) => {
  // If no data or empty, show empty chart structure but no fake data
  const safeData = data.length > 0 ? data : [];

  return (
    <div className="w-full mt-6 bg-bg-primary border border-border-default rounded-xl p-4 sm:p-6 pb-2 hover:border-border-strong transition-colors group">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-semibold text-[16px] text-text-primary">Engagement Pipeline</h3>
        <select className="bg-bg-tertiary border border-border-default rounded-md px-2 py-1 font-body text-[12px] outline-none text-text-secondary w-28 h-8">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>All time</option>
        </select>
      </div>
      
      {/* Hide the yAxis line, only keep labels. XAxis keep line */}
      <div style={{ width: '100%', minHeight: 240 }}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={safeData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,59,59,0.25)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="rgba(255,59,59,0.01)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-disabled)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
              dy={10}
              minTickGap={20}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-disabled)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#ff3b3b" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              activeDot={{ r: 6, fill: '#ff3b3b', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ViewsChart;
