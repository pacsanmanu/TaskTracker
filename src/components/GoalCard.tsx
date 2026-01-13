import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Trash2, Power, Pencil } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { GoalForm } from '@/components/GoalForm'
import type { Goal } from '@/types'

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
  return (
    <Card className={`transition-all ${completed ? 'bg-muted/50' : ''}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Checkbox 
            checked={completed} 
            onCheckedChange={onToggle}
            disabled={!goal.is_active}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
                {goal.title}
              </span>
              {!goal.is_active && (
                <Badge variant="secondary">Paused</Badge>
              )}
            </div>
            {goal.description && (
              <span className="text-sm text-muted-foreground line-clamp-1">
                {goal.description}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
              className="text-destructive" 
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
