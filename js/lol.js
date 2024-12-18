const API_KEY = 'RGAPI-0741e357-0169-4426-8bef-0052103a7eaa';
const API_URL = 'https://na1.api.riotgames.com/lol';

async function fetchSummonerData(summonerName) {
    const url = `${API_URL}/summoner/v4/summoners/by-name/${summonerName}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Riot-Token': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        displaySummonerData(data);
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        displayError('Unable to fetch summoner data. Please try again.');
    }
}

async function fetchRankedStats(encryptedAccountId) {
    const url = `${API_URL}/league/v4/entries/by-account/${encryptedAccountId}`;

    try {
        const response = await fetch(url, {
            headers: {
                'X-Riot-Token': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
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
    resultsContainer.innerHTML = '';

    if (!data) {
        resultsContainer.innerHTML = '<p>No data found for the summoner.</p>';
        return;
    }

    const summonerHtml = `
        <h2>Summoner: ${data.name}</h2>
        <p>Summoner Level: ${data.summonerLevel}</p>
        <img src="http://ddragon.leagueoflegends.com/cdn/12.16.1/img/profileicon/${data.profileIconId}.png" alt="${data.name}'s Profile Icon">
    `;

    resultsContainer.innerHTML = summonerHtml;

    fetchRankedStats(data.id);
}

function displayRankedStats(data) {
    const resultsContainer = document.querySelector('.results-container');
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

function displayError(message) {
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}

document.getElementById('searchButton').addEventListener('click', function () {
    const summonerName = document.querySelector('.search-container input[type="text"]').value.trim();

    if (summonerName) {
        fetchSummonerData(summonerName);
    } else {
        alert('Please enter a summoner name.');
    }
});
