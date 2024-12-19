async function fetchSummonerData(summonerName) {
    const response = await fetch('/.netlify/functions/riotProxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summonerName }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displaySummonerStats(data);
}

function displaySummonerStats(summonerData, rankedData) {
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';

    if (!summonerData) {
        resultsContainer.innerHTML = '<p>No summoner data found.</p>';
        return;
    }

    let statsHtml = `
        <h2>Summoner: ${summonerData.name}</h2>
        <p>Level: ${summonerData.summonerLevel}</p>
        <img src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/profileicon/${summonerData.profileIconId}.png" alt="${summonerData.name}'s Profile Icon">
        <button onclick="addToFavorites('${summonerData.name}', '${summonerData.id}')">Add to Favorites</button>
    `;

    if (rankedData && rankedData.length > 0) {
        const soloDuo = rankedData.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
        if (soloDuo) {
            statsHtml += `
                <h3>Ranked Solo/Duo:</h3>
                <p>Tier: ${soloDuo.tier} ${soloDuo.rank}</p>
                <p>LP: ${soloDuo.leaguePoints}</p>
                <p>Wins: ${soloDuo.wins}</p>
                <p>Losses: ${soloDuo.losses}</p>
                <p>Win Rate: ${((soloDuo.wins / (soloDuo.wins + soloDuo.losses)) * 100).toFixed(2)}%</p>
            `;
        } else {
            statsHtml += '<p>No Solo/Duo ranked data available.</p>';
        }
    } else {
        statsHtml += '<p>No ranked data available.</p>';
    }

    resultsContainer.innerHTML = statsHtml;
}

function addToFavorites(summonerName, summonerId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.name === summonerName)) {
        favorites.push({ name: summonerName, id: summonerId });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${summonerName} added to favorites!`);
    } else {
        alert(`${summonerName} is already in your favorites!`);
    }
}

function removeFromFavorites(summonerName, summonerId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => !(fav.name === summonerName));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${summonerName} removed from favorites.`);
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        if (favorites.length === 0) {
            resultsContainer.innerHTML = '<p>No favorites yet.</p>';
        } else {
            let favoritesHtml = '<h2>Favorites</h2><ul>';
            favorites.forEach(fav => {
                favoritesHtml += `<li>${fav.name} <button onclick="fetchSummonerData('${fav.name}')">View Stats</button> <button onclick="removeFromFavorites('${fav.name}', '${fav.id}')">Remove</button></li>`;
            });
            favoritesHtml += '</ul>';
            resultsContainer.innerHTML = favoritesHtml;
        }
    }
}

function displayError(message) {
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const summonerNameInput = document.querySelector('input[type="text"]');

    if (searchButton && summonerNameInput) {
        searchButton.addEventListener('click', () => {
            const summonerName = summonerNameInput.value.trim();
            if (summonerName) {
                fetchSummonerData(summonerName);
            } else {
                alert('Please enter a summoner name.');
            }
        });

        summonerNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchButton.click();
            }
        });
    } else {
        console.error('Search elements not found');
    }

    const favoritesButton = document.createElement('button');
    favoritesButton.textContent = 'Show Favorites';
    favoritesButton.onclick = displayFavorites;
    document.querySelector('.search-container').appendChild(favoritesButton);
});