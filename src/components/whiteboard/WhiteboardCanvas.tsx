import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  CanvasElement, 
  StrokeElement, 
  ShapeElement, 
  TextElement, 
  StickerElement, 
  ToolType, 
  ShapeType, 
  BoardBackgroundType, 
  Point 
} from './types';
import { Bold, Italic, Check, X, Trash2, Move } from 'lucide-react';

interface WhiteboardCanvasProps {
  elements: CanvasElement[];
  onUpdateElements: (elements: CanvasElement[]) => void;
  currentTool: ToolType;
  currentColor: string;
  strokeWidth: number;
  currentShape: ShapeType;
  background: BoardBackgroundType;
  zoom: number;
}

const ARABIC_FONTS = [
  { id: 'Tajawal, sans-serif', name: 'خط تجوال (افتراضي)' },
  { id: 'Amiri, serif', name: 'خط النسخ (أميري)' },
  { id: 'Alexandria, sans-serif', name: 'خط الإسكندرية' },
  { id: 'Cairo, sans-serif', name: 'خط القاهرة' },
  { id: 'Noto Kufi Arabic, sans-serif', name: 'خط كوفي حديث' },
];

const QUICK_HARAKAT = [
  { symbol: 'َ', label: 'فتحة' },
  { symbol: 'ُ', label: 'ضمة' },
  { symbol: 'ِ', label: 'كسرة' },
  { symbol: 'ْ', label: 'سكون' },
  { symbol: 'ّ', label: 'شدة' },
  { symbol: 'ً', label: 'تنوين فتح' },
  { symbol: 'ٌ', label: 'تنوين ضم' },
  { symbol: 'ٍ', label: 'تنوين كسر' },
];

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  elements,
  onUpdateElements,
  currentTool,
  currentColor,
  strokeWidth,
  currentShape,
  background,
  zoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentStrokeRef = useRef<StrokeElement | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const currentShapePreviewRef = useRef<ShapeElement | null>(null);
  
  // Laser trail points with timestamps
  const laserPointsRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const laserAnimFrameRef = useRef<number | null>(null);

  // Selected element for moving / resizing / editing
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDraggingElement, setIsDraggingElement] = useState<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Text inline editor modal state
  const [editingTextElement, setEditingTextElement] = useState<TextElement | null>(null);
  const [textInputVal, setTextInputVal] = useState<string>('');
  const [textFontFamily, setTextFontFamily] = useState<string>('Tajawal, sans-serif');
  const [textFontSize, setTextFontSize] = useState<number>(32);
  const [isTextBold, setIsTextBold] = useState<boolean>(false);
  const [isTextItalic, setIsTextItalic] = useState<boolean>(false);

  // Image cache for rendered stickers/images
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Helper: get canvas coordinates from pointer event
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Account for display scaling & zoom
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
      pressure: e.pressure || 0.5,
    };
  };

  // Draw Background function
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    if (background === 'chalkboard') {
      // Classical classroom green chalkboard
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1b4332');
      grad.addColorStop(0.5, '#2d6a4f');
      grad.addColorStop(1, '#1b4332');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle chalk border
      ctx.strokeStyle = '#40916c';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, height - 20);
    } else if (background === 'dark') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    } else if (background === 'warm_sepia') {
      ctx.fillStyle = '#fbf7ee';
      ctx.fillRect(0, 0, width, height);
    } else if (background === 'arabic_ruled') {
      // White notebook with Arabic handwriting ruled lines (Red baseline, Top guide, Bottom guide)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const lineHeight = 70;
      const startY = 60;
      for (let y = startY; y < height; y += lineHeight) {
        // Upper guide line (light dashed blue)
        ctx.strokeStyle = '#bfdbfe';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(width - 30, y);
        ctx.stroke();

        // Main baseline (solid red for Arabic line)
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(30, y + 26);
        ctx.lineTo(width - 30, y + 26);
        ctx.stroke();

        // Lower descending line (light dashed pink)
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(30, y + 46);
        ctx.lineTo(width - 30, y + 46);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    } else if (background === 'math_grid') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = 32;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    } else if (background === 'dot_grid') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#94a3b8';
      const gap = 30;
      for (let x = gap; x < width; x += gap) {
        for (let y = gap; y < height; y += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Default clean whiteboard
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  };

  // Render single element
  const renderElement = (ctx: CanvasRenderingContext2D, el: CanvasElement) => {
    ctx.save();

    if (el.type === 'stroke') {
      if (el.points.length === 0) return;
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = el.opacity || 1;

      if (el.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = el.color.startsWith('#') ? el.color + '66' : el.color;
      }

      ctx.beginPath();
      const pts = el.points;
      if (pts.length === 1) {
        ctx.arc(pts[0].x, pts[0].y, el.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.fill();
      } else {
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      }
    } else if (el.type === 'shape') {
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = el.strokeWidth;
      ctx.fillStyle = el.fillColor || 'transparent';

      if (el.strokeStyle === 'dashed') ctx.setLineDash([8, 8]);
      if (el.strokeStyle === 'dotted') ctx.setLineDash([3, 3]);

      const { x, y, width, height, shapeType } = el;

      ctx.beginPath();
      if (shapeType === 'rectangle') {
        ctx.rect(x, y, width, height);
      } else if (shapeType === 'circle') {
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      } else if (shapeType === 'line') {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
      } else if (shapeType === 'arrow') {
        // Arrow head
        const toX = x + width;
        const toY = y + height;
        const headlen = 16;
        const angle = Math.atan2(toY - y, toX - x);
        ctx.moveTo(x, y);
        ctx.lineTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      } else if (shapeType === 'triangle') {
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.closePath();
      } else if (shapeType === 'star') {
        const cx = x + width / 2;
        const cy = y + height / 2;
        const spikes = 5;
        const outerRadius = Math.abs(width) / 2;
        const innerRadius = outerRadius / 2;
        let rot = (Math.PI / 2) * 3;
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          let sx = cx + Math.cos(rot) * outerRadius;
          let sy = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(sx, sy);
          rot += step;

          sx = cx + Math.cos(rot) * innerRadius;
          sy = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(sx, sy);
          rot += step;
        }
        ctx.closePath();
      } else if (shapeType === 'speech_bubble') {
        // Rounded rectangle with speech tip
        const r = 16;
        const w = width;
        const h = height * 0.8;
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        // Tip
        ctx.lineTo(x + w * 0.4, y + h);
        ctx.lineTo(x + w * 0.2, y + height);
        ctx.lineTo(x + w * 0.25, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      } else if (shapeType === 'cloud') {
        // Simple 4-arc cloud
        const cx = x + width / 2;
        const cy = y + height / 2;
        const rw = width / 2;
        const rh = height / 2;
        ctx.arc(cx - rw * 0.4, cy, rh * 0.5, 0, Math.PI * 2);
        ctx.arc(cx, cy - rh * 0.3, rh * 0.6, 0, Math.PI * 2);
        ctx.arc(cx + rw * 0.4, cy, rh * 0.5, 0, Math.PI * 2);
      }

      if (el.fillColor && el.fillColor !== 'transparent') {
        ctx.fill();
      }
      ctx.stroke();
    } else if (el.type === 'text') {
      const fontStyle = `${el.isItalic ? 'italic ' : ''}${el.isBold ? 'bold ' : ''}${el.fontSize || 32}px ${el.fontFamily || 'Tajawal, sans-serif'}`;
      ctx.font = fontStyle;
      ctx.fillStyle = el.color || '#000000';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.direction = 'rtl';

      const lines = el.text.split('\n');
      const lineH = el.fontSize * 1.35;

      lines.forEach((line, idx) => {
        ctx.fillText(line, el.x, el.y + idx * lineH);
      });
    } else if (el.type === 'sticker') {
      if (el.stickerType === 'image' && el.content.startsWith('data:image')) {
        let img = imageCacheRef.current.get(el.content);
        if (!img) {
          img = new Image();
          img.src = el.content;
          img.onload = () => drawCanvas();
          imageCacheRef.current.set(el.content, img);
        }
        if (img.complete) {
          ctx.drawImage(img, el.x, el.y, el.width, el.height);
        }
      } else if (el.stickerType === 'stamp') {
        // Teacher Praise Stamp (badge styled with rounded corners and border)
        const w = el.width || 190;
        const h = el.height || 54;
        
        ctx.fillStyle = '#fef3c7';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        const r = 16;
        ctx.roundRect(el.x, el.y, w, h, [r, r, r, r]);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 20px Alexandria, Tajawal, sans-serif';
        ctx.fillStyle = '#92400e';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.direction = 'rtl';
        ctx.fillText(el.content, el.x + w / 2, el.y + h / 2);
      } else {
        // Emoji or character
        ctx.font = `${el.width || 52}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.content, el.x + (el.width || 52) / 2, el.y + (el.height || 52) / 2);
      }
    }

    // Draw selection highlight box if selected
    if (el.id === selectedElementId) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      let bounds = getElementBounds(el);
      ctx.strokeRect(bounds.x - 6, bounds.y - 6, bounds.width + 12, bounds.height + 12);
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  // Helper bounds calculation
  const getElementBounds = (el: CanvasElement) => {
    if (el.type === 'stroke') {
      if (el.points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
      const xs = el.points.map((p) => p.x);
      const ys = el.points.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    } else if (el.type === 'shape') {
      return {
        x: Math.min(el.x, el.x + el.width),
        y: Math.min(el.y, el.y + el.height),
        width: Math.abs(el.width),
        height: Math.abs(el.height),
      };
    } else if (el.type === 'text') {
      const lines = el.text.split('\n');
      const maxLen = Math.max(...lines.map((l) => l.length), 1);
      const w = maxLen * (el.fontSize * 0.6);
      const h = lines.length * (el.fontSize * 1.35);
      return { x: el.x - w, y: el.y, width: w, height: h };
    } else if (el.type === 'sticker') {
      return { x: el.x, y: el.y, width: el.width || 60, height: el.height || 60 };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  };

  // Draw full canvas routine
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground(ctx, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach((el) => {
      renderElement(ctx, el);
    });

    // Draw active stroke preview if drawing
    if (currentStrokeRef.current) {
      renderElement(ctx, currentStrokeRef.current);
    }

    // Draw active shape preview if drawing
    if (currentShapePreviewRef.current) {
      renderElement(ctx, currentShapePreviewRef.current);
    }

    // Draw laser pointer trail
    const now = Date.now();
    const laserPts = laserPointsRef.current.filter((p) => now - p.time < 1200);
    laserPointsRef.current = laserPts;

    if (laserPts.length > 0) {
      ctx.save();
      for (let i = 0; i < laserPts.length; i++) {
        const p = laserPts[i];
        const age = now - p.time;
        const alpha = Math.max(0, 1 - age / 1200);

        ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bright glowing head
      const latest = laserPts[laserPts.length - 1];
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(latest.x, latest.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(latest.x, latest.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, [elements, background, selectedElementId]);

  // Laser animation loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (laserPointsRef.current.length > 0) {
        drawCanvas();
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [drawCanvas]);

  // Adjust canvas resolution on mount / resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.max(1280, rect.width * dpr);
      const targetHeight = Math.max(760, rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        drawCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawCanvas]);

  // Trigger draw on dependencies
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pt = getCanvasCoords(e);
    isDrawingRef.current = true;
    startPointRef.current = pt;

    if (currentTool === 'laser') {
      laserPointsRef.current.push({ x: pt.x, y: pt.y, time: Date.now() });
      drawCanvas();
      return;
    }

    if (currentTool === 'select') {
      // Find element clicked
      const clickedEl = [...elements].reverse().find((el) => {
        const b = getElementBounds(el);
        return pt.x >= b.x - 10 && pt.x <= b.x + b.width + 10 && pt.y >= b.y - 10 && pt.y <= b.y + b.height + 10;
      });

      if (clickedEl) {
        setSelectedElementId(clickedEl.id);
        setIsDraggingElement(true);
        dragOffsetRef.current = {
          x: pt.x - ('x' in clickedEl ? clickedEl.x : 0),
          y: pt.y - ('y' in clickedEl ? clickedEl.y : 0),
        };
      } else {
        setSelectedElementId(null);
      }
      return;
    }

    if (currentTool === 'eraser') {
      // Erase element if point collides
      const remaining = elements.filter((el) => {
        const b = getElementBounds(el);
        const collides = pt.x >= b.x - 20 && pt.x <= b.x + b.width + 20 && pt.y >= b.y - 20 && pt.y <= b.y + b.height + 20;
        return !collides;
      });
      if (remaining.length !== elements.length) {
        onUpdateElements(remaining);
      }
      return;
    }

    if (currentTool === 'pen' || currentTool === 'highlighter') {
      currentStrokeRef.current = {
        id: `stroke_${Date.now()}_${Math.random()}`,
        type: 'stroke',
        tool: currentTool,
        points: [pt],
        color: currentColor,
        size: currentTool === 'highlighter' ? strokeWidth * 2.5 : strokeWidth,
        opacity: currentTool === 'highlighter' ? 0.45 : 1,
      };
      drawCanvas();
      return;
    }

    if (currentTool === 'shape') {
      currentShapePreviewRef.current = {
        id: `shape_${Date.now()}`,
        type: 'shape',
        shapeType: currentShape,
        x: pt.x,
        y: pt.y,
        width: 0,
        height: 0,
        strokeColor: currentColor,
        fillColor: 'transparent',
        strokeWidth: strokeWidth,
        strokeStyle: 'solid',
      };
      drawCanvas();
      return;
    }

    if (currentTool === 'text') {
      // Open text editor modal at point
      const newTextEl: TextElement = {
        id: `text_${Date.now()}`,
        type: 'text',
        text: '',
        x: pt.x,
        y: pt.y,
        fontSize: 36,
        fontFamily: textFontFamily,
        color: currentColor === '#ffffff' && background === 'white' ? '#000000' : currentColor,
        isBold: isTextBold,
        isItalic: isTextItalic,
        align: 'right',
      };
      setEditingTextElement(newTextEl);
      setTextInputVal('');
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCanvasCoords(e);

    if (currentTool === 'laser') {
      laserPointsRef.current.push({ x: pt.x, y: pt.y, time: Date.now() });
      return;
    }

    if (!isDrawingRef.current) return;

    if (currentTool === 'select' && isDraggingElement && selectedElementId) {
      // Move selected element
      const updated = elements.map((el) => {
        if (el.id === selectedElementId) {
          if (el.type === 'stroke') {
            const dx = pt.x - startPointRef.current!.x;
            const dy = pt.y - startPointRef.current!.y;
            return {
              ...el,
              points: el.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
            };
          } else {
            return {
              ...el,
              x: pt.x - dragOffsetRef.current.x,
              y: pt.y - dragOffsetRef.current.y,
            };
          }
        }
        return el;
      });
      startPointRef.current = pt;
      onUpdateElements(updated);
      return;
    }

    if (currentTool === 'eraser') {
      const remaining = elements.filter((el) => {
        const b = getElementBounds(el);
        const collides = pt.x >= b.x - 20 && pt.x <= b.x + b.width + 20 && pt.y >= b.y - 20 && pt.y <= b.y + b.height + 20;
        return !collides;
      });
      if (remaining.length !== elements.length) {
        onUpdateElements(remaining);
      }
      return;
    }

    if (currentStrokeRef.current) {
      currentStrokeRef.current.points.push(pt);
      drawCanvas();
      return;
    }

    if (currentShapePreviewRef.current && startPointRef.current) {
      currentShapePreviewRef.current.width = pt.x - startPointRef.current.x;
      currentShapePreviewRef.current.height = pt.y - startPointRef.current.y;
      drawCanvas();
      return;
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    setIsDraggingElement(false);

    if (currentStrokeRef.current) {
      onUpdateElements([...elements, currentStrokeRef.current]);
      currentStrokeRef.current = null;
    }

    if (currentShapePreviewRef.current) {
      const shape = currentShapePreviewRef.current;
      if (Math.abs(shape.width) > 5 || Math.abs(shape.height) > 5) {
        onUpdateElements([...elements, shape]);
      }
      currentShapePreviewRef.current = null;
    }

    drawCanvas();
  };

  // Text submit handler
  const handleSaveText = () => {
    if (!editingTextElement || !textInputVal.trim()) {
      setEditingTextElement(null);
      return;
    }

    const finalized: TextElement = {
      ...editingTextElement,
      text: textInputVal.trim(),
      fontFamily: textFontFamily,
      fontSize: textFontSize,
      isBold: isTextBold,
      isItalic: isTextItalic,
    };

    onUpdateElements([...elements, finalized]);
    setEditingTextElement(null);
    setTextInputVal('');
  };

  const handleInsertHarakat = (haraka: string) => {
    setTextInputVal((prev) => prev + haraka);
  };

  const handleDeleteSelected = () => {
    if (!selectedElementId) return;
    onUpdateElements(elements.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[650px] sm:h-[750px] lg:h-[820px] rounded-3xl overflow-hidden shadow-inner border border-slate-300 touch-none flex items-center justify-center bg-slate-200"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full cursor-${
          currentTool === 'laser'
            ? 'crosshair'
            : currentTool === 'pen' || currentTool === 'highlighter'
            ? 'crosshair'
            : currentTool === 'eraser'
            ? 'cell'
            : currentTool === 'text'
            ? 'text'
            : currentTool === 'select'
            ? 'default'
            : 'crosshair'
        }`}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
      />

      {/* Selected Element Quick Floating Actions */}
      {selectedElementId && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in">
          <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
            <Move className="w-3.5 h-3.5" />
            عنصر محدد
          </span>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
          <button
            onClick={() => setSelectedElementId(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Text Modal / Floating Editor */}
      {editingTextElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 max-w-lg w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-800 text-sm">✍️ كتابة نص عربي على السبورة</h4>
              <button
                onClick={() => setEditingTextElement(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formatting Tools */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={textFontFamily}
                onChange={(e) => setTextFontFamily(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700"
              >
                {ARABIC_FONTS.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTextFontSize(Math.max(18, textFontSize - 4))}
                  className="px-2 py-0.5 bg-white text-slate-700 rounded text-xs font-bold"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold px-1">{textFontSize}px</span>
                <button
                  type="button"
                  onClick={() => setTextFontSize(Math.min(96, textFontSize + 4))}
                  className="px-2 py-0.5 bg-white text-slate-700 rounded text-xs font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsTextBold(!isTextBold)}
                className={`p-2 rounded-xl text-xs font-bold border ${
                  isTextBold ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-slate-50 text-slate-600'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsTextItalic(!isTextItalic)}
                className={`p-2 rounded-xl text-xs font-bold border ${
                  isTextItalic ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-slate-50 text-slate-600'
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Arabic Harakat Keyboard */}
            <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-200/80">
              <div className="text-[11px] font-bold text-emerald-900 mb-1.5">لوحة التشكيل السريع بنقرة واحدة:</div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_HARAKAT.map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => handleInsertHarakat(h.symbol)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg text-sm font-black border border-emerald-200 shadow-2xs transition-transform active:scale-95"
                    title={h.label}
                  >
                    {h.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Input Area */}
            <textarea
              rows={4}
              value={textInputVal}
              onChange={(e) => setTextInputVal(e.target.value)}
              placeholder="اكتب النص هنا (يدعم الأسطر المتعددة والتشكيل الكامل)..."
              dir="rtl"
              style={{
                fontFamily: textFontFamily,
                fontSize: `${Math.min(24, textFontSize)}px`,
                fontWeight: isTextBold ? 'bold' : 'normal',
                fontStyle: isTextItalic ? 'italic' : 'normal',
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
              autoFocus
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTextElement(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveText}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>إدراج في السبورة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
