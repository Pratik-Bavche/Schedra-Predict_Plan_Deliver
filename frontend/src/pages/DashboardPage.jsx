import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CostOverviewChart } from "@/components/dashboard/CostOverviewChart"
import { RiskHeatmap } from "@/components/dashboard/RiskHeatmap"
import { ProjectGantt } from "@/components/dashboard/ProjectGantt"
import { DollarSign, Activity, Users, AlertTriangle } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { generateProjectForecast, generateProjectTimeline } from "@/lib/insightGenerator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalBudget: 0,
        totalProjects: 0,
        delayDays: 0, // Changed from scheduleDelay for clarity
        totalResources: 0,
        highRiskCount: 0,
        forecastData: [],
        riskData: [],
        ganttTasks: [],
        allProjects: []
    })
    const [loading, setLoading] = useState(true)
    const [selectedMetric, setSelectedMetric] = useState(null)
    const [ganttFilter, setGanttFilter] = useState("all")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/projects")
                const projects = Array.isArray(response) ? response : [];

                // 1. Basic Stats
                let budget = 0;
                let resources = 0;
                let riskCount = 0;
                let delay = 0;
                const now = new Date();

                // 2. Prepare for aggregations
                const aggregatedForecast = {}; // key: Month, val: {actual, forecast}
                const regionMap = {}; // key: Region, val: {count, riskScoreSum}

                // We will generate filtered tasks on render, so just storing projects is enough for now,
                // but let's keep calculating the implementation-agnostic stats here.

                projects.forEach(p => {
                    try {
                        // Budget
                        budget += (Number(p.budget) || 0);

                        // Resources
                        resources += (parseInt(p.teamSize) || 0);

                        // Risk
                        if (p.riskLevel === 'High' || p.riskLevel === 'Critical') {
                            riskCount++;
                        }

                        // Delay (Overdue)
                        if (p.dueDate) {
                            const due = new Date(p.dueDate);
                            // Valid date check
                            if (!isNaN(due.getTime()) && p.status !== 'Completed' && now > due) {
                                const diffTime = Math.abs(now - due);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                delay += diffDays;
                            }
                        }

                        // Cost Forecast Aggregation
                        const pForecast = generateProjectForecast(p);
                        if (Array.isArray(pForecast)) {
                            pForecast.forEach(entry => {
                                if (entry && entry.month) {
                                    if (!aggregatedForecast[entry.month]) {
                                        aggregatedForecast[entry.month] = { actual: 0, forecast: 0 };
                                    }
                                    aggregatedForecast[entry.month].actual += (entry.actual || 0);
                                    aggregatedForecast[entry.month].forecast += (entry.forecast || 0);
                                }
                            });
                        }

                        // Regional Risk Aggregation
                        const region = p.region || p.type || "General";
                        if (!regionMap[region]) regionMap[region] = { count: 0, scoreSum: 0 };

                        let score = 20;
                        if (p.riskLevel === 'Medium') score = 55;
                        if (p.riskLevel === 'High') score = 85;
                        if (p.riskLevel === 'Critical') score = 95;

                        regionMap[region].count++;
                        regionMap[region].scoreSum += score;
                    } catch (err) {
                        console.warn("Skipping malformed project data:", p, err);
                    }
                });

                // Finalize Forecast Data
                const finalForecast = Object.keys(aggregatedForecast).map(month => ({
                    month,
                    actual: aggregatedForecast[month].actual,
                    forecast: aggregatedForecast[month].forecast
                }));

                // Finalize Risk Data
                const finalRisk = Object.keys(regionMap).map(r => ({
                    region: r,
                    factor: "Composite", // Simplified for aggregation
                    score: Math.round(regionMap[r].scoreSum / regionMap[r].count)
                }));

                setStats({
                    totalBudget: budget,
                    totalProjects: projects.length,
                    delayDays: delay,
                    totalResources: resources,
                    highRiskCount: riskCount,
                    forecastData: finalForecast,
                    riskData: finalRisk,
                    // We generate tasks dynamically now
                    ganttTasks: [],
                    allProjects: projects
                })
            } catch (error) {
                toast.error("Failed to load dashboard data")
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const getFilteredProjects = () => {
        if (!selectedMetric) return [];
        const { allProjects } = stats;
        const now = new Date();

        switch (selectedMetric) {
            case 'budget':
                return allProjects.map(p => ({
                    name: p.name,
                    value: `$${(p.budget || 0).toLocaleString()}`,
                    sub: "Total Budget"
                }));
            case 'delay':
                return allProjects.filter(p => {
                    if (!p.dueDate || p.status === 'Completed') return false;
                    const due = new Date(p.dueDate);
                    return !isNaN(due.getTime()) && now > due;
                }).map(p => {
                    const diffTime = Math.abs(now - new Date(p.dueDate));
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return {
                        name: p.name,
                        value: `+${diffDays} Days`,
                        sub: "Overdue"
                    };
                });
            case 'resources':
                return allProjects.map(p => ({
                    name: p.name,
                    value: p.teamSize || 0,
                    sub: "Staff Members"
                }));
            case 'risk':
                return allProjects.filter(p => p.riskLevel === 'High' || p.riskLevel === 'Critical')
                    .map(p => ({
                        name: p.name,
                        value: p.riskLevel,
                        sub: "Risk Level"
                    }));
            default:
                return [];
        }
    }

    const getDialogTitle = () => {
        switch (selectedMetric) {
            case 'budget': return "Project Budgets";
            case 'delay': return "Schedule Delays";
            case 'resources': return "Resource Allocation";
            case 'risk': return "High Risk Projects";
            default: return "Details";
        }
    }

    // Dynamic Gantt Task Generation
    const getFilteredGanttTasks = () => {
        const { allProjects } = stats;
        let filteredProjects = [];

        if (ganttFilter === 'all') {
            filteredProjects = allProjects;
        } else {
            // Specific Project ID
            filteredProjects = allProjects.filter(p => p._id === ganttFilter || p.id === ganttFilter);
        }

        let tasks = [];
        filteredProjects.forEach(p => {
            const pTasks = generateProjectTimeline(p);
            if (Array.isArray(pTasks)) {
                const validTasks = pTasks.filter(t => t && t.start && !isNaN(new Date(t.start).getTime()) && t.end && !isNaN(new Date(t.end).getTime()));
                tasks = [...tasks, ...validTasks];
            }
        });
        return tasks;
    }

    if (loading) return <div className="p-8">Loading dashboard...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {/* Top Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setSelectedMetric('budget')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget Spend</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across {stats.totalProjects} active projects</p>
                    </CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setSelectedMetric('delay')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Schedule Delay</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.delayDays > 0 ? `+${stats.delayDays} Days` : "On Track"}
                        </div>
                        <p className="text-xs text-muted-foreground">Cumulative impact</p>
                    </CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setSelectedMetric('resources')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Resources</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalResources}</div>
                        <p className="text-xs text-muted-foreground">Total assigned staff</p>
                    </CardContent>
                </Card>
                <Card
                    className="cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => setSelectedMetric('risk')}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">High Risk Items</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.highRiskCount}</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <CostOverviewChart data={stats.forecastData} />
                <RiskHeatmap data={stats.riskData} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
                <ProjectGantt
                    tasks={getFilteredGanttTasks()}
                    headerAction={
                        <Select value={ganttFilter} onValueChange={setGanttFilter}>
                            <SelectTrigger className="w-[200px] h-8">
                                <SelectValue placeholder="Filter Timeline" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                {stats.allProjects.map(p => (
                                    <SelectItem key={p._id || p.id} value={p._id || p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    }
                />
            </div>

            <Dialog open={!!selectedMetric} onOpenChange={(open) => !open && setSelectedMetric(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{getDialogTitle()}</DialogTitle>
                        <DialogDescription>
                            Breaking down metrics by project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[300px] overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getFilteredProjects().length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground">
                                            No data available for this metric.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    getFilteredProjects().map((p, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="font-bold">{p.value}</div>
                                                <div className="text-xs text-muted-foreground">{p.sub}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
