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

## 4. Storage Bucket Setup

This project uses Supabase Storage to store user-uploaded images. Create a bucket named `Images` and set its access as needed (public is simplest for development). To create the bucket:

1. Open Supabase Dashboard
2. Navigate to Storage -> Buckets
3. Click "New Bucket"
4. Use the name `Images` and set public access (or configure your preferred access policy)

After creating the bucket, uploads from the Home page will be stored under `Images/{userId}/...` and a public URL will be returned for viewing.

### Applying Storage Policies

There are two ways to configure access for the `Images` bucket:

- Owner-only policies (recommended for stricter control): Run `policies_owner.sql` in the Supabase SQL editor as the project owner. This enables RLS and creates policies to allow authenticated users to upload and manage their own files.

  Note: If you upload to the bucket root (no subfolders), use `policies_owner.sql` which allows root uploads for authenticated users.

- Public bucket (easiest for development): Make the `Images` bucket public in the Storage UI. You can use `policies_public.sql` as a reminder/instruction if you prefer running SQL scripts.

If you tried to run the owner-only script and received a "must be owner of table objects" error, use the Supabase Dashboard as the project owner to run the script or set the bucket to public instead.

#### RLS: INSERT blocked for storage.objects

If you see errors like `new row violates row-level security policy` when uploading a file, it means the current RLS policies don't allow the insert. To fix this:

1. Ensure you ran `policies_owner.sql` as the Supabase project owner so that RLS policies for `storage.objects` are applied correctly.
2. If you can't run the owner script, set the `Images` bucket to public in the Storage UI (this avoids RLS checks for public objects).
3. Double check the `bucket_id` in your upload path — the bucket name is case-insensitive in the SQL checks but must match the actual bucket name.
4. Check `owner` field behavior: some Supabase setups set `owner` to NULL on upload; the policy allows inserts when `owner IS NULL`.

If you're still blocked, share the exact SQL error and the object insert statement (or the Supabase client call) and I can help adjust the policy to match your setup.

### Debugging Storage RLS Errors

If you get `new row violates row-level security policy` when uploading:

- Check that `policies_owner.sql` was run as the project owner.
- Confirm that the `bucket_id` and object `name` match your upload path. If you upload to the bucket root, the policy allows `position('/' IN name) = 0`.
- In the frontend, inspect the logged session and upload details (the app prints `Current session` and `Upload attempt details` to the console when uploading).
- If your uploads don't set the `owner` field, the policy allows `owner IS NULL` during INSERTs. For updates the `owner` must equal the user's UID.
