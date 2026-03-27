import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-[#12121a] border border-[#1e1e2e] p-3 rounded-xl shadow-lg">
        <p className="text-white font-bold mb-1">{dataPoint.merchantName}</p>
        <p className="text-indigo-400 font-semibold mb-2">₹{dataPoint.amount.toLocaleString()}</p>
        <div className="text-xs text-gray-400 capitalize bg-[#1e1e2e] px-2 py-1 rounded inline-block">
          {dataPoint.usageFrequency} usage
        </div>
      </div>
    );
  }
  return null;
};

export default function SubscriptionBarChart({ subscriptions = [] }) {
  // Take top 10 items to prevent chart clutter
  const data = [...subscriptions]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);



  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 h-[400px] flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Subscription Breakdown</h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">No subscription data available</div>
      ) : (
        <div className="flex-1 min-h-0 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
              <XAxis 
                dataKey="merchantName" 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                axisLine={{stroke: '#4b5563'}} 
                tickLine={false} 
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                tick={{fill: '#9ca3af', fontSize: 12}} 
                axisLine={{stroke: '#4b5563'}} 
                tickLine={false} 
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e1e2e'}} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.usageFrequency === 'rarely' ? '#ef4444' : '#6366f1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
