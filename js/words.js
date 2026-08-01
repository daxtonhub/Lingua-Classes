async function loadWords() {
  const { data, error } = await supabase
    .from("words_vault")
    .select("*")
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false });

  const list = document.getElementById("word-list");
  if (error) { list.textContent = error.message; return; }
  if (!data.length) { list.innerHTML = "<p>No words added yet.</p>"; return; }

  list.innerHTML = data.map(w => `
    <div class="card">
      <h3>${w.word}</h3>
      <p>${w.meaning}</p>
      ${w.example ? `<p class="meta">e.g. "${w.example}"</p>` : ""}
      ${(w.added_by === currentUser.id || myRole === "teacher") ? `<button class="danger" onclick="deleteWord('${w.id}')">Delete</button>` : ""}
    </div>
  `).join("");
}

async function addWord() {
  const word = document.getElementById("word-input").value.trim();
  const meaning = document.getElementById("meaning-input").value.trim();
  const example = document.getElementById("example-input").value.trim() || null;

  if (!word || !meaning) return alert("Word and meaning are required");

  const { error } = await supabase.from("words_vault").insert({
    batch_id: batchId, word, meaning, example, added_by: currentUser.id
  });
  if (error) return alert(error.message);

  document.getElementById("word-input").value = "";
  document.getElementById("meaning-input").value = "";
  document.getElementById("example-input").value = "";
  loadWords();
}

async function deleteWord(id) {
  if (!confirm("Delete this word?")) return;
  const { error } = await supabase.from("words_vault").delete().eq("id", id);
  if (error) return alert(error.message);
  loadWords();
}
