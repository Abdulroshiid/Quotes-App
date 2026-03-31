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
        </div>
    `,
    )
    .join("");
}

// Function to handle form submission
quoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const author = document.getElementById("author").value;

  const response = await fetch("/add-quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, author }),
  });

  if (response.ok) {
    quoteForm.reset();
    fetchQuotes(); // Refresh list automatically
  }
});

// Load quotes on page start
fetchQuotes();
