import { loadComponent } from './utils.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('#header-placeholder', '/public/partials/header.html');
    await loadComponent('#footer-placeholder', '/public/partials/footer.html');

    setupHomePage();
});

function setupHomePage() {
    const games = [
        {
            id: 'apex-legends',
            name: 'Apex Legends',
            description: 'Track player stats!',
        },
        {
            id: 'lol',
            name: 'League of Legends',
            description: 'Review summoner stats, and more!',
        },
    ];

    const gameCardsContainer = document.querySelector('#game-cards');
    if (gameCardsContainer) {
        games.forEach(game => {
            const card = document.createElement('div');
            card.classList.add('game-card');
            card.id = game.id;

            const button = document.createElement('button');
            button.textContent = 'View Stats';
            button.onclick = () => viewGame(game.id);

            card.innerHTML = `
                <h2>${game.name}</h2>
                <p>${game.description}</p>
            `;
            card.appendChild(button);
            gameCardsContainer.appendChild(card);
        });
    }
}

function viewGame(gameId) {
    const gamePages = {
        'apex-legends': 'apex-legends.html',
        'lol': 'lol.html',
    };

    if (gamePages[gameId]) {
        window.location.href = gamePages[gameId];
    }
}