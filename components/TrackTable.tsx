import React, { useMemo } from "react";
import { AudioFile } from "../types";
import { SortConfig } from "../utils/sortingUtils";

interface TrackTableProps {
  files: AudioFile[];
  selectedFileIds: string[];
  activeFileId: string | null;
  onSelect: (id: string, multi: boolean) => void;
  onSelectAll?: () => void;
  onActivate: (file: AudioFile) => void;
  sortConfig: SortConfig[];
  onSort: (config: SortConfig[]) => void;
  onContextMenu?: (e: React.MouseEvent, id: string) => void;

  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
}

interface ColumnDef {
  id: SortKey | "select";
  label: string;
  defaultWidth: number;
  minWidth: number;
  isSortable: boolean;
}

const columns: ColumnDef[] = [
  {
    id: "select",
    label: "",
    defaultWidth: 48,
    minWidth: 48,
    isSortable: false,
  },
  {
    id: "state",
    label: "Status",
    defaultWidth: 60,
    minWidth: 50,
    isSortable: true,
  },
  {
    id: "title",
    label: "Tytuł",
    defaultWidth: 250,
    minWidth: 150,
    isSortable: true,
  },
  {
    id: "artist",
    label: "Artysta",
    defaultWidth: 180,
    minWidth: 100,
    isSortable: true,
  },
  { id: "bpm", label: "BPM", defaultWidth: 70, minWidth: 60, isSortable: true },
  {
    id: "key",
    label: "Tonacja",
    defaultWidth: 80,
    minWidth: 70,
    isSortable: true,
  },
  {
    id: "recordLabel",
    label: "Wydawca",
    defaultWidth: 130,
    minWidth: 100,
    isSortable: true,
  },
  {
    id: "year",
    label: "Rok",
    defaultWidth: 60,
    minWidth: 50,
    isSortable: true,
  },
  {
    id: "genre",
    label: "Gatunek",
    defaultWidth: 130,
    minWidth: 80,
    isSortable: true,
  },
  {
    id: "rating",
    label: "Ocena",
    defaultWidth: 100,
    minWidth: 80,
    isSortable: true,
  },
  {
    id: "dateAdded",
    label: "Dodano",
    defaultWidth: 110,
    minWidth: 100,
    isSortable: true,
  },
];

const TrackTable: React.FC<TrackTableProps> = ({
  files,
  selectedFileIds,
  activeFileId,
  onSelect,
  onActivate,
  onContextMenu,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const allVisibleSelected = useMemo(
    () =>
      files.length > 0 && files.every((f) => selectedFileIds.includes(f.id)),
    [files, selectedFileIds],
  );

  const renderStars = (rating: number | undefined) => {
    const val = rating || 0;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-3 w-3 ${i <= val ? "text-[var(--accent-cyan)] glow-cyan" : "text-white/10"}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (files.length === 0) return null;

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-transparent p-8 pb-32 select-none">
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        <table className="w-full border-separate border-spacing-y-3">
          <thead className="sticky top-0 z-10">
            <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
              <th className="px-6 py-4 text-left w-12">#</th>
              <th className="px-6 py-4 text-left">Tytuł / Artysta</th>
              <th className="px-6 py-4 text-center w-24">BPM</th>
              <th className="px-6 py-4 text-center w-24">Tonacja</th>
              <th className="px-6 py-4 text-left w-40">Gatunek</th>
              <th className="px-6 py-4 text-center w-32">Ocena</th>
              <th className="px-6 py-4 text-right w-40">DODANO</th>
              <th className="px-6 py-4 text-center w-16"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, idx) => {
              const isActive = activeFileId === file.id;
              const isSelected = selectedFileIds.includes(file.id);
              const tags = file.fetchedTags || file.originalTags || {};
              const date = new Date(file.dateAdded).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <tr
                  key={file.id}
                  onClick={(e) => {
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    if (isMulti) {
                      onSelect(file.id, true);
                    } else {
                      onActivate(file);
                    }
                  }}
                  onContextMenu={(e) => onContextMenu?.(e, file.id)}
                  className={`group glass-effect hover:bg-white/5 transition-all cursor-pointer relative ${isActive ? 'bg-white/10 ring-1 ring-[var(--accent-cyan)]/50' : isSelected ? 'bg-white/5 border-[var(--accent-cyan)]/20' : ''} rounded-2xl`}
                >
                  <td className="px-6 py-4 rounded-l-2xl text-[10px] font-mono text-white/20 group-hover:text-white/60 transition-colors">
                     <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            onSelect(file.id, true);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-3.5 w-3.5 rounded-none border border-white/20 bg-black checked:bg-[var(--accent-cyan)] checked:border-transparent transition-all cursor-pointer"
                        />
                        <div className="relative h-4 w-4 flex items-center justify-center">
                           <span className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">{(currentPage - 1) * files.length + idx + 1}</span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute inset-0 text-[var(--accent-cyan)] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                           </svg>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-[var(--accent-cyan)] transition-colors truncate max-w-[250px]">{tags.title || file.file.name}</span>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold truncate max-w-[200px]">{tags.artist || "UNKNOWN"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-mono text-white/60 font-bold">{tags.bpm || "---"}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-mono px-2 py-1 rounded-lg border ${isActive ? 'bg-[var(--accent-magenta)] text-white border-transparent' : 'bg-white/5 text-[var(--accent-magenta)] border-white/10 font-bold'}`}>
                      {tags.initialKey || "---"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-white/40 font-medium">{tags.genre || "---"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">{renderStars(tags.rating)}</div>
                  </td>
                  <td className="px-6 py-4 text-right text-[10px] text-white/20 font-bold uppercase tracking-wider">
                    {date}
                  </td>
                  <td className="px-6 py-4 rounded-r-2xl text-center">
                     <button className="p-2 text-white/20 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                     </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl z-40">
           <button 
             onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
             className={`p-2 rounded-full transition-all ${currentPage === 1 ? 'text-white/10' : 'text-white hover:bg-white/10'}`}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
           </button>
           <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase px-2">Strona {currentPage} z {totalPages}</span>
           <button 
             onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
             className={`p-2 rounded-full transition-all ${currentPage === totalPages ? 'text-white/10' : 'text-white hover:bg-white/10'}`}
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
           </button>
        </div>
      )}
    </div>
  );
};

export default TrackTable;
