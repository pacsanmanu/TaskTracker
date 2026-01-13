import React from 'react'
import { useStats } from '@/hooks/useStats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts'
import { Flame, CheckCircle2, Trophy, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const Stats: React.FC = () => {
  const { weeklyData, streak, loading } = useStats()

  if (loading) {
    return (
      <div className="container py-8 max-w-4xl animate-fade-in">
        <div className="h-10 w-48 bg-muted rounded mb-8 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    )
  }

  const totalCompletions = weeklyData.reduce((acc, curr) => acc + curr.completions, 0)

  return (
    <div className="container py-8 md:py-12 max-w-4xl animate-fade-in">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your Progress</h1>
          <p className="text-muted-foreground mt-1">Visualize your consistency and achievements</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-orange-500/10 to-orange-500/5 shadow-none group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <Flame className="h-16 w-16 text-orange-500" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">Current Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{streak} days</div>
              <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1 font-medium">Keep the fire burning!</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 to-primary/5 shadow-none group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-primary">Weekly Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCompletions}</div>
              <p className="text-xs text-primary/70 mt-1 font-medium">Completed in 7 days</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 shadow-none group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">Activity Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round((totalCompletions / (weeklyData.length * 5)) * 100)}%
              </div>
              <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1 font-medium">Relative to average</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-muted/40 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
            <div>
              <CardTitle className="text-lg">Activity History</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Your daily performance for the last week</p>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[400px] pt-10 pb-4 px-2 md:px-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor" 
                  className="text-muted-foreground dark:text-slate-400"
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-muted-foreground dark:text-slate-400"
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)', opacity: 0.4 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border bg-popover p-3 shadow-lg animate-scale-in border-border/50">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {payload[0].payload.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-primary" />
                              <span className="font-bold text-base text-popover-foreground">
                                {payload[0].value} {payload[0].value === 1 ? 'Goal' : 'Goals'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="completions" 
                  radius={[6, 6, 0, 0]}
                  fill="url(#barGradient)"
                  barSize={window.innerWidth < 768 ? 24 : 40}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fillOpacity={entry.completions === 0 ? 0.1 : 1} 
                      className="transition-all duration-500 ease-in-out hover:filter hover:brightness-110"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  )
}

export default Stats
