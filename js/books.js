let books = [];
let currentFilter = 'all';

async function loadBooks(search = 'popular') {
    const container = document.getElementById('books-grid');
    container.innerHTML = '<p class="no-results">Loading...</p>';
    
    try {
        const url = `https://openlibrary.org/search.json?q=${search}&limit=20`;
        const response = await fetch(url);
        const data = await response.json();
        
        books = data.docs.map(item => ({
            id: item.key,
            title: item.title || 'No Title',
            author: item.author_name?.[0] || 'Unknown Author',
            genre: getGenre(item.subject),
            image: item.cover_i 
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                : 'https://via.placeholder.com/200x300?text=No+Cover'
        }));
        
        showBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        container.innerHTML = '<p class="no-results">Error loading books. Please try again.</p>';
    }
}

function getGenre(subjects) {
    if (!subjects || subjects.length === 0) return 'general';
    
    for (let subject of subjects) {
        const s = subject.toLowerCase();
        if (s.includes('mystery') || s.includes('detective') || s.includes('crime')) return 'mystery';
        if (s.includes('romance') || s.includes('love')) return 'romance';
        if (s.includes('science fiction') || s.includes('sci-fi') || s.includes('fantasy')) return 'sci-fi';
        if (s.includes('history') || s.includes('biography') || s.includes('non-fiction') || s.includes('nonfiction')) return 'non-fiction';
        if (s.includes('fiction') || s.includes('novel')) return 'fiction';
    }
    
    return 'general';
}

function showBooks() {
    const container = document.getElementById('books-grid');
    const favorites = getFavorites();
    
    let show = books;
    if (currentFilter !== 'all') {
        show = books.filter(b => b.genre === currentFilter);
    }
    
    if (show.length === 0) {
        container.innerHTML = '<p class="no-results">No books found in this genre</p>';
        return;
    }
    
    container.innerHTML = show.map(book => {
        const isFav = favorites.some(fav => fav.id === book.id);
        return `
            <div class="book-card" onclick="goToDetails('${book.id}')">
                <div class="book-cover">
                    <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFav('${book.id}')">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <img src="${book.image}" alt="${book.title}">
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <span class="genre-tag">${book.genre}</span>
                </div>
            </div>
        `;
    }).join('');
}
function goToDetails(bookId) {
    window.location.href = 'book_details.html?id=' + bookId;
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFav(id) {
    let favorites = getFavorites();
    const book = books.find(b => b.id === id);
    
    if (!book) return;
    
    const index = favorites.findIndex(fav => fav.id === id);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(book);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showBooks();
}

function search(text) {
    currentFilter = 'all';
    document.querySelectorAll('.genre-pill').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-genre="all"]').classList.add('active');
    
    if (!text) {
        loadBooks('popular');
    } else {
        loadBooks(text);
    }
}

function setFilter(genre) {
    currentFilter = genre;
    
    document.querySelectorAll('.genre-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.genre === genre);
    });
    
    if (genre !== 'all') {
        const hasBooks = books.some(b => b.genre === genre);
        if (!hasBooks) {
            loadBooksByGenre(genre);
            return;
        }
    }
    showBooks();
}

async function loadBooksByGenre(genre) {
    const container = document.getElementById('books-grid');
    container.innerHTML = '<p class="no-results">Loading...</p>';
    
    const queries = {
        'mystery': 'mystery detective crime',
        'romance': 'romance love',
        'sci-fi': 'science fiction',
        'non-fiction': 'history biography',
        'fiction': 'fiction novel'
    };
    
    const query = queries[genre] || genre;
    
    try {
        const url = `https://openlibrary.org/search.json?q=${query}&limit=20`;
        const response = await fetch(url);
        const data = await response.json();
        
        books = data.docs.map(item => ({
            id: item.key, 
            title: item.title || 'No Title',
            author: item.author_name?.[0] || 'Unknown Author',
            genre: genre,
            image: item.cover_i 
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                : 'https://via.placeholder.com/200x300?text=No+Cover'
        }));
        
        showBooks();
    } catch (error) {
        console.error('Error loading books:', error);
        container.innerHTML = '<p class="no-results">Error loading books. Please try again.</p>';
    }
}

window.onload = () => {
    loadBooks('popular');
    
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', (e) => search(e.target.value));
    }
    
    document.querySelectorAll('.genre-pill').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.genre));
    });
};