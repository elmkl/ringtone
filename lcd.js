const canvas = document.getElementById('lcd');
const ctx = canvas.getContext('2d');
const W = 84;
const H = 48;
const BG = '#8b956d';
const PX = '#2d3314';

// 5-pixel-tall glyph definitions [x, y] offsets
const FONT = {
  R: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[2,3],[3,4]],
  I: [[0,0],[0,1],[0,2],[0,3],[0,4]],
  N: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,1],[2,2],[3,3],[4,0],[4,1],[4,2],[4,3],[4,4]],
  G: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[1,4],[2,4],[3,4],[3,2],[3,3],[2,2]],
  T: [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[2,2],[2,3],[2,4]],
  O: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[1,4],[2,4],[3,4],[4,0],[4,1],[4,2],[4,3],[4,4]],
  E: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[1,2],[2,2],[1,4],[2,4],[3,4]],
  S: [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[1,2],[2,2],[3,2],[3,3],[0,4],[1,4],[2,4],[3,4]],
  C: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[1,4],[2,4],[3,0],[3,4]],
  D: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,1],[3,2],[3,3],[2,4],[1,4]],
  A: [[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[3,4],[1,2],[2,2]],
  B: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[2,1],[2,2],[1,2],[1,4],[2,4],[3,1],[3,3],[3,4]],
  V: [[0,0],[0,1],[0,2],[4,0],[4,1],[4,2],[1,3],[3,3],[2,4]],
  L: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4]],
  1: [[1,0],[0,1],[1,1],[1,2],[1,3],[1,4],[0,4],[2,4]],
  ' ': [],
};

const CHAR_WIDTHS = { I: 1, L: 4, V: 5, 1: 3, ' ': 3 };
const DEFAULT_WIDTH = 5;
const SPACING = 1;

function drawText(str, ox, oy) {
  let x = ox;
  for (const ch of str) {
    const glyph = FONT[ch];
    if (glyph) {
      glyph.forEach(([dx, dy]) => ctx.fillRect(x + dx, oy + dy, 1, 1));
    }
    x += (CHAR_WIDTHS[ch] || DEFAULT_WIDTH) + SPACING;
  }
}

function drawLine(x1, x2, y) {
  for (let x = x1; x < x2; x++) {
    ctx.fillRect(x, y, 1, 1);
  }
}

function render(frame) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = PX;

  drawText('RINGTONE', 4, 3);
  drawLine(4, 80, 10);
  drawText('CODE A BEAT', 4, 14);
  drawLine(4, 80, 21);
  drawText('GET A CASSETTE', 1, 24);

  // animated waveform — cycles through wave shapes
  const t = frame * 0.03;
  const cycleDuration = 180; // ~3 seconds per shape at 60fps
  const shapes = ['sine', 'square', 'sawtooth', 'triangle'];
  const shapeIndex = Math.floor(frame / cycleDuration) % shapes.length;
  const shape = shapes[shapeIndex];

  for (let i = 0; i < 38; i++) {
    const x = 4 + i * 2;
    const phase = t + i * 0.25;
    let h;

    switch (shape) {
      case 'sine':
        h = Math.floor(Math.abs(Math.sin(phase)) * 15) + 1;
        break;
      case 'square':
        // show actual square wave shape: alternating tall/short
        h = Math.sin(phase) > 0 ? 15 : 3;
        break;
      case 'sawtooth':
        h = Math.floor(((phase % (Math.PI * 2)) / (Math.PI * 2)) * 15) + 1;
        break;
      case 'triangle':
        h = Math.floor(Math.abs(Math.asin(Math.sin(phase)) * (2 / Math.PI)) * 15) + 1;
        break;
    }

    for (let y = 0; y < h; y++) {
      ctx.fillRect(x, 47 - y, 1, 1);
    }
  }

  requestAnimationFrame(() => render(frame + 1));
}

render(0);