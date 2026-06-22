'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCompact, formatNumber } from '@/lib/formatters';

const PIE_COLORS = ['#4F46E5', '#8B8CFB', '#06B6D4', '#22C55E', '#F59E0B', '#EF4444', '#A78BFA', '#14B8A6'];

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border border-line px-3 py-2 font-mono text-xs shadow-soft"
      style={{ background: 'var(--surface)', color: 'var(--text)' }}
    >
      {label != null && <div className="mb-1 font-semibold">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text)' }}>
          {p.name}: {formatNumber(p.value)}
        </div>
      ))}
    </div>
  );
}

const axisProps = {
  stroke: 'var(--muted)',
  tick: { fill: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)' },
  tickLine: false,
};

export default function ChartPanel({ chart, className = '' }) {
  const { type, title, subtitle, data, valueKey } = chart;

  return (
    <div className={`rounded-xl border border-line p-[18px] ${className}`} style={{ background: 'var(--bg)' }}>
      <h4 className="text-[14.5px]">{title}</h4>
      <p className="mb-4 font-mono text-xs text-muted">{subtitle}</p>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer>
          {type === 'donut' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={2}
                stroke="var(--bg)"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<TooltipBox />} />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: 'var(--muted)' }}
              />
            </PieChart>
          ) : type === 'line' ? (
            <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={formatCompact} width={48} />
              <Tooltip content={<TooltipBox />} />
              <Line
                type="monotone"
                dataKey="value"
                name={valueKey}
                stroke="var(--accent)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: 'var(--accent2)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="var(--grid)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} interval={0} angle={data.length > 6 ? -20 : 0} textAnchor={data.length > 6 ? 'end' : 'middle'} height={data.length > 6 ? 48 : 30} />
              <YAxis {...axisProps} tickFormatter={formatCompact} width={48} />
              <Tooltip content={<TooltipBox />} cursor={{ fill: 'var(--grid)' }} />
              <Bar dataKey="value" name={valueKey} radius={[7, 7, 0, 0]} fill="url(#barGrad)" maxBarSize={46} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent2)" />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
