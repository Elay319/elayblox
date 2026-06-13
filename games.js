```js
const API = "https://elayblox-server.onrender.com";
const container = document.getElementById("games");

async function loadGames() {
  container.innerHTML = "Loading games...";

  try {
    const res = await fetch(API + "/games");
    const games = await res.json();

    if (games.length === 0) {
      container.innerHTML =
        "<p>No games yet. Be the first to create one!</p>";
      return;
    }

    container.innerHTML = "";

    const user =
      JSON.parse(
        localStorage.getItem("elaybloxUser") || "null"
      );

    const username =
      user
        ? encodeURIComponent(user.username)
        : "Guest";

    const avatar =
      user && user.avatar
        ? encodeURIComponent(user.avatar)
        : "";

    games.forEach(game => {

      const playLink =
        game.link +
        "?username=" +
        username +
        "&avatar=" +
        avatar;

      container.innerHTML += `
        <div class="game-card">
          <img src="${game.image}">

          <h3>${game.name}</h3>

          <p>${game.description}</p>

          <p>
            <b>Creator:</b>
            ${game.creator || "Unknown"}
          </p>

          <a
            class="play-btn"
            href="${playLink}"
            target="_blank"
          >
            Play
          </a>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);

    container.innerHTML =
      "<p>Could not load games. Server may be sleeping.</p>";
  }
}

loadGames();
```
