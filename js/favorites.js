import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    GithubUser.search("limarodrigo5").then((user) => console.log(user));
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gitfav:")) || [];
  }

  save() {
    localStorage.setItem("@gitfav:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

// classe que vai criar a visualização e eventos do html

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();

    this.onadd();
  }

  onadd() {
    const input = this.root.querySelector(".search input");
    const addButton = this.root.querySelector(".search button");

    addButton.onclick = () => {
      const { value } = input;
      this.add(value);
    };

    input.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        const { value } = input;
        this.add(value);
      }
    });
  }

  update() {
    this.removeAllTr();

    if (this.entries.length === 0) {
      // Se a tabela estiver vazia, mostre a célula .empty-table
      const emptyRow = this.createEmptyRow();
      this.tbody.append(emptyRow);
    } else {
      this.entries.forEach((user) => {
        const row = this.createRow();

        row.querySelector(
          ".user img"
        ).src = ` https://github.com/${user.login}.png `;
        row.querySelector(".user img").alt = `Imagem de ${user.name}`;
        row.querySelector(".user a").href = `https://github.com/${user.login}`;
        row.querySelector(".user p").textContent = user.name;
        row.querySelector(".user span").textContent = user.login;
        row.querySelector(".repositories").textContent = user.public_repos;
        row.querySelector(".followers").textContent = user.followers;

        row.querySelector(".remove").addEventListener("click", () => {
          const isOk = confirm("Tem certeza que deseja deletar essa linha?");
          if (isOk) {
            this.delete(user);
          }
        });

        document.addEventListener("keydown", (event) => {
          if (event.keyCode === 27) {
            const isOk = confirm("Tem certeza que deseja deletar essa linha?");
            if (isOk) {
              this.delete(user);
            }
          }
        });

        this.tbody.append(row);
      });
    }
  }
  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      
      <td class="user">
          <img src="https://github.com/limarodrigo5.png" alt="imagem de perfil do github">
          <a href="https://github.com/limarodrigo5" target="_blank">
              <p>Rodrigo Lima</p>
              <span>limarodrigo5</span>
          </a>
      </td>
      <td class="repositories">35</td>
      <td class="followers">2</td>
      <td><button class="remove">Remove</button></td>
  
      `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  createEmptyRow() {
    const tr = document.createElement("tr");
    tr.classList.add("empty-table");

    const td = document.createElement("td");
    td.setAttribute("colspan", "4");
    td.innerHTML = `
      <div>
        <img id="animated-star" src="./assets/animatedstar.svg" alt="Estrela animada">
        <p>Nenhum favorito ainda</p>
      </div>
    `;

    tr.appendChild(td);
    return tr;
  }
}
