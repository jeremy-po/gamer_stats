async function fetchNews() {
    const apiKey = '3709a8279c124c67ae6f2ae3df06cb40';  
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=gaming&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const articles = data.articles;
        displayNews(articles);
    } catch (error) {
        displayError('Error fetching news. Please try again later.');
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-articles');
    newsContainer.innerHTML = ''; 

    const filteredArticles = articles.filter(article => {
        return !(article.title.includes("[Removed]") || article.description.includes("[Removed]"));
    });

    if (filteredArticles.length === 0) {
        newsContainer.innerHTML = '<p>No news available at the moment.</p>';
    } else {
        filteredArticles.forEach(article => {
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

function displayError(message) {
    const newsContainer = document.getElementById('news-articles');
    newsContainer.innerHTML = `<p class="error">${message}</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNews()
        .catch(error => {
            displayError('Failed to load news: ' + error.message);
        });
});
