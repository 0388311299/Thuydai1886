/* Bộ dụng cụ dựng hình vật phẩm — vật liệu và khối cơ bản.
   Mỗi cấu kiện là một THREE.Group mang userData.compId + hướng tách (dir).
   Vật liệu luôn tạo mới cho từng cấu kiện để lúc chọn/làm mờ không ảnh hưởng cấu kiện khác. */
import * as THREE from 'three';

export function M({ c = 0x8a8580, r = 0.6, m = 0, o = 1, e = null } = {}) {
  const mt = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  if (o < 1) { mt.transparent = true; mt.opacity = o; }
  if (e != null) { mt.emissive = new THREE.Color(e); mt.emissiveIntensity = 1; }
  return mt;
}

/* bảng màu vật liệu dùng chung cho mọi vật phẩm */
export const MATS = {
  gangXam:   () => M({ c: 0x5a5651, r: .5,  m: .6  }),
  gangDo:    () => M({ c: 0xb23a2e, r: .48, m: .3  }),
  gangDen:   () => M({ c: 0x45423f, r: .5,  m: .55 }),
  dongThau:  () => M({ c: 0xb08b45, r: .35, m: .95 }),
  dongDo:    () => M({ c: 0x96572f, r: .4,  m: .9  }),
  inox:      () => M({ c: 0xc2c7cb, r: .25, m: 1   }),
  thep:      () => M({ c: 0x6e7074, r: .4,  m: .9  }),
  caoSu:     () => M({ c: 0x1d1c1b, r: .95, m: 0   }),
  da:        () => M({ c: 0x665f56, r: .95, m: 0   }),
  beTong:    () => M({ c: 0x7e786f, r: .95, m: 0   }),
  nhomMo:    () => M({ c: 0x9ca0a4, r: .45, m: .75 })
};

const put = (mesh, p, rot) => {
  if (p) mesh.position.set(p[0], p[1], p[2]);
  if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
  return mesh;
};

export const cyl = (rTop, rBot, h, mat, p, rot, seg = 28) =>
  put(new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat), p, rot);

export const box = (w, h, d, mat, p, rot) =>
  put(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat), p, rot);

export const ball = (r, mat, p, seg = 20) =>
  put(new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg * 0.6), mat), p);

export const ring = (r, tube, mat, p, rot, arc = Math.PI * 2) =>
  put(new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 40, arc), mat), p, rot);

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
export function lathe(profile, mat, p, seg = 32) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0005), y));
  return put(new THREE.Mesh(new THREE.LatheGeometry(pts, seg), mat), p);
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
