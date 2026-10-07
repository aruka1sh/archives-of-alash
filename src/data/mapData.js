export const MAP_WIDTH = 1600;
export const MAP_HEIGHT = 1200;

export const PLAYER_START = { x: 800, y: 600 };

export const BUILDINGS = [
  {
    id: 'elder_house',
    x: 200,
    y: 150,
    w: 130,
    h: 110,
    type: 'yurt',
    label: "Elder's House",
    color: 0xC4A46C
  },
  {
    id: 'archive',
    x: 1280,
    y: 130,
    w: 150,
    h: 130,
    type: 'brick',
    label: 'Archive',
    color: 0xA0896C
  },
  {
    id: 'teacher_house',
    x: 180,
    y: 880,
    w: 130,
    h: 110,
    type: 'wooden',
    label: "Teacher's House",
    color: 0x9B8B75
  },
  {
    id: 'house_1',
    x: 700,
    y: 100,
    w: 100,
    h: 85,
    type: 'wooden',
    color: 0xA09080
  },
  {
    id: 'house_2',
    x: 1100,
    y: 850,
    w: 100,
    h: 85,
    type: 'wooden',
    color: 0xA09080
  },
  {
    id: 'house_3',
    x: 380,
    y: 720,
    w: 90,
    h: 75,
    type: 'yurt',
    color: 0xB89870
  },
  {
    id: 'house_4',
    x: 900,
    y: 930,
    w: 100,
    h: 85,
    type: 'wooden',
    color: 0xA09080
  },
  {
    id: 'house_5',
    x: 1380,
    y: 500,
    w: 90,
    h: 75,
    type: 'yurt',
    color: 0xB89870
  },
  {
    id: 'house_6',
    x: 600,
    y: 550,
    w: 95,
    h: 80,
    type: 'wooden',
    color: 0xA09080
  }
];

export const TREES = [
  { x: 50, y: 50 },
  { x: 120, y: 45 },
  { x: 420, y: 55 },
  { x: 560, y: 40 },
  { x: 640, y: 380 },
  { x: 540, y: 400 },
  { x: 100, y: 480 },
  { x: 80, y: 540 },
  { x: 1400, y: 680 },
  { x: 1460, y: 720 },
  { x: 750, y: 600 },
  { x: 1550, y: 60 },
  { x: 1520, y: 120 },
  { x: 1100, y: 380 },
  { x: 1140, y: 400 },
  { x: 50, y: 1000 },
  { x: 100, y: 1050 },
  { x: 800, y: 820 },
  { x: 840, y: 800 },
  { x: 1450, y: 300 },
  { x: 1480, y: 340 },
  { x: 60, y: 300 },
  { x: 400, y: 200 }
];

export const NPCS = [
  {
    id: 'elder',
    x: 340,
    y: 280,
    texture: 'npc_elder',
    name: 'Village Elder',
    dialogKey: 'elder'
  },
  {
    id: 'teacher',
    x: 340,
    y: 1000,
    texture: 'npc_teacher',
    name: 'Teacher',
    dialogKey: 'teacher'
  },
  {
    id: 'archivist',
    x: 1400,
    y: 280,
    texture: 'npc_archivist',
    name: 'Archivist',
    dialogKey: 'archivist'
  }
];

export const FRAGMENTS = [
  { id: 'fragment_1', x: 580, y: 430 },
  { id: 'fragment_2', x: 1050, y: 650 },
  { id: 'fragment_3', x: 700, y: 220 }
];

export const DECORATIONS = [
  { type: 'fence_h', x: 260, y: 420, w: 200 },
  { type: 'fence_h', x: 900, y: 500, w: 150 },
  { type: 'fence_v', x: 480, y: 600, h: 120 },
  { type: 'well', x: 750, y: 680 },
  { type: 'cart', x: 1100, y: 550 },
  { type: 'stones', x: 500, y: 350 }
];