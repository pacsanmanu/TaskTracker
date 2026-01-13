import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Pencil } from 'lucide-react'
import type { Goal } from '@/types'

interface GoalFormProps {
  onAddGoal?: (title: string, description: string) => Promise<any>
  onUpdateGoal?: (id: string, title: string, description: string) => Promise<any>
  goal?: Goal
  trigger?: React.ReactNode
}

export const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal, onUpdateGoal, goal, trigger }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(goal?.title || '')
  const [description, setDescription] = useState(goal?.description || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description || '')
    }
  }, [goal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    setLoading(true)
    try {
      if (goal && onUpdateGoal) {
        await onUpdateGoal(goal.id, title, description)
      } else if (onAddGoal) {
        await onAddGoal(title, description)
        setTitle('')
        setDescription('')
      }
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {goal ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {goal ? 'Edit Goal' : 'Add Goal'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{goal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
            <DialogDescription>
              {goal ? 'Update your goal details.' : 'Create a new daily goal to track.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Drink 2L of water"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Stay hydrated throughout the day"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Saving...' : goal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
