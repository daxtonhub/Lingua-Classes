// Loaded AFTER the Supabase CDN script in every HTML page.
// Replace these two values with your real Supabase project values
// (Project Settings -> API in your Supabase dashboard).
const SUPABASE_URL = "https://YOUR-PROJECT-ID.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-public-key-here";

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
