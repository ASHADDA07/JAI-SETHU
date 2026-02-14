import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Upload, FolderPlus, FileText, Image as ImageIcon, 
  Trash2, Lock, Loader2, Shield, MoreVertical, 
  Folder, X, Eye, Download, Edit2, Share2, Check
} from 'lucide-react';

export default function EvidenceVault() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // -- STATE --
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Modal & Menu States
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  
  // Rename State
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // 1. Handle File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    const objectUrl = URL.createObjectURL(selectedFile);

    setTimeout(() => {
        const newFile = {
            id: Date.now(),
            name: selectedFile.name,
            size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
            type: selectedFile.type.includes('image') ? 'image' : 'doc',
            date: new Date().toLocaleDateString(),
            status: 'Encrypted',
            url: objectUrl 
        };
        setFiles(prev => [newFile, ...prev]);
        setUploading(false);
        if(fileInputRef.current) fileInputRef.current.value = ''; 
    }, 1000);
  };

  // 2. Create Folder
  const handleCreateFolder = () => {
      if(!newFolderName.trim()) return;
      setFiles(prev => [{
          id: Date.now(),
          name: newFolderName,
          type: 'folder',
          size: '-',
          date: new Date().toLocaleDateString(),
          status: 'Secure',
          items: 0
      }, ...prev]);
      setNewFolderName('');
      setShowFolderModal(false);
  };

  // 3. Rename Logic
  const startRename = (file: any) => {
      setRenamingId(file.id);
      setRenameValue(file.name);
      setActiveMenuId(null); // Close menu
  };

  const saveRename = () => {
      if (!renameValue.trim()) return;
      setFiles(files.map(f => f.id === renamingId ? { ...f, name: renameValue } : f));
      setRenamingId(null);
  };

  // 4. Share Logic
  const handleShare = (file: any) => {
      alert(`Secure Link Generated for ${file.name}:\n\nhttps://jaisethu.com/v/${file.id}\n\n(Copied to clipboard)`);
      setActiveMenuId(null);
  };

  // 5. Delete & Download
  const handleDelete = (id: number) => {
      if(window.confirm('Delete this item permanently?')) {
          setFiles(prev => prev.filter(f => f.id !== id));
      }
      setActiveMenuId(null);
  };

  const handleDownload = (file: any) => {
      if (!file.url) return;
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setActiveMenuId(null);
  };

  // Close menus on click outside
  useEffect(() => {
      const handleClickOutside = (e: any) => {
          if (!e.target.closest('.menu-container')) {
              setActiveMenuId(null);
          }
      };
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="text-[#D4AF37]" /> Evidence Vault
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Lock size={12} className="text-green-600"/> AES-256 Encrypted Storage
                </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setShowFolderModal(true)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
                >
                    <FolderPlus size={18} /> New Folder
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                    {uploading ? <Loader2 size={18} className="animate-spin"/> : <Upload size={18} />} 
                    Upload Evidence
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect}/>
            </div>
        </div>

        {/* STORAGE BAR */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-3xl font-bold text-gray-900">
                        {files.filter(f => f.type !== 'folder').length > 0 ? files.filter(f => f.type !== 'folder').reduce((acc, curr) => acc + parseFloat(curr.size), 0).toFixed(2) : '0'}
                    </span>
                    <span className="text-gray-500 text-sm font-medium"> / 5.0 GB Used</span>
                </div>
                <span className="text-xs text-yellow-700 font-bold bg-yellow-100 px-2 py-1 rounded border border-yellow-200">
                    PRO PLAN
                </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${Math.max(files.length * 2, 2)}%` }}></div>
            </div>
        </div>

        {/* FILE LIST */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px] relative">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-t-xl">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Empty State */}
            {files.length === 0 && !uploading && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Upload size={32} className="opacity-40"/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No Evidence Uploaded</h3>
                    <p className="text-sm max-w-xs text-center mb-6">Upload documents or create folders to organize your case files.</p>
                </div>
            )}

            {/* Loading Indicator */}
            {uploading && (
                <div className="p-4 border-b border-gray-100 flex items-center justify-between animate-pulse bg-blue-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                            <div className="h-3 w-32 bg-gray-200 rounded"></div>
                            <div className="h-2 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="text-xs font-bold text-blue-600 flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin"/> Encrypting & Uploading...
                    </div>
                </div>
            )}

            {/* FILES LOOP */}
            {files.map((file) => (
                <div key={file.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-center group relative">
                    
                    {/* NAME COLUMN (With Rename Input) */}
                    <div className="col-span-6 flex items-center gap-3 cursor-pointer" onClick={() => file.type !== 'folder' && !renamingId && setPreviewFile(file)}>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 
                            ${file.type === 'folder' ? 'bg-yellow-100 text-yellow-600' : 
                              file.type === 'image' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                            {file.type === 'folder' ? <Folder size={20} fill="currentColor" className="opacity-80"/> : 
                             file.type === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>}
                        </div>
                        
                        {renamingId === file.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input 
                                    type="text" 
                                    value={renameValue} 
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    className="border border-blue-500 rounded px-2 py-1 text-sm outline-none"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                                />
                                <button onClick={saveRename} className="p-1 bg-green-500 text-white rounded"><Check size={14}/></button>
                            </div>
                        ) : (
                            <div className="min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 truncate">{file.name}</h4>
                                <p className="text-[10px] text-green-600 flex items-center gap-1">
                                    {file.type === 'folder' ? <span>{file.items} items</span> : <><Lock size={8}/> {file.status}</>}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="col-span-2 text-sm text-gray-600">{file.size}</div>
                    <div className="col-span-2 text-sm text-gray-600">{file.date}</div>

                    {/* ACTIONS */}
                    <div className="col-span-2 flex justify-end gap-2 relative">
                        {/* Quick View */}
                        {file.type !== 'folder' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Preview"
                            >
                                <Eye size={18} />
                            </button>
                        )}
                        
                        {/* 3 DOTS MENU */}
                        <div className="menu-container relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === file.id ? null : file.id); }}
                                className={`p-2 rounded-lg transition-colors ${activeMenuId === file.id ? 'bg-gray-200 text-black' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                                <MoreVertical size={18} />
                            </button>

                            {activeMenuId === file.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {file.type !== 'folder' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDownload(file); }} 
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Download size={14}/> Download
                                        </button>
                                    )}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); startRename(file); }} 
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit2 size={14}/> Rename
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleShare(file); }} 
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Share2 size={14}/> Share Securely
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} 
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                                    >
                                        <Trash2 size={14}/> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- MODAL: CREATE FOLDER --- */}
      {showFolderModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                 <h3 className="text-lg font-serif font-bold mb-4">Create New Folder</h3>
                 <input 
                    type="text" 
                    placeholder="Folder Name" 
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6 outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    autoFocus
                 />
                 <div className="flex gap-3 justify-end">
                     <button onClick={() => setShowFolderModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                     <button onClick={handleCreateFolder} className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:brightness-110">Create</button>
                 </div>
             </div>
        </div>
      )}

      {/* --- MODAL: PREVIEW --- */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
             <button onClick={() => setPreviewFile(null)} className="absolute top-6 right-6 text-white/70 hover:text-white p-2">
                <X size={32}/>
             </button>
             <h2 className="text-white text-xl font-bold mb-4">{previewFile.name}</h2>
             <div className="max-w-4xl w-full max-h-[80vh] flex items-center justify-center">
                 {previewFile.type === 'image' ? (
                     <img src={previewFile.url} className="max-w-full max-h-[70vh] rounded-lg shadow-2xl" alt="Preview"/>
                 ) : (
                     <div className="bg-white p-12 rounded-2xl text-center">
                         <FileText size={64} className="text-[#D4AF37] mb-4 mx-auto"/>
                         <p className="font-bold">Preview Unavailable</p>
                         <button onClick={() => handleDownload(previewFile)} className="mt-4 px-6 py-2 bg-black text-white rounded-lg font-bold flex items-center gap-2 mx-auto">
                             <Download size={18}/> Download
                         </button>
                     </div>
                 )}
             </div>
        </div>
      )}

    </DashboardLayout>
  );
}