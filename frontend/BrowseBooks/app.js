const api = "http://localhost:5000/api/books";

let allBooks = [];

async function loadBooks() {
    const res = await fetch(api);
    allBooks = await res.json();
    displayBooks(allBooks);
}

function displayBooks(books) {
    const container = document.getElementById("bookList");
    container.innerHTML = "";

    books.forEach(book => {
        container.innerHTML += `
            <div class="book-card">
                <img src="${book.image}">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p class="price">$${book.price}</p>
                <button>Add</button>
            </div>
        `;
    });
}

document.getElementById("searchBox").addEventListener("input", async (e) => {
    const q = e.target.value;
    if (q.trim() === "") return displayBooks(allBooks);

    const res = await fetch(api + "/search/" + q);
    const results = await res.json();
    displayBooks(results);
});

function filterBooks(category) {
    if (category === "All") return displayBooks(allBooks);
    const filtered = allBooks.filter(b => b.genre === category);
    displayBooks(filtered);
}

loadBooks();