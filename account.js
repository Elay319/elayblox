const user = JSON.parse(localStorage.getItem("elaybloxUser"));
const accountBar = document.getElementById("accountBar");

if (accountBar) {
  if (user) {
    accountBar.innerHTML = `
      <span>Logged in as <b>${user.username}</b></span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    accountBar.innerHTML = `<a href="login.html">Login</a>`;
  }
}

function logout() {
  localStorage.removeItem("elaybloxUser");
  location.href = "login.html";
}
