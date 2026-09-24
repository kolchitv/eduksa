export type ToolType = 
  | 'select'
  | 'pen'
  | 'highlighter'
  | 'eraser'
  | 'shape'
  | 'text'
  | 'laser'
  | 'sticker';

export type ShapeType = 
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'double_arrow'
  | 'star'
  | 'triangle'
  | 'speech_bubble'
  | 'cloud';

export type BoardBackgroundType = 
  | 'white'
  | 'chalkboard'
  | 'dark'
  | 'arabic_ruled'    // أسطر كراس عربي للخط (سطر أساس + سطر قمة + سطر قاع)
  | 'math_grid'       // شبكة مربعات رياضيات
  | 'dot_grid'        // شبكة نقاط
  | 'english_ruled'   // 4 أسطر إنجليزي
  | 'warm_sepia';     // ورق عاجي مريح للعين

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface StrokeElement {
  id: string;
  type: 'stroke';
  tool: 'pen' | 'highlighter';
  points: Point[];
  color: string;
  size: number;
  opacity: number;
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
}

export interface TextElement {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  align: 'right' | 'center' | 'left';
  backgroundColor?: string;
  hasBorder?: boolean;
}

export interface StickerElement {
  id: string;
  type: 'sticker';
  stickerType: 'emoji' | 'stamp' | 'image' | 'badge';
  content: string; // emoji char, stamp text or base64/url
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  category?: string;
  label?: string;
}

export type CanvasElement = StrokeElement | ShapeElement | TextElement | StickerElement;

export interface WhiteboardPage {
  id: string;
  title: string;
  background: BoardBackgroundType;
  elements: CanvasElement[];
}

export interface WhiteboardFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface WhiteboardProject {
  id: string;
  title: string;
  folderId: string;
  subject: string;
  updatedAt: number;
  createdAt: number;
  pages: WhiteboardPage[];
  currentPageIndex: number;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  stars: number;
  avatar?: string;
}
