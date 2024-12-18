window.addToFavorites = function(playerName, platform) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.name === playerName && fav.platform === platform)) {
        favorites.push({ name: playerName, platform: platform });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${playerName} added to favorites!`);
    } else {
        alert(`${playerName} is already in your favorites!`);
    }
}

window.removeFromFavorites = function(playerName, platform) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => !(fav.name === playerName && fav.platform === platform));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${playerName} removed from favorites.`);
}

window.fetchPlayerStats = async function(playerName, platform) {
    const API_URL = `https://api.mozambiquehe.re/bridge?auth=95637a7af45f24a6026d3291407b0957&player=${encodeURIComponent(playerName)}&platform=${platform}`;
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.errors) {
            console.error('Error fetching data:', data.errors);
            displayError('Error fetching player stats. Please check player name and platform.');
            return;
        }
        
        displayPlayerStats(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        displayError('Error fetching player stats. Please try again later.');
    }
}

function displayPlayerStats(data) {
    const statsContainer = document.querySelector('.results-container');
    
    statsContainer.innerHTML = '';
    
    if (!data || !data.global) {
        statsContainer.innerHTML = '<p>No data found for this player.</p>';
        return;
    }

    const kills = data.total.kills?.value || 'N/A'; 
    const damage = data.total.damage?.value || 'N/A'; 

    const playerStats = `
        <h2>Player Stats for ${data.global.name}</h2>
        <p>Platform: ${data.global.platform}</p>
        <p>Level: ${data.global.level}</p>
        <p>Kills: ${kills}</p>
        <p>Damage: ${damage}</p>
        <button onclick="addToFavorites('${data.global.name}', '${data.global.platform}')">Add to Favorites</button>
    `;
    
    statsContainer.innerHTML = playerStats;
}

function handleSearch() {
    const playerName = document.querySelector('.search-container input[type="text"]').value;
    const platform = document.querySelector('select[name="platform"]').value;
    
    if (playerName && platform) {
        fetchPlayerStats(playerName, platform);
    } else {
        alert('Please enter a player name and select a platform.');
    }
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const statsContainer = document.querySelector('.results-container');
    if (favorites.length === 0) {
        statsContainer.innerHTML = '<p>No favorites yet.</p>';
    } else {
        let favoritesHtml = '<h2>Favorites</h2><ul>';
        favorites.forEach(fav => {
            favoritesHtml += `<li>${fav.name} (${fav.platform}) <button onclick="fetchPlayerStats('${fav.name}', '${fav.platform}')">View Stats</button> <button onclick="removeFromFavorites('${fav.name}', '${fav.platform}')">Remove</button></li>`;
        });
        favoritesHtml += '</ul>';
        statsContainer.innerHTML = favoritesHtml;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.search-container button').addEventListener('click', handleSearch);
    document.querySelector('.search-container input[type="text"]').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    const favoritesButton = document.createElement('button');
    favoritesButton.textContent = 'Show Favorites';
    favoritesButton.onclick = displayFavorites;
    document.querySelector('.search-container').appendChild(favoritesButton);
});