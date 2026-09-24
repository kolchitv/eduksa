import React, { useState, useEffect, useRef } from 'react';
import { 
  ToolType, 
  ShapeType, 
  BoardBackgroundType, 
  WhiteboardProject, 
  WhiteboardPage, 
  WhiteboardFolder, 
  CanvasElement, 
  StickerElement 
} from './types';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import { WhiteboardCanvas } from './WhiteboardCanvas';
import { StickersDrawer } from './StickersDrawer';
import { ClassroomToolsModal } from './ClassroomToolsModal';
import { PagesSidebar } from './PagesSidebar';
import { BoardsManagerModal } from './BoardsManagerModal';
import { StickerItem } from './stickersData';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Share2, 
  Download, 
  Printer, 
  Info,
  LayoutTemplate
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioManager } from '../../utils/audio';

const DEFAULT_FOLDERS: WhiteboardFolder[] = [
  { id: 'lughati', name: 'لُغَتِي الجميلة', icon: '📖', color: '#059669' },
  { id: 'foundation', name: 'معمل التأسيس والقرائية', icon: '✨', color: '#d97706' },
  { id: 'math', name: 'الرياضيات والأرقام', icon: '📐', color: '#2563eb' },
  { id: 'science', name: 'العلوم والاكتشاف', icon: '🔬', color: '#7c3aed' },
  { id: 'general', name: 'أنشطة حرة وتعزيز', icon: '🌟', color: '#db2777' },
];

const INITIAL_PROJECTS: WhiteboardProject[] = [
  {
    id: 'proj_1',
    title: 'درس حرف الميم (م) - الكتابة على السطر والتشكيل',
    folderId: 'lughati',
    subject: 'لغتي الصف الأول',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    currentPageIndex: 0,
    pages: [
      {
        id: 'page_1_1',
        title: 'شريحة 1: الحرف بالحركات القصيرة',
        background: 'arabic_ruled',
        elements: [
          {
            id: 'title_1',
            type: 'text',
            text: 'درس حرف الميم ( م ) - أصوات الحرف بالحركات القصيرة',
            x: 1200,
            y: 35,
            fontSize: 34,
            fontFamily: 'Tajawal, sans-serif',
            color: '#065f46',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'stamp_intro',
            type: 'sticker',
            stickerType: 'stamp',
            content: '🌟 ممتاز يا بطل!',
            x: 80,
            y: 25,
            width: 180,
            height: 52,
          },
          {
            id: 'txt_m1',
            type: 'text',
            text: 'مَـ  مَـسْـجِـدٌ   🕌',
            x: 1100,
            y: 160,
            fontSize: 40,
            fontFamily: 'Amiri, serif',
            color: '#1e293b',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'txt_m2',
            type: 'text',
            text: 'مُـ  مُـعَـلِّـمٌ   👨‍🏫',
            x: 1100,
            y: 300,
            fontSize: 40,
            fontFamily: 'Amiri, serif',
            color: '#1e293b',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'txt_m3',
            type: 'text',
            text: 'مِـ  مِـقَـصٌّ   ✂️',
            x: 1100,
            y: 440,
            fontSize: 40,
            fontFamily: 'Amiri, serif',
            color: '#1e293b',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'txt_m4',
            type: 'text',
            text: 'مْ   شَـمْـسٌ   ☀️',
            x: 1100,
            y: 580,
            fontSize: 40,
            fontFamily: 'Amiri, serif',
            color: '#1e293b',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
        ],
      },
      {
        id: 'page_1_2',
        title: 'شريحة 2: تحليل وتركيب الكلمات',
        background: 'chalkboard',
        elements: [
          {
            id: 'txt_chalk_title',
            type: 'text',
            text: 'نشاط تحليلي: حلل الكلمة التالية إلى مقاطع وحروف',
            x: 1200,
            y: 40,
            fontSize: 32,
            fontFamily: 'Tajawal, sans-serif',
            color: '#fef08a',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'sh_box1',
            type: 'shape',
            shapeType: 'rectangle',
            x: 820,
            y: 180,
            width: 320,
            height: 120,
            strokeColor: '#ffffff',
            fillColor: 'transparent',
            strokeWidth: 3,
            strokeStyle: 'solid',
          },
          {
            id: 'txt_word_demo',
            type: 'text',
            text: 'مَـكْـتَـبَـةٌ',
            x: 1040,
            y: 215,
            fontSize: 42,
            fontFamily: 'Amiri, serif',
            color: '#ffffff',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'sh_arrow1',
            type: 'shape',
            shapeType: 'arrow',
            x: 780,
            y: 240,
            width: -100,
            height: 0,
            strokeColor: '#34d399',
            fillColor: 'transparent',
            strokeWidth: 4,
            strokeStyle: 'solid',
          },
          {
            id: 'sh_analysis_box',
            type: 'shape',
            shapeType: 'rectangle',
            x: 120,
            y: 180,
            width: 520,
            height: 120,
            strokeColor: '#34d399',
            fillColor: 'transparent',
            strokeWidth: 3,
            strokeStyle: 'dashed',
          },
          {
            id: 'txt_analysis_res',
            type: 'text',
            text: '[ مَـكْـ ] + [ تَـ ] + [ بَـ ] + [ ـةٌ ]',
            x: 580,
            y: 215,
            fontSize: 34,
            fontFamily: 'Tajawal, sans-serif',
            color: '#34d399',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
        ],
      },
    ],
  },
  {
    id: 'proj_2',
    title: 'لوحة الأشكال الهندسية وشبكة الرياضيات',
    folderId: 'math',
    subject: 'الرياضيات',
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now(),
    currentPageIndex: 0,
    pages: [
      {
        id: 'page_2_1',
        title: 'شريحة 1: الأشكال والمساحات',
        background: 'math_grid',
        elements: [
          {
            id: 'math_title',
            type: 'text',
            text: 'درس الأشكال المستوية: المستطيل، المربع، والدائرة',
            x: 1200,
            y: 40,
            fontSize: 32,
            fontFamily: 'Tajawal, sans-serif',
            color: '#1e40af',
            isBold: true,
            isItalic: false,
            align: 'right',
          },
          {
            id: 'math_rect',
            type: 'shape',
            shapeType: 'rectangle',
            x: 800,
            y: 160,
            width: 320,
            height: 180,
            strokeColor: '#2563eb',
            fillColor: '#eff6ff',
            strokeWidth: 4,
            strokeStyle: 'solid',
          },
          {
            id: 'math_circle',
            type: 'shape',
            shapeType: 'circle',
            x: 440,
            y: 160,
            width: 180,
            height: 180,
            strokeColor: '#059669',
            fillColor: '#ecfdf5',
            strokeWidth: 4,
            strokeStyle: 'solid',
          },
          {
            id: 'math_star',
            type: 'shape',
            shapeType: 'star',
            x: 160,
            y: 160,
            width: 180,
            height: 180,
            strokeColor: '#d97706',
            fillColor: '#fef3c7',
            strokeWidth: 4,
            strokeStyle: 'solid',
          },
        ],
      },
    ],
  },
];

export const InteractiveWhiteboard: React.FC = () => {
  // State for Projects & Folders
  const [projects, setProjects] = useState<WhiteboardProject[]>(() => {
    try {
      const saved = localStorage.getItem('lughati_whiteboards');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PROJECTS;
  });

  const [folders, setFolders] = useState<WhiteboardFolder[]>(() => {
    try {
      const saved = localStorage.getItem('lughati_whiteboard_folders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_FOLDERS;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(projects[0]?.id || 'proj_1');
  const [currentProject, setCurrentProject] = useState<WhiteboardProject>(projects[0] || INITIAL_PROJECTS[0]);

  // Active Page & Elements
  const currentPageIndex = currentProject.currentPageIndex || 0;
  const currentPage = currentProject.pages[currentPageIndex] || currentProject.pages[0] || {
    id: 'default_page',
    title: 'شريحة 1',
    background: 'arabic_ruled' as BoardBackgroundType,
    elements: [],
  };

  // Undo / Redo Stack for current page
  const [undoStack, setUndoStack] = useState<CanvasElement[][]>([]);
  const [redoStack, setRedoStack] = useState<CanvasElement[][]>([]);

  // Active Tool Settings
  const [currentTool, setCurrentTool] = useState<ToolType>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [currentShape, setCurrentShape] = useState<ShapeType>('rectangle');
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals & Drawers
  const [isStickersOpen, setIsStickersOpen] = useState<boolean>(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState<boolean>(false);
  const [isPagesSidebarOpen, setIsPagesSidebarOpen] = useState<boolean>(false);
  const [isBoardsModalOpen, setIsBoardsModalOpen] = useState<boolean>(false);

  // Board Container Ref for Fullscreen & Export
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // Sync currentProject when projects change or currentProjectId changes
  useEffect(() => {
    const proj = projects.find((p) => p.id === currentProjectId) || projects[0];
    if (proj) setCurrentProject(proj);
  }, [currentProjectId, projects]);

  // Save projects to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lughati_whiteboards', JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  // Update elements on current page
  const handleUpdateElements = (newElements: CanvasElement[]) => {
    // Push current state to undo
    setUndoStack((prev) => [...prev.slice(-25), currentPage.elements]);
    setRedoStack([]); // reset redo

    const updatedPages = currentProject.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: newElements };
      }
      return p;
    });

    const updatedProject: WhiteboardProject = {
      ...currentProject,
      updatedAt: Date.now(),
      pages: updatedPages,
    };

    setCurrentProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updatedProject : p)));
  };

  // Undo / Redo Handlers
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, currentPage.elements]);
    setUndoStack((prev) => prev.slice(0, prev.length - 1));

    const updatedPages = currentProject.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: previous };
      }
      return p;
    });

    const updatedProject = { ...currentProject, pages: updatedPages };
    setCurrentProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updatedProject : p)));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, currentPage.elements]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));

    const updatedPages = currentProject.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, elements: next };
      }
      return p;
    });

    const updatedProject = { ...currentProject, pages: updatedPages };
    setCurrentProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updatedProject : p)));
  };

  const handleClearPage = () => {
    if (currentPage.elements.length === 0) return;
    if (confirm('هل أنت متأكد من رغبتك في مسح كافة عناصر هذه الصفحة؟')) {
      handleUpdateElements([]);
    }
  };

  // Background Change
  const handleChangeBackground = (newBg: BoardBackgroundType) => {
    const updatedPages = currentProject.pages.map((p, idx) => {
      if (idx === currentPageIndex) {
        return { ...p, background: newBg };
      }
      return p;
    });
    const updatedProject = { ...currentProject, pages: updatedPages };
    setCurrentProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updatedProject : p)));
  };

  // Add Sticker / Stamp to Canvas
  const handleSelectSticker = (item: StickerItem) => {
    const isStamp = item.type === 'stamp';
    const newSticker: StickerElement = {
      id: `sticker_${Date.now()}`,
      type: 'sticker',
      stickerType: isStamp ? 'stamp' : 'emoji',
      content: item.content,
      label: item.label,
      x: 640 - (isStamp ? 95 : 30),
      y: 350 - (isStamp ? 27 : 30),
      width: isStamp ? 190 : 64,
      height: isStamp ? 54 : 64,
    };
    handleUpdateElements([...currentPage.elements, newSticker]);
    audioManager.play('star');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
  };

  const handleUploadImage = (dataUrl: string) => {
    const newImgEl: StickerElement = {
      id: `img_${Date.now()}`,
      type: 'sticker',
      stickerType: 'image',
      content: dataUrl,
      x: 350,
      y: 180,
      width: 400,
      height: 300,
    };
    handleUpdateElements([...currentPage.elements, newImgEl]);
  };

  // Page Nav & Management
  const handleSelectPage = (index: number) => {
    const updated = { ...currentProject, currentPageIndex: index };
    setCurrentProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updated : p)));
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleAddPage = () => {
    const newPage: WhiteboardPage = {
      id: `page_${Date.now()}`,
      title: `شريحة ${currentProject.pages.length + 1}`,
      background: currentPage.background || 'arabic_ruled',
      elements: [],
    };
    const updatedPages = [...currentProject.pages, newPage];
    const updated = {
      ...currentProject,
      pages: updatedPages,
      currentPageIndex: updatedPages.length - 1,
    };
    setCurrentProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updated : p)));
    audioManager.play('click');
  };

  const handleDuplicatePage = (index: number) => {
    const targetPage = currentProject.pages[index];
    if (!targetPage) return;

    const duplicatedPage: WhiteboardPage = {
      ...targetPage,
      id: `page_${Date.now()}`,
      title: `${targetPage.title} (نسخة)`,
      elements: JSON.parse(JSON.stringify(targetPage.elements || [])),
    };

    const updatedPages = [...currentProject.pages];
    updatedPages.splice(index + 1, 0, duplicatedPage);

    const updated = {
      ...currentProject,
      pages: updatedPages,
      currentPageIndex: index + 1,
    };
    setCurrentProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updated : p)));
  };

  const handleDeletePage = (index: number) => {
    if (currentProject.pages.length <= 1) return;
    const updatedPages = currentProject.pages.filter((_, i) => i !== index);
    const nextIndex = Math.min(currentPageIndex, updatedPages.length - 1);
    const updated = {
      ...currentProject,
      pages: updatedPages,
      currentPageIndex: nextIndex,
    };
    setCurrentProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updated : p)));
  };

  // Boards Management Helpers
  const handleCreateProject = (folderId: string, title: string) => {
    const newProj: WhiteboardProject = {
      id: `proj_${Date.now()}`,
      title,
      folderId,
      subject: 'درس جديد',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentPageIndex: 0,
      pages: [
        {
          id: `page_${Date.now()}`,
          title: 'شريحة 1',
          background: 'arabic_ruled',
          elements: [],
        },
      ],
    };
    setProjects([newProj, ...projects]);
    setCurrentProjectId(newProj.id);
  };

  const handleDeleteProject = (projectId: string) => {
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    if (currentProjectId === projectId && remaining.length > 0) {
      setCurrentProjectId(remaining[0].id);
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    const duplicated: WhiteboardProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj_${Date.now()}`,
      title: `${target.title} (نسخة)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects([duplicated, ...projects]);
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newF: WhiteboardFolder = {
      id: `folder_${Date.now()}`,
      name,
      icon: '📁',
      color,
    };
    setFolders([...folders, newF]);
  };

  const handleExportProjectJSON = (proj: WhiteboardProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${proj.title.replace(/\s+/g, '_')}_whiteboard.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportProjectsJSON = (imported: WhiteboardProject[]) => {
    setProjects([...imported, ...projects]);
    if (imported.length > 0) {
      setCurrentProjectId(imported[0].id);
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!boardContainerRef.current) return;
    if (!document.fullscreenElement) {
      boardContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Export as PNG
  const handleExportPNG = () => {
    const canvas = boardContainerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${currentProject.title}_شريحة_${currentPageIndex + 1}.png`;
    a.click();
  };

  // Export as PDF / Print
  const handlePrintOrPDF = () => {
    const canvas = boardContainerRef.current?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('يرجى السماح بالنوافذ المنبثقة للطباعة أو حفظ ملف PDF');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <title>${currentProject.title} - سبورة لغتي</title>
          <style>
            body { margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, sans-serif; text-align: center; }
            h2 { color: #065f46; margin-bottom: 4px; }
            p { color: #64748b; font-size: 14px; margin-top: 0; }
            img { max-width: 100%; height: auto; border: 2px solid #065f46; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            @media print {
              body { padding: 0; }
              img { border: none; box-shadow: none; width: 100%; }
            }
          </style>
        </head>
        <body>
          <h2>منصة لُغَتِي التعليمية - ${currentProject.title}</h2>
          <p>شريحة ${currentPageIndex + 1} من ${currentProject.pages.length} • تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}</p>
          <img src="${dataUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div 
      ref={boardContainerRef}
      className={`min-h-screen flex flex-col justify-between p-2 sm:p-4 transition-colors ${
        isFullscreen ? 'bg-slate-900 p-2' : 'bg-slate-100/90'
      }`}
    >
      {/* Top Header Banner (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto w-full mb-3 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-3 sm:px-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              ✏️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-white font-alexandria">
                  السبورة التفاعلية الذكية للمعلمين
                </h2>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full">
                  شاملة الأدوات 🚀
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium line-clamp-1">
                {currentProject.title} • {currentProject.pages.length} شرائح
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBoardsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-200" />
              <span>تبديل الدرس</span>
            </button>

            <button
              onClick={handleAddPage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-transform active:scale-95"
            >
              <span>+ إضافة شريحة</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toolbar (Top + Deck) */}
      <div className="mb-2 z-30">
        <WhiteboardToolbar
          currentTool={currentTool}
          onSelectTool={setCurrentTool}
          currentColor={currentColor}
          onChangeColor={setCurrentColor}
          strokeWidth={strokeWidth}
          onChangeStrokeWidth={setStrokeWidth}
          currentShape={currentShape}
          onSelectShape={setCurrentShape}
          currentBackground={currentPage.background}
          onChangeBackground={handleChangeBackground}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClearPage={handleClearPage}
          zoom={zoom}
          onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
          onZoomOut={() => setZoom((z) => Math.max(0.6, z - 0.15))}
          onResetZoom={() => setZoom(1)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onOpenStickers={() => setIsStickersOpen(true)}
          onOpenToolsModal={() => setIsToolsModalOpen(true)}
          onOpenPagesSidebar={() => setIsPagesSidebarOpen(true)}
          onOpenBoardsModal={() => setIsBoardsModalOpen(true)}
          onExportPNG={handleExportPNG}
          onExportPDF={handlePrintOrPDF}
          onPrint={handlePrintOrPDF}
          pageNumber={currentPageIndex + 1}
          totalPages={currentProject.pages.length}
          onPrevPage={() => handleSelectPage(Math.max(0, currentPageIndex - 1))}
          onNextPage={() => handleSelectPage(Math.min(currentProject.pages.length - 1, currentPageIndex + 1))}
        />
      </div>

      {/* Main Canvas Workspace */}
      <div className="flex-1 flex items-center justify-center w-full max-w-7xl mx-auto relative">
        <WhiteboardCanvas
          elements={currentPage.elements}
          onUpdateElements={handleUpdateElements}
          currentTool={currentTool}
          currentColor={currentColor}
          strokeWidth={strokeWidth}
          currentShape={currentShape}
          background={currentPage.background}
          zoom={zoom}
        />
      </div>

      {/* Modals and Drawers */}
      <StickersDrawer
        isOpen={isStickersOpen}
        onClose={() => setIsStickersOpen(false)}
        onSelectSticker={handleSelectSticker}
        onUploadImage={handleUploadImage}
      />

      <ClassroomToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />

      <PagesSidebar
        isOpen={isPagesSidebarOpen}
        onClose={() => setIsPagesSidebarOpen(false)}
        pages={currentProject.pages}
        currentPageIndex={currentPageIndex}
        onSelectPage={handleSelectPage}
        onAddPage={handleAddPage}
        onDuplicatePage={handleDuplicatePage}
        onDeletePage={handleDeletePage}
      />

      <BoardsManagerModal
        isOpen={isBoardsModalOpen}
        onClose={() => setIsBoardsModalOpen(false)}
        projects={projects}
        folders={folders}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onCreateFolder={handleCreateFolder}
        onExportProject={handleExportProjectJSON}
        onImportProjects={handleImportProjectsJSON}
      />
    </div>
  );
};
