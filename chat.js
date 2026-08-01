async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*, profiles(full_name)")
    .eq("batch_id", batchId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const list = document.getElementById("chat-list");
  if (error) { list.textContent = error.message; return; }

  list.innerHTML = data.map(m => `
    <div class="${m.sender_id === currentUser.id ? 'msg-me' : ''}">
      <div class="meta">${m.profiles?.full_name || "Someone"}</div>
      <div class="msg-bubble">${m.content}</div>
      ${(myRole === "teacher" || m.sender_id === currentUser.id) ? `<div><button class="danger" style="width:auto;padding:2px 8px;font-size:11px;" onclick="deleteMessage('${m.id}')">delete</button></div>` : ""}
    </div>
  `).join("");
  list.scrollTop = list.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const content = input.value.trim();
  if (!content) return;

  const { error } = await supabase.from("messages").insert({
    batch_id: batchId, sender_id: currentUser.id, content
  });
  if (error) return alert(error.message);

  input.value = "";
  loadMessages();
}

async function deleteMessage(id) {
  const { error } = await supabase
    .from("messages")
    .update({ deleted_at: new Date().toISOString(), deleted_by: currentUser.id })
    .eq("id", id);
  if (error) return alert(error.message);
  loadMessages();
}

// NOTE for later: to make chat live/real-time without any redesign,
// replace the "load on tab click" pattern above with:
//   supabase.channel('chat-' + batchId)
//     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `batch_id=eq.${batchId}` }, loadMessages)
//     .subscribe();
// This is a pure addition — no schema or backend change required.
