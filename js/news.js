async function fetchGNews() {
    const apiKey = '0fb84af188d3aa4c47985c9f355505ca';
    const response = await fetch(`https://gnews.io/api/v4/search?q=gaming&token=${apiKey}`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const articles = data.articles;
    displayNews(articles);
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-articles');
    newsContainer.innerHTML = '';

    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>No news available at the moment.</p>';
    } else {
        articles.forEach(article => {
            const articleElement = createArticleElement(article);
            newsContainer.appendChild(articleElement);
        });
    }
}

function createArticleElement(article) {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('news-article');

    articleDiv.innerHTML = `
        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
        <p>${article.description}</p>
        <p><small>Source: ${article.source.name}</small></p>
    `;
    
    return articleDiv;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGNews()
        .catch(error => {
            const newsContainer = document.getElementById('news-articles');
            newsContainer.innerHTML = `<p class="error">Failed to load news: ${error.message}</p>`;
        });
});
