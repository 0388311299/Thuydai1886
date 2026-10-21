/* Kiến trúc bên trong bảo tàng — tiền sảnh tròn + 5 gian theo thời kỳ.
   Bố cục này độc lập với kết cấu thật của thủy đài, chỉ mượn tinh thần
   khối tròn + mái nón. Trả về cả danh sách vật cản để đi lại và vùng bấm được. */
import * as THREE from 'three';
import { PERIODS, ARTIFACTS } from './data/exhibits.js';
import { buildArtifact } from './artifacts/index.js';
import { gianSign, exhibitPlate, emptyPlate, introPanel, floorArrow } from './label.js';

export const GEO = {
  R_HUB: 8.5,        // bán kính tiền sảnh
  H_WALL: 5.2,
  DOOR_H: 1.6,       // nửa bề rộng cửa
  CORRIDOR: 1.8,
  ROOM_W: 12, ROOM_D: 12,
  WALL_T: 0.4,
  EYE: 1.62
};
const R0 = GEO.R_HUB + GEO.CORRIDOR;          // mép trước gian
const R1 = R0 + GEO.ROOM_D;                   // mép sau gian

/* --------------------------------------------------------------- vật liệu */
function brickTexture() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 512;
  const c = cv.getContext('2d');
  c.fillStyle = '#41382c'; c.fillRect(0, 0, 512, 512);
  const bh = 32, bw = 96;
  for (let r = 0; r * bh < 512; r++) {
    const off = (r % 2) * bw / 2;
    for (let x = -bw; x < 512 + bw; x += bw) {
      const v = 18 + Math.random() * 26;
      c.fillStyle = `rgb(${82 + v},${69 + v * .7},${54 + v * .5})`;
      c.fillRect(x + off + 2, r * bh + 2, bw - 4, bh - 4);
    }
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* co dãn UV của hình hộp để hoạ tiết giữ đúng kích thước thật */
function uvScale(geo, sx, sy) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
  uv.needsUpdate = true;
  return geo;
}

function floorTexture() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 512;
  const c = cv.getContext('2d');
  c.fillStyle = '#2b2721'; c.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {   // hạt đá mài
    const g = 24 + Math.random() * 46;
    c.fillStyle = `rgba(${g + 40},${g + 32},${g + 24},.5)`;
    c.fillRect(Math.random() * 512, Math.random() * 512, 2.4, 2.4);
  }
  c.strokeStyle = '#15120f'; c.lineWidth = 5;
  for (let i = 0; i <= 4; i++) {
    c.beginPath(); c.moveTo(i * 128, 0); c.lineTo(i * 128, 512); c.stroke();
    c.beginPath(); c.moveTo(0, i * 128); c.lineTo(512, i * 128); c.stroke();
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(12, 12);
  return t;
}

/* vệt bóng tiếp đất — một ảnh dùng chung cho mọi bệ */
let shadowTex = null;
function contactShadow() {
  if (!shadowTex) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const c = cv.getContext('2d');
    const g = c.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, 'rgba(0,0,0,.72)');
    g.addColorStop(0.45, 'rgba(0,0,0,.34)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, 128, 128);
    shadowTex = new THREE.CanvasTexture(cv);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.86),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: .9 }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

/* nhãn nhỏ đánh dấu cốt đất trong tủ */
function groundTag() {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 64;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, 256, 64);
  c.fillStyle = '#d8bd88';
  c.font = '600 30px system-ui, sans-serif';
  c.textBaseline = 'middle';
  c.fillText('— CỐT ĐẤT', 6, 34);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.08),
    new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false }));
}

/* --------------------------------------------------------------- dựng cảnh */
export function buildMuseum() {
  const group = new THREE.Group();
  const colliders = [];
  const hits = [];
  const rooms = [];

  const brick = brickTexture();
  const matWall = new THREE.MeshStandardMaterial({ map: brick, color: 0xffffff, roughness: .95 });
  const matWall2 = new THREE.MeshStandardMaterial({ color: 0x2f2a23, roughness: .95 });
  const matStone = new THREE.MeshStandardMaterial({ color: 0x6e665b, roughness: .9 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x17140f, roughness: 1 });

  /* vách: hộp dài theo trục X cục bộ, tự ghi vào danh sách vật cản */
  const wall = (x, z, len, rotY, h = GEO.H_WALL, t = GEO.WALL_T, mat = matWall) => {
    const geo = new THREE.BoxGeometry(len, h, t);
    if (mat.map) uvScale(geo, len / 1.2, h / 1.2);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, h / 2, z); m.rotation.y = rotY;
    group.add(m);
    colliders.push({ x, z, hx: len / 2, hz: t / 2, rot: rotY });
    return m;
  };

  /* ---------------------------------------------------------------- sàn */
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R1 + 2.5, 72),
    new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: .82, metalness: .05 }));
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  /* --------------------------------------------- mái nón trên tiền sảnh */
  const dome = new THREE.Mesh(
    new THREE.ConeGeometry(GEO.R_HUB + 0.25, 3.6, 48, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x241f19, roughness: .95, side: THREE.BackSide }));
  dome.position.y = GEO.H_WALL + 1.8;
  group.add(dome);

  const oculus = new THREE.Mesh(new THREE.CircleGeometry(1.25, 32),
    new THREE.MeshBasicMaterial({ color: 0xffe6bc, toneMapped: false }));
  oculus.rotation.x = Math.PI / 2;
  oculus.position.y = GEO.H_WALL + 3.58;
  group.add(oculus);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 3.4, GEO.H_WALL + 3.4, 28, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffd9a0, transparent: true, opacity: .055,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
    }));
  shaft.position.y = (GEO.H_WALL + 3.4) / 2;
  group.add(shaft);

  /* --------------------------------------------------- bồn nước giữa sảnh */
  const basin = new THREE.Group();
  basin.add(new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.95, 0.42, 40), matStone));
  const water = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40),
    new THREE.MeshStandardMaterial({ color: 0x16313a, roughness: .06, metalness: .9 }));
  water.rotation.x = -Math.PI / 2; water.position.y = 0.23;
  basin.add(water);
  basin.position.y = 0.21;
  group.add(basin);
  colliders.push({ x: 0, z: 0, hx: 1.95, hz: 1.95, rot: 0, round: true, r: 1.95 });

  /* -------------------------------------------- vách tiền sảnh + 5 cửa gian */
  const N = PERIODS.length;
  const dHalfAng = Math.asin(GEO.DOOR_H / GEO.R_HUB);
  const angleOf = i => -Math.PI / 2 + i * (Math.PI * 2 / N);

  for (let i = 0; i < N; i++) {
    const a0 = angleOf(i) + dHalfAng;
    const a1 = angleOf((i + 1) % N) - dHalfAng + (i === N - 1 ? Math.PI * 2 : 0);
    const span = a1 - a0;
    const n = Math.max(2, Math.round(span / 0.14));
    const step = span / n;
    for (let k = 0; k < n; k++) {
      const m = a0 + step * (k + 0.5);
      const chord = 2 * GEO.R_HUB * Math.sin(step / 2) + 0.06;
      wall(Math.cos(m) * GEO.R_HUB, Math.sin(m) * GEO.R_HUB, chord, -m - Math.PI / 2);
    }
  }

  /* --------------------------------------------------------- từng gian */
  PERIODS.forEach((p, i) => {
    const a = angleOf(i);
    const U = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));   // hướng ra xa tâm
    const V = new THREE.Vector3(-Math.sin(a), 0, Math.cos(a));  // hướng ngang gian
    const at = (s, t, y = 0) => new THREE.Vector3(U.x * s + V.x * t, y, U.z * s + V.z * t);
    const rotTan = -a - Math.PI / 2;   // vách dài theo phương ngang
    const rotRad = -a;                 // vách dài theo phương xuyên tâm
    const faceV = -a, faceNegV = Math.PI - a, faceNegU = -a - Math.PI / 2, faceU = Math.PI / 2 - a;
    const W = GEO.ROOM_W, D = GEO.ROOM_D, dh = GEO.DOOR_H;

    /* hành lang nối */
    for (const s of [-1, 1]) {
      const pm = at(GEO.R_HUB + GEO.CORRIDOR / 2, s * (dh + GEO.WALL_T / 2));
      wall(pm.x, pm.z, GEO.CORRIDOR + 0.3, rotRad, GEO.H_WALL, GEO.WALL_T, matWall2);
    }

    /* vách trước (chia hai bên cửa) */
    const segLen = W / 2 - dh;
    for (const s of [-1, 1]) {
      const pm = at(R0, s * (dh + segLen / 2));
      wall(pm.x, pm.z, segLen, rotTan);
    }
    /* vách hai bên + vách sau */
    for (const s of [-1, 1]) {
      const pm = at(R0 + D / 2, s * W / 2);
      wall(pm.x, pm.z, D, rotRad);
    }
    const back = at(R1, 0);
    wall(back.x, back.z, W + GEO.WALL_T, rotTan);

    /* trần gian */
    const ceil = new THREE.Mesh(new THREE.BoxGeometry(W + 0.8, 0.3, D + GEO.CORRIDOR + 0.8), matDark);
    const cc = at(R0 + D / 2 - GEO.CORRIDOR / 2, 0);
    ceil.position.set(cc.x, GEO.H_WALL + 0.15, cc.z);
    ceil.rotation.y = rotTan;
    group.add(ceil);

    /* đèn gian */
    const lp = at(R0 + D / 2, 0);
    const lamp = new THREE.PointLight(0xffd9a8, 48, 26, 2);
    lamp.position.set(lp.x, 4.3, lp.z);
    group.add(lamp);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffe9c4, toneMapped: false }));
    bulb.position.copy(lamp.position);
    group.add(bulb);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.3, 18, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x2b2621, roughness: .7, side: THREE.DoubleSide }));
    shade.position.set(lp.x, 4.45, lp.z);
    group.add(shade);


    /* biển tên gian trên cửa (phía tiền sảnh) */
    const sign = gianSign(p);
    const sp = at(GEO.R_HUB - 0.55, 0);
    sign.position.set(sp.x, 3.55, sp.z);
    sign.rotation.y = faceNegU;
    group.add(sign);

    /* chỉ hướng trên sàn */
    const arrowHolder = new THREE.Group();
    arrowHolder.add(floorArrow(p));
    const ap = at(GEO.R_HUB - 2.6, 0);
    arrowHolder.position.set(ap.x, 0.012, ap.z);
    arrowHolder.rotation.y = -a - Math.PI / 2;
    group.add(arrowHolder);

    /* ------------------------------------------------- 6 ô trưng bày / gian */
    const layout = [
      { s: R0 + 3.4, t: -W / 2 + GEO.WALL_T / 2, face: faceV,    nrm: V.clone() },
      { s: R0 + 3.4, t:  W / 2 - GEO.WALL_T / 2, face: faceNegV, nrm: V.clone().negate() },
      { s: R0 + 8.0, t: -W / 2 + GEO.WALL_T / 2, face: faceV,    nrm: V.clone() },
      { s: R0 + 8.0, t:  W / 2 - GEO.WALL_T / 2, face: faceNegV, nrm: V.clone().negate() },
      { s: R1 - GEO.WALL_T / 2, t: -3.3, face: faceNegU, nrm: U.clone().negate() },
      { s: R1 - GEO.WALL_T / 2, t:  3.3, face: faceNegU, nrm: U.clone().negate() }
    ];

    layout.forEach((L, k) => {
      const artId = p.slots[k] || null;
      const base = at(L.s, L.t);
      buildNiche({
        group, hits, colliders, period: p, slot: k + 1, artId,
        base, nrm: L.nrm, face: L.face, matStone, matDark
      });
    });

    rooms.push({ period: p, angle: a, U, V, center: at(R0 + D / 2, 0), door: at(GEO.R_HUB + 0.9, 0) });
  });

  /* ------------------------------------------- bảng dẫn nhập ở tiền sảnh */
  const intro = introPanel([
    'Năm gian, năm thời kỳ. Mỗi ô trưng bày một vật phẩm cấp nước.',
    'Đi bằng W A S D, nhìn bằng chuột. Nhìn vào vật phẩm rồi nhấn E để xem chi tiết, tách cấu kiện.'
  ]);
  const ia = Math.PI / 2;  // vách sau lưng điểm xuất phát
  intro.position.set(Math.cos(ia) * (GEO.R_HUB - 0.6), 2.3, Math.sin(ia) * (GEO.R_HUB - 0.6));
  intro.rotation.y = -ia - Math.PI / 2;
  group.add(intro);

  /* đèn tiền sảnh */
  const hubLight = new THREE.PointLight(0xffe2b4, 70, 30, 2);
  hubLight.position.set(0, 4.6, 0);
  group.add(hubLight);

  return { group, colliders, hits, rooms };
}

/* ------------------------------------------------------------ ô trưng bày */
/* Tủ trưng bày nhô ra khỏi mặt vách: hộp lật mặt trong nên hở phía trước. */
function buildNiche({ group, hits, colliders, period, slot, artId, base, nrm, face, matStone, matDark }) {
  const art = artId ? ARTIFACTS[artId] : null;
  const accent = period.accent;
  const n = nrm.clone().normalize();
  const side = new THREE.Vector3(-n.z, 0, n.x);      // phương ngang dọc mặt vách
  const g = new THREE.Group();
  group.add(g);

  const onFloor = art && art.mount === 'san';     // hiện vật có cả phần móng thì đứng trên sàn tủ
  const W = 2.1, H = 2.5, D = onFloor ? 1.34 : 0.78;
  const P = (d, y, t = 0) => new THREE.Vector3(
    base.x + n.x * d + side.x * t, y, base.z + n.z * d + side.z * t);

  /* thùng tủ */
  const shell = new THREE.Mesh(new THREE.BoxGeometry(W, H, D),
    new THREE.MeshStandardMaterial({ color: 0x14110e, roughness: 1, side: THREE.BackSide }));
  shell.position.copy(P(D / 2, H / 2));
  shell.rotation.y = face;
  g.add(shell);

  /* nền sáng sát vách */
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.12, H - 0.2),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(accent).multiplyScalar(art ? 0.15 : 0.06), toneMapped: false
    }));
  glow.position.copy(P(0.035, H / 2));
  glow.rotation.y = face;
  g.add(glow);

  /* khung miệng tủ */
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a3228, roughness: .85 });
  const bar = (w, h, t, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), frameMat);
    m.position.copy(P(D - 0.04, y, t));
    m.rotation.y = face;
    g.add(m);
  };
  bar(W + 0.16, 0.16, 0, H - 0.08);
  bar(W + 0.16, 0.16, 0, 0.08);
  bar(0.16, H + 0.16, -(W / 2 + 0.08), H / 2);
  bar(0.16, H + 0.16, W / 2 + 0.08, H / 2);

  /* chắn đi xuyên tủ */
  const c0 = P(D / 2, 0);
  colliders.push({ x: c0.x, z: c0.z, hx: W / 2 + 0.1, hz: D / 2 + 0.05, rot: face });

  if (!art) {
    const plate = emptyPlate(slot);
    plate.position.copy(P(0.05, H / 2));
    plate.rotation.y = face;
    g.add(plate);
    return;
  }

  /* bệ đặt vật phẩm — chỉ dùng cho hiện vật nhỏ, đặt trên bệ */
  let standY = 0.015;
  if (!onFloor) {
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.56), matStone);
    ped.position.copy(P(D / 2 + 0.04, 0.475));
    ped.rotation.y = face;
    g.add(ped);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.06, 0.64),
      new THREE.MeshStandardMaterial({ color: 0x2b2621, roughness: .7 }));
    cap.position.copy(P(D / 2 + 0.04, 0.98));
    cap.rotation.y = face;
    g.add(cap);
    standY = 1.01;
  }

  /* vật phẩm — giữ nguyên tỉ lệ thật, đáy đặt đúng mặt đứng */
  const built = buildArtifact(artId);
  let groundY = null;
  if (built) {
    const holder = new THREE.Group();
    holder.add(built.group);
    const bb = new THREE.Box3().setFromObject(built.group);
    const h = bb.max.y - bb.min.y;
    const sc = Math.min(1, (onFloor ? H - 0.3 : 1.3) / h);
    built.group.scale.setScalar(sc);
    built.group.position.y = -bb.min.y * sc;        // đáy về 0
    holder.position.copy(P(D / 2 + (onFloor ? 0 : 0.04), standY));
    holder.rotation.y = face;
    g.add(holder);
    if (built.group.userData.groundLine) groundY = standY + (-bb.min.y) * sc;

    const sh = contactShadow();
    sh.scale.setScalar(onFloor ? 1.5 : 1);
    sh.position.copy(P(D / 2 + (onFloor ? 0 : 0.04), standY + 0.004));
    g.add(sh);
  }

  /* vạch cốt đất cho hiện vật có phần chôn dưới đất */
  if (groundY != null) {
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.3, D - 0.24),
      new THREE.MeshBasicMaterial({
        color: 0x7a6340, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide
      }));
    soil.rotation.set(-Math.PI / 2, 0, 0);
    soil.position.copy(P(D / 2, groundY));
    g.add(soil);
    const tag = groundTag();
    tag.position.copy(P(D - 0.06, groundY + 0.055, -(W / 2) + 0.3));
    tag.rotation.y = face;
    g.add(tag);
  }

  /* bảng tên: trên vách tủ nếu hiện vật đứng sàn, trước bệ nếu đặt trên bệ */
  const plate = exhibitPlate(art, accent);
  if (onFloor) { plate.position.copy(P(0.06, H - 0.42)); plate.rotation.y = face; }
  else { plate.position.copy(P(D / 2 + 0.33, 0.6)); plate.rotation.y = face; }
  g.add(plate);

  /* đèn rọi trong tủ */
  const spot = new THREE.PointLight(
    new THREE.Color(accent).lerp(new THREE.Color(0xffffff), .8), onFloor ? 15 : 6, 8, 2);
  spot.position.copy(P(D / 2, H - 0.35));
  g.add(spot);

  /* vùng bấm được (vô hình nhưng vẫn bắt tia) */
  const hit = new THREE.Mesh(new THREE.BoxGeometry(W, H, D + 0.9),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.position.copy(P(D / 2 + 0.3, H / 2));
  hit.rotation.y = face;
  hit.visible = false;
  hit.userData = { kind: 'exhibit', artId, periodId: period.id, slot };
  g.add(hit);
  hits.push(hit);
}
