# Supabase Database Setup

This directory contains SQL scripts for setting up the database schema for Hackerator.

## Setup Instructions

### 1. Run the Profiles Table SQL

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Open the `profiles.sql` file
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute the script

### 2. What the Script Does

The `profiles.sql` script will:
- Create a `profiles` table with the following columns:
  - `id` (UUID, references auth.users)
  - `name` (TEXT, required)
  - `email` (TEXT, required)
  - `bio` (TEXT, optional)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
  
- Enable Row Level Security (RLS) on the profiles table
- Create policies that allow users to:
  - View their own profile
  - Insert their own profile
  - Update their own profile
  - Delete their own profile
  
- Create an index on the email column for faster lookups
- Add an automatic trigger to update the `updated_at` timestamp

### 3. Verify the Setup

After running the script, verify that:
1. The `profiles` table exists in your database
2. RLS is enabled on the table
3. The policies are active

You can check this in the Supabase dashboard under:
- **Table Editor** → Look for the `profiles` table
- **Authentication** → **Policies** → Look for the profiles policies

## How It Works

When a user signs up and visits the Home page for the first time:
1. The app checks if a profile exists for the user
2. If no profile is found, the ProfileModal is automatically displayed
3. The user enters their name and bio
4. The profile is saved to the `profiles` table in Supabase
5. The modal closes and the user can continue using the app

## Troubleshooting

### Profile Modal Not Showing
- Make sure you've run the SQL script in your Supabase project
- Check the browser console for any errors
- Verify that RLS policies are correctly set up

### Can't Save Profile
- Ensure RLS policies are active
- Check that the user is authenticated
- Verify the Supabase client configuration in your app

### Profile Already Exists Error
- The app handles this automatically by updating the existing profile instead of inserting a new one
