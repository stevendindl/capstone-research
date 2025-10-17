# Simple Supabase Authentication Setup

This is a simplified authentication setup using only Supabase email/password authentication with a profiles table.

## Database Setup

1. Go to Supabase project dashboard
2. Navigate to the SQL Editor
3. Run (or copy over) the SQL code from `database/setup.sql` to create the profiles table and necessary triggers

Have to ensure `.env` file has actual Supabase credentials:

## Implemented supabase usage

- **User Registration**: Email/password signup with username
- **User Login**: Email/password authentication  
- **Profile Creation**: Automatic profile creation on signup

## Files Using Supabase auth

- `app/index.tsx` - Authentication check and routing
- `app/(onboard)/signup.tsx` - User registration form
- `app/(onboard)/signin.tsx` - User login form
- `lib/supabase.tsx` - Supabase client configuration
- `database/setup.sql` - Database schema and triggers

## Database Schema

The profiles table includes:
- `id` (UUID) - References auth.users(id)
- `username` (TEXT) - Unique username
- `email` (TEXT) - User email
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Security Features

- Row Level Security (RLS) enabled
- Users can only view/update their own profiles
- Automatic profile creation via database trigger
- Secure password handling via Supabase Auth

## Testing the Setup

1. Start your app: `npx expo start`
2. Navigate to Welcome → Sign Up
3. Fill in the form and create an account
4. Check your email for verification
5. Sign in with credentials

## Next (Ideal) Steps 

- Password reset functionality
- Email verification requirements
- Profile picture uploads
- Additional user metadata
- Social authentication providers