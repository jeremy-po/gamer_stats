async function fetchSummonerData(summonerName) {
    const url = `/api/summoner/${encodeURIComponent(summonerName)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text(); 
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
        const data = await response.json();
        displaySummonerData(data);
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        displayError('Unable to fetch summoner data. Please try again.');
    }
}

async function fetchRankedStats(encryptedAccountId) {
    const url = `/api/ranked/${encodeURIComponent(encryptedAccountId)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text(); 
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
        const data = await response.json();
        displayRankedStats(data);
    } catch (error) {
        console.error('Error fetching ranked stats:', error);
        displayError('Unable to fetch ranked stats. Please try again.');
    }
}

function displaySummonerData(data) {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';

        if (!data) {
            resultsContainer.innerHTML = '<p>No data found for the summoner.</p>';
        } else {
            const summonerHtml = `
                <h2>Summoner: ${data.name}</h2>
                <p>Summoner Level: ${data.summonerLevel}</p>
                <img src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/profileicon/${data.profileIconId}.png" alt="${data.name}'s Profile Icon">
                <button onclick="addToFavorites('${data.name}', '${data.id}')">Add to Favorites</button>
            `;

            resultsContainer.innerHTML = summonerHtml;
            fetchRankedStats(data.id);
        }
    }
}

function displayRankedStats(data) {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML += '<h3>Ranked Stats</h3>';

        if (!data || data.length === 0) {
            resultsContainer.innerHTML += '<p>No ranked stats found for the summoner.</p>';
            return;
        }

        const soloDuoStats = data.find(entry => entry.queueType === 'RANKED_SOLO_5x5');

        if (!soloDuoStats) {
            resultsContainer.innerHTML += '<p>No solo/duo ranked stats available.</p>';
            return;
        }

        const rankedStatsHtml = `
            <p>Tier: ${soloDuoStats.tier} ${soloDuoStats.rank}</p>
            <p>LP: ${soloDuoStats.leaguePoints}</p>
            <p>Wins: ${soloDuoStats.wins}</p>
            <p>Losses: ${soloDuoStats.losses}</p>
            <p>Win Rate: ${((soloDuoStats.wins / (soloDuoStats.wins + soloDuoStats.losses)) * 100).toFixed(2)}%</p>
        `;

        resultsContainer.innerHTML += rankedStatsHtml;
    }
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

function displayError(message) {
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = `<p class="error">${message}</p>`;
    }
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
    }

    const favoritesButton = document.createElement('button');
    favoritesButton.textContent = 'Show Favorites';
    favoritesButton.onclick = displayFavorites;
    document.querySelector('.search-container').appendChild(favoritesButton);
});