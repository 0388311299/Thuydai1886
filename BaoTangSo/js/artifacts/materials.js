/* Vật liệu có bản đồ bề mặt — sinh thẳng bằng canvas, không cần tệp ảnh ngoài.
   Mỗi công thức cho ra: map (màu), rmMap (lục = độ nhám, lam = độ kim loại)
   và normalMap (gồ ghề). Hoạ tiết nối liền mạch khi lặp.                      */
import * as THREE from 'three';

const SIZE = 512;
const cache = new Map();

/* ------------------------------------------------------------------ nhiễu */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* nhiễu giá trị lặp kín: lưới nhỏ nội suy vòng quanh */
function lattice(n, rand) {
  const g = new Float32Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return (x, y) => {
    const fx = x * n, fy = y * n;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0;
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const at = (i, j) => g[((j % n) + n) % n * n + ((i % n) + n) % n];
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  };
}

/* chồng nhiều lớp nhiễu */
function fbm(seed, base = 4, oct = 4) {
  const r = rng(seed);
  const layers = [];
  for (let o = 0; o < oct; o++) layers.push(lattice(base << o, r));
  return (x, y) => {
    let v = 0, amp = 1, sum = 0;
    for (const l of layers) { v += l(x, y) * amp; sum += amp; amp *= 0.5; }
    return v / sum;
  };
}

function canvas(fill) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = SIZE;
  const c = cv.getContext('2d');
  if (fill) { c.fillStyle = fill; c.fillRect(0, 0, SIZE, SIZE); }
  return cv;
}

function texture(cv, repeat, srgb) {
  const t = new THREE.CanvasTexture(cv);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}

/* bản đồ pháp tuyến dựng từ bản đồ độ cao */
function normalMapOf(height, strength) {
  const cv = canvas();
  const c = cv.getContext('2d');
  const img = c.createImageData(SIZE, SIZE);
  const at = (x, y) => height[((y % SIZE) + SIZE) % SIZE * SIZE + ((x % SIZE) + SIZE) % SIZE];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * SIZE + x) * 4;
      img.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = (1 / len) * 0.5 * 255 + 127;
      img.data[i + 3] = 255;
    }
  }
  c.putImageData(img, 0, 0);
  return cv;
}

const mix = (a, b, t) => a + (b - a) * t;
const rgb = (r, g, b) => `rgb(${r | 0},${g | 0},${b | 0})`;

/* --------------------------------------------------------------- công thức */
/* Mỗi công thức trả về { map, rm, normal, repeat, normalScale } */
const RECIPES = {

  /* gang đúc: rỗ khí, gỉ lốm đốm, nhám không đều */
  gang(seed, tint = [92, 88, 83]) {
    const grain = fbm(seed, 8, 4), blot = fbm(seed + 7, 3, 3), pit = fbm(seed + 13, 32, 2);
    const col = canvas(), rm = canvas();
    const ci = col.getContext('2d').createImageData(SIZE, SIZE);
    const ri = rm.getContext('2d').createImageData(SIZE, SIZE);
    const h = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const u = x / SIZE, v = y / SIZE;
      const g = grain(u, v), b = blot(u, v), p = pit(u, v);
      const rust = Math.max(0, b - 0.74) * 1.7;                 // mảng gỉ
      const hole = p < 0.17 ? (0.17 - p) * 2.4 : 0;             // rỗ đúc
      const k = mix(0.82, 1.14, g) - hole * 0.45;
      const i = (y * SIZE + x) * 4;
      ci.data[i]     = mix(tint[0] * k, 132, rust);
      ci.data[i + 1] = mix(tint[1] * k, 74, rust);
      ci.data[i + 2] = mix(tint[2] * k, 44, rust);
      ci.data[i + 3] = 255;
      ri.data[i] = 128;
      ri.data[i + 1] = (mix(0.42, 0.68, g) + rust * 0.25 + hole * 0.3) * 255;   // nhám
      ri.data[i + 2] = (0.78 - rust * 0.55 - hole * 0.2) * 255;                 // kim loại
      ri.data[i + 3] = 255;
      h[y * SIZE + x] = g * 0.55 - hole * 1.5;
    }
    col.getContext('2d').putImageData(ci, 0, 0);
    rm.getContext('2d').putImageData(ri, 0, 0);
    return { map: col, rm, normal: normalMapOf(h, 22), repeat: 1, normalScale: 0.5 };
  },

  /* gang sơn: sơn hơi sần, tróc lộ nền gang và vệt gỉ quanh chỗ tróc */
  son(seed, paint) {
    const orange = fbm(seed, 24, 3), chip = fbm(seed + 3, 3, 3), dirt = fbm(seed + 11, 4, 3);
    const col = canvas(), rm = canvas();
    const ci = col.getContext('2d').createImageData(SIZE, SIZE);
    const ri = rm.getContext('2d').createImageData(SIZE, SIZE);
    const h = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const u = x / SIZE, v = y / SIZE;
      const o = orange(u, v), ch = chip(u, v), d = dirt(u, v);
      const bare = ch > 0.80 ? Math.min(1, (ch - 0.80) * 6) : 0;   // chỗ tróc
      const halo = ch > 0.74 && ch <= 0.80 ? (ch - 0.74) * 11 : 0; // viền gỉ
      const k = mix(0.9, 1.08, o) * mix(1, 0.88, d);
      const i = (y * SIZE + x) * 4;
      let r = paint[0] * k, g = paint[1] * k, b = paint[2] * k;
      r = mix(r, 148, halo * 0.5); g = mix(g, 86, halo * 0.5); b = mix(b, 52, halo * 0.5);
      r = mix(r, 74, bare); g = mix(g, 69, bare); b = mix(b, 64, bare);
      ci.data[i] = r; ci.data[i + 1] = g; ci.data[i + 2] = b; ci.data[i + 3] = 255;
      ri.data[i] = 128;
      ri.data[i + 1] = (mix(0.34, 0.5, o) + bare * 0.32 + halo * 0.2) * 255;
      ri.data[i + 2] = (0.08 + bare * 0.6) * 255;
      ri.data[i + 3] = 255;
      h[y * SIZE + x] = o * 0.25 - bare * 0.9;
    }
    col.getContext('2d').putImageData(ci, 0, 0);
    rm.getContext('2d').putImageData(ri, 0, 0);
    return { map: col, rm, normal: normalMapOf(h, 16), repeat: 1, normalScale: 0.38 };
  },

  /* đồng thau: vết xước tay cầm, mảng gỉ xanh trong khe */
  dong(seed, tint = [184, 146, 74]) {
    const patina = fbm(seed, 5, 3), scratch = fbm(seed + 5, 64, 2), grain = fbm(seed + 9, 16, 3);
    const col = canvas(), rm = canvas();
    const ci = col.getContext('2d').createImageData(SIZE, SIZE);
    const ri = rm.getContext('2d').createImageData(SIZE, SIZE);
    const h = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const u = x / SIZE, v = y / SIZE;
      const p = Math.max(0, patina(u, v) - 0.68) * 1.7, s = scratch(u, v), g = grain(u, v);
      const k = mix(0.88, 1.1, g) * mix(1, 1.06, s);
      const i = (y * SIZE + x) * 4;
      ci.data[i]     = mix(tint[0] * k, 108, p);
      ci.data[i + 1] = mix(tint[1] * k, 142, p);
      ci.data[i + 2] = mix(tint[2] * k, 110, p);
      ci.data[i + 3] = 255;
      ri.data[i] = 128;
      ri.data[i + 1] = (mix(0.18, 0.34, s) + p * 0.42) * 255;
      ri.data[i + 2] = (0.98 - p * 0.72) * 255;
      ri.data[i + 3] = 255;
      h[y * SIZE + x] = s * 0.3 + p * 0.4;
    }
    col.getContext('2d').putImageData(ci, 0, 0);
    rm.getContext('2d').putImageData(ri, 0, 0);
    return { map: col, rm, normal: normalMapOf(h, 12), repeat: 1, normalScale: 0.3 };
  },

  /* thép / inox: xước mảnh theo một phương */
  thep(seed, tint = [182, 187, 192], rough = 0.3) {
    const line = fbm(seed, 96, 2), broad = fbm(seed + 4, 6, 3);
    const col = canvas(), rm = canvas();
    const ci = col.getContext('2d').createImageData(SIZE, SIZE);
    const ri = rm.getContext('2d').createImageData(SIZE, SIZE);
    const h = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const u = x / SIZE, v = y / SIZE;
      const l = line(u * 0.08, v), b = broad(u, v);
      const k = mix(0.9, 1.08, l) * mix(0.96, 1.04, b);
      const i = (y * SIZE + x) * 4;
      ci.data[i] = tint[0] * k; ci.data[i + 1] = tint[1] * k; ci.data[i + 2] = tint[2] * k;
      ci.data[i + 3] = 255;
      ri.data[i] = 128;
      ri.data[i + 1] = (rough + (l - 0.5) * 0.18) * 255;
      ri.data[i + 2] = 240;
      ri.data[i + 3] = 255;
      h[y * SIZE + x] = l * 0.3;
    }
    col.getContext('2d').putImageData(ci, 0, 0);
    rm.getContext('2d').putImageData(ri, 0, 0);
    return { map: col, rm, normal: normalMapOf(h, 9), repeat: 1, normalScale: 0.22 };
  },

  /* đá, bê tông, cao su: hạt thô, không kim loại */
  khoang(seed, tint, grainAmt = 0.18, rough = 0.9, rep = 1) {
    const sp = fbm(seed, 40, 3), broad = fbm(seed + 2, 5, 3);
    const col = canvas(), rm = canvas();
    const ci = col.getContext('2d').createImageData(SIZE, SIZE);
    const ri = rm.getContext('2d').createImageData(SIZE, SIZE);
    const h = new Float32Array(SIZE * SIZE);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      const u = x / SIZE, v = y / SIZE;
      const s = sp(u, v), b = broad(u, v);
      const k = 1 + (s - 0.5) * grainAmt * 2 + (b - 0.5) * grainAmt;
      const i = (y * SIZE + x) * 4;
      ci.data[i] = tint[0] * k; ci.data[i + 1] = tint[1] * k; ci.data[i + 2] = tint[2] * k;
      ci.data[i + 3] = 255;
      ri.data[i] = 128;
      ri.data[i + 1] = (rough + (s - 0.5) * 0.12) * 255;
      ri.data[i + 2] = 4;
      ri.data[i + 3] = 255;
      h[y * SIZE + x] = s;
    }
    col.getContext('2d').putImageData(ci, 0, 0);
    rm.getContext('2d').putImageData(ri, 0, 0);
    return { map: col, rm, normal: normalMapOf(h, 15), repeat: rep, normalScale: 0.45 };
  }
};

/* --------------------------------------------------- dựng vật liệu từ kho */
function build(key, make) {
  if (!cache.has(key)) {
    const r = make();
    cache.set(key, {
      map: texture(r.map, r.repeat, true),
      rm: texture(r.rm, r.repeat, false),
      normal: texture(r.normal, r.repeat, false),
      normalScale: r.normalScale
    });
  }
  return cache.get(key);
}

/* Trả về vật liệu mới (để chọn/làm mờ từng cấu kiện) nhưng dùng chung ảnh bề mặt. */
export function surfaced(key, make, extra = {}) {
  const t = build(key, make);
  const m = new THREE.MeshStandardMaterial({
    map: t.map,
    roughnessMap: t.rm,
    metalnessMap: t.rm,
    normalMap: t.normal,
    normalScale: new THREE.Vector2(t.normalScale, t.normalScale),
    roughness: 1, metalness: 1,
    ...extra
  });
  return m;
}

export const RECIPE = RECIPES;
