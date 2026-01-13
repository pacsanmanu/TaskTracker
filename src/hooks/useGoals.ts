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
        .order('created_at', { ascending: false })

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
      const { data, error } = await supabase
        .from('goals')
        .insert([{ title, description, user_id: user.id }])
        .select()

      if (error) throw error
      setGoals([data[0], ...goals])
      return data[0]
    } catch (error) {
      console.error('Error adding goal:', error)
      throw error
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
    toggleGoalActive,
    deleteGoal,
    refreshGoals: fetchGoals
  }
}
