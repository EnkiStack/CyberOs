import { noficationsLog } from "../components/nofication.js";

export function initFolders() {
  const addFolderBtn = document.getElementById("addFolderBtn");
  const addLinkBtn = document.getElementById("addLinkBtn");
  const deleteFolderBtn = document.getElementById("deleteFolderBtn");

  const folderModal = document.getElementById("folderModal");
  const linkModal = document.getElementById("linkModal");
  const folderNameInput = document.getElementById("folderNameInput");
  const linkNameInput = document.getElementById("linkNameInput");
  const linkUrlInput = document.getElementById("linkUrlInput");

  let selectedFolder = null;

  // Загружаем сохранённые папки
  let folders = JSON.parse(localStorage.getItem("folders")) || [];
  let links = JSON.parse(localStorage.getItem("links")) || [];

  // Открытие/закрытие папок
  function setupFolderHandlers() {
    const folderHeaders = document.querySelectorAll(".folder-header");

    folderHeaders.forEach((header) => {
      header.removeEventListener("click", handleFolderClick);
      header.addEventListener("click", handleFolderClick);
    });
  }

  function handleFolderClick() {
    const folder = this.closest(".folder");

    folder.classList.toggle("open");

    const folderId = this.dataset.folder;
    const isOpen = folder.classList.contains("open");

    localStorage.setItem(`folder_${folderId}`, isOpen ? "open" : "closed");
  }


  // Отображение папки
  function renderFolder(name) {
    const folderId = name.toLowerCase().replace(/\s+/g, "_");

    const savedState = localStorage.getItem(`folder_${folderId}`);

    const isOpen = savedState === "open";

    const folderHTML = `
      <div class="folder ${isOpen ? "open" : ""}">
        <div class="folder-header" data-folder="${folderId}">
          <span class="folder-icon">📁</span>
          <span class="folder-name">${name}</span>
          <span class="folder-toggle">▼</span>
        </div>

        <div class="folder-content" id="${folderId}"></div>
      </div>
    `;

    const foldersContainer = document.querySelector(".folders-container");

    foldersContainer.insertAdjacentHTML("beforeend", folderHTML);
  }

  // Восстанавливаем сохранённые папки
  folders.forEach((name) => {
    renderFolder(name);
  });

  // Открываем окно создания папки
  addFolderBtn.addEventListener("click", () => {
    folderNameInput.value = "";
    folderModal.classList.add("show");
    folderNameInput.focus();
  });

  // Создание папки
  function createFolder() {
    const name = folderNameInput.value.trim();

    if (!name) {
      noficationsLog("Введите название папки :(");
      return;
    }

    if (folders.includes(name)) {
      noficationsLog("Папка уже существует :(");
      return;
    }

    const folderId = name.toLowerCase().replace(/\s+/g, "_");

    // Сначала сохраняем состояние
    localStorage.setItem(`folder_${folderId}`, "open");

    // Добавляем название в массив
    folders.push(name);

    // Сохраняем массив
    localStorage.setItem("folders", JSON.stringify(folders));

    // Показываем папку
    renderFolder(name);

    folderModal.classList.remove("show");

    setupFolderHandlers();
  }

  const folderConfirmBtn = document.getElementById("folderConfirmBtn");

  folderConfirmBtn.addEventListener("click", createFolder);

  folderNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      createFolder();
    }
  });

  document.getElementById("folderCancelBtn").addEventListener("click", () => {
    folderModal.classList.remove("show");
  });

  // --LINKS -- \\

  addLinkBtn.addEventListener("click", () => {
    const openFolder = document.querySelector(".folder.open");

    if (!openFolder) {
      noficationsLog("Откройте папку, в которую хотите добавить ссылку");
      return;
    }

    selectedFolder = openFolder;

    linkNameInput.value = "";
    linkUrlInput.value = "";

    linkModal.classList.add("show");

    linkNameInput.focus();
  });

  function renderLink(link) {
    const content = document.querySelector(`.folder-content#${link.folderId}`);

    const linkHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <a href="${link.url}" class="link" target="_blank">
          ${link.nameLink}
        </a>

        <span class="link-delete" data-link="${link.nameLink}">
          ✕
        </span>
      </div>
    `;

    content.insertAdjacentHTML("beforeend", linkHTML);
  }

  links.forEach((link) => {
    renderLink(link);
  });

  function createLink() {
    const nameLink = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (!nameLink || !url) {
      noficationsLog("Введите название и URL");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      noficationsLog("URL должен начинаться с http:// или https://");
      return;
    }

    const folderId =
      selectedFolder.querySelector(".folder-header").dataset.folder;

    const newLink = {
      nameLink: nameLink,
      url: url,
      folderId: folderId,
    };

    renderLink(newLink);

    links.push(newLink);

    localStorage.setItem("links", JSON.stringify(links));

    const content = selectedFolder.querySelector(".folder-content");
    const deleteBtn = content.querySelector('[data-link="' + nameLink + '"]');

    deleteBtn.addEventListener("click", () => {
      deleteBtn.parentElement.remove();
      links = links.filter((link) => link.nameLink !== nameLink);
      localStorage.setItem("links", JSON.stringify(links));
    });

    linkModal.classList.remove("show");
  }

  const linkConfirmBtn = document.getElementById("linkConfirmBtn");
  linkConfirmBtn.addEventListener("click", createLink);

  linkUrlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      createLink();
    }
  });

  document.getElementById("linkCancelBtn").addEventListener("click", () => {
    linkModal.classList.remove("show");
  });

  // Удаление папки
  deleteFolderBtn.addEventListener("click", () => {
    const openFolder = document.querySelector(".folder.open");

    if (!openFolder) {
      noficationsLog("Откройте папку, которую хотите удалить");
      return;
    }

    if (confirm("Вы уверены? Все ссылки в папке будут удалены.")) {
      const folderId =
        openFolder.querySelector(".folder-header").dataset.folder;

      const folderName = openFolder.querySelector(".folder-name").textContent;

      // Удаляем состояние папки
      localStorage.removeItem(`folder_${folderId}`);

      // Удаляем папку из массива
      folders = folders.filter((name) => name !== folderName);

      // Сохраняем новый массив
      localStorage.setItem("folders", JSON.stringify(folders));

      // Удаляем из HTML
      openFolder.remove();
    }
  });

  setupFolderHandlers();

  // Закрытие модального окна по клику на фон
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  });
}
