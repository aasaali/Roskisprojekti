import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ClipboardList,
  DollarSign,
  FileText,
  Calendar,
  MapPin,
  User,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { GarbageBin, CollectionTask, CompletedCollection } from '@/app/App';

interface TaskManagerProps {
  bins: GarbageBin[];
  tasks: CollectionTask[];
  completedCollections: CompletedCollection[];
  onCompleteTask: (taskId: string, collectorName: string) => void;
}

export function TaskManager({
  bins,
  tasks,
  completedCollections,
  onCompleteTask,
}: TaskManagerProps) {
  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);
  const [collectorName, setCollectorName] = useState('Waste Solutions Ltd');
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const ongoingTasks = tasks.filter(
    (task) => task.status === 'pending' || task.status === 'in-progress'
  );
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeSinceCreation = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  const getPriorityBadge = (priority: CollectionTask['priority']) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="destructive" className="text-xs">
            High Priority
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">Medium Priority</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Low Priority
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: CollectionTask['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">In Progress</Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">Completed</Badge>
        );
    }
  };

  const getInvoiceStatusBadge = (status: CompletedCollection['invoiceStatus']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-xs">
            Pending Invoice
          </Badge>
        );
      case 'invoiced':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">Invoiced</Badge>
        );
      case 'paid':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-xs">Paid</Badge>
        );
    }
  };

  const handleOpenCompleteDialog = (task: CollectionTask) => {
    setSelectedTask(task);
    setIsCompleteDialogOpen(true);
  };

  const handleConfirmComplete = () => {
    if (selectedTask) {
      onCompleteTask(selectedTask.id, collectorName);
      setIsCompleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const totalPendingInvoiceAmount = completedCollections
    .filter((col) => col.invoiceStatus === 'pending')
    .reduce((sum, col) => sum + col.cost, 0);

  const totalInvoicedAmount = completedCollections
    .filter((col) => col.invoiceStatus === 'invoiced')
    .reduce((sum, col) => sum + col.cost, 0);

  const totalPaidAmount = completedCollections
    .filter((col) => col.invoiceStatus === 'paid')
    .reduce((sum, col) => sum + col.cost, 0);

  return (
    <>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              <CardTitle>Task Management & Invoicing</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ongoing" className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="ongoing">
                  Ongoing Tasks ({ongoingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedTasks.length})
                </TabsTrigger>
                <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
              </TabsList>

              {/* Ongoing Tasks */}
              <TabsContent value="ongoing" className="space-y-4">
                {ongoingTasks.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No ongoing collection tasks</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {ongoingTasks.map((task) => (
                      <Card key={task.id} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">{task.binName}</CardTitle>
                              <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{task.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                              {getPriorityBadge(task.priority)}
                              {getStatusBadge(task.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-slate-500">Fill Level</div>
                              <div className="text-lg font-semibold">
                                {task.fillLevelAtCreation}%
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">Estimated Cost</div>
                              <div className="text-lg font-semibold">€{task.estimatedCost}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>Created {getTimeSinceCreation(task.createdAt)}</span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(task.createdAt)}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-200">
                            <div className="text-xs text-slate-400 font-mono mb-2">
                              {task.id}
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handleOpenCompleteDialog(task)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark as Completed
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Completed Tasks */}
              <TabsContent value="completed" className="space-y-4">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No completed tasks</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold">{task.binName}</div>
                              <div className="text-sm text-slate-500">{task.location}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-xs text-slate-500">Completed</div>
                                <div className="text-sm">
                                  {task.completedAt
                                    ? formatDate(task.completedAt)
                                    : 'N/A'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500">Cost</div>
                                <div className="text-sm font-semibold">
                                  €{task.estimatedCost}
                                </div>
                              </div>
                              {getStatusBadge(task.status)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Invoicing */}
              <TabsContent value="invoicing" className="space-y-4">
                {/* Invoice Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Pending Invoices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">
                        €{totalPendingInvoiceAmount}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {
                          completedCollections.filter(
                            (col) => col.invoiceStatus === 'pending'
                          ).length
                        }{' '}
                        collections
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Invoiced
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-blue-600">
                        €{totalInvoicedAmount}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {
                          completedCollections.filter(
                            (col) => col.invoiceStatus === 'invoiced'
                          ).length
                        }{' '}
                        collections
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Paid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-emerald-600">
                        €{totalPaidAmount}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {
                          completedCollections.filter((col) => col.invoiceStatus === 'paid')
                            .length
                        }{' '}
                        collections
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Collection Records for Invoicing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Collection Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {completedCollections.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No collection records</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {completedCollections.map((collection) => (
                          <Card key={collection.id} className="bg-slate-50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold">{collection.binName}</div>
                                  <div className="text-sm text-slate-500">
                                    {collection.location}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                                    <User className="w-3 h-3" />
                                    <span>{collection.collectorName}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-xs text-slate-500">Collection Date</div>
                                    <div className="text-sm">
                                      {formatDate(collection.collectionDate)}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="text-xs text-slate-500">Fill Level</div>
                                    <div className="text-sm font-semibold">
                                      {collection.fillLevel}%
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <div className="text-xs text-slate-500">Cost</div>
                                    <div className="text-lg font-semibold text-emerald-600">
                                      €{collection.cost}
                                    </div>
                                  </div>

                                  <div>{getInvoiceStatusBadge(collection.invoiceStatus)}</div>
                                </div>
                              </div>

                              <div className="text-xs text-slate-400 font-mono mt-2">
                                Task ID: {collection.taskId} | Collection ID: {collection.id}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Complete Task Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Collection Task</DialogTitle>
            <DialogDescription>
              Mark this task as completed and reset the bin. An invoice record will be created
              automatically.
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Bin:</span>
                  <span className="text-sm font-semibold">{selectedTask.binName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Location:</span>
                  <span className="text-sm font-semibold">{selectedTask.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Fill Level:</span>
                  <span className="text-sm font-semibold">
                    {selectedTask.fillLevelAtCreation}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Cost:</span>
                  <span className="text-sm font-semibold">€{selectedTask.estimatedCost}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collector">Collector Name</Label>
                <Input
                  id="collector"
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  placeholder="Enter collector/company name"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCompleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
