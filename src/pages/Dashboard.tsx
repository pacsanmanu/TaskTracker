import React, { useState } from 'react'
import { GoalCard } from '@/components/GoalCard'
import { GoalForm } from '@/components/GoalForm'
import { useGoals } from '@/hooks/useGoals'
import { useCompletions } from '@/hooks/useCompletions'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

// DND imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

const Dashboard: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date())
  const formattedDate = format(date, 'yyyy-MM-dd')
  
  const { 
    goals, 
    addGoal, 
    updateGoal, 
    updateGoalOrder,
    deleteGoal, 
    toggleGoalActive, 
    loading: goalsLoading 
  } = useGoals()
  const { completions, toggleCompletion, loading: completionsLoading } = useCompletions(formattedDate)

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = goals.findIndex((g) => g.id === active.id)
      const newIndex = goals.findIndex((g) => g.id === over.id)
      
      const newOrderedGoals = arrayMove(goals, oldIndex, newIndex)
      updateGoalOrder(newOrderedGoals)
    }
  }

  const activeGoals = goals.filter(g => g.is_active || completions.some(c => c.goal_id === g.id))
  
  const progress = activeGoals.length > 0 
    ? (completions.length / activeGoals.length) * 100 
    : 0

  return (
    <div className="container max-w-2xl py-8 md:py-12 animate-fade-in">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Daily Goals</h1>
                <p className="text-muted-foreground mt-1">Keep track of your habits and goals</p>
              </div>
              <GoalForm onAddGoal={addGoal} />
            </div>

            <div className="flex items-center justify-center gap-3 bg-card border rounded-xl p-2 shadow-sm">
              <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "flex-1 justify-center text-center font-semibold hover:bg-secondary",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "EEEE, d MMMM") : <span>Pick a date</span>}
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

              <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-9 w-9">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <div className="space-y-4 bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <CheckCircle2 className="h-24 w-24 text-primary" />
            </div>
            <div className="flex justify-between items-end mb-1">
              <div className="space-y-1">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Progress</span>
                <div className="text-2xl font-bold">{Math.round(progress)}% Complete</div>
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {completions.length} of {activeGoals.length} goals
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3"
              indicatorClassName="bg-primary transition-all duration-1000 ease-in-out"
            />
          </div>

          <div className="grid gap-4">
            {goalsLoading || completionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[76px] w-full rounded-xl" />
                ))}
              </div>
            ) : activeGoals.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={activeGoals.map((g) => g.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid gap-4">
                    {activeGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        completed={completions.some((c) => c.goal_id === goal.id)}
                        onToggle={() => toggleCompletion(goal.id)}
                        onDelete={deleteGoal}
                        onUpdate={updateGoal}
                        onToggleActive={toggleGoalActive}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No goals for today</h3>
                <p className="text-muted-foreground max-w-[250px] mx-auto mt-1">
                  You haven't added any goals for this day yet.
                </p>
                <div className="mt-6">
                  <GoalForm onAddGoal={addGoal} />
                </div>
              </div>
            )}
          </div>
          
          {goals.some(g => !g.is_active && !completions.some(c => c.goal_id === g.id)) && (
            <div className="mt-6 pt-6 border-t animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-muted-foreground">Paused Goals</h2>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  {goals.filter(g => !g.is_active && !completions.some(c => c.goal_id === g.id)).length}
                </Badge>
              </div>
              <div className="grid gap-4 opacity-80">
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
  )
}

export default Dashboard
