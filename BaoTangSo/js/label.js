/* Chữ trong không gian 3D — vẽ bằng canvas rồi dán lên mặt phẳng.
   Dùng MeshBasicMaterial để chữ luôn đọc được trong gian tối.            */
import * as THREE from 'three';

const PPM = 200;   // điểm ảnh trên mỗi mét

function canvasOf(w, h, ppm) {
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * ppm);
  cv.height = Math.round(h * ppm);
  return cv;
}

export function panel(w, h, draw, { transparent = true, side = THREE.FrontSide, ppm = PPM } = {}) {
  const cv = canvasOf(w, h, ppm);
  draw(cv.getContext('2d'), cv.width, cv.height);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent, side, toneMapped: false })
  );
  return mesh;
}

const hex = n => '#' + n.toString(16).padStart(6, '0');

/* chữ co lại cho vừa bề rộng */
function fit(ctx, text, font, max) {
  let size = parseInt(font, 10);
  const rest = font.replace(/^\d+/, '');
  for (; size > 10; size -= 2) {
    ctx.font = size + rest;
    if (ctx.measureText(text).width <= max) break;
  }
  return size + rest;
}

function wrap(ctx, text, max) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ------------------------------------------------- biển tên gian trưng bày */
export function gianSign(p) {
  const w = 4.2, h = 1.15;
  return panel(w, h, (c, W, H) => {
    c.fillStyle = '#17140f'; c.fillRect(0, 0, W, H);
    c.fillStyle = hex(p.accent); c.fillRect(0, 0, W, 10);
    c.fillStyle = hex(p.accent);
    c.font = '700 64px system-ui, sans-serif'; c.textBaseline = 'top';
    const head = 'GIAN ' + p.no;
    c.fillText(head, 40, 48);
    const headW = c.measureText(head).width;
    c.font = '500 44px system-ui, sans-serif'; c.fillStyle = '#a99c8b';
    c.fillText(p.years, 40 + headW + 36, 60);
    c.fillStyle = '#f2ece3';
    c.font = fit(c, p.name, '600 52px system-ui, sans-serif', W - 80);
    c.fillText(p.name, 40, 140);
  }, { transparent: false });
}

/* ----------------------------------------------------- bảng tên vật phẩm */
export function exhibitPlate(art, accent) {
  const w = 0.84, h = 0.34;
  return panel(w, h, (c, W, H) => {
    c.fillStyle = '#100e0c'; c.fillRect(0, 0, W, H);
    c.fillStyle = hex(accent); c.fillRect(0, 0, W * 0.022, H);
    c.textBaseline = 'top';
    const x = W * 0.075;
    c.fillStyle = hex(accent); c.font = `600 ${H * 0.1}px system-ui, sans-serif`;
    c.fillText('HIỆN VẬT SỐ', x, H * 0.1);
    c.fillStyle = '#f2ece3';
    c.font = fit(c, art.name, `650 ${H * 0.235}px system-ui, sans-serif`, W - x * 2);
    c.fillText(art.name, x, H * 0.27);
    c.fillStyle = '#8e8375'; c.font = `400 ${H * 0.115}px system-ui, sans-serif`;
    c.fillText(art.nien, x, H * 0.58);
    c.fillStyle = hex(accent); c.font = `600 ${H * 0.105}px system-ui, sans-serif`;
    c.fillText('NHÌN VÀO  ·  NHẤN  E', x, H * 0.79);
  }, { transparent: false, ppm: 440 });
}

export function emptyPlate(no) {
  const w = 1.0, h = 0.38;
  return panel(w, h, (c, W, H) => {
    c.fillStyle = '#100e0c'; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#332c25'; c.lineWidth = 6; c.strokeRect(10, 10, W - 20, H - 20);
    c.fillStyle = '#6b6154'; c.textBaseline = 'middle'; c.textAlign = 'center';
    c.font = '600 32px system-ui, sans-serif';
    c.fillText('Ô ' + no + ' · chờ hiện vật', W / 2, H / 2);
  }, { transparent: false });
}

/* ------------------------------------------- bảng dẫn nhập ở giữa tiền sảnh */
export function introPanel(lines) {
  const w = 3.4, h = 2.0;
  return panel(w, h, (c, W, H) => {
    c.fillStyle = '#14110e'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#d79a3c'; c.fillRect(0, 0, W, 8);
    c.textBaseline = 'top';
    const x = 46;
    c.fillStyle = '#d79a3c'; c.font = '700 34px system-ui, sans-serif';
    c.fillText('BẢO TÀNG SỐ · THỦY ĐÀI 1886', x, 44);
    c.fillStyle = '#f2ece3'; c.font = '600 50px system-ui, sans-serif';
    c.fillText('Vật phẩm cấp nước', x, 100);
    c.fillText('qua các thời kỳ', x, 158);
    c.fillStyle = '#a99c8b'; c.font = '400 27px system-ui, sans-serif';
    let y = 236;
    for (const l of lines) {
      for (const ln of wrap(c, l, W - x * 2)) { c.fillText(ln, x, y); y += 36; }
      y += 8;
    }
  }, { transparent: false });
}

/* mũi chỉ hướng trên sàn */
export function floorArrow(p) {
  const w = 1.6, h = 0.8;
  const m = panel(w, h, (c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.fillStyle = hex(p.accent); c.globalAlpha = 0.85;
    c.font = '700 52px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('GIAN ' + p.no + '  ▸', W / 2, H / 2);
  });
  m.rotation.x = -Math.PI / 2;
  return m;
}
