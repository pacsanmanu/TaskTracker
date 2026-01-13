export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  is_active: boolean
  order_index: number
  created_at: string
}

export interface GoalCompletion {
  id: string
  goal_id: string
  completed_at: string
  created_at: string
}

export interface DailyGoalStatus extends Goal {
  completed: boolean
}
