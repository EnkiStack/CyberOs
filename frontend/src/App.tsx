import "./App.css";

import { useEffect, useState } from "react";

import BootScreen from "./components/BootScreen";
import { Clock } from "./components/Clock";
import { Folders, type FolderItem } from "./components/Folders";
import { Music } from "./components/Music";
import { Search } from "./components/Search";

const STORAGE_KEY = "cyberstart-folders-v1";

const initialFolders: FolderItem[] = [
  {
    id: "projects",
    name: "Projects",
    kind: "folder",
    children: [
      { id: "github", name: "GitHub", kind: "link", url: "https://github.com" },
      {
        id: "work-tools",
        name: "Work tools",
        kind: "folder",
        children: [
          { id: "figma", name: "Figma", kind: "link", url: "https://www.figma.com" },
          { id: "notion", name: "Notion", kind: "link", url: "https://www.notion.so" },
        ],
      },
    ],
  },
  {
    id: "archive",
    name: "Archive",
    kind: "folder",
    children: [
      { id: "docs", name: "Docs", kind: "link", url: "https://developer.mozilla.org" },
      { id: "news", name: "News", kind: "link", url: "https://news.ycombinator.com" },
    ],
  },
  {
    id: "downloads",
    name: "Downloads",
    kind: "folder",
    children: [
      { id: "media", name: "Media", kind: "link", url: "https://www.youtube.com" },
      { id: "music", name: "Music", kind: "link", url: "https://open.spotify.com" },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    kind: "folder",
    children: [
      { id: "chatgpt", name: "ChatGPT", kind: "link", url: "https://chat.openai.com" },
      { id: "google", name: "Google", kind: "link", url: "https://www.google.com" },
    ],
  },
];

const wallpaperLevels = [0.45, 0.6, 0.75, 0.9];

function App() {
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    if (typeof window === "undefined") {
      return initialFolders;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return initialFolders;
    }

    try {
      const parsed = JSON.parse(saved) as FolderItem[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialFolders;
    } catch {
      return initialFolders;
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPathIds, setCurrentPathIds] = useState<string[]>([]);
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [activeModal, setActiveModal] = useState<"folder" | "link" | "delete" | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<FolderItem | null>(null);
  const [folderName, setFolderName] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const closeModal = () => {
    setActiveModal(null);
    setFolderName("");
    setLinkName("");
    setLinkUrl("");
  };

  const getCurrentFolderContents = (): FolderItem[] => {
    let current = folders;
    
    for (const id of currentPathIds) {
      const folder = current.find(item => item.id === id && item.kind === 'folder');
      if (folder && folder.children) {
        current = folder.children;
      } else {
        return folders;
      }
    }
    
    return current;
  };

  const addItemToCurrentFolder = (newItem: FolderItem) => {
    if (currentPathIds.length === 0) {
      setFolders((current) => [...current, newItem]);
      return;
    }

    setFolders((current) => {
      const updateNested = (items: FolderItem[], pathIds: string[]): FolderItem[] => {
        if (pathIds.length === 0) {
          return [...items, newItem];
        }

        return items.map((item) => {
          if (item.id === pathIds[0] && item.kind === 'folder') {
            return {
              ...item,
              children: updateNested(item.children || [], pathIds.slice(1)),
            };
          }
          return item;
        });
      };

      return updateNested(current, currentPathIds);
    });
  };

  const handleCreateItem = () => {
    if (activeModal === "folder") {
      const name = folderName.trim();
      if (!name) {
        return;
      }

      addItemToCurrentFolder({
        id: crypto.randomUUID(),
        name,
        kind: "folder",
        children: [],
      });
      closeModal();
      return;
    }

    if (activeModal === "link") {
      const name = linkName.trim();
      const url = linkUrl.trim();
      if (!name || !url) {
        return;
      }

      addItemToCurrentFolder({
        id: crypto.randomUUID(),
        name,
        kind: "link",
        url,
      });
      closeModal();
    }
  };

  const findFolderPath = (items: FolderItem[], targetId: string, current: string[] = []): string[] => {
    for (const item of items) {
      const nextPath = [...current, item.id];

      if (item.id === targetId) {
        return nextPath;
      }

      if (item.kind === "folder" && item.children) {
        const found = findFolderPath(item.children, targetId, nextPath);
        if (found.length > 0) {
          return found;
        }
      }
    }

    return [];
  };

  const handleDeleteRequest = (item: FolderItem) => {
    setItemToDelete(item);
    setActiveModal("delete");
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) {
      return;
    }

    setFolders((current) => {
      const removeNested = (items: FolderItem[], targetId: string): FolderItem[] =>
        items
          .filter((item) => item.id !== targetId)
          .map((item) => {
            if (item.kind === "folder" && item.children) {
              return {
                ...item,
                children: removeNested(item.children, targetId),
              };
            }

            return item;
          });

      return removeNested(current, itemToDelete.id);
    });

    setActiveModal(null);
    setItemToDelete(null);
    setDeleteMode(false);
    setSelectedId(null);
    setExpandedFolderIds((current) => current.filter((id) => id !== itemToDelete.id));
  };

  const handleSelectItem = (item: FolderItem) => {
    if (deleteMode) {
      if (item.kind === "folder") {
        handleDeleteRequest(item);
      }
      return;
    }

    if (item.kind === "folder") {
      const nextPath = findFolderPath(folders, item.id);
      setCurrentPathIds(nextPath);
      setSelectedId(item.id);
      setExpandedFolderIds((current) => {
        if (current.includes(item.id)) {
          return current.filter((id) => id !== item.id);
        }

        return [...current, item.id];
      });
      return;
    }

    if (item.kind === "link" && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
  };

  const handleNavigateFolder = (folderId: string) => {
    const nextPath = findFolderPath(folders, folderId);
    setCurrentPathIds(nextPath);
    setSelectedId(folderId);
    setExpandedFolderIds((current) => {
      if (current.includes(folderId)) {
        return current;
      }

      return [...current, folderId];
    });
  };

  const cycleWallpaper = () => {
    setWallpaperIndex((current) => (current + 1) % wallpaperLevels.length);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setActiveModal(null);
  };

  return (
    <>
      <BootScreen />
      <div
        className="background"
        aria-hidden="true"
        style={{ filter: `brightness(${wallpaperLevels[wallpaperIndex]})` }}
      />

      <main>
        <aside className="my-links">
          <div className="folders-container">
            <Folders
              items={folders}
              selectedId={selectedId}
              deleteMode={deleteMode}
              currentPathIds={currentPathIds}
              expandedFolderIds={expandedFolderIds}
              onSelect={handleSelectItem}
              onNavigate={handleNavigateFolder}
              onDeleteRequest={handleDeleteRequest}
            />
          </div>

          <div className="folder-controls">
            <button
              type="button"
              className="control-btn"
              onClick={() => setActiveModal("folder")}
            >
              + Новая папка
            </button>
            <button
              type="button"
              className="control-btn"
              onClick={() => setActiveModal("link")}
            >
              + Добавить ссылку
            </button>
            <button
              type="button"
              className="control-btn delete-btn"
              onClick={() => setDeleteMode((current) => !current)}
            >
              🗑️ {deleteMode ? "Готово" : "Удалить"}
            </button>
          </div>
        </aside>

        <div className="dashboard">
          <section className="hero">
            <Clock />
            <p className="subtitle">Wake up, Mustafo.</p>
          </section>

          <Search />

          <div className="box-buttom">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className="button-change-wallpaper"
                onClick={cycleWallpaper}
              >
                Обои
              </button>
            ))}
          </div>
        </div>

        <aside className="right-panel">
          <Music
            isPlaying={isMusicPlaying}
            onToggle={() => setIsMusicPlaying((value) => !value)}
          />
        </aside>
      </main>

      <div
        className={`modal ${activeModal ? "is-open" : ""}`}
        aria-hidden={!activeModal}
      >
        {activeModal === "delete" && itemToDelete ? (
          <div className="modal-content">
            <div className="modal-title">Удалить элемент?</div>
            <p className="modal-text">
              Вы уверены, что хотите удалить <strong>{itemToDelete.name}</strong>?
            </p>
            <div className="modal-buttons">
              <button
                type="button"
                className="modal-btn modal-btn-confirm danger"
                onClick={confirmDeleteItem}
              >
                Удалить
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={closeDeleteModal}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-content">
            <div className="modal-title">
              {activeModal === "folder"
                ? "Создать новую папку"
                : "Добавить новую ссылку"}
            </div>

            {activeModal === "link" ? (
              <>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Название ссылки..."
                  value={linkName}
                  onChange={(event) => setLinkName(event.target.value)}
                />
                <input
                  type="text"
                  className="modal-input"
                  placeholder="URL..."
                  value={linkUrl}
                  onChange={(event) => setLinkUrl(event.target.value)}
                />
              </>
            ) : (
              <input
                type="text"
                className="modal-input"
                placeholder="Название папки..."
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
              />
            )}

            <div className="modal-buttons">
              <button
                type="button"
                className="modal-btn modal-btn-confirm"
                onClick={handleCreateItem}
              >
                {activeModal === "folder" ? "Создать" : "Добавить"}
              </button>
              <button
                type="button"
                className="modal-btn modal-btn-cancel"
                onClick={closeModal}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
