import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Goal } from '@/types'
import { useAuth } from './useAuth'

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchGoals = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [user])

  const addGoal = async (title: string, description: string) => {
    if (!user) return
    
    try {
      // Get the highest order_index to place the new goal at the end
      const maxOrder = goals.length > 0 
        ? Math.max(...goals.map(g => g.order_index)) 
        : -1;

      const { data, error } = await supabase
        .from('goals')
        .insert([{ 
          title, 
          description, 
          user_id: user.id,
          order_index: maxOrder + 1 
        }])
        .select()

      if (error) throw error
      setGoals([...goals, data[0]])
      return data[0]
    } catch (error) {
      console.error('Error adding goal:', error)
      throw error
    }
  }

  const updateGoalOrder = async (newGoals: Goal[]) => {
    setGoals(newGoals) // Optimistic update
    
    try {
      const updates = newGoals.map((goal, index) => ({
        id: goal.id,
        user_id: user?.id,
        title: goal.title,
        description: goal.description,
        is_active: goal.is_active,
        order_index: index,
      }))

      const { error } = await supabase
        .from('goals')
        .upsert(updates)

      if (error) throw error
    } catch (error) {
      console.error('Error updating order:', error)
      fetchGoals() // Revert on error
    }
  }

  const toggleGoalActive = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ is_active })
        .eq('id', id)

      if (error) throw error
      setGoals(goals.map(g => g.id === id ? { ...g, is_active } : g))
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  const updateGoal = async (id: string, title: string, description: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ title, description })
        .eq('id', id)

      if (error) throw error
      setGoals(goals.map(g => g.id === id ? { ...g, title, description } : g))
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error
      setGoals(goals.filter(g => g.id !== id))
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  }

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    updateGoalOrder,
    toggleGoalActive,
    deleteGoal,
    refreshGoals: fetchGoals
  }
}
