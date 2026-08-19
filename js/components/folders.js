export function initFolders() {
  const addFolderBtn = document.getElementById('addFolderBtn');
  const addLinkBtn = document.getElementById('addLinkBtn');
  const deleteFolderBtn = document.getElementById('deleteFolderBtn');
  
  const folderModal = document.getElementById('folderModal');
  const linkModal = document.getElementById('linkModal');
  const folderNameInput = document.getElementById('folderNameInput');
  const folderIconInput = document.getElementById('folderIconInput');
  const linkNameInput = document.getElementById('linkNameInput');
  const linkUrlInput = document.getElementById('linkUrlInput');
  
  let selectedFolder = null;

  // Открытие/закрытие папок
  function setupFolderHandlers() {
    const folderHeaders = document.querySelectorAll('.folder-header');
    
    folderHeaders.forEach(header => {
      header.removeEventListener('click', handleFolderClick);
      header.addEventListener('click', handleFolderClick);
    });
  }

  function handleFolderClick(e) {
    const folder = this.closest('.folder');
    folder.classList.toggle('open');
    
    const folderId = this.dataset.folder;
    const isOpen = folder.classList.contains('open');
    localStorage.setItem(`folder_${folderId}`, isOpen ? 'open' : 'closed');
  }

  // Создание новой папки
  addFolderBtn.addEventListener('click', () => {
    folderNameInput.value = '';
    folderIconInput.value = '📁';
    folderModal.classList.add('show');
    folderNameInput.focus();
  });

  document.getElementById('folderConfirmBtn').addEventListener('click', () => {
    const name = folderNameInput.value.trim();
    const icon = folderIconInput.value.trim();
    
    if (!name) {
      alert('Введите название папки');
      return;
    }

    const folderId = name.toLowerCase().replace(/\s+/g, '_');
    
    // compute next delay index based on existing .delay-* classes
    const existingDelays = document.querySelectorAll('[class*="delay-"]');
    const nextDelayIndex = existingDelays.length + 1;

    const folderHTML = `
      <div class="folder open animate-fade-in-left delay-${nextDelayIndex}">
        <div class="folder-header" data-folder="${folderId}">
          <span class="folder-icon">${icon}</span>
          <span class="folder-name">${name}</span>
          <span class="folder-toggle">▼</span>
        </div>
        <div class="folder-content" id="${folderId}">
        </div>
      </div>
    `;

    const folderControls = document.querySelector('.folder-controls');
    folderControls.insertAdjacentHTML('beforebegin', folderHTML);
    
    localStorage.setItem(`folder_${folderId}`, 'open');
    
    folderModal.classList.remove('show');
    setupFolderHandlers();
  });

  document.getElementById('folderCancelBtn').addEventListener('click', () => {
    folderModal.classList.remove('show');
  });

  // Добавление ссылки
  addLinkBtn.addEventListener('click', () => {
    const openFolder = document.querySelector('.folder.open');
    if (!openFolder) {
      alert('Откройте папку, в которую хотите добавить ссылку');
      return;
    }

    selectedFolder = openFolder;
    linkNameInput.value = '';
    linkUrlInput.value = '';
    linkModal.classList.add('show');
    linkNameInput.focus();
  });

  document.getElementById('linkConfirmBtn').addEventListener('click', () => {
    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (!name || !url) {
      alert('Введите название и URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alert('URL должен начинаться с http:// или https://');
      return;
    }

    const content = selectedFolder.querySelector('.folder-content');
    const linkHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <a href="${url}" class="link" target="_blank">${name}</a>
        <span class="link-delete" data-link="${name}">✕</span>
      </div>
    `;


    // compute delay for new link: count existing links inside folder
    const existingLinks = content.querySelectorAll('.link');
    const linkDelayIndex = existingLinks.length + 1;

    const linkHTMLWithDelay = linkHTML.replace('class="link"', `class="link animate-fade-in-left delay-${linkDelayIndex}"`);
    content.insertAdjacentHTML('beforeend', linkHTMLWithDelay);

    const deleteBtn = content.querySelector('[data-link="' + name + '"]');
    deleteBtn.addEventListener('click', () => {
      deleteBtn.parentElement.remove();
    });

    linkModal.classList.remove('show');
  });

  document.getElementById('linkCancelBtn').addEventListener('click', () => {
    linkModal.classList.remove('show');
  });

  // Удаление папки
  deleteFolderBtn.addEventListener('click', () => {
    const openFolder = document.querySelector('.folder.open');
    if (!openFolder) {
      alert('Откройте папку, которую хотите удалить');
      return;
    }

    if (confirm('Вы уверены? Все ссылки в папке будут удалены.')) {
      const folderId = openFolder.querySelector('.folder-header').dataset.folder;
      localStorage.removeItem(`folder_${folderId}`);
      openFolder.remove();
    }
  });

  // Восстанавливаем состояние папок из localStorage
  const folders = document.querySelectorAll('.folder');
  folders.forEach(folder => {
    const header = folder.querySelector('.folder-header');
    const folderId = header.dataset.folder;
    const savedState = localStorage.getItem(`folder_${folderId}`);

    if (savedState === 'open') {
      folder.classList.add('open');
    }
  });

  // По умолчанию открываем первую папку
  const firstFolder = document.querySelector('.folder');
  if (firstFolder && !firstFolder.classList.contains('open')) {
    firstFolder.classList.add('open');
  }

  // Инициализируем обработчики
  setupFolderHandlers();

  // Закрытие модального окна при нажатии на фон
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });
}
