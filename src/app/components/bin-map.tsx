import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Navigation } from 'lucide-react';
import type { GarbageBin } from '@/app/App';

interface BinMapProps {
  bins: GarbageBin[];
  selectedBin: string | null;
  onSelectBin: (binId: string) => void;
}

export function BinMap({ bins, selectedBin, onSelectBin }: BinMapProps) {
  const getMarkerColor = (status: GarbageBin['status']) => {
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
        return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">Warning</Badge>;
      case 'idle':
        return <Badge variant="secondary" className="text-xs">Idle</Badge>;
      default:
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">Normal</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Map View */}
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="relative w-full h-[600px] bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50">
              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                    linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Map Labels */}
              <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold">City Overview</span>
                </div>
              </div>

              {/* Bin Markers */}
              {bins.map((bin, index) => {
                // Distribute bins across the map area
                const xPos = 15 + (index % 3) * 30 + Math.random() * 10;
                const yPos = 20 + Math.floor(index / 3) * 30 + Math.random() * 10;

                return (
                  <div
                    key={bin.id}
                    className={`absolute cursor-pointer group transition-transform hover:scale-110 ${
                      selectedBin === bin.id ? 'scale-125 z-10' : ''
                    }`}
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                    }}
                    onClick={() => onSelectBin(bin.id)}
                  >
                    {/* Marker Pin */}
                    <div className="relative">
                      <div
                        className={`w-8 h-8 ${getMarkerColor(
                          bin.status
                        )} rounded-full border-4 border-white shadow-lg flex items-center justify-center`}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </div>

                      {/* Pulse Animation for Critical */}
                      {bin.status === 'critical' && (
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                      )}

                      {/* Fill Level Indicator */}
                      <div
                        className={`absolute -top-1 -right-1 w-5 h-5 ${getMarkerColor(
                          bin.status
                        )} rounded-full border-2 border-white shadow text-white text-xs flex items-center justify-center font-semibold`}
                      >
                        {bin.fillLevel}
                      </div>

                      {/* Hover Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap">
                          <div className="font-semibold">{bin.name}</div>
                          <div className="text-xs text-slate-300">{bin.location}</div>
                          <div className="text-xs mt-1">Fill: {bin.fillLevel}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Legend */}
          <div className="flex items-center gap-6 mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-sm text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-sm text-slate-600">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-slate-600">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full" />
              <span className="text-sm text-slate-600">Idle</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bin List Sidebar */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Bin Locations</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {bins.map((bin) => (
              <div
                key={bin.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedBin === bin.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white'
                }`}
                onClick={() => onSelectBin(bin.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{bin.name}</div>
                    <div className="text-xs text-slate-500">{bin.location}</div>
                  </div>
                  {getStatusBadge(bin.status)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {bin.coordinates.lat.toFixed(4)}, {bin.coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">{bin.fillLevel}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}