import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  Entertainment: '#6366f1',
  Utilities: '#f59e0b',
  Health: '#10b981',
  Software: '#3b82f6',
  Food: '#ef4444',
  Other: '#8b5cf6'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#12121a] border border-[#1e1e2e] p-3 rounded-xl shadow-lg">
        <p className="text-gray-300 text-sm mb-1">{payload[0].name}</p>
        <p className="text-white font-bold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ byCategory = {} }) {
  const data = Object.entries(byCategory)
    // eslint-disable-next-line no-unused-vars
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));



  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 h-[400px] flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Spend by Category</h3>
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">No category data available</div>
      ) : (
        <div className="flex-1 min-h-0 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Other} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{paddingTop: '20px'}} />
          </PieChart>
        </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
