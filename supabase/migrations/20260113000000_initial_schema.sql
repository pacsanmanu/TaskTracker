-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create goal_completions table
CREATE TABLE IF NOT EXISTS public.goal_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(goal_id, completed_at)
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_completions ENABLE ROW LEVEL SECURITY;

-- Policies for goals
CREATE POLICY "Users can view their own goals" 
ON public.goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" 
ON public.goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.goals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.goals FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for goal_completions
CREATE POLICY "Users can view their own goal completions" 
ON public.goal_completions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.goals 
        WHERE public.goals.id = public.goal_completions.goal_id 
        AND public.goals.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert their own goal completions" 
ON public.goal_completions FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.goals 
        WHERE public.goals.id = public.goal_completions.goal_id 
        AND public.goals.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own goal completions" 
ON public.goal_completions FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.goals 
        WHERE public.goals.id = public.goal_completions.goal_id 
        AND public.goals.user_id = auth.uid()
    )
);
