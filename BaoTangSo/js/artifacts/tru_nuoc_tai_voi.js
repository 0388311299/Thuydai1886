/* Trụ nước uống tại vòi SAWACO — dựng lại từ mã Blender build_fountain.py trong repo
   (thư mục Tru_nuoc_tai_voi_20261016). Trục đứng là Y, mặt cỏ y = 0, mặt đá y = +0,25.
   Thân trụ lệch +200 mm so với tâm bệ, đúng như bản vẽ. Mặt trước quay về +Z.     */
import * as THREE from 'three';
import { MATS, cyl, box, ball, lathe, tube, seg, rod, compiler } from './kit.js';

const CX = 0.2, Z0 = 0.25, H = 1.1, RT = 0.225, RB = 0.16, TOP = Z0 + H;
const FZ = -0.154;                       // vòi nằm ở mép sau chậu
const radiusAt = z => RB + (RT - RB) * (z - Z0) / H;

export function buildTruNuocTaiVoi() {
  const root = new THREE.Group();
  const C = compiler(root);

  const inox = MATS.inox(); inox.side = THREE.DoubleSide;
  const inox2 = MATS.inox(); inox2.side = THREE.DoubleSide;
  const crom = MATS.crom();
  const dark = MATS.caoSu();

  /* ------------------------------- thân côn inox H1100 · D450/D320 · tôn 1,5 */
  {
    const g = C.add('than_tru', [0, 0.08, 0]);
    g.add(lathe([[RB, Z0], [RT, TOP], [RT - .0015, TOP], [RB - .0015, Z0], [RB, Z0]],
      inox, [CX, 0, 0], 72));
    g.add(lathe([[.1605, Z0], [.1605, Z0 + .008], [.159, Z0 + .009]], crom, [CX, 0, 0], 72));
  }

  /* ----------------------------------- chậu thu nước, viền cuốn, lỗ thoát */
  {
    const g = C.add('chau', [0, 0.52, 0]);
    g.add(lathe([
      [.2245, TOP - .002], [.225, TOP], [.2235, TOP + .0015], [.220, TOP + .002],
      [.216, TOP], [.212, TOP - .004], [.202, TOP - .009], [.184, TOP - .019],
      [.16, TOP - .033], [.13, TOP - .049], [.10, TOP - .061], [.07, TOP - .069],
      [.025, TOP - .075], [.022, TOP - .078]
    ], inox2, [CX, 0, 0], 72));
    g.add(lathe([[.222, TOP - .004], [.2255, TOP - .001], [.2255, TOP + .001],
      [.223, TOP + .003], [.22, TOP + .001]], crom, [CX, 0, 0], 72));
    g.add(cyl(.021, .021, .004, dark, [CX, TOP - .079, 0], null, 28));
    g.add(lathe([[.022, TOP - .077], [.024, TOP - .074], [.027, TOP - .074], [.027, TOP - .076]],
      crom, [CX, 0, 0], 40));
    for (let i = 0; i < 4; i++) {                       // lưới chắn rác
      const x = (i - 1.5) * .009;
      const ln = 2 * Math.sqrt(Math.max(.021 * .021 - x * x, 0));
      g.add(box(.0018, .0012, ln, crom, [CX + x, TOP - .075, 0]));
    }
  }

  /* ------------------------------------------------------- vòi bấm chrome */
  {
    const g = C.add('voi_bam', [0, 0.8, -0.4]);
    g.add(cyl(.023, .023, .003, dark, [CX, TOP + .001, FZ], null, 28));
    g.add(lathe([
      [.023, TOP + .002], [.023, TOP + .005], [.019, TOP + .009], [.012, TOP + .015],
      [.011, TOP + .030], [.014, TOP + .045], [.018, TOP + .054], [.018, TOP + .065],
      [.015, TOP + .074], [.010, TOP + .078]
    ], crom, [CX, 0, FZ], 48));
    const head = ball(1, crom, [CX, TOP + .067, FZ + .005], 20);
    head.scale.set(.018, .021, .018);
    g.add(head);
    g.add(seg([CX, TOP + .067, FZ + .015], [CX, TOP + .079, FZ + .026], .007, crom, 16));
    g.add(seg([CX, TOP + .080, FZ + .027], [CX, TOP + .081, FZ + .028], .003, dark, 10));
    g.add(seg([CX, TOP + .055, FZ - .014], [CX, TOP + .055, FZ - .024], .009, crom, 16));
    for (const dz of [.012, .017]) {
      g.add(lathe([[.012, TOP + dz], [.013, TOP + dz + .001], [.012, TOP + dz + .002]],
        crom, [CX, 0, FZ], 32));
    }
  }

  /* --------------------------------- nhận diện SAWACO in trên mặt côn trước */
  {
    const g = C.add('nhan_dien', [0, 0.2, 0.7]);
    g.add(decal());
  }

  /* ----------------------------------------- bệ đá theo bản vẽ phê duyệt */
  {
    const g = C.add('be_da', [0, -0.85, 0]);
    g.add(box(1, .15, 1, MATS.beTong(), [0, .135, 0]));
    g.add(box(1, .02, 1, MATS.vua(), [0, .22, 0]));
    g.add(box(1.04, .02, 1.08, MATS.granit(), [0, .24, 0]));
    g.add(box(1.04, .25, .02, MATS.granit(), [0, .105, .53]));
    for (const x of [-.51, .51]) g.add(box(.02, .25, 1.04, MATS.granit(), [x, .105, 0]));
    g.add(box(1, .2, 1, MATS.gach(), [0, -.04, 0]));
    g.add(box(1.1, .1, 1.1, MATS.beTong(), [0, -.19, 0]));
    g.add(cyl(.06, .06, .39, dark, [CX, .055, 0], null, 28));   // lỗ chờ Ø120
  }

  /* ------------------------- cốt thép, neo J M10 (bản vẽ: 8Ø10 mỗi phương) */
  {
    const g = C.add('ket_cau_neo', [0.95, -0.45, 0]);
    const thep = MATS.thepCot();
    for (let i = 0; i < 8; i++) {
      const v = -.475 + i * .95 / 7;
      g.add(seg([-.475, .09, -v], [.475, .09, -v], .005, thep, 8));
      const x = (Math.abs(v - .2) < .06) ? .27 : v;
      g.add(seg([x, .101, -.475], [x, .101, .475], .005, thep, 8));
    }
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2;
      const x = CX + .115 * Math.cos(a), z = -.115 * Math.sin(a);
      rod([[x + .025, .082, z], [x, .082, z], [x, .12, z], [x, .277, z]], .005, thep, g, 8);
      g.add(cyl(.012, .012, .002, crom, [x, .255, z], null, 20));
      g.add(cyl(.009, .009, .009, crom, [x, .262, z], null, 6));
    }
  }

  /* ----------------------------------- tuyến cấp và thoát giấu trong trụ */
  {
    const g = C.add('cap_thoat', [-1.0, -0.15, 0]);
    const capMat = MATS.nhuaCap(), thoatMat = MATS.nhuaThoat(), brass = MATS.dongThau();
    rod([[CX - .03, -.36, 0], [CX - .03, .02, 0], [CX - .07, .08, 0], [CX - .07, .42, 0]],
      .0135, capMat, g, 14);
    rod([[CX, TOP - .082, 0], [CX, 1.02, 0], [CX + .018, .66, -.012], [CX + .02, .18, -.012],
      [CX + .02, -.33, -.012], [CX + .30, -.36, -.012]], .021, thoatMat, g, 16);
    rod([[CX - .07, .72, 0], [CX - .09, .94, -.04], [CX, TOP - .03, FZ]], .006, crom, g, 10);
    rod([[CX - .07, .42, 0], [CX - .13, .49, .03], [CX - .07, .72, 0]], .006, crom, g, 10);
    for (const z of [.44, .70]) {
      g.add(cyl(.016, .016, .038, brass, [CX - .07, z, 0], null, 10));
      g.add(box(.055, .007, .009, capMat, [CX - .04, z + .012, 0]));
    }
  }

  root.userData.ground = 0;         // mặt cỏ
  root.userData.height = 1.67;
  root.userData.groundLine = true;
  return { group: root, comps: C.map };
}

/* Nhãn: logo SAWACO chính thức + hai dòng chữ, uốn theo mặt côn. */
function decal() {
  const W = 0.30, zTop = TOP - 0.065, zBot = TOP - 0.355, Hh = zTop - zBot;
  const nx = 48, ny = 10;
  const pos = [], uv = [], idx = [];
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const u = i / nx, v = j / ny;
      const z = zBot + Hh * v;
      const r = radiusAt(z) + 0.0012;
      const a = (u - 0.5) * W / r;
      pos.push(CX + r * Math.sin(a), z, r * Math.cos(a));
      uv.push(u, v);
    }
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const k = j * (nx + 1) + i;
      idx.push(k, k + nx + 1, k + 1, k + 1, k + nx + 1, k + nx + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  const cv = document.createElement('canvas');
  cv.width = 620; cv.height = Math.round(620 * Hh / W);
  const c = cv.getContext('2d');
  const paint = () => {
    c.clearRect(0, 0, cv.width, cv.height);
    c.fillStyle = '#121416';
    c.textAlign = 'center';
    c.font = '600 34px system-ui, sans-serif';
    c.fillText('NƯỚC UỐNG TRỰC TIẾP', cv.width / 2, cv.height * 0.82);
    c.font = '400 30px system-ui, sans-serif';
    c.fillText('Drinking water', cv.width / 2, cv.height * 0.97);
  };
  paint();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  /* logo chính thức: lấy phần alpha rồi in thành mực đen, đúng như file Blender */
  const img = new Image();
  img.onload = () => {
    const w = cv.width * 0.6, h = w * img.height / img.width;
    const off = document.createElement('canvas');
    off.width = Math.round(w); off.height = Math.round(h);
    const oc = off.getContext('2d');
    oc.drawImage(img, 0, 0, off.width, off.height);
    oc.globalCompositeOperation = 'source-in';
    oc.fillStyle = '#121416';
    oc.fillRect(0, 0, off.width, off.height);
    c.drawImage(off, (cv.width - w) / 2, cv.height * 0.04);
    paint();
    tex.needsUpdate = true;
  };
  img.src = 'assets/logo_sawaco.png';

  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: tex, transparent: true, roughness: .45, metalness: 0, side: THREE.DoubleSide
  }));
}
