-- Add order_index to goals
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Update existing goals to have an order based on created_at
WITH numbered_goals AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) - 1 as new_order
  FROM public.goals
)
UPDATE public.goals
SET order_index = numbered_goals.new_order
FROM numbered_goals
WHERE public.goals.id = numbered_goals.id;
