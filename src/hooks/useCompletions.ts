import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { GoalCompletion } from '@/types'
import { useAuth } from './useAuth'

export const useCompletions = (date: string) => {
  const [completions, setCompletions] = useState<GoalCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchCompletions = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('goal_completions')
        .select('*, goals!inner(user_id)')
        .eq('completed_at', date)
        .eq('goals.user_id', user.id)

      if (error) throw error
      setCompletions(data || [])
    } catch (error) {
      console.error('Error fetching completions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompletions()
  }, [user, date])

  const toggleCompletion = async (goalId: string) => {
    if (!user) return

    const existing = completions.find(c => c.goal_id === goalId)

    if (existing) {
      try {
        const { error } = await supabase
          .from('goal_completions')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
        setCompletions(completions.filter(c => c.id !== existing.id))
      } catch (error) {
        console.error('Error deleting completion:', error)
      }
    } else {
      try {
        const { data, error } = await supabase
          .from('goal_completions')
          .insert([{ goal_id: goalId, completed_at: date }])
          .select()

        if (error) throw error
        setCompletions([...completions, data[0]])
      } catch (error) {
        console.error('Error adding completion:', error)
      }
    }
  }

  return {
    completions,
    loading,
    toggleCompletion,
    refreshCompletions: fetchCompletions
  }
}
