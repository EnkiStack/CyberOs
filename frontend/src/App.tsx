import "./App.css";

import { type ChangeEvent, useEffect, useRef, useState } from "react";

import BootScreen from "./components/BootScreen";
import { Clock } from "./components/Clock";
import { Folders, type FolderItem } from "./components/Folders";
import { Music } from "./components/Music";
import { Notification, type NotificationItem } from "./components/Notification";
import { Search } from "./components/Search";
import Footer from "./components/Footer";

const STORAGE_KEY = "cyberstart-folders-v1";
const SETTINGS_STORAGE_KEY = "cyberstart-settings-v1";
const MUSIC_STORAGE_KEY = "cyberstart-custom-music-v1";
const DEFAULT_USER_NAME = "Mustafo";

type ExportedBackup = {
  version: number;
  exportedAt: string;
  folders: FolderItem[];
  wallpaperIndex: number;
  customWallpaper: string | null;
  fontSize: number;
  userName: string;
  music: Array<{ title: string; src: string }>;
};

const readSavedMusic = (): Array<{ title: string; src: string }> => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(MUSIC_STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved) as Array<{ title: string; src: string }>;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

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

const wallpaperOptions = [
  {
    name: "Night pulse",
    background:
      "linear-gradient(135deg, rgba(16, 18, 30, 0.6), rgba(56, 28, 74, 0.38)), url('/legacy_site/assets/images/bg.jpg')",
  },
  {
    name: "Neon violet",
    background:
      "linear-gradient(135deg, rgba(28, 16, 46, 0.62), rgba(14, 58, 96, 0.38)), url('/legacy_site/assets/images/bg.jpg')",
  },
  {
    name: "Blue cyber",
    background:
      "linear-gradient(135deg, rgba(8, 20, 34, 0.66), rgba(23, 82, 114, 0.42)), url('/legacy_site/assets/images/bg.jpg')",
  },
  {
    name: "Dark synth",
    background:
      "linear-gradient(135deg, rgba(11, 15, 23, 0.72), rgba(61, 39, 76, 0.5)), url('/legacy_site/assets/images/bg.jpg')",
  },
];

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
  const [activeModal, setActiveModal] = useState<"folder" | "link" | "delete" | "settings" | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<FolderItem | null>(null);
  const [folderName, setFolderName] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTargetFolderId, setLinkTargetFolderId] = useState<string>("root");
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window === "undefined") {
      return 16;
    }

    try {
      const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!saved) {
        return 16;
      }

      const parsed = JSON.parse(saved) as { fontSize?: number };
      const value = Number(parsed.fontSize);
      return Number.isFinite(value) ? Math.min(24, Math.max(12, value)) : 16;
    } catch {
      return 16;
    }
  });
  const [userName, setUserName] = useState<string>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_USER_NAME;
    }

    try {
      const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!saved) {
        return DEFAULT_USER_NAME;
      }

      const parsed = JSON.parse(saved) as { userName?: string };
      const value = parsed.userName?.trim();
      return value ? value : DEFAULT_USER_NAME;
    } catch {
      return DEFAULT_USER_NAME;
    }
  });
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window.localStorage.getItem("cyberstart-custom-wallpaper-v1");
    } catch {
      return null;
    }
  });
  const [isWallpaperPickerOpen, setIsWallpaperPickerOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settingsJson, setSettingsJson] = useState("");
  const wallpaperInputRef = useRef<HTMLInputElement | null>(null);
  const settingsFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (customWallpaper) {
      window.localStorage.setItem("cyberstart-custom-wallpaper-v1", customWallpaper);
      return;
    }

    window.localStorage.removeItem("cyberstart-custom-wallpaper-v1");
  }, [customWallpaper]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        fontSize,
        userName,
      }),
    );
  }, [fontSize, userName]);

  useEffect(() => {
    const payload: ExportedBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      folders,
      wallpaperIndex,
      customWallpaper,
      fontSize,
      userName,
      music: readSavedMusic(),
    };

    setSettingsJson(JSON.stringify(payload, null, 2));
  }, [folders, wallpaperIndex, customWallpaper, fontSize, userName]);

  const showNotification = (message: string, tone: NotificationItem["tone"] = "info") => {
    const id = crypto.randomUUID();

    setNotifications((current) => [...current, { id, message, tone }]);

    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 2600);
  };

  const closeModal = () => {
    setActiveModal(null);
    setFolderName("");
    setLinkName("");
    setLinkUrl("");
    setLinkTargetFolderId(currentPathIds[currentPathIds.length - 1] ?? "root");
  };

  const getFolderOptions = (items: FolderItem[], prefix = ""): Array<{ id: string; label: string }> => {
    return items.flatMap((item) => {
      if (item.kind !== "folder") {
        return [];
      }

      const currentLabel = prefix ? `${prefix} / ${item.name}` : item.name;
      const nested = item.children ? getFolderOptions(item.children, currentLabel) : [];

      return [{ id: item.id, label: currentLabel }, ...nested];
    });
  };

  const addItemToFolder = (newItem: FolderItem, targetFolderId: string | null) => {
    if (!targetFolderId || targetFolderId === "root") {
      setFolders((current) => [...current, newItem]);
      return;
    }

    setFolders((current) => {
      const insertNested = (items: FolderItem[]): FolderItem[] =>
        items.map((item) => {
          if (item.id === targetFolderId && item.kind === "folder") {
            return {
              ...item,
              children: [...(item.children ?? []), newItem],
            };
          }

          if (item.kind === "folder" && item.children) {
            return {
              ...item,
              children: insertNested(item.children),
            };
          }

          return item;
        });

      return insertNested(current);
    });
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
      if (currentPathIds.length > 0) {
        closeModal();
        showNotification("Папки можно создавать только в корне", "warning");
        return;
      }

      const name = folderName.trim();
      if (!name) {
        showNotification("Введите название папки", "warning");
        return;
      }

      addItemToCurrentFolder({
        id: crypto.randomUUID(),
        name,
        kind: "folder",
        children: [],
      });
      closeModal();
      showNotification("Папка создана", "success");
      return;
    }

    if (activeModal === "link") {
      const name = linkName.trim();
      const url = linkUrl.trim();
      if (!name || !url) {
        showNotification("Заполните название и ссылку", "warning");
        return;
      }

      addItemToFolder(
        {
          id: crypto.randomUUID(),
          name,
          kind: "link",
          url,
        },
        linkTargetFolderId === "root" ? null : linkTargetFolderId,
      );
      closeModal();
      showNotification("Ссылка добавлена", "success");
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

  const handleCustomWallpaperUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        return;
      }

      setCustomWallpaper(result);
      setIsWallpaperPickerOpen(false);
      showNotification("Кастомные обои установлены", "success");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleExportSettings = () => {
    const blob = new Blob([settingsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cyberstart-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    showNotification("JSON сохранён в файл", "success");
  };

  const handleCopySettings = async () => {
    try {
      await navigator.clipboard.writeText(settingsJson);
      showNotification("JSON скопирован в буфер обмена", "success");
    } catch {
      showNotification("Не удалось скопировать JSON", "error");
    }
  };

  const handleImportSettings = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result ?? "{}")) as Partial<ExportedBackup>;

        if (Array.isArray(parsed.folders)) {
          setFolders(parsed.folders);
        }

        if (typeof parsed.wallpaperIndex === "number") {
          setWallpaperIndex(parsed.wallpaperIndex);
        }

        if (typeof parsed.customWallpaper === "string" || parsed.customWallpaper === null) {
          setCustomWallpaper(parsed.customWallpaper);
        }

        if (typeof parsed.fontSize === "number") {
          setFontSize(Math.min(24, Math.max(12, parsed.fontSize)));
        }

        if (typeof parsed.userName === "string") {
          const cleaned = parsed.userName.trim();
          setUserName(cleaned || DEFAULT_USER_NAME);
        }

        if (Array.isArray(parsed.music)) {
          window.localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(parsed.music));
        }

        setActiveModal(null);
        showNotification("Настройки успешно импортированы", "success");
      } catch {
        showNotification("Невалидный JSON-файл", "error");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleSetAsHomepage = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const maybeWindow = window as Window & {
      chrome?: { runtime?: { id?: string } };
      browser?: { newtab?: { url?: string } };
      external?: { AddFavorite?: (url: string, title: string) => void };
    };

    if (userAgent.includes("firefox")) {
      window.open("about:preferences#home", "_blank");
      return;
    }

    if (userAgent.includes("chrome") || userAgent.includes("chromium") || userAgent.includes("edge")) {
      const chromeUrl = userAgent.includes("edge") ? "edge://settings/startup" : "chrome://settings/startup";
      window.open(chromeUrl, "_blank");
      return;
    }

    if (maybeWindow.external?.AddFavorite) {
      maybeWindow.external.AddFavorite(window.location.href, "CyberStart");
      return;
    }

    showNotification(
      "Браузер не позволяет сайту менять домашнюю страницу автоматически. Откройте настройки браузера вручную.",
      "info",
    );
  };

  const selectedWallpaper = wallpaperOptions[wallpaperIndex];
  const activeBackground = customWallpaper
    ? `linear-gradient(135deg, rgba(10, 12, 22, 0.45), rgba(34, 20, 45, 0.32)), url("${customWallpaper}")`
    : selectedWallpaper.background;

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
        style={{
          backgroundImage: activeBackground,
          filter: `blur(0.8px) brightness(${wallpaperLevels[wallpaperIndex]}) saturate(1.1)`,
        }}
      />

      <Notification items={notifications} />

      <main style={{ fontSize: `${fontSize}px` }}>
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
              disabled={currentPathIds.length > 0}
              title={currentPathIds.length > 0 ? "Папки создаются только в корне" : "Создать новую папку"}
              onClick={() => {
                if (currentPathIds.length === 0) {
                  setActiveModal("folder");
                }
              }}
            >
              + Новая папка
            </button>
            <button
              type="button"
              className="control-btn"
              onClick={() => {
                setLinkTargetFolderId(currentPathIds[currentPathIds.length - 1] ?? "root");
                setActiveModal("link");
              }}
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
            <p className="subtitle">Wake up, {userName}.</p>
          </section>

          <Search />

          <div className="box-buttom">
            <div className="wallpaper-picker-wrap">
              <button
                type="button"
                className="button-change-wallpaper"
                onClick={() => setIsWallpaperPickerOpen((current) => !current)}
              >
                Обои
              </button>

              {isWallpaperPickerOpen && (
                <div className="wallpaper-picker" aria-label="Выбор обоев">
                  <button
                    type="button"
                    className="wallpaper-upload-btn"
                    onClick={() => wallpaperInputRef.current?.click()}
                  >
                    Загрузить фото
                  </button>

                  <input
                    ref={wallpaperInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCustomWallpaperUpload}
                  />

                  {wallpaperOptions.map((wallpaper, index) => (
                    <button
                      key={wallpaper.name}
                      type="button"
                      className={`wallpaper-swatch ${index === wallpaperIndex && !customWallpaper ? "is-active" : ""}`}
                      style={{ backgroundImage: wallpaper.background }}
                      title={wallpaper.name}
                      onClick={() => {
                        setCustomWallpaper(null);
                        setWallpaperIndex(index);
                        setIsWallpaperPickerOpen(false);
                      }}
                    >
                      <span>{wallpaper.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="button-change-wallpaper settings"
              onClick={() => setActiveModal("settings")}
            >
              Настройки
            </button>

            <button
              type="button"
              className="button-change-wallpaper how-to-use"
            >
              Как использовать
            </button>

          </div>

          <footer>
            <Footer />
          </footer>
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
        ) : activeModal === "settings" ? (
          <div className="modal-content settings-modal-content">
            <div className="modal-title">Настройки</div>

            <label className="settings-field">
              <span>Имя для приветствия</span>
              <input
                type="text"
                className="modal-input settings-input"
                value={userName}
                onChange={(event) => setUserName(event.target.value || DEFAULT_USER_NAME)}
                placeholder={DEFAULT_USER_NAME}
              />
            </label>

            <label className="settings-field">
              <span>Размер шрифта</span>
              <input
                type="number"
                className="modal-input settings-input"
                min={12}
                max={24}
                step={1}
                value={fontSize}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  if (Number.isFinite(nextValue)) {
                    setFontSize(Math.min(24, Math.max(12, nextValue)));
                  }
                }}
              />
            </label>

            <label className="settings-field">
              <span>JSON-профиль</span>
              <textarea className="settings-json" value={settingsJson} readOnly />
            </label>

            <div className="settings-actions">
              <button type="button" className="modal-btn" onClick={handleCopySettings}>
                Копировать
              </button>
              <button type="button" className="modal-btn" onClick={handleExportSettings}>
                Скачать JSON
              </button>
              <button
                type="button"
                className="modal-btn"
                onClick={() => settingsFileInputRef.current?.click()}
              >
                Импорт JSON
              </button>
            </div>

            <div className="settings-actions">
              <button type="button" className="modal-btn modal-btn-confirm" onClick={handleSetAsHomepage}>
                Сделать домашней страницей
              </button>
            </div>

            <p className="settings-help-text">
              В большинстве браузеров сайт сам не может сменить домашнюю страницу из-за ограничений безопасности. Поэтому кнопка открывает настройки запуска браузера или показывает подсказку по ручной установке.
            </p>

            <input
              ref={settingsFileInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleImportSettings}
            />

            <div className="modal-buttons">
              <button type="button" className="modal-btn modal-btn-cancel" onClick={closeModal}>
                Закрыть
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
                <label className="modal-field-label">
                  <span>В папку</span>
                  <select
                    className="modal-select"
                    value={linkTargetFolderId}
                    onChange={(event) => setLinkTargetFolderId(event.target.value)}
                  >
                    <option value="root">Корень</option>
                    {getFolderOptions(folders).map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.label}
                      </option>
                    ))}
                  </select>
                </label>
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
