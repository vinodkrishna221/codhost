# Supabase Authentication Troubleshooting Guide

## Overview

This guide helps diagnose and fix issues with user data synchronization between auth.users and related tables (user_stats, user_activities) in the Supabase database.

## Database Schema Overview

### Tables and Relationships

```sql
auth.users (Supabase managed)
└── users_table (1:1)
    ├── user_stats (1:1)
    └── user_activities (1:many)
```

### Key Table Schemas

```sql
-- users_table
id UUID PRIMARY KEY REFERENCES auth.users(id)
email TEXT UNIQUE
username TEXT UNIQUE
created_at TIMESTAMPTZ
avatar_url TEXT
current_rank TEXT

-- user_stats
user_id UUID PRIMARY KEY REFERENCES users_table(id)
problems_solved INTEGER
achievement_points INTEGER
rank_position INTEGER
last_updated TIMESTAMPTZ

-- user_activities
id UUID PRIMARY KEY
user_id UUID REFERENCES users_table(id)
problem_id UUID
completed_at TIMESTAMPTZ
problem_difficulty TEXT
problem_title TEXT
```

## Step-by-Step Troubleshooting

### 1. Verify User Creation Flow

Check if users are properly created in `users_table`:

```sql
-- Check if user exists in auth.users
SELECT * FROM auth.users WHERE email = 'user@example.com';

-- Check if user exists in users_table
SELECT * FROM users_table WHERE email = 'user@example.com';

-- Check for orphaned users (in auth.users but not in users_table)
SELECT au.id, au.email 
FROM auth.users au
LEFT JOIN users_table ut ON au.id = ut.id
WHERE ut.id IS NULL;
```

### 2. Verify User Stats Creation

Check if user_stats records are created:

```sql
-- Check user_stats for specific user
SELECT * FROM user_stats WHERE user_id = 'user-uuid';

-- Find missing user_stats records
SELECT ut.id, ut.email
FROM users_table ut
LEFT JOIN user_stats us ON ut.id = us.user_id
WHERE us.user_id IS NULL;
```

### 3. Verify Trigger Functions

Check if triggers are properly installed and firing:

```sql
-- List all triggers
SELECT 
    event_object_table AS table_name,
    trigger_name,
    event_manipulation AS trigger_event,
    action_statement AS trigger_action
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY table_name, trigger_name;

-- Check trigger function existence
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
AND routine_name IN ('handle_new_user', 'update_user_stats_on_solve');
```

### 4. Common Issues and Solutions

#### Issue 1: User Stats Not Created on Sign Up

**Symptoms:**
- User exists in `auth.users` and `users_table`
- No record in `user_stats`

**Solution:**
1. Verify trigger function:
```sql
-- Manually run trigger function
SELECT handle_new_user();

-- Recreate trigger if missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
```

#### Issue 2: Activity Updates Not Reflecting in Stats

**Symptoms:**
- New activities appear in `user_activities`
- `user_stats` not updating

**Solution:**
1. Check trigger function:
```sql
-- Verify trigger function
SELECT update_user_stats_on_solve();

-- Recreate trigger if needed
DROP TRIGGER IF EXISTS on_problem_solved ON user_activities;
CREATE TRIGGER on_problem_solved
    AFTER INSERT ON user_activities
    FOR EACH ROW
    WHEN (NEW.action = 'Solved')
    EXECUTE FUNCTION update_user_stats_on_solve();
```

### 5. Data Consistency Checks

Run these queries to verify data consistency:

```sql
-- Check for users without stats
SELECT ut.id, ut.email
FROM users_table ut
LEFT JOIN user_stats us ON ut.id = us.user_id
WHERE us.user_id IS NULL;

-- Verify activity counts match stats
WITH activity_counts AS (
    SELECT user_id, COUNT(*) as actual_count
    FROM user_activities
    WHERE action = 'Solved'
    GROUP BY user_id
)
SELECT 
    us.user_id,
    us.problems_solved as recorded_count,
    COALESCE(ac.actual_count, 0) as actual_count
FROM user_stats us
LEFT JOIN activity_counts ac ON us.user_id = ac.user_id
WHERE us.problems_solved != COALESCE(ac.actual_count, 0);
```

### 6. Manual Fix Scripts

If inconsistencies are found, use these scripts to fix them:

```sql
-- Create missing user_stats records
INSERT INTO user_stats (user_id)
SELECT ut.id
FROM users_table ut
LEFT JOIN user_stats us ON ut.id = us.user_id
WHERE us.user_id IS NULL;

-- Update problems_solved count
UPDATE user_stats us
SET problems_solved = (
    SELECT COUNT(*)
    FROM user_activities ua
    WHERE ua.user_id = us.user_id
    AND ua.action = 'Solved'
);
```

## Authentication Flow Verification

1. Sign Up Flow:
```typescript
// Expected flow:
auth.users (created by Supabase)
  → handle_new_user() trigger
    → users_table record created
    → user_stats record created
```

2. Activity Creation Flow:
```typescript
user_activities record created
  → on_problem_solved trigger
    → user_stats updated
    → rank recalculated
```

## Debugging Tools

1. Enable Supabase Database Logs:
```sql
ALTER DATABASE your_database SET log_statement = 'all';
```

2. Monitor Trigger Execution:
```sql
CREATE OR REPLACE FUNCTION log_trigger_execution()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO trigger_logs (trigger_name, table_name, operation)
    VALUES (TG_NAME, TG_TABLE_NAME, TG_OP);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Contact Support

If issues persist after following this guide:

1. Collect the following information:
   - Database logs
   - Trigger execution logs
   - User ID and email of affected accounts
   - Timestamps of failed operations

2. Create a support ticket with Supabase including:
   - All collected information
   - Steps to reproduce the issue
   - Results of the diagnostic queries above