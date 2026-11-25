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
quoteList.addEventListener("click", async (e) => {
  const shareButton = e.target.closest(".share-btn");
  if (!shareButton) return;

  const text = shareButton.dataset.text;
  const author = shareButton.dataset.author;
  const quoteString = `"${text}" — ${author}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Quote from QuoteHub",
        text: quoteString,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        showShareFallback(quoteString, shareButton);
      }
    }
  } else {
    showShareFallback(quoteString, shareButton);
  }
});

function showShareFallback(quoteString, shareButton) {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteString)}`;
  const popup = window.open(shareUrl, "share-quote", "noopener,noreferrer,width=640,height=520");

  if (!popup) {
    shareButton.textContent = "Pop-up blocked";
  } else {
    shareButton.textContent = "Opened share window";
  }

  setTimeout(() => {
    shareButton.textContent = "Share";
  }, 2000);
}
