const quoteList = document.getElementById("quote-list");
const quoteForm = document.getElementById("quote-form");

// Function to fetch and display quotes
async function fetchQuotes() {
  const response = await fetch("/get-quotes");
  const data = await response.json();

  quoteList.innerHTML = data
    .map(
      (q) => `
        <div class="quote-card">
            <p>"${q.text}"</p>
            <span>— ${q.author}</span>
            <button class="share-btn" data-text="${q.text}" data-author="${q.author}">Share</button>
        </div>
    `,
    )
    .join("");
}

// Function to handle form submission
quoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Adding...";

  const text = document.getElementById("text").value;
  const author = document.getElementById("author").value;

  try {
    const response = await fetch("/add-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author }),
    });

    if (response.ok) {
      quoteForm.reset();
      fetchQuotes(); // Refresh list automatically
    }
  } finally {
    // Reset loading state
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Load quotes on page start
fetchQuotes();

// Share quote functionality
quoteList.addEventListener("click", (e) => {
  if (e.target.classList.contains("share-btn")) {
    const text = e.target.dataset.text;
    const author = e.target.dataset.author;
    const quoteString = `"${text}" — ${author}`;
    
    // Try Web Share API first (mobile), fallback to clipboard
    if (navigator.share) {
      navigator.share({
        title: "Quote from QuoteHub",
        text: quoteString,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(quoteString).then(() => {
        e.target.textContent = "Copied!";
        setTimeout(() => {
          e.target.textContent = "Share";
        }, 2000);
      });
    }
  }
});
