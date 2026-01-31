import { Battery, Thermometer, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import type { GarbageBin } from '@/app/App';

interface BinMonitorProps {
  bins: GarbageBin[];
  selectedBin: string | null;
  onSelectBin: (binId: string) => void;
}

export function BinMonitor({ bins, selectedBin, onSelectBin }: BinMonitorProps) {
  const getStatusColor = (status: GarbageBin['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'idle':
        return 'bg-slate-400';
      default:
        return 'bg-emerald-500';
    }
  };

  const getStatusBadge = (status: GarbageBin['status']) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Warning</Badge>;
      case 'idle':
        return <Badge variant="secondary">Idle</Badge>;
      default:
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Normal</Badge>;
    }
  };

  const getFillLevelColor = (level: number) => {
    if (level >= 90) return 'bg-red-500';
    if (level >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const formatLastCollection = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bins.map((bin) => (
        <Card
          key={bin.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedBin === bin.id ? 'ring-2 ring-emerald-500' : ''
          }`}
          onClick={() => onSelectBin(bin.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base">{bin.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{bin.location}</span>
                </div>
              </div>
              {getStatusBadge(bin.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Fill Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Fill Level</span>
                <span className="text-sm font-semibold">{bin.fillLevel}%</span>
              </div>
              <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full transition-all ${getFillLevelColor(
                    bin.fillLevel
                  )}`}
                  style={{ width: `${bin.fillLevel}%` }}
                />
              </div>
            </div>

            {/* Alerts */}
            {bin.status !== 'normal' && bin.status !== 'idle' && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  {bin.status === 'critical'
                    ? 'Immediate collection required'
                    : 'Schedule collection soon'}
                </p>
              </div>
            )}

            {/* Idle Status Message */}
            {bin.status === 'idle' && (
              <div className="flex items-start gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-600">
                  Bin is currently not in service
                </p>
              </div>
            )}

            {/* Device Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Battery
                  className={`w-4 h-4 ${
                    bin.battery > 70 ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                />
                <div>
                  <div className="text-xs text-slate-500">Battery</div>
                  <div className="text-sm font-semibold">{bin.battery}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs text-slate-500">Temp</div>
                  <div className="text-sm font-semibold">{bin.temperature}°C</div>
                </div>
              </div>
            </div>

            {/* Last Collection */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Last collected {formatLastCollection(bin.lastCollection)}</span>
            </div>

            {/* Bin ID */}
            <div className="text-xs text-slate-400 font-mono">{bin.id}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}