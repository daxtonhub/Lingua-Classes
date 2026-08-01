async function loadNotices(type) {
  let query = supabase.from("notices").select("*").eq("batch_id", batchId).order("created_at", { ascending: false });
  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  const list = document.getElementById("notice-list");
  if (error) { list.textContent = error.message; return; }
  if (!data.length) { list.innerHTML = "<p>No notices yet.</p>"; return; }

  list.innerHTML = data.map(n => `
    <div class="card">
      <span class="tag ${n.type === 'test' ? 'test' : ''}">${n.type}</span>
      <h3>${n.title}</h3>
      <p>${n.description || ""}</p>
      ${n.date ? `<p class="meta">📅 ${n.date} ${n.time || ""}</p>` : ""}
      ${n.syllabus ? `<p class="meta">📘 Syllabus: ${n.syllabus}</p>` : ""}
      ${myRole === "teacher" ? `<button class="danger" onclick="deleteNotice('${n.id}')">Delete</button>` : ""}
    </div>
  `).join("");
}

async function createNotice() {
  const type = document.getElementById("notice-type").value;
  const title = document.getElementById("notice-title").value.trim();
  const description = document.getElementById("notice-desc").value.trim();
  const date = document.getElementById("notice-date").value || null;
  const time = document.getElementById("notice-time").value || null;
  const syllabus = document.getElementById("notice-syllabus").value.trim() || null;

  if (!title) return alert("Title is required");

  const { error } = await supabase.from("notices").insert({
    batch_id: batchId, type, title, description, date, time, syllabus,
    created_by: currentUser.id
  });
  if (error) return alert(error.message);

  document.getElementById("notice-title").value = "";
  document.getElementById("notice-desc").value = "";
  document.getElementById("notice-date").value = "";
  document.getElementById("notice-time").value = "";
  document.getElementById("notice-syllabus").value = "";
  loadNotices(null);
}

async function deleteNotice(id) {
  if (!confirm("Delete this notice?")) return;
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) return alert(error.message);
  loadNotices(null);
}
