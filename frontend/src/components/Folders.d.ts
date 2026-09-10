export type FolderItem = {
    id: string;
    name: string;
    kind: 'folder' | 'link';
    url?: string;
};
type FoldersProps = {
    items: FolderItem[];
    selectedId: string | null;
    deleteMode: boolean;
    onSelect: (item: FolderItem) => void;
};
export declare function Folders({ items, selectedId, deleteMode, onSelect }: FoldersProps): import("react").JSX.Element;
export {};
