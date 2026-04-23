import React from "react";

interface LibraryToolbarProps {
  onImport: () => void;
  onSettings: () => void;
  onAnalyzeAll: () => void;
  onAnalyzeSelected: () => void;
  onForceAnalyzeSelected: () => void;
  onEdit: () => void;
  onExport: () => void;
  onDelete: () => void;
  onClearAll: () => void;
  onRename: () => void;
  onFindDuplicates: () => void;
  onExportCsv: () => void;
  onConvertXml: () => void; // New

  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isProcessing: boolean;

  isDirectAccessMode: boolean;
  directoryName?: string;
  isRestored?: boolean;

  // Search & View Props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const LibraryToolbar: React.FC<LibraryToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilters,
  showFilters,
  onImport,
  onSettings,
  onAnalyzeAll,
  onAnalyzeSelected,
  onEdit,
  onExport,
  onDelete,
  onClearAll,
  onRename,
  onFindDuplicates,
  onConvertXml,
  selectedCount,
  totalCount,
  isProcessing,
  isDirectAccessMode,
  directoryName,
}) => {
  return (
    <header className="h-24 glass-effect border-b border-white/5 flex flex-col flex-shrink-0 z-20 relative">
      <div className="flex-1 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-br from-[var(--accent-magenta)] to-[var(--accent-blue)] rounded-xl shadow-lg glow-magenta">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v9"/>
              <path d="m21 9-9-4-9 4"/>
              <path d="M3 15h18V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white font-heading leading-tight">
              Biblioteka
            </h1>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest leading-none">
              {totalCount} Utworów {isDirectAccessMode ? `• ${directoryName}` : ""}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/50 focus:bg-white/10 transition-all font-medium text-sm text-white placeholder:text-white/20"
              placeholder="Szukaj..."
            />
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
               <button 
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-3.5 flex items-center text-white/20 hover:text-white transition-colors"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                 </svg>
               </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${showFilters ? "bg-[var(--accent-cyan)] text-black glow-cyan" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            FILTRY
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-1" />

          <button
            onClick={onSettings}
            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title="Ustawienia"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Secondary Bar for Actions */}
      <div className="h-14 bg-black/40 flex items-center px-8 gap-4 border-t border-white/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={onImport}
            className="flex items-center gap-2 bg-[var(--accent-blue)]/20 hover:bg-[var(--accent-blue)]/30 border border-[var(--accent-blue)]/30 text-[var(--accent-blue)] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            title="Dodaj nowe pliki do biblioteki"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            DODAJ PLIKI
          </button>
          
          <button 
             onClick={onAnalyzeAll}
             disabled={isProcessing}
             className="flex items-center gap-2 bg-[var(--accent-magenta)]/20 hover:bg-[var(--accent-magenta)]/30 border border-[var(--accent-magenta)]/30 text-[var(--accent-magenta)] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(217,70,239,0.1)]"
             title="Automatycznie otaguj wszystkie utwory przy użyciu AI"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            AUTO-TAG AI
          </button>
        </div>

        <div className="h-8 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-2 flex-1 scrollbar-hide overflow-x-auto py-1">
          {selectedCount > 0 ? (
            <>
              <div className="px-4 py-2 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 rounded-xl mr-2 shrink-0">
                <span className="text-[10px] font-black text-[var(--accent-cyan)] uppercase tracking-[0.2em] leading-none">
                  WYBRANO: {selectedCount}
                </span>
              </div>

              <button onClick={onAnalyzeSelected} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap">ANALIZA AI</button>
              <button onClick={onEdit} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap">EDYTUJ TAGI</button>
              <button onClick={onRename} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap">FORMAT NAZW</button>
              <button onClick={onExport} className="bg-[var(--accent-magenta)]/10 hover:bg-[var(--accent-magenta)]/20 border border-[var(--accent-magenta)]/20 text-[var(--accent-magenta)] px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">ZAPISZ ZMIANY</button>
              <button onClick={onDelete} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">USUŃ</button>
            </>
          ) : (
            <div className="flex items-center gap-3 px-5 py-2 bg-white/[0.03] rounded-2xl border border-white/5 border-dashed shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.15em] italic whitespace-nowrap">Wybierz utwory z listy, aby odblokować panel akcji</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
           <button onClick={onFindDuplicates} className="px-3 py-2 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl uppercase transition-all">Duplikaty</button>
           <button onClick={onConvertXml} className="px-3 py-2 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl uppercase transition-all">Export XML</button>
           <div className="w-px h-5 bg-white/10 mx-1" />
           <button onClick={onClearAll} className="px-3 py-2 text-[10px] font-black text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl uppercase transition-all">Czyść</button>
        </div>
      </div>
    </header>
  );
};

export default LibraryToolbar;
