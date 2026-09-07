import type { Stats } from './types';

interface StatsGridProps {
  stats: Stats[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-white rounded-lg p-6 flex items-center gap-4">
          <Icon className={`w-8 h-8 ${
            label.includes('Passed') ? 'text-green-500' : 
            label.includes('Score') ? 'text-gray-700' :
            label.includes('Time') ? 'text-blue-500' : 'text-gray-700'
          }`} />
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}