import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { PARTS, GROUP_ORDER, GROUP_NAME } from './parts.js';

/* ------------------------------------------------------------------ cảnh */
const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x15120f);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 800);
camera.position.set(40, 26, 44);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotateSpeed = 0.55;

scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x4a3a28, 0.55));
const sun = new THREE.DirectionalLight(0xfff0d8, 2.1);
sun.position.set(34, 48, 26);
scene.add(sun);
const rim = new THREE.DirectionalLight(0x9fc0ff, 0.5);
rim.position.set(-30, 18, -34);
scene.add(rim);

/* ------------------------------------------------------- dữ liệu cấu kiện */
const byBase = new Map();
for (const p of PARTS) byBase.set(p.base, p);
const baseName = n => n.split('.')[0];

const root = new THREE.Group();
scene.add(root);

/* bảng màu vật liệu — GLB không mang được node vật liệu của Blender */
const PALETTE = {
  Da_Hoc:         { c: 0x7e7467, r: .95, m: 0 },
  Vua_Xam:        { c: 0x9d9486, r: .9,  m: 0 },
  Vua_Trong_Kem:  { c: 0x8b8071, r: .95, m: 0 },
  Vua_Trong_Nau:  { c: 0x7d6e5c, r: .95, m: 0 },
  Gach_Nung:      { c: 0xa8604a, r: .85, m: 0 },
  Be_Tong_Ham:    { c: 0x8c8882, r: .9,  m: 0 },
  Tuong_Voi_Vang: { c: 0xd8bd88, r: .88, m: 0 },
  Da_Trang:       { c: 0xe2dccf, r: .7,  m: 0 },
  Long_Trong_Toi: { c: 0x2a2420, r: .95, m: 0 },
  Cua_Go:         { c: 0x6c4626, r: .75, m: 0 },
  Go_Tram:        { c: 0x7b5631, r: .8,  m: 0 },
  Van_San:        { c: 0x8a6239, r: .78, m: 0 },
  Go_Mai_Duoi:    { c: 0x7b5631, r: .8,  m: 0 },
  Sat_Ri_Do:      { c: 0x8e4a33, r: .65, m: .75 },
  Ong_Gang:       { c: 0x4c4a48, r: .5,  m: .9 },
  Thep_Den:       { c: 0x3f4245, r: .45, m: .9 },
  Thep_Tan_Dinh:  { c: 0x6e7074, r: .4,  m: .85 },
  Inox:           { c: 0xc3c8cc, r: .25, m: 1 },
  Kinh:           { c: 0x9fc4cc, r: .08, m: 0, o: .3 },
  Ton_Mai_Song:   { c: 0x8d9196, r: .5,  m: .8 },
  Ton_Mai_Ri:     { c: 0x8a5f46, r: .7,  m: .6 },
  Ong_Xam:        { c: 0x85888c, r: .5,  m: .7 },
  Den_Phat_Sang:  { c: 0xffd9a0, r: .4,  m: 0, e: 0xffc078 },
};
function paint(mt) {
  const p = PALETTE[baseName(mt.name || '')];
  if (!p) return;
  mt.color.setHex(p.c);
  if ('roughness' in mt) mt.roughness = p.r;
  if ('metalness' in mt) mt.metalness = p.m;
  if (p.o != null) { mt.transparent = true; mt.opacity = p.o; }
  if (p.e != null && mt.emissive) { mt.emissive.setHex(p.e); mt.emissiveIntensity = 1; }
}

const items = [];           // {mesh, data, home, dir, center}
const meshOf = new Map();   // base -> nhóm
const pickMap = new Map(); // mesh con -> base
let modelBox = new THREE.Box3(), modelCtr = new THREE.Vector3(), modelR = 20;

/* --------------------------------------------------------------- nạp mô hình */
const loadEl = document.getElementById('loading');
const pctEl = document.getElementById('pct');

/* nạp .glb; nếu máy chủ không phục vụ .glb (vd. artifact) thì dùng bản base64 .json */
async function fetchModel() {
  const show = (got, all) => { if (all) pctEl.textContent = Math.round(got / all * 100) + '%'; };
  const read = async res => {
    const all = +res.headers.get('content-length') || 0;
    if (!res.body) return res.arrayBuffer();
    const rd = res.body.getReader(); const chunks = []; let got = 0;
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      chunks.push(value); got += value.length; show(got, all);
    }
    const buf = new Uint8Array(got); let at = 0;
    for (const c of chunks) { buf.set(c, at); at += c.length; }
    return buf.buffer;
  };
  try {
    const r = await fetch('models/thuy_dai_1886.glb');
    if (!r.ok) throw new Error('404');
    const buf = await read(r);
    if (new TextDecoder().decode(new Uint8Array(buf, 0, 4)) !== 'glTF') throw new Error('không phải glB');
    return buf;
  } catch (e) {
    pctEl.textContent = '0%';
    const j = JSON.parse(new TextDecoder().decode(await read(await fetch('models/thuy_dai_1886.glb.json'))));
    const bin = atob(j.glb); const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8.buffer;
  }
}

fetchModel().then(buf => new GLTFLoader().parse(buf, '', gltf => {
  const meshes = [];
  gltf.scene.updateWorldMatrix(true, true);
  gltf.scene.traverse(o => { if (o.isMesh) meshes.push(o); });

  // cấu kiện nhiều vật liệu bị glTF tách thành "Tên_0", "Tên_1"… -> gom lại một cấu kiện
  const resolve = n => {
    const b = baseName(n);
    if (byBase.has(b)) return b;
    const s = b.replace(/_\d+$/, '');
    return byBase.has(s) ? s : null;
  };
  const bucket = new Map();
  for (const m of meshes) {
    const b = resolve(m.name) || resolve(m.parent?.name || '');
    if (!b) continue;
    (bucket.get(b) || bucket.set(b, []).get(b)).push(m);
  }

  for (const [b, ms] of bucket) {
    const data = byBase.get(b);
    const g = new THREE.Group();
    g.name = b;
    root.add(g);
    for (const m of ms) {
      g.attach(m);
      m.material = Array.isArray(m.material) ? m.material.map(x => x.clone()) : m.material.clone();
      mats(m).forEach(mt => {
        paint(mt);
        mt.userData.o = { op: mt.opacity, tr: mt.transparent, em: mt.emissive?.clone?.() };
      });
      pickMap.set(m, b);
    }
    const box = new THREE.Box3().setFromObject(g);
    const c = box.getCenter(new THREE.Vector3());
    items.push({ mesh: g, parts: ms, data, home: g.position.clone(), center: c, top: box.max.y,
                 size: box.getSize(new THREE.Vector3()).length(), dir: new THREE.Vector3() });
    meshOf.set(b, g);
    modelBox.union(box);
  }
  modelBox.getCenter(modelCtr);
  modelR = Math.max(...modelBox.getSize(new THREE.Vector3()).toArray()) * 0.5;

  // hướng bung: toả ngang khỏi tâm + đẩy lên theo cao độ
  for (const it of items) {
    const h = new THREE.Vector3(it.center.x - modelCtr.x, 0, it.center.z - modelCtr.z);
    // cấu kiện nằm giữa thì toả theo góc của nhóm, để không chồng lên nhau
    if (h.length() < modelR * 0.18) {
      const a = GROUP_ORDER.indexOf(it.data.group) / GROUP_ORDER.length * Math.PI * 2;
      h.set(Math.cos(a), 0, Math.sin(a)).multiplyScalar(modelR * 0.5);
    }
    const up = (it.center.y - modelBox.min.y) / Math.max(1, modelBox.max.y - modelBox.min.y);
    it.dir.copy(h).normalize().multiplyScalar(modelR * 0.9).setY(up * modelR * 1.15);
  }

  buildList();
  fitView();
  loadEl.classList.add('hide');   // giữ phần tử lại để kiểm thử bám được
})).catch(err => {
  loadEl.innerHTML = '<p style="max-width:300px;text-align:center">Không nạp được mô hình <code>models/thuy_dai_1886.glb</code>. Hãy mở trang qua một máy chủ web (không mở trực tiếp bằng file://).</p>';
  console.error(err);
});

const mats = m => Array.isArray(m.material) ? m.material : [m.material];

/* --------------------------------------------------------------- bung / gộp */
let exTarget = 0, exNow = 0;
const exEl = document.getElementById('ex'), exVal = document.getElementById('exVal');

function setEx(v, slider = true, pull = true) {
  exTarget = Math.max(0, Math.min(100, v));
  if (slider) { exEl.value = exTarget; }
  if (pull && items.length) {           // lùi máy quay cho vừa khung khi bung
    const k = exTarget / 100;
    const dist = modelR * (2.5 + 2.3 * k);
    const dir = camera.position.clone().sub(controls.target).normalize();
    const ctr = modelCtr.clone().setY(modelCtr.y + modelR * 0.42 * k);
    tween(controls.target.clone(), ctr, camera.position.clone(), ctr.clone().addScaledVector(dir, dist));
  }
  exEl.style.setProperty('--p', exTarget + '%');
  exVal.textContent = Math.round(exTarget) + '%';
  btnPlay.textContent = exTarget > 50 ? 'Gộp lại' : 'Bung ra';
}
exEl.addEventListener('input', () => setEx(+exEl.value, false, false));
exEl.addEventListener('change', () => setEx(+exEl.value, false, true));

const btnPlay = document.getElementById('btnPlay');
btnPlay.onclick = () => setEx(exTarget > 50 ? 0 : 100);

/* ----------------------------------------------------------- chọn & hiển thị */
let sel = null, selItem = null, hover = null, xray = false;
const itemOf = b => items.find(i => i.data.base === b);
const hidden = new Set();   // nhóm đang ẩn

function applyLook() {
  for (const it of items) {
    const g = it.data.group;
    const on = !hidden.has(g);
    it.mesh.visible = on;
    const isSel = sel === it.data.base;
    const dim = (sel && !isSel) || xray;
    for (const mt of it.parts.flatMap(mats)) {
      const o = mt.userData.o;
      mt.transparent = dim || o.tr;
      mt.opacity = isSel ? 1 : (xray ? 0.17 : (sel ? 0.28 : o.op));
      mt.depthWrite = !(dim && !isSel);
      if (mt.emissive) {
        mt.emissive.copy(o.em || new THREE.Color(0));
        if (isSel) mt.emissive.setRGB(0.42, 0.26, 0.05);
        else if (hover === it.data.base) mt.emissive.setRGB(0.16, 0.12, 0.04);
      }
      mt.needsUpdate = true;
    }
  }
  document.querySelectorAll('#groups li').forEach(li =>
    li.classList.toggle('sel', li.dataset.base === sel));
}

function select(base, focus = false) {
  sel = base;
  selItem = base ? itemOf(base) : null;
  if (base) { showInfo(byBase.get(base)); if (focus) focusPart(base); }
  else { info.classList.add('empty'); infoBody.innerHTML = hintHTML; pin.hidden = true; }
  applyLook();
}

function focusPart(base) {
  const it = itemOf(base); if (!it) return;
  const c = it.center.clone().sub(it.home).add(it.mesh.position);
  const r = Math.max(it.size * 0.6, 2.5);
  tween(controls.target.clone(), c, camera.position.clone(),
    c.clone().add(new THREE.Vector3(1, 0.62, 0.85).normalize().multiplyScalar(r * 2.6)));
}

let tw = null;
function tween(t0, t1, p0, p1) { tw = { t0, t1, p0, p1, k: 0 }; }

function fitView() {
  const r = modelR * 2.5;
  tween(controls.target.clone(), modelCtr.clone(), camera.position.clone(),
    modelCtr.clone().add(new THREE.Vector3(1, 0.55, 1.1).normalize().multiplyScalar(r)));
}

/* --------------------------------------------------------------- bảng info */
const info = document.getElementById('info');
const infoBody = document.getElementById('infoBody');
const hintHTML = infoBody.innerHTML;
document.getElementById('infoClose').onclick = () => select(null);

const nf = (x, d = 0) => x == null ? '—' :
  x.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });

const lvl = z => (z < 0 ? '−' : '+') + nf(Math.abs(z), 2) + ' m';

function massText(p) {
  if (p.kg == null) return '—';
  return p.kg >= 1000 ? `${nf(p.kg / 1000, 1)} tấn` : `${nf(p.kg)} kg`;
}

function showInfo(p) {
  info.classList.remove('empty');
  infoBody.innerHTML = `
    <h2 class="ttl">${p.name}</h2>
    <p class="sub">${GROUP_NAME[p.group] || p.group}</p>
    <div class="year"><b>${p.nien}</b><span>${p.nienNote}</span></div>
    <dl class="rows">
      <div class="row"><dt>Vật liệu</dt><dd><div class="chips">${p.mats.map(m => `<span class="chip">${m}</span>`).join('')}</div></dd></div>
      <div class="row"><dt>Khối lượng</dt><dd><span class="mass">${massText(p)}</span><small>Ước tính: ${p.kgNote}</small></dd></div>
      <div class="row"><dt>Kích thước bao</dt><dd>${nf(p.dim[0], 2)} × ${nf(p.dim[1], 2)} × ${nf(p.dim[2], 2)} m <small>dài × rộng × cao</small></dd></div>
      <div class="row"><dt>Cao độ</dt><dd>${lvl(p.zmin)} → ${lvl(p.zmax)}<small>so với cao độ nền ±0,00</small></dd></div>
      <div class="row"><dt>Thể tích</dt><dd>${nf(p.vol, 2)} m³ <small>khối hình học trong mô hình</small></dd></div>
      <div class="row"><dt>Diện tích mặt</dt><dd>${nf(p.area, 1)} m²</dd></div>
      <div class="row"><dt>Lưới</dt><dd>${nf(p.faces)} mặt</dd></div>
    </dl>
    <div class="act">
      <button class="btn" id="aFocus">Phóng tới</button>
      <button class="btn" id="aOnly">Chỉ xem nhóm này</button>
    </div>
    <p class="note">Số đo lấy trực tiếp từ mô hình <b>thuy_dai_1886.blend</b> — mô hình dựng theo ảnh, lấy người cao 1,70 m làm chuẩn, chưa có bản vẽ đo đạc của SAWACO. Khối lượng là ước tính theo khối hình học hoặc bề dày giả thiết, không phải số liệu hồ sơ.</p>`;
  infoBody.querySelector('#aFocus').onclick = () => focusPart(p.base);
  infoBody.querySelector('#aOnly').onclick = () => {
    const only = hidden.size !== GROUP_ORDER.length - 1 || hidden.has(p.group);
    hidden.clear();
    if (only) GROUP_ORDER.forEach(g => { if (g !== p.group) hidden.add(g); });
    syncGroupUI(); applyLook();
  };
}

/* --------------------------------------------------------------- danh mục */
const groupsEl = document.getElementById('groups');

function buildList() {
  groupsEl.innerHTML = '';
  for (const g of GROUP_ORDER) {
    const ps = PARTS.filter(p => p.group === g);
    if (!ps.length) continue;
    const d = document.createElement('div');
    d.className = 'grp'; d.dataset.g = g;
    d.innerHTML = `<h3>${GROUP_NAME[g] || g}<span class="eye" title="Ẩn / hiện nhóm">◉</span></h3>
      <ul>${ps.map(p => `<li data-base="${p.base}">${p.name}<em>${massText(p)}</em></li>`).join('')}</ul>`;
    d.querySelector('h3').onclick = e => {
      if (e.target.classList.contains('eye')) {
        hidden.has(g) ? hidden.delete(g) : hidden.add(g);
        syncGroupUI(); applyLook();
      } else d.classList.toggle('closed');
    };
    d.querySelectorAll('li').forEach(li => {
      li.onclick = () => { select(li.dataset.base, true); closeList(); };
      li.onmouseenter = () => { hover = li.dataset.base; applyLook(); };
      li.onmouseleave = () => { hover = null; applyLook(); };
    });
    groupsEl.append(d);
  }
}
function syncGroupUI() {
  document.querySelectorAll('.grp').forEach(d => d.classList.toggle('off', hidden.has(d.dataset.g)));
}

document.getElementById('q').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.grp').forEach(d => {
    let n = 0;
    d.querySelectorAll('li').forEach(li => {
      const hit = !q || li.textContent.toLowerCase().includes(q);
      li.style.display = hit ? '' : 'none'; if (hit) n++;
    });
    d.style.display = n ? '' : 'none';
    if (q) d.classList.remove('closed');
  });
});

const listEl = document.getElementById('list');
document.getElementById('btnPanel').onclick = () => listEl.classList.toggle('open');
const closeList = () => { if (innerWidth <= 1100) listEl.classList.remove('open'); };

/* --------------------------------------------------------------- nút công cụ */
const btnXray = document.getElementById('btnXray');
btnXray.onclick = () => { xray = !xray; btnXray.classList.toggle('on', xray); applyLook(); };
const btnSpin = document.getElementById('btnSpin');
btnSpin.onclick = () => { controls.autoRotate = !controls.autoRotate; btnSpin.classList.toggle('on', controls.autoRotate); };
document.getElementById('btnReset').onclick = () => {
  hidden.clear(); syncGroupUI(); xray = false; btnXray.classList.remove('on');
  setEx(0); select(null); fitView();
};

/* --------------------------------------------------------------- chuột / cảm ứng */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const tip = document.getElementById('tip'), pin = document.getElementById('pin');
let down = null;

function pick(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set((ev.clientX - r.left) / r.width * 2 - 1, -(ev.clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(items.filter(i => i.mesh.visible).map(i => i.mesh), true)[0];
  return hit ? (pickMap.get(hit.object) || null) : null;
}
canvas.addEventListener('pointerdown', e => down = { x: e.clientX, y: e.clientY });
canvas.addEventListener('pointerup', e => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  down = null;
  if (moved > 6) return;
  const b = pick(e);
  select(b && b === sel ? null : b);
});
canvas.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  const b = pick(e);
  if (b !== hover) { hover = b; applyLook(); }
  if (b) {
    const r = canvas.getBoundingClientRect();
    tip.hidden = false; tip.textContent = byBase.get(b).name;
    tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top) + 'px';
  } else tip.hidden = true;
});
canvas.addEventListener('pointerleave', () => { tip.hidden = true; hover = null; applyLook(); });
addEventListener('keydown', e => {
  if (e.key === 'Escape') select(null);
  if (e.key === 'e' || e.key === 'E') setEx(exTarget > 50 ? 0 : 100);
});

/* --------------------------------------------------------------- vòng lặp */
const tmp = new THREE.Vector3();
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * renderer.getPixelRatio() || canvas.height !== h * renderer.getPixelRatio()) {
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
}
function loop() {
  requestAnimationFrame(loop);
  resize();

  if (Math.abs(exNow - exTarget) > 0.05) {
    exNow += (exTarget - exNow) * 0.12;
    const k = exNow / 100;
    for (const it of items) it.mesh.position.copy(it.home).addScaledVector(it.dir, k);
  }
  if (tw) {
    tw.k = Math.min(1, tw.k + 0.045);
    const s = tw.k < 0.5 ? 2 * tw.k * tw.k : 1 - 2 * (1 - tw.k) ** 2;
    controls.target.lerpVectors(tw.t0, tw.t1, s);
    camera.position.lerpVectors(tw.p0, tw.p1, s);
    if (tw.k >= 1) tw = null;
  }
  controls.update();

  if (selItem) {
    tmp.copy(selItem.center).sub(selItem.home).add(selItem.mesh.position);
    tmp.y = selItem.top - selItem.home.y + selItem.mesh.position.y;
    tmp.project(camera);
    const r = canvas.getBoundingClientRect();
    pin.hidden = tmp.z > 1;
    pin.style.left = Math.max(70, Math.min(r.width - 70, (tmp.x * 0.5 + 0.5) * r.width)) + 'px';
    pin.style.top = Math.max(34, Math.min(r.height - 10, (-tmp.y * 0.5 + 0.5) * r.height)) + 'px';
    pin.firstElementChild.textContent = byBase.get(sel).name;
  } else pin.hidden = true;

  renderer.render(scene, camera);
}
loop();
setEx(0);

window.__v = { items, pick, select, get sel() { return sel; } };   // móc kiểm thử
