/* Bộ dụng cụ dựng hình vật phẩm — vật liệu và khối cơ bản.
   Mỗi cấu kiện là một THREE.Group mang userData.compId + hướng tách (dir).
   Vật liệu luôn tạo mới cho từng cấu kiện để lúc chọn/làm mờ không ảnh hưởng cấu kiện khác. */
import * as THREE from 'three';
import { surfaced, RECIPE as R } from './materials.js';

export function M({ c = 0x8a8580, r = 0.6, m = 0, o = 1, e = null } = {}) {
  const mt = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  if (o < 1) { mt.transparent = true; mt.opacity = o; }
  if (e != null) { mt.emissive = new THREE.Color(e); mt.emissiveIntensity = 1; }
  return mt;
}

/* Bảng vật liệu dùng chung. Mỗi lần gọi cho ra vật liệu mới (để làm mờ riêng
   từng cấu kiện) nhưng dùng chung ảnh bề mặt đã sinh sẵn.                    */
export const MATS = {
  gangXam:   () => surfaced('gang-xam',  () => R.gang(1, [68, 65, 61])),
  gangDen:   () => surfaced('gang-den',  () => R.gang(2, [52, 50, 48])),
  gangDo:    () => surfaced('gang-do',   () => R.son(3, [176, 58, 46])),
  dongThau:  () => surfaced('dong-thau', () => R.dong(4, [186, 148, 76])),
  dongDo:    () => surfaced('dong-do',   () => R.dong(5, [162, 98, 58])),
  inox:      () => surfaced('inox',      () => R.thep(6, [198, 203, 208], 0.22)),
  thep:      () => surfaced('thep',      () => R.thep(7, [150, 154, 158], 0.34)),
  nhomMo:    () => surfaced('nhom-mo',   () => R.thep(8, [168, 172, 176], 0.44)),
  caoSu:     () => surfaced('cao-su',    () => R.khoang(9,  [36, 35, 34], 0.08, 0.95)),
  da:        () => surfaced('da',        () => R.khoang(10, [104, 97, 87], 0.16, 0.93)),
  beTong:    () => surfaced('be-tong',   () => R.khoang(11, [132, 127, 118], 0.12, 0.95))
};

/* Mật độ hoạ tiết theo kích thước thật: một ô hoạ tiết = TILE mét trên mọi khối,
   nếu không thì khối nhỏ bị nén hoạ tiết còn khối tròn xoay nổi vân như gỗ. */
const TILE = 0.22;
function uvm(geo, su, sv) {
  const uv = geo.attributes.uv;
  if (!uv) return geo;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  uv.needsUpdate = true;
  return geo;
}

const put = (mesh, p, rot) => {
  if (p) mesh.position.set(p[0], p[1], p[2]);
  if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
  return mesh;
};

export const cyl = (rTop, rBot, h, mat, p, rot, seg = 40) =>
  put(new THREE.Mesh(uvm(new THREE.CylinderGeometry(rTop, rBot, h, seg),
    Math.PI * (rTop + rBot) / TILE, h / TILE), mat), p, rot);

export const box = (w, h, d, mat, p, rot) =>
  put(new THREE.Mesh(uvm(new THREE.BoxGeometry(w, h, d), w / TILE, h / TILE), mat), p, rot);

export const ball = (r, mat, p, seg = 28) =>
  put(new THREE.Mesh(uvm(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.6)),
    2 * Math.PI * r / TILE, Math.PI * r / TILE), mat), p);

export const ring = (r, tube, mat, p, rot, arc = Math.PI * 2) =>
  put(new THREE.Mesh(uvm(new THREE.TorusGeometry(r, tube, 16, 56, arc),
    arc * r / TILE, 2 * Math.PI * tube / TILE), mat), p, rot);

/* vành bích: đĩa mỏng + vòng bu lông */
export function flange(r, h, mat, p, bolts = 6, boltMat = null) {
  const g = new THREE.Group();
  g.add(cyl(r, r, h, mat, [0, 0, 0]));
  for (let i = 0; i < bolts; i++) {
    const a = (i / bolts) * Math.PI * 2;
    g.add(cyl(0.012, 0.012, h * 1.9, boltMat || mat, [Math.cos(a) * r * 0.78, 0, Math.sin(a) * r * 0.78]));
  }
  if (p) g.position.set(p[0], p[1], p[2]);
  return g;
}

/* khối tròn xoay từ biên dạng [ [r,y], ... ] */
export function lathe(profile, mat, p, seg = 56) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0005), y));
  let len = 0, rMax = 0;
  for (let i = 0; i < pts.length; i++) {
    rMax = Math.max(rMax, pts[i].x);
    if (i) len += pts[i].distanceTo(pts[i - 1]);
  }
  return put(new THREE.Mesh(uvm(new THREE.LatheGeometry(pts, seg),
    2 * Math.PI * rMax / TILE, len / TILE), mat), p);
}

/* tạo khung cấu kiện: trả về hàm add(id, dir) */
export function compiler(root) {
  const map = new Map();
  return {
    add(id, dir) {
      const g = new THREE.Group();
      g.userData.compId = id;
      g.userData.dir = new THREE.Vector3(dir[0], dir[1], dir[2]);
      root.add(g);
      map.set(id, g);
      return g;
    },
    map
  };
}
