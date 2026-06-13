const API = "https://elayblox-server.onrender.com";
const container = document.getElementById("games");

async function loadGames() {
  try {
    container.innerHTML = "Loading games...";

    const res = await fetch(API + "/games");
    const games = await res.json();

    const user = JSON.parse(localStorage.getItem("elaybloxUser") || "null");
    const username = user ? encodeURIComponent(user.username) : "Guest";
    const avatar = user && user.avatar ? encodeURIComponent(user.avatar) : "";

    if (!games || games.length === 0) {
      container.innerHTML = "<p>No games yet.</p>";
      return;
    }

    container.innerHTML = "";

    games.forEach(game => {
      const playLink = `${game.link}?username=${username}&avatar=${avatar}`;

      container.innerHTML += `
        <div class="game-card">
          <img src="${game.image}">
          <h3>${game.name}</h3>
          <p>${game.description}</p>
          <p><b>Creator:</b> ${game.creator || "Unknown"}</p>
          <a class="play-btn" href="${playLink}" target="_blank">Play</a>
        </div>
      `;
    });
  } catch (err) {
    container.innerHTML = "<p>Error loading games.</p>";
    console.error(err);
  }
}

loadGames();
