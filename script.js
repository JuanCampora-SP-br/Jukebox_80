document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('botao-Busca');
    const searchInput = document.getElementById('searchInput');
    const cardContainer = document.querySelector('.card-container');
    const mensagemErro = document.getElementById('mensagem-erro');
    let musicData = [];

    // Carrega os dados do JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            musicData = data;
        })
        .catch(error => console.error('Erro ao carregar dados:', error));

    function searchMusic() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        cardContainer.innerHTML = ''; // Limpa os resultados anteriores
        mensagemErro.textContent = ''; // Limpa a mensagem de erro anterior

        if (!searchTerm) {
            return; // Não faz nada se a busca for vazia
        }

        const filteredMusic = musicData.filter(music => {
            // Permite buscar por gênero, título ou artista
            const title = music.mTitle.toLowerCase();
            const artist = music.mArtist.toLowerCase();
            const genre = music.mGenre.toLowerCase();            
            return genre.includes(searchTerm) || title.includes(searchTerm) || artist.includes(searchTerm);
        });

        if (filteredMusic.length === 0) {
            mensagemErro.textContent = 'Tente novamente...';
        } else {
            filteredMusic.forEach(music => {
                // Cria um link de busca para o YouTube com o nome do artista e da música
                const youtubeSearchQuery = encodeURIComponent(`${music.mArtist} ${music.mTitle}`);
                const youtubeSearchLink = `https://www.youtube.com/results?search_query=${youtubeSearchQuery}`;

                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                    <div class="music-info">
                        <h2>${music.mTitle}</h2>
                        <p><strong>Artista:</strong> ${music.mArtist}</p>
                        <p><strong>Gênero:</strong> ${music.mGenre}</p>
                        <p><strong>Ano:</strong> ${music.mReleaseDate}</p>
                    </div>
                    <div class="player-container">
                        <div class="video-preview">
                            <img src="https://img.youtube.com/vi/${music.mVideoId}/mqdefault.jpg" alt="Thumbnail do vídeo ${music.mTitle}" class="video-thumbnail">
                        </div>
                        <a href="${youtubeSearchLink}" target="_blank" class="play-link" title="Buscar no YouTube">
                            <button class="play-button">▶</button>
                        </a>
                    </div>
                `;
                cardContainer.appendChild(card);
            });
        }
    }

    searchButton.addEventListener('click', searchMusic);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchMusic();
        }
    });
});