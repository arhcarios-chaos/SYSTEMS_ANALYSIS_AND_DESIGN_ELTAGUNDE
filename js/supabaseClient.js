// ============================================================
// js/supabaseClient.js
// Creates and exports the single Supabase client used by the app.
//
// SETUP:
// 1. Go to https://supabase.com -> your project -> Project Settings -> API
// 2. Copy "Project URL" into SUPABASE_URL below
// 3. Copy the "anon public" key into SUPABASE_ANON_KEY below
// 4. Run sql/schema.sql in the Supabase SQL Editor to create the table
//
// Do NOT put your "service_role" key here - only the "anon" key is
// safe to expose in front-end code.
// ============================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://knslnlguunrkxmzqqpxt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuc2xubGd1dW5ya3htenFxcHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NTQwNzMsImV4cCI6MjEwNDUzMDA3M30.b_l1sk_-p5TQZuRPsjddI1a2RmfkubgyPnqYpJMOXVw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simple helper used by app.js to warn the student if they forgot
// to fill in their real project credentials.
export function isSupabaseConfigured() {
  return (
    !SUPABASE_URL.includes("YOUR-PROJECT-REF") &&
    !SUPABASE_ANON_KEY.includes("YOUR-ANON-PUBLIC-KEY")
  );
}
