async function fetchPlayerStats(playerName, platform) {
    const API_URL = `https://api.mozambiquehe.re/bridge?auth=95637a7af45f24a6026d3291407b0957&player=${playerName}&platform=${platform}`;
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.errors) {
            console.error('Error fetching data:', data.errors);
            return;
        }
        
        displayPlayerStats(data);
    } catch (error) {
        console.error('Error fetching data:', error);
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

    `;
    
    statsContainer.innerHTML = playerStats;
}



function handleSearch() {
    const playerName = document.querySelector('.search-container input[type="text"]').value;
    const platform = document.querySelector('select[name="platform"]').value;
    
    if (playerName && platform) {
        fetchPlayerStats(playerName, platform);
    } else {
        alert('Please enter a player name and platform.');
    }
}

document.querySelector('.search-container button').addEventListener('click', handleSearch);

document.querySelector('.search-container input[type="text"]').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});