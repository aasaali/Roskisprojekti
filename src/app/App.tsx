import { useState, useEffect } from 'react';
import { Trash2, MapPin, AlertCircle, TrendingUp, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { BinMonitor } from '@/app/components/bin-monitor';
import { BinMap } from '@/app/components/bin-map';
import { BinAnalytics } from '@/app/components/bin-analytics';
import { TaskManager } from '@/app/components/task-manager';
import { toast } from 'sonner';
import { Toaster } from '@/app/components/ui/sonner';

// Mock IoT data for garbage bins
export interface GarbageBin {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  fillLevel: number;
  status: 'normal' | 'warning' | 'critical' | 'idle';
  lastCollection: string;
  temperature: number;
  battery: number;
}

// Collection task interface
export interface CollectionTask {
  id: string;
  binId: string;
  binName: string;
  location: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  completedAt?: string;
  fillLevelAtCreation: number;
  estimatedCost: number;
}

// Completed collection record for invoicing
export interface CompletedCollection {
  id: string;
  taskId: string;
  binId: string;
  binName: string;
  location: string;
  collectionDate: string;
  fillLevel: number;
  cost: number;
  collectorName: string;
  invoiceStatus: 'pending' | 'invoiced' | 'paid';
}

export const mockBins: GarbageBin[] = [
  {
    id: 'BIN-001',
    name: 'Nilsiä',
    location: 'Työmaa 3',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    fillLevel: 85,
    status: 'warning',
    lastCollection: '2026-01-28T10:30:00',
    temperature: 18,
    battery: 92,
  },
  {
    id: 'BIN-002',
    name: 'Nurmes',
    location: 'Työmaa 7',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    fillLevel: 95,
    status: 'critical',
    lastCollection: '2026-01-27T14:20:00',
    temperature: 22,
    battery: 78,
  },
  {
    id: 'BIN-003',
    name: 'Sonkajärvi',
    location: 'Työmaa 1',
    coordinates: { lat: 40.7489, lng: -73.9680 },
    fillLevel: 45,
    status: 'normal',
    lastCollection: '2026-01-29T08:15:00',
    temperature: 16,
    battery: 95,
  },
  {
    id: 'BIN-004',
    name: 'Lapinlahti',
    location: 'Työmaa 45',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    fillLevel: 72,
    status: 'normal',
    lastCollection: '2026-01-28T16:45:00',
    temperature: 20,
    battery: 88,
  },
  {
    id: 'BIN-005',
    name: 'Iisalmi',
    location: 'Toimisto',
    coordinates: { lat: 40.7282, lng: -73.9942 },
    fillLevel: 30,
    status: 'normal',
    lastCollection: '2026-01-29T07:00:00',
    temperature: 17,
    battery: 91,
  },
  {
    id: 'BIN-006',
    name: 'Lieksa',
    location: 'Työmaa 34',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    fillLevel: 0,
    status: 'idle',
    lastCollection: '2026-01-25T09:00:00',
    temperature: 15,
    battery: 45,
  },
  {
    id: 'BIN-007',
    name: 'Kaavi',
    location: 'Varasto',
    coordinates: { lat: 40.7350, lng: -74.0120 },
    fillLevel: 0,
    status: 'idle',
    lastCollection: '2026-01-24T13:30:00',
    temperature: 14,
    battery: 38,
  },
];

// Initial mock tasks
const initialTasks: CollectionTask[] = [
  {
    id: 'TASK-001',
    binId: 'BIN-002',
    binName: 'Nurmes',
    location: 'Työmaa 7',
    createdAt: '2026-01-30T08:00:00',
    status: 'pending',
    priority: 'high',
    fillLevelAtCreation: 95,
    estimatedCost: 125,
  },
];

// Initial completed collections for invoicing
const initialCompletedCollections: CompletedCollection[] = [
  {
    id: 'COL-001',
    taskId: 'TASK-100',
    binId: 'BIN-001',
    binName: 'Nilsiä',
    location: 'Työmaa 3',
    collectionDate: '2026-01-28T10:30:00',
    fillLevel: 88,
    cost: 120,
    collectorName: 'Waste Solutions Ltd',
    invoiceStatus: 'pending',
  },
  {
    id: 'COL-002',
    taskId: 'TASK-101',
    binId: 'BIN-003',
    binName: 'Sonkajärvi',
    location: 'Työmaa 1',
    collectionDate: '2026-01-29T08:15:00',
    fillLevel: 65,
    cost: 95,
    collectorName: 'Waste Solutions Ltd',
    invoiceStatus: 'invoiced',
  },
  {
    id: 'COL-003',
    taskId: 'TASK-102',
    binId: 'BIN-004',
    binName: 'Lapinlahti',
    location: 'Työmaa 45',
    collectionDate: '2026-01-28T16:45:00',
    fillLevel: 92,
    cost: 130,
    collectorName: 'Waste Solutions Ltd',
    invoiceStatus: 'paid',
  },
];

export default function App() {
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [bins, setBins] = useState<GarbageBin[]>(mockBins);
  const [tasks, setTasks] = useState<CollectionTask[]>(initialTasks);
  const [completedCollections, setCompletedCollections] = useState<CompletedCollection[]>(initialCompletedCollections);

  // Automation: Create tasks for critical bins
  useEffect(() => {
    bins.forEach((bin) => {
      if (bin.status === 'critical') {
        // Check if task already exists for this bin
        const existingTask = tasks.find(
          (task) => task.binId === bin.id && (task.status === 'pending' || task.status === 'in-progress')
        );

        if (!existingTask) {
          // Create new task
          const newTask: CollectionTask = {
            id: `TASK-${Date.now()}-${bin.id}`,
            binId: bin.id,
            binName: bin.name,
            location: bin.location,
            createdAt: new Date().toISOString(),
            status: 'pending',
            priority: 'high',
            fillLevelAtCreation: bin.fillLevel,
            estimatedCost: calculateCollectionCost(bin.fillLevel),
          };

          setTasks((prev) => [...prev, newTask]);
          
          // Send notification to collection company (simulated)
          toast.success(`🚨 Collection Task Created`, {
            description: `Task created for ${bin.name} (${bin.location}). Message sent to collection company.`,
          });
        }
      }
    });
  }, [bins, tasks]);

  const calculateCollectionCost = (fillLevel: number): number => {
    const baseCost = 80;
    const fillLevelMultiplier = fillLevel / 100;
    return Math.round(baseCost + (fillLevel * 0.5));
  };

  const handleCompleteTask = (taskId: string, collectorName: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Mark task as completed
    const completedAt = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'completed' as const, completedAt, assignedTo: collectorName }
          : t
      )
    );

    // Create completed collection record for invoicing
    const completedCollection: CompletedCollection = {
      id: `COL-${Date.now()}`,
      taskId: task.id,
      binId: task.binId,
      binName: task.binName,
      location: task.location,
      collectionDate: completedAt,
      fillLevel: task.fillLevelAtCreation,
      cost: task.estimatedCost,
      collectorName,
      invoiceStatus: 'pending',
    };

    setCompletedCollections((prev) => [completedCollection, ...prev]);

    // Reset bin fill level and update status
    setBins((prev) =>
      prev.map((bin) =>
        bin.id === task.binId
          ? {
              ...bin,
              fillLevel: 0,
              status: 'normal' as const,
              lastCollection: completedAt,
            }
          : bin
      )
    );

    toast.success(`✅ Collection Completed`, {
      description: `${task.binName} has been emptied and reset. Invoice record created.`,
    });
  };

  const activeBins = bins.filter(bin => bin.status !== 'idle').length;
  const idleBins = bins.filter(bin => bin.status === 'idle').length;
  const criticalBins = bins.filter(bin => bin.status === 'critical').length;
  const warningBins = bins.filter(bin => bin.status === 'warning').length;
  const averageFillLevel = Math.round(
    bins.filter(bin => bin.status !== 'idle').reduce((sum, bin) => sum + bin.fillLevel, 0) / activeBins
  );
  const ongoingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Smart Waste Management</h1>
              <p className="text-sm text-slate-500">IoT Monitoring System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Bins</CardTitle>
              <Trash2 className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-emerald-600">{activeBins}</div>
              <p className="text-xs text-slate-500 mt-1">Currently operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Ongoing Tasks</CardTitle>
              <ClipboardList className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-blue-600">{ongoingTasks}</div>
              <p className="text-xs text-slate-500 mt-1">Active collection tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Idle Bins</CardTitle>
              <Trash2 className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-500">{idleBins}</div>
              <p className="text-xs text-slate-500 mt-1">Not in service</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Critical Alerts</CardTitle>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-red-600">{criticalBins}</div>
              <p className="text-xs text-slate-500 mt-1">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Warnings</CardTitle>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-amber-600">{warningBins}</div>
              <p className="text-xs text-slate-500 mt-1">Need collection soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Avg Fill Level</CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{averageFillLevel}%</div>
              <p className="text-xs text-slate-500 mt-1">Active bins average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="monitor" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-4">
            <BinMonitor bins={bins} selectedBin={selectedBin} onSelectBin={setSelectedBin} />
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <BinMap bins={bins} selectedBin={selectedBin} onSelectBin={setSelectedBin} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <BinAnalytics bins={bins} />
          </TabsContent>
        </Tabs>

        {/* Task Manager */}
        <TaskManager
          bins={bins}
          tasks={tasks}
          completedCollections={completedCollections}
          onCompleteTask={handleCompleteTask}
        />
      </main>
      <Toaster />
    </div>
  );
}