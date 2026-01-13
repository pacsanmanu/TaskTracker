import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { startOfDay, subDays, format, eachDayOfInterval } from 'date-fns'

export const useStats = () => {
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const { user } = useAuth()

  const fetchStats = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Fetch completions for the last 30 days
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')
      
      const { data, error } = await supabase
        .from('goal_completions')
        .select('*, goals!inner(user_id)')
        .eq('goals.user_id', user.id)
        .gte('completed_at', thirtyDaysAgo)

      if (error) throw error

      // Process weekly data
      const last7Days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date()
      })

      const chartData = last7Days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const count = data?.filter(c => c.completed_at === dateStr).length || 0
        return {
          name: format(day, 'EEE'),
          completions: count
        }
      })

      setWeeklyData(chartData)

      // Calculate streak (simple version: days with at least one completion)
      let currentStreak = 0
      let checkDate = startOfDay(new Date())
      
      while (true) {
        const dateStr = format(checkDate, 'yyyy-MM-dd')
        const hasCompletion = data?.some(c => c.completed_at === dateStr)
        
        if (hasCompletion) {
          currentStreak++
          checkDate = subDays(checkDate, 1)
        } else {
          // If no completion today, check if it was broken yesterday
          if (currentStreak === 0) {
            checkDate = subDays(checkDate, 1)
            const hadYesterday = data?.some(c => c.completed_at === format(checkDate, 'yyyy-MM-dd'))
            if (!hadYesterday) break
            // If it had yesterday but not today, streak is 0 and we break
            break
          } else {
            break
          }
        }
      }
      setStreak(currentStreak)

    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [user])

  return {
    weeklyData,
    streak,
    loading,
    refreshStats: fetchStats
  }
}
