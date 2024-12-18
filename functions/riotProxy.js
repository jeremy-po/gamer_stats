const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const API_KEY = process.env.RIOT_API_KEY;
    const { summonerName } = JSON.parse(event.body);

    if (!summonerName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Summoner name is required' }),
        };
    }

    try {
        const response = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`, {
            headers: {
                'X-Riot-Token': API_KEY,
            },
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Riot API error: ${response.statusText}` }),
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};