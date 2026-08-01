// Loaded AFTER the Supabase CDN script in every HTML page.
// Replace these two values with your real Supabase project values
// (Project Settings -> API in your Supabase dashboard).
const SUPABASE_URL = "https://tseenfhjgomvliuvtubx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZWVuZmhqZ29tdmxpdXZ0dWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MDk0NDcsImV4cCI6MjEwMTE4NTQ0N30.w-qqE8IhtoTLZdLv5_xw6yiUL8GXgKF6R9yNnycDVE8";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Redirect to login if not signed in. Call this at the top of any
// protected page's script.
async function requireLogin() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
    return null;
  }
  return data.user;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Helper used on batch pages: reads ?batch=<id> from the URL
function getBatchIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("batch");
}

// Returns 'teacher' | 'student' | 'admin' | null for the current user in a batch
async function getMyRole(batchId, userId) {
  const { data, error } = await supabase
    .from("batch_memberships")
    .select("role")
    .eq("batch_id", batchId)
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data.role;
}
