const games = [
{
    name: "My First Game",
    description: "Welcome to ElayBlox!",
    image: "https://picsum.photos/300/180",
    link: "https://example.com"
}
];

const container = document.getElementById("games");

games.forEach(game => {
    container.innerHTML += `
    <div class="game">
        <img src="${game.image}">
        <h2>${game.name}</h2>
        <p>${game.description}</p>
        <a class="play-btn" href="${game.link}">
            Play
        </a>
    </div>
    `;
});
