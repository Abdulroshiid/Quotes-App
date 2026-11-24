const quoteList = document.getElementById("quote-list");
const quoteForm = document.getElementById("quote-form");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const status = document.getElementById("status");
const textInput = document.getElementById("text");
const characterCount = document.getElementById("character-count");
const editDialog = document.getElementById("edit-dialog");
const editForm = document.getElementById("edit-form");
const editText = document.getElementById("edit-text");
const editAuthor = document.getElementById("edit-author");
let editingId = null;
let searchTimer;

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = type;
}

// Function to fetch and display quotes
async function fetchQuotes() {
  setStatus("Loading quotes...");
  try {
    const params = new URLSearchParams({
      search: searchInput.value.trim(),
      filter: filterSelect.value,
    });
    const response = await fetch(`/get-quotes?${params}`);
    if (!response.ok) throw new Error("Could not load quotes");
    const quotes = await response.json();

    if (!quotes.length) {
      quoteList.innerHTML = '<p class="empty-state">No quotes found.</p>';
      setStatus("");
      return;
    }

    quoteList.innerHTML = quotes
      .map(
        (quote) => `
      <article class="quote-card" data-id="${quote.id}">
        <p>“${escapeHtml(quote.text)}”</p>
        <span>— ${escapeHtml(quote.author || "Anonymous")}</span>
        <div class="card-actions">
          <button class="like-btn ${quote.liked ? "active" : ""}" data-action="like" aria-label="Like quote">
            ♥ <span>${quote.likes || 0}</span>
          </button>
          <button class="favorite-btn ${quote.favorite ? "active" : ""}" data-action="favorite" aria-label="Favorite quote">
            ${quote.favorite ? "★ Favorited" : "☆ Favorite"}
          </button>
          <button class="edit-btn" data-action="edit">Edit</button>
          <button class="delete-btn" data-action="delete">Delete</button>
          <button class="share-btn" data-action="share">Share</button>
        </div>
      </article>
    `,
      )
      .join("");
    setStatus("");
  } catch (error) {
    setStatus(error.message, "error");
  }
}

textInput.addEventListener("input", () => {
  characterCount.textContent = `${textInput.value.length} / 500`;
});

// Function to handle form submission
quoteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Adding...";

  try {
    const response = await fetch("/add-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textInput.value, author: document.getElementById("author").value }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not add quote");
    quoteForm.reset();
    characterCount.textContent = "0 / 500";
    setStatus("Quote added successfully.", "success");
    await fetchQuotes();
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Add Quote";
  }
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(fetchQuotes, 250);
});
filterSelect.addEventListener("change", fetchQuotes);

quoteList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = button.closest(".quote-card");
  const id = card.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    editingId = id;
    editText.value = card.querySelector("p").textContent.replace(/^“|”$/g, "");
    editAuthor.value = card.querySelector("span").textContent.replace(/^—\s*/, "");
    editDialog.showModal();
    return;
  }

  if (action === "delete") {
    if (!confirm("Delete this quote?")) return;
    const response = await fetch(`/quotes/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setStatus("Could not delete quote.", "error");
      return;
    }
    setStatus("Quote deleted.", "success");
    await fetchQuotes();
    return;
  }

  if (action === "like") {
    const isLiked = button.classList.contains("active");
    const response = await fetch(`/quotes/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isLiked ? "decrement" : "increment" }),
    });
    if (response.ok) {
      button.classList.toggle("active");
      const result = await response.json();
      button.querySelector("span").textContent = result.likes;
    }
    return;
  }

  if (action === "favorite") {
    const response = await fetch(`/quotes/${id}/favorite`, { method: "POST" });
    if (response.ok) {
      const result = await response.json();
      button.classList.toggle("active", Boolean(result.favorite));
      button.textContent = result.favorite ? "★ Favorited" : "☆ Favorite";
      if (filterSelect.value === "favorites") await fetchQuotes();
    }
    return;
  }

  if (action === "share") {
    const quoteString = `${card.querySelector("p").textContent} ${card.querySelector("span").textContent}`;
    if (navigator.share) {
      navigator.share({ title: "Quote from QuoteHub", text: quoteString }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(quoteString);
      button.textContent = "Copied!";
      setTimeout(() => { button.textContent = "Share"; }, 2000);
    }
  }
});

editForm.addEventListener("submit", async (event) => {
  event.preventEvent?.();
  event.preventDefault();
  const response = await fetch(`/quotes/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: editText.value, author: editAuthor.value }),
  });
  const result = await response.json();
  if (!response.ok) {
    setStatus(result.error || "Could not update quote.", "error");
    return;
  }
  editDialog.close();
  setStatus("Quote updated.", "success");
  await fetchQuotes();
});

document.getElementById("cancel-edit").addEventListener("click", () => editDialog.close());

// Load quotes on page start
fetchQuotes();
