const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = 'RGAPI-0741e357-0169-4426-8bef-0052103a7eaaRE';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/summoner/:summonerName', async (req, res) => {
    const summonerName = encodeURIComponent(req.params.summonerName);
    const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'X-Riot-Token': API_KEY,
            }
        });

        if (!response.ok) {
            const errorData = await response.text(); 
            throw new Error(`Riot API Error: ${response.status} - ${errorData}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in API:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/ranked/:encryptedAccountId', async (req, res) => {
    const encryptedAccountId = encodeURIComponent(req.params.encryptedAccountId);
    const url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-account/${encryptedAccountId}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'X-Riot-Token': API_KEY,
            }
        });

        if (!response.ok) {
            const errorData = await response.text(); 
            throw new Error(`Riot API Error: ${response.status} - ${errorData}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in API:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});