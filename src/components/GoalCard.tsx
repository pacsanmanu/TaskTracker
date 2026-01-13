import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Trash2, Power, Pencil, GripVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { GoalForm } from '@/components/GoalForm'
import type { Goal } from '@/types'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface GoalCardProps {
  goal: Goal
  completed: boolean
  onToggle: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, description: string) => Promise<any>
  onToggleActive: (id: string, is_active: boolean) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  completed,
  onToggle,
  onDelete,
  onUpdate,
  onToggleActive,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on buttons or menus
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="menuitem"]')) {
      return
    }
    if (goal.is_active) {
      onToggle()
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging ? "z-50" : "")}>
      <Card 
        onClick={handleCardClick}
        className={cn(
          "group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] animate-fade-in cursor-pointer select-none",
          completed ? "bg-primary/5 border-primary/20" : "bg-card",
          !goal.is_active && "opacity-60 bg-muted/30 cursor-not-allowed",
          isDragging && "opacity-50 shadow-2xl scale-105"
        )}
      >
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
          completed ? "bg-primary" : "bg-transparent group-hover:bg-primary/30",
          !goal.is_active && "bg-muted"
        )} />
        
        <CardContent className="p-4 flex items-center justify-between gap-2">
          <div 
            {...attributes} 
            {...listeners}
            className="p-1 -ml-2 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Checkbox 
                checked={completed} 
                onCheckedChange={onToggle}
                disabled={!goal.is_active}
                className="h-5 w-5 rounded-md border-2"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-semibold text-base transition-all duration-300 truncate",
                  completed ? "text-muted-foreground line-through decoration-primary/50" : "text-foreground"
                )}>
                  {goal.title}
                </span>
                {!goal.is_active && (
                  <Badge variant="outline" className="text-[10px] py-0 h-4 bg-muted text-muted-foreground border-muted-foreground/20">
                    Paused
                  </Badge>
                )}
              </div>
              {goal.description && (
                <span className="text-sm text-muted-foreground line-clamp-1">
                  {goal.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <GoalForm 
                  goal={goal} 
                  onUpdateGoal={onUpdate}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuItem onClick={() => onToggleActive(goal.id, !goal.is_active)}>
                  <Power className="mr-2 h-4 w-4" />
                  {goal.is_active ? 'Pause' : 'Resume'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                  onClick={() => onDelete(goal.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
