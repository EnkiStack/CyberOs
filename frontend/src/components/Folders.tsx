export type FolderItem = {
  id: string
  name: string
  kind: 'folder' | 'link'
  url?: string
  children?: FolderItem[]
}

type FoldersProps = {
  items: FolderItem[]
  selectedId: string | null
  deleteMode: boolean
  currentPathIds: string[]
  expandedFolderIds: string[]
  onSelect: (item: FolderItem) => void
  onNavigate: (folderId: string) => void
  onDeleteRequest: (item: FolderItem) => void
}

function getCurrentFolderContents(allItems: FolderItem[], pathIds: string[]): FolderItem[] {
  let current = allItems
  
  for (const id of pathIds) {
    const folder = current.find(item => item.id === id && item.kind === 'folder')
    if (folder && folder.children) {
      current = folder.children
    } else {
      return allItems
    }
  }
  
  return current
}

export function Folders({ 
  items, 
  selectedId, 
  deleteMode, 
  currentPathIds,
  expandedFolderIds,
  onSelect, 
  onNavigate,
  onDeleteRequest,
}: FoldersProps) {
  const currentItems = items

  const renderBranch = (branchItems: FolderItem[], level = 0): JSX.Element[] =>
    branchItems.map((item) => {
      const isExpanded = item.kind === 'folder' && expandedFolderIds.includes(item.id)
      const isCurrentFolder = currentPathIds[currentPathIds.length - 1] === item.id

      return (
        <div key={item.id} className="folder-node" style={{ marginLeft: level > 0 ? 14 : 0 }}>
          <div className={`folder-item ${selectedId === item.id ? 'is-selected' : ''} ${deleteMode ? 'is-delete-mode' : ''} ${item.kind === 'link' ? 'is-link' : ''} ${isCurrentFolder ? 'is-current-folder' : ''}`}>
            <button
              type="button"
              className="folder-item-main"
              onClick={() => onSelect(item)}
            >
              <span className="folder-main">
                <span className="folder-icon">{item.kind === 'folder' ? '📁' : '🔗'}</span>
                <span className="folder-name">{item.name}</span>
              </span>
              {item.kind === 'folder' && item.children && item.children.length > 0 && (
                <span className={`folder-arrow ${isExpanded ? 'is-open' : ''}`}>▾</span>
              )}
            </button>

            {item.kind === 'link' && (
              <button
                type="button"
                className="folder-delete-btn"
                aria-label={`Удалить ${item.name}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteRequest(item);
                }}
              >
                🗑️
              </button>
            )}
          </div>

          {item.kind === 'folder' && isExpanded && item.children && item.children.length > 0 && (
            <div className="folder-children">
              {renderBranch(item.children, level + 1)}
            </div>
          )}
        </div>
      )
    })

  return (
    <div className="folders-list">
      {renderBranch(currentItems)}
    </div>
  )
}
