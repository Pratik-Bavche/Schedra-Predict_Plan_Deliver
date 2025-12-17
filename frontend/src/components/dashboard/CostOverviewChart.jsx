import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const defaultData = [
    { month: "Jan", actual: 4000, forecast: 4200 },
    { month: "Feb", actual: 3000, forecast: 3200 },
    { month: "Mar", actual: 2000, forecast: 2500 },
    { month: "Apr", actual: 2780, forecast: 2900 },
    { month: "May", actual: 1890, forecast: 2100 },
    { month: "Jun", actual: 2390, forecast: 2500 },
]

export function CostOverviewChart({ data }) {
    const chartData = data || defaultData;
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Cost vs Forecast</CardTitle>
                <CardDescription>
                    Comparing actual spend against AI-predicted budget over the last 6 months.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[350px] w-full min-w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="month"
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
                            <Bar dataKey="actual" name="Actual Spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                            <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
