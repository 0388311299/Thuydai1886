/* Bảo tàng số trong lòng thủy đài 1886 — điểm khởi động.
   Dựng cảnh, đi lại bằng góc nhìn thứ nhất, nhìn vào vật phẩm rồi mở chế độ xem chi tiết. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { PERIODS, ARTIFACTS } from './data/exhibits.js';
import { buildMuseum, GEO } from './architecture.js';
import { Walker } from './walker.js';
import { Inspector } from './inspector.js';

const $ = s => document.querySelector(s);
const canvas = $('#view');

/* ------------------------------------------------------------- bộ dựng hình */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c0a08);
scene.fog = new THREE.Fog(0x0c0a08, 14, 46);

const pmrem = new THREE.PMREMGenerator(renderer);
const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = env;

const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 120);

scene.add(new THREE.HemisphereLight(0x9fb4d8, 0x2a2219, 0.6));
const shaftLight = new THREE.DirectionalLight(0xffe2b4, 1.1);
shaftLight.position.set(0.4, 9, 0.6);
scene.add(shaftLight);

/* --------------------------------------------------------------- nội dung */
const museum = buildMuseum();
scene.add(museum.group);

const gate = $('#gate');
let everLocked = false;

const walker = new Walker(camera, canvas, { eye: GEO.EYE, bound: GEO.R_HUB + GEO.CORRIDOR + GEO.ROOM_D - 0.8 });
walker.setColliders(museum.colliders);
walker.place(0, 4.6, 0);

const inspector = new Inspector(renderer, env, {
  onClose: () => {
    walker.enabled = true;
    $('#hud').hidden = false;
    if (!everLocked) return;        // nơi không khóa được con trỏ thì đi tiếp luôn
    gate.hidden = false;
    gate.dataset.mode = 'resume';
    $('#gateTitle').textContent = 'Nhấp để tiếp tục tham quan';
    $('#gateSub').textContent = 'Chuột để nhìn · W A S D để đi · E để xem vật phẩm';
  }
});

/* ----------------------------------------------------------------- cổng vào */
gate.addEventListener('click', () => {
  gate.hidden = true;
  walker.enabled = true;
  walker.lock();          // trình duyệt nào chặn khóa con trỏ thì vẫn nhìn được bằng cách kéo chuột
});

walker.onLockChange = locked => {
  if (locked) { everLocked = true; gate.hidden = true; return; }
  if (everLocked && !inspector.active) {
    gate.hidden = false;
    gate.dataset.mode = 'resume';
    $('#gateTitle').textContent = 'Tạm dừng';
    $('#gateSub').textContent = 'Nhấp để tiếp tục · Esc để tạm dừng';
  }
};

/* --------------------------------------------------------------- ngắm chọn */
const ray = new THREE.Raycaster();
ray.far = 4.6;
const fwd = new THREE.Vector3();
let target = null;
let frame = 0;

function aim() {
  walker.forward(fwd);
  ray.set(camera.position, fwd.normalize());
  const hit = ray.intersectObjects(museum.hits, false)[0];
  const next = hit ? hit.object : null;
  if (next === target) return;
  target = next;
  const prompt = $('#prompt');
  $('#cross').classList.toggle('on', !!target);
  if (!target) { prompt.hidden = true; return; }
  const a = ARTIFACTS[target.userData.artId];
  prompt.hidden = false;
  prompt.innerHTML = `<b>${a.name}</b><span>Nhấn <kbd>E</kbd> hoặc bấm chuột để xem chi tiết</span>`;
}

function enter() {
  if (!target || inspector.active) return;
  walker.enabled = false;
  walker.unlock();
  $('#hud').hidden = true;
  gate.hidden = true;
  inspector.open(target.userData.artId);
}

addEventListener('keydown', e => {
  if (inspector.active) return;
  if (e.code === 'KeyE') enter();
  if (e.code === 'KeyM') toggleMap();
});

/* bấm (không phải kéo) vào vật phẩm cũng mở chế độ xem */
let downAt = null;
canvas.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
canvas.addEventListener('pointerup', e => {
  if (inspector.active || gate.hidden === false) { downAt = null; return; }
  if (downAt && Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) < 7) { aim(); enter(); }
  downAt = null;
});

/* --------------------------------------------------------- bản đồ / dịch chuyển */
const map = $('#map');
function toggleMap() { map.hidden = !map.hidden; }
$('#btnMap').onclick = toggleMap;

map.innerHTML = `<div class="hd">Sơ đồ bảo tàng</div>` +
  `<button data-i="-1"><i>◎</i><span><b>Tiền sảnh</b><em>Bồn nước trung tâm</em></span></button>` +
  PERIODS.map((p, i) => {
    const n = p.slots.filter(Boolean).length;
    return `<button data-i="${i}"><i>${p.no}</i><span><b>${p.name}</b>` +
      `<em>${p.years} · ${n}/${p.slots.length} ô có hiện vật</em></span></button>`;
  }).join('') +
  `<p class="hint">Phím <kbd>M</kbd> để mở / đóng</p>`;

map.querySelectorAll('button').forEach(b => b.onclick = () => {
  const i = +b.dataset.i;
  if (i < 0) walker.place(0, 4.6, 0);
  else {
    const r = museum.rooms[i];
    const p = r.door;
    walker.place(p.x, p.z, Math.atan2(-r.U.x, -r.U.z));
  }
  map.hidden = true;
  if (!walker.locked) walker.lock();
});

/* ------------------------------------------------------- gian đang đứng */
const hubR = GEO.R_HUB;
function whereAmI() {
  const p = walker.pos;
  const r = Math.hypot(p.x, p.z);
  if (r < hubR - 0.2) return { no: '◎', name: 'Tiền sảnh', years: 'Thủy đài 1886' };
  let best = null, bd = 9e9;
  for (const rm of museum.rooms) {
    const d = Math.hypot(p.x - rm.center.x, p.z - rm.center.z);
    if (d < bd) { bd = d; best = rm; }
  }
  return best ? { no: best.period.no, name: best.period.name, years: best.period.years } : null;
}

let whereKey = '';
function paintWhere() {
  const w = whereAmI(); if (!w) return;
  const k = w.no + w.name;
  if (k === whereKey) return;
  whereKey = k;
  $('#where').innerHTML = `<i>${w.no}</i><span><b>${w.name}</b><em>${w.years}</em></span>`;
}

/* ---------------------------------------------------------------- vòng lặp */
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  inspector.resize(w, h);
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (inspector.active) {
    inspector.update(dt);
    inspector.render();
  } else {
    walker.update(dt);
    aim();
    if ((frame++ % 10) === 0) paintWhere();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}
$('#loading').classList.add('hide');
tick();

/* cửa sau để gỡ lỗi và dựng cảnh thử từ bảng điều khiển của trình duyệt */
window.BAOTANG = { scene, camera, renderer, walker, inspector, museum, PERIODS, ARTIFACTS };
