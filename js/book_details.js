function getBookIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
async function loadBookDetails() {
    const bookId = getBookIdFromUrl();
    
    if (!bookId) {
        document.querySelector('main').innerHTML = '<p>Book not found</p>';
        return;
    }
    try {
        const response = await fetch('https://openlibrary.org' + bookId + '.json');
        const data = await response.json();
        let coverUrl = 'https://via.placeholder.com/300x450?text=No+Cover';
        if (data.covers && data.covers.length > 0) {
            coverUrl = 'https://covers.openlibrary.org/b/id/' + data.covers[0] + '-L.jpg';
        }
        let authorName = 'Unknown Author';
        if (data.authors && data.authors.length > 0) {
            const authorResponse = await fetch('https://openlibrary.org' + data.authors[0].author.key + '.json');
            const authorData = await authorResponse.json();
            authorName = authorData.name || 'Unknown Author';
        }
        let description = data.description || 'No description available.';
        if (typeof description === 'object') {
            description = description.value || 'No description available.';
        }
        const publishDate = data.first_publish_date || data.first_publish_year || 'Unknown';
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFav = favorites.some(fav => fav.id === bookId);
        const html = `
            <div class="details-container">
                <div class="details-back">
                    <a href="home.html" class="back-link">
                        <i class="fas fa-arrow-left"></i> Back to Library
                    </a>
                </div>
                
                <div class="details-content">
                    <div class="details-cover">
                        <img src="${coverUrl}" alt="${data.title}">
                    </div>
                    
                    <div class="details-info">
                        <h1 class="details-title">${data.title}</h1>
                        <p class="details-author">by ${authorName}</p>
                        
                        <div class="details-meta">
                            <span class="details-year">First published: ${publishDate}</span>
                            ${data.number_of_pages ? `<span class="details-pages">${data.number_of_pages} pages</span>` : ''}
                        </div>
                        
                        <div class="details-actions">
                            <button class="details-btn details-btn-primary" onclick="readSample()">
                                <i class="fas fa-book-open"></i> Read Sample
                            </button>
                            <button class="details-btn details-btn-fav ${isFav ? 'active' : ''}" onclick="toggleDetailsFav('${bookId}', '${data.title.replace(/'/g, "\\'")}', '${authorName}', '${coverUrl}')">
                                <i class="${isFav ? 'fas' : 'far'} fa-heart"></i> ${isFav ? 'In Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                        
                        <div class="details-description">
                            <h3>About this book</h3>
                            <p>${description}</p>
                        </div>
                        
                        ${data.subjects ? `
                        <div class="details-subjects">
                            <h3>Subjects</h3>
                            <div class="subjects-list">
                                ${data.subjects.slice(0, 8).map(subject => `<span class="subject-tag">${subject}</span>`).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('main').innerHTML = html;
        
    } catch (error) {
        console.error('Error:', error);
        document.querySelector('main').innerHTML = '<p>Error loading book details. Please try again.</p>';
    }
}
function readSample() {
    alert('Reading sample feature coming soon!');
}
function toggleDetailsFav(id, title, author, image) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(fav => fav.id === id);
    
    const btn = document.querySelector('.details-btn-fav');
    
    if (index > -1) {
        favorites.splice(index, 1);
        btn.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
        btn.classList.remove('active');
    } else {
        favorites.push({
            id: id,
            title: title,
            author: author,
            image: image,
            genre: 'general'
        });
        btn.innerHTML = '<i class="fas fa-heart"></i> In Favorites';
        btn.classList.add('active');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}
window.onload = loadBookDetails;