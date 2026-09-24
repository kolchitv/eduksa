import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Plus, 
  Folder, 
  FileText, 
  Trash2, 
  Copy, 
  Edit2, 
  Download, 
  Upload, 
  Check, 
  Sparkles,
  Layout
} from 'lucide-react';
import { WhiteboardProject, WhiteboardFolder } from './types';

interface BoardsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: WhiteboardProject[];
  folders: WhiteboardFolder[];
  currentProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (folderId: string, title: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onCreateFolder: (name: string, color: string) => void;
  onExportProject: (project: WhiteboardProject) => void;
  onImportProjects: (importedProjects: WhiteboardProject[]) => void;
}

export const BoardsManagerModal: React.FC<BoardsManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  folders,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onCreateFolder,
  onExportProject,
  onImportProjects,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [newBoardTitle, setNewBoardTitle] = useState<string>('');
  const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredProjects = selectedFolderId === 'all'
    ? projects
    : projects.filter((p) => p.folderId === selectedFolderId);

  const handleCreateBoardSubmit = () => {
    if (!newBoardTitle.trim()) return;
    const targetFolder = selectedFolderId === 'all' ? (folders[0]?.id || 'default') : selectedFolderId;
    onCreateProject(targetFolder, newBoardTitle.trim());
    setNewBoardTitle('');
    setIsCreatingBoard(false);
  };

  const handleCreateFolderSubmit = () => {
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), '#10b981');
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportProjects(parsed);
        } else if (parsed && parsed.id && parsed.pages) {
          onImportProjects([parsed]);
        }
      } catch (err) {
        alert('ملف غير صالح، يرجى التأكد من اختيار ملف سبورة مدعوم.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              📁
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">إدارة المجلدات والسبورات التعليمية</h3>
              <p className="text-xs text-emerald-100 font-medium">نظّم دروسك وفصولك، أنشئ سبورات جديدة، وصدّر مشاريعك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Folders Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-3.5 space-y-2 overflow-y-auto">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold text-slate-500">المجلدات والمواد</span>
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>مجلد جديد</span>
              </button>
            </div>

            {isCreatingFolder && (
              <div className="p-2 bg-white rounded-xl border border-emerald-300 shadow-xs space-y-1.5 animate-in fade-in">
                <input
                  type="text"
                  placeholder="اسم المجلد (مثال: لغتي أول)..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setIsCreatingFolder(false)}
                    className="px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 rounded"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleCreateFolderSubmit}
                    className="px-2 py-0.5 text-[11px] bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            )}

            {/* Folder Items */}
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedFolderId === 'all'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span>جميع السبورات</span>
              </div>
              <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-md font-mono">
                {projects.length}
              </span>
            </button>

            {folders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              const count = projects.filter((p) => p.folderId === folder.id).length;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{folder.icon || '📁'}</span>
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded-md font-mono">
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Import / Export System */}
            <div className="pt-4 border-t border-slate-200 mt-4 space-y-1.5">
              <label className="w-full flex items-center justify-center gap-2 p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>استيراد ملف سبورات (JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportFileChange}
                />
              </label>
            </div>
          </div>

          {/* Boards Grid */}
          <div className="flex-1 bg-white p-4 sm:p-5 overflow-y-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  {selectedFolderId === 'all'
                    ? 'كافة السبورات المحفوظة'
                    : folders.find((f) => f.id === selectedFolderId)?.name}
                </h4>
                <p className="text-xs text-slate-400">انقر على أي سبورة لفتحها والمتابعة من حيث توقفت</p>
              </div>

              <button
                onClick={() => setIsCreatingBoard(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء سبورة جديدة</span>
              </button>
            </div>

            {/* Create Board Prompt Form */}
            {isCreatingBoard && (
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2 animate-in fade-in">
                <div className="text-xs font-bold text-emerald-900">عنوان الدرس أو السبورة الجديدة:</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مثال: درس حرف الميم - الصف الأول الابتدائي..."
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBoardSubmit()}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateBoardSubmit}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                  >
                    إنشاء وفتح
                  </button>
                  <button
                    onClick={() => setIsCreatingBoard(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Projects List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProjects.map((project) => {
                const isCurrent = project.id === currentProjectId;
                const pageCount = project.pages?.length || 1;
                const elementsCount = project.pages?.reduce((acc, p) => acc + (p.elements?.length || 0), 0) || 0;
                
                return (
                  <div
                    key={project.id}
                    className={`group relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-2 ring-emerald-400/40'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {pageCount} {pageCount === 1 ? 'صفحة' : 'صفحات'} • {elementsCount} عنصر
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            مفتوحة الآن
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h5 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 line-clamp-2 mb-1">
                        {project.title}
                      </h5>

                      <div className="text-[11px] text-slate-400 font-medium">
                        آخر تعديل: {new Date(project.updatedAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          onClose();
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        فتح السبورة
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDuplicateProject(project.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="تكرار السبورة"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onExportProject(project)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="تصدير كملف JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {projects.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف سبورة "${project.title}"؟`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف السبورة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💾 كل تعديلاتك وحركاتك على السبورة تُحفظ تلقائياً في المتصفح</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
