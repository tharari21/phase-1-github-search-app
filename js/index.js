const baseUrl = "https://api.github.com";
const form = document.querySelector("#github-form");
const userList = document.querySelector("#user-list");
const repoList = document.querySelector("#repos-list");
const getResource = async (endpoint) => {
  const req = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
  });
  const res = await req.json();
  return res;
};
const postResource = async (body) => {
  const req = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify(body),
  });
  const res = await req.json();
  return res;
};
const updateResource = async (id, body) => {
  const req = await fetch(baseUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify(body),
  });
  const res = await req.json();
  return res;
};

const getUsers = async (query) => {
  const results = await getResource(`/search/users?q=${encodeURI(query)}`);
  console.log(results);
  return results.items;
};
const getUserRepositories = async (username) => {
  const repositories = await getResource(`/users/${encodeURI(username)}/repos`);
  return repositories;
};
const getRepositories = async (query) => {
  const repositories = await getResource(
    `/search/repositories?q=${encodeURI(query)}`
  );
  return repositories.items;
};
const renderUsers = (users) => {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    const login = document.createElement("h5");
    const img = document.createElement("img");
    login.textContent = user.login;
    img.src = user.avatar_url;
    li.append(login, img);

    const clickHandler = async () => {
      const repositories = await getUserRepositories(user.login);
      renderRepositories(repositories);
    };
    li.addEventListener("click", clickHandler);
    userList.append(li);
  });
};
const renderRepositories = (repositories) => {
  repoList.innerHTML = "";
  repositories.forEach((repository) => {
    const p = document.createElement("p");
    p.textContent = repository.name;
    repoList.append(p);
  });
};

const submitHandler = async (e) => {
  e.preventDefault();
  const dropdown = e.target["search-by"];
  const searchBy = dropdown.options[dropdown.selectedIndex].value;
  if (searchBy === "users") {
    const users = await getUsers(e.target.search.value);
    renderUsers(users);
  } else {
    const repositories = await getRepositories(e.target.search.value);
    renderRepositories(repositories);
  }
};
form.addEventListener("submit", submitHandler);
