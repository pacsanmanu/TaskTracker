import React, { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { GoalCard } from '@/components/GoalCard'
import { GoalForm } from '@/components/GoalForm'
import { useGoals } from '@/hooks/useGoals'
import { useCompletions } from '@/hooks/useCompletions'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date())
  const formattedDate = format(date, 'yyyy-MM-dd')
  
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalActive, loading: goalsLoading } = useGoals()
  const { completions, toggleCompletion, loading: completionsLoading } = useCompletions(formattedDate)

  const handlePrevDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    setDate(newDate)
  }

  const activeGoals = goals.filter(g => g.is_active || completions.some(c => c.goal_id === g.id))
  
  const progress = activeGoals.length > 0 
    ? (completions.length / activeGoals.length) * 100 
    : 0

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Daily Goals</h1>
            <GoalForm onAddGoal={addGoal} />
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4">
            {goalsLoading || completionsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : activeGoals.length > 0 ? (
              activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  completed={completions.some((c) => c.goal_id === goal.id)}
                  onToggle={() => toggleCompletion(goal.id)}
                  onDelete={deleteGoal}
                  onUpdate={updateGoal}
                  onToggleActive={toggleGoalActive}
                />
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No goals for this day.</p>
                <p className="text-sm text-muted-foreground">Add a new goal to get started!</p>
              </div>
            )}
          </div>
          
          {goals.some(g => !g.is_active && !completions.some(c => c.goal_id === g.id)) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Paused Goals</h2>
              <div className="grid gap-4 opacity-60">
                {goals
                  .filter(g => !g.is_active && !completions.some(c => c.goal_id === g.id))
                  .map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      completed={false}
                      onToggle={() => {}}
                      onDelete={deleteGoal}
                      onUpdate={updateGoal}
                      onToggleActive={toggleGoalActive}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
