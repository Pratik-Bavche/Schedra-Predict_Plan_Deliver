import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const defaultData = [
    { name: "Jan", Actual: 4000, Predicted: 4200 },
    { name: "Feb", Actual: 3000, Predicted: 3200 },
    { name: "Mar", Actual: 2000, Predicted: 2500 },
    { name: "Apr", Actual: 2780, Predicted: 2900 },
    { name: "May", Actual: 1890, Predicted: 2100 },
    { name: "Jun", Actual: 2390, Predicted: 2500 },
]

export function CostOverviewChart({ data, loading }) {
    const chartData = (data && data.length > 0) ? data : defaultData;
    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Cost vs Forecast</CardTitle>
                <CardDescription>
                    Comparing actual spend against AI-predicted budget over the last 6 months.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-0 pb-2">
                <div className="h-[350px] w-full flex items-center justify-center min-h-[350px]">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm">Generating AI Forecast...</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="99%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Actual" name="Actual Spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                                <Line type="monotone" dataKey="Predicted" name="AI Forecast" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
