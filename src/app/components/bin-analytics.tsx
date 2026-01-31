import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';
import type { GarbageBin } from '@/app/App';

interface BinAnalyticsProps {
  bins: GarbageBin[];
}

export function BinAnalytics({ bins }: BinAnalyticsProps) {
  // Filter out idle bins for fill level calculations
  const activeBins = bins.filter((b) => b.status !== 'idle');
  
  // Generate fill level distribution data
  const fillLevelData = [
    { range: '0-25%', count: activeBins.filter((b) => b.fillLevel <= 25).length },
    { range: '26-50%', count: activeBins.filter((b) => b.fillLevel > 25 && b.fillLevel <= 50).length },
    { range: '51-75%', count: activeBins.filter((b) => b.fillLevel > 50 && b.fillLevel <= 75).length },
    { range: '76-90%', count: activeBins.filter((b) => b.fillLevel > 75 && b.fillLevel <= 90).length },
    { range: '91-100%', count: activeBins.filter((b) => b.fillLevel > 90).length },
  ];

  // Generate weekly collection trend data
  const weeklyData = [
    { day: 'Mon', collections: 8, fillRate: 65 },
    { day: 'Tue', collections: 6, fillRate: 58 },
    { day: 'Wed', collections: 10, fillRate: 72 },
    { day: 'Thu', collections: 7, fillRate: 68 },
    { day: 'Fri', collections: 12, fillRate: 82 },
    { day: 'Sat', collections: 9, fillRate: 75 },
    { day: 'Sun', collections: 5, fillRate: 55 },
  ];

  // Status distribution for pie chart
  const statusData = [
    { name: 'Normal', value: bins.filter((b) => b.status === 'normal').length },
    { name: 'Warning', value: bins.filter((b) => b.status === 'warning').length },
    { name: 'Critical', value: bins.filter((b) => b.status === 'critical').length },
  ];

  const COLORS = {
    normal: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
  };

  // Calculate analytics metrics
  const totalCollections = weeklyData.reduce((sum, day) => sum + day.collections, 0);
  const avgFillRate =
    bins.reduce((sum, bin) => sum + bin.fillLevel, 0) / bins.length;
  const collectionEfficiency = 87; // Mock efficiency metric
  const avgBatteryLevel =
    bins.reduce((sum, bin) => sum + bin.battery, 0) / bins.length;

  return (
    <div className="space-y-4">
      {/* Key Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Weekly Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold">{totalCollections}</div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">vs. last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Avg Fill Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold">{avgFillRate.toFixed(0)}%</div>
              <div className="flex items-center gap-1 text-amber-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+5%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Current average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Collection Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold">{collectionEfficiency}%</div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+3%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Optimal routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Avg Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-semibold">{avgBatteryLevel.toFixed(0)}%</div>
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-2%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Device health</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fill Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Fill Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fillLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === 'Normal'
                          ? COLORS.normal
                          : entry.name === 'Warning'
                          ? COLORS.warning
                          : COLORS.critical
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Collection & Fill Rate Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="collections"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Collections"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="fillRate"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Avg Fill Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bins Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bins
                .filter((b) => b.status !== 'normal' && b.status !== 'idle')
                .sort((a, b) => b.fillLevel - a.fillLevel)
                .map((bin) => (
                  <div
                    key={bin.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-sm">{bin.name}</div>
                      <div className="text-xs text-slate-500">{bin.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{bin.fillLevel}%</div>
                      <div
                        className={`text-xs ${
                          bin.status === 'critical' ? 'text-red-600' : 'text-amber-600'
                        }`}
                      >
                        {bin.status === 'critical' ? 'Critical' : 'Warning'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bins
                .sort((a, b) => a.battery - b.battery)
                .slice(0, 4)
                .map((bin) => (
                  <div
                    key={bin.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold text-sm">{bin.name}</div>
                      <div className="text-xs text-slate-500">Battery Status</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{bin.battery}%</div>
                      <div
                        className={`text-xs ${
                          bin.battery > 70 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {bin.battery > 70 ? 'Good' : 'Low'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}