/* Trụ nước chữa cháy Thảo Tín Vũ DN100 — dựng lại từ mã Blender dung_tru_DN100.py
   trong repo (thư mục Tru_Thao_Tin_Vu). Số đo gốc tính bằng mm, ở đây đổi sang mét.
   Trục đứng là Y, cốt đất y = 0; mặt trước (họng lớn) quay về +Z.
   Cấu hình lắp ngắn nhất theo catalogue: h1 = 750 trên đất, h2 = 800 dưới đất.  */
import * as THREE from 'three';
import { MATS, cyl, box, ball, ring, lathe, tube, seg, rod, compiler } from './kit.js';

const mm = v => v / 1000;
/* biên dạng catalogue ghi theo cặp (z, r) tính bằng mm -> [r, y] tính bằng mét */
const prof = pairs => pairs.map(([z, r]) => [mm(r), mm(z)]);

export function buildTruChuaChay() {
  const root = new THREE.Group();
  const C = compiler(root);

  const red = MATS.sonDo(), redB = MATS.sonDo();
  const yellow = MATS.sonVang();
  const blue = MATS.sonXanh(), blueB = MATS.sonXanh();
  const steel = MATS.thep();
  const brass = MATS.dongThau();

  /* bu lông: long đền + đầu lục giác, trục bất kỳ */
  const bolt = (g, at, axis, size, mat) => {
    const a = new THREE.Vector3(axis[0], axis[1], axis[2]).normalize();
    const p = new THREE.Vector3(at[0], at[1], at[2]);
    g.add(seg([p.x, p.y, p.z], [p.x + a.x * mm(2), p.y + a.y * mm(2), p.z + a.z * mm(2)], mm(size * 1.4), mat, 16));
    const h0 = p.clone().addScaledVector(a, mm(2));
    const h1 = p.clone().addScaledVector(a, mm(8));
    g.add(seg([h0.x, h0.y, h0.z], [h1.x, h1.y, h1.z], mm(size), mat, 6));
  };

  /* ---------------------------------------------- 01 thân trụ gang sơn đỏ */
  {
    const g = C.add('than_tru', [0, 0.16, 0]);
    g.add(lathe(prof([
      [0, 148], [25, 148], [33, 144], [38, 134], [55, 134], [65, 128], [105, 125],
      [125, 106], [145, 91], [250, 91], [262, 105], [276, 108], [286, 105],
      [295, 97], [615, 97], [624, 117], [645, 117], [650, 113]
    ]), red, [0, 0, 0], 72));

    /* 07 · gân dọc chân trụ */
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.add(cyl(mm(2.6), mm(2.6), mm(93), redB,
        [Math.cos(a) * mm(93), mm(199.5), Math.sin(a) * mm(93)], null, 8));
    }
    /* 10 · hoa văn vòng chân */
    g.add(ring(mm(136), mm(1.8), redB, [0, mm(48), 0], [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      g.add(ball(mm(4.4), redB, [Math.cos(a) * mm(136), mm(48), Math.sin(a) * mm(136)], 10));
    }
    /* 14–16 · chữ đắp nổi và biểu trưng, đặt ở mặt trước thân */
    g.add(castMark(red.color));
  }

  /* ------------------------------------- 02 mặt bích đế + 08 bu lông đế */
  {
    const g = C.add('bich_de', [0, -0.3, 0]);
    g.add(cyl(mm(164), mm(164), mm(20), MATS.sonDo(), [0, mm(10), 0], null, 64));
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * Math.PI * 2;
      bolt(g, [Math.cos(a) * mm(143), mm(35), Math.sin(a) * mm(143)], [0, 1, 0], 6, steel);
    }
  }

  /* ------------------------- 03–06, 09 nắp đỉnh vàng và đầu vuông vận hành */
  {
    const g = C.add('nap_dinh', [0, 0.72, 0]);
    const capProf = [[645, 116], [656, 116], [665, 105], [678, 96], [695, 84], [712, 62], [724, 35], [727, 22]];
    g.add(lathe(prof(capProf), yellow, [0, 0, 0], 72));

    /* gân toả trên nắp */
    const ribPath = [[660, 109], [679, 98], [697, 85], [713, 63], [724, 35]];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      rod(ribPath.map(([z, r]) => [Math.cos(a) * mm(r), mm(z), Math.sin(a) * mm(r)]),
        mm(2.1), yellow, g, 6);
    }
    /* 04 cổ ty van · 05 đầu vuông (đỉnh đúng cao độ h1 = 750 mm) */
    g.add(cyl(mm(18), mm(18), mm(8), yellow, [0, mm(730), 0], null, 24));
    g.add(box(mm(22), mm(16), mm(22), steel, [0, mm(742), 0]));
    /* 09 bu lông nắp */
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * Math.PI * 2;
      bolt(g, [Math.cos(a) * mm(107), mm(620), Math.sin(a) * mm(107)], [0, -1, 0], 4.5, steel);
    }
  }

  /* ------------------------------------------------ 11–13 các họng chờ */
  const outlet = (g, dir, z, bore, rim, reach) => {
    const d = new THREE.Vector3(dir[0], 0, dir[2]).normalize();
    const u = new THREE.Vector3(-d.z, 0, d.x);              // ngang, vuông góc trục họng
    const at = (a, b, c) => [d.x * mm(a) + u.x * mm(b), mm(z) + mm(c), d.z * mm(a) + u.z * mm(b)];
    const axis = [d.x, 0, d.z];

    const pipe = (ro, ri, a0, a1, mat) => {
      const m = tube(mm(ro), mm(ri), 0, mm(a1 - a0), mat, null, 36);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      m.position.set(...at(a0, 0, 0));
      g.add(m);
    };
    pipe(bore + 10, bore, 70, reach - 20, MATS.sonDo());
    pipe(rim - 3, bore, reach - 25, reach - 7, brass);

    const disc = (r, len, a, mat, radial = 40) => {
      const p0 = at(a - len / 2, 0, 0), p1 = at(a + len / 2, 0, 0);
      g.add(seg(p0, p1, mm(r), mat, radial));
    };
    disc(rim, 20, reach, MATS.sonDo());
    disc(rim * 0.28, 16, reach + 17, MATS.sonDo());
    disc(rim * 0.2, 16, reach + 32, MATS.sonDo(), 6);

    /* gân toả trên mặt nắp */
    for (let j = 0; j < 20; j++) {
      const a = (j / 20) * Math.PI * 2;
      const r1 = rim * 0.34, r2 = rim * 0.86;
      g.add(seg(at(reach + 10, r1 * Math.cos(a), r1 * Math.sin(a)),
                at(reach + 10, r2 * Math.cos(a + 0.05), r2 * Math.sin(a + 0.05)),
                mm(1.6), MATS.sonDo(), 5));
    }
    /* tay giữ nắp hình chữ U và chốt bản lề */
    const arm = [[reach + 38, -12, 12], [reach + 39, -12, -rim * 0.9], [reach + 27, -12, -rim - 17],
                 [reach - 18, -12, -rim - 17], [reach - 28, -12, -rim - 8]];
    rod(arm.map(p => at(p[0], p[1], p[2])), mm(5), MATS.sonDo(), g, 7);
    rod(arm.map(p => at(p[0], p[1] + 24, p[2])), mm(5), MATS.sonDo(), g, 7);
    g.add(seg(at(reach - 25, -25, -rim - 8), at(reach - 25, 25, -rim - 8), mm(7), steel, 16));
    void axis;
  };

  {
    const g = C.add('hong_lon', [0, 0.18, 0.85]);
    outlet(g, [0, 0, 1], 438, 50, 79, 188);
  }
  {
    const g = C.add('hong_ben', [0.95, 0.1, 0]);
    outlet(g, [1, 0, 0], 490, 32.5, 59, 157);
    outlet(g, [-1, 0, 0], 490, 32.5, 59, 157);
  }

  /* ------------------------------------------- 20 bầu dưới (đoạn ngầm) */
  {
    const g = C.add('bau_duoi', [0, -0.42, 0]);
    g.add(lathe(prof([[0, 150], [-18, 150], [-23, 98], [-50, 95], [-102, 91], [-143, 75], [-160, 66]]),
      blue, [0, 0, 0], 64));
  }

  /* --------------------------- 21–27 cổ lồng điều chỉnh cao độ và bích kẹp */
  {
    const g = C.add('co_dieu_chinh', [0, -0.78, 0]);
    g.add(tube(mm(73), mm(61), mm(-260), mm(-150), blueB, null, 48));
    for (let i = 0; i < 16; i++) {
      const z = -165 - i * 5.6;
      g.add(ring(mm(73.5), mm(1.6), blueB, [0, mm(z), 0], [Math.PI / 2, 0, 0]));
    }
    for (const [z, r, d] of [[-265, 103, 16], [-287, 103, 16], [-235, 83, 28]]) {
      g.add(tube(mm(r), mm(62), mm(z - d / 2), mm(z + d / 2), blueB, null, 48));
    }
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = Math.cos(a) * mm(89), zz = Math.sin(a) * mm(89);
      bolt(g, [x, mm(-254), zz], [0, 1, 0], 7, steel);
      g.add(cyl(mm(4), mm(4), mm(58), steel, [x, mm(-278), zz], null, 10));
      bolt(g, [x, mm(-310), zz], [0, -1, 0], 7, steel);
    }
  }

  /* ------------------------------------------------- 23 ống đứng ngầm */
  {
    const g = C.add('ong_ngam', [0, -1.0, 0]);
    g.add(tube(mm(62), mm(50), mm(-590), mm(-250), blue, null, 48));
  }

  /* --------------------------- 28–33 cổ 90, bích đầu vào DN100 và chân co */
  {
    const g = C.add('co_90', [0, -1.25, 0.35]);
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = (Math.PI / 2) * i / 10;
      pts.push([0, mm(-590 - 100 * Math.sin(t)), mm(100 - 100 * Math.cos(t))]);
    }
    rod(pts, mm(62), blue, g, 28);
    /* 29 cổ ngang + 30 mặt bích đầu vào, quay về +Z */
    g.add(seg([0, mm(-690), mm(100)], [0, mm(-690), mm(175)], mm(62), blue, 36));
    g.add(seg([0, mm(-690), mm(175)], [0, mm(-690), mm(193)], mm(110), blue, 40));
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * Math.PI * 2;
      bolt(g, [Math.cos(a) * mm(90), mm(-690) + Math.sin(a) * mm(90), mm(193)], [0, 0, 1], 6, steel);
    }
    /* 31–33 chân co và gân đỡ */
    g.add(box(mm(148), mm(20), mm(100), blue, [0, mm(-790), mm(55)]));
    for (const s of [-1, 1]) {
      rod([[s * mm(50), mm(-710), mm(15)], [s * mm(50), mm(-780), mm(15)], [s * mm(50), mm(-780), mm(100)]],
        mm(6), blue, g, 8);
    }
  }

  root.userData.ground = 0;          // cốt đất
  root.userData.height = 1.55;       // H_min theo catalogue
  root.userData.groundLine = true;
  return { group: root, comps: C.map };
}

/* chữ đắp nổi trên thân: THẢO TÍN VŨ · DN100 · biểu trưng */
function castMark() {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 256;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, 512, 256);
  c.fillStyle = 'rgba(214,150,140,.95)';
  c.textAlign = 'center';
  c.font = '700 54px system-ui, sans-serif';
  c.fillText('THẢO TÍN VŨ', 256, 60);
  c.font = '600 46px system-ui, sans-serif';
  c.fillText('DN100', 256, 118);
  c.strokeStyle = 'rgba(214,150,140,.9)'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(196, 196); c.lineTo(256, 150); c.lineTo(316, 196);
  c.lineTo(256, 242); c.closePath(); c.stroke();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: .5 }));
  m.position.set(0, 0.555, 0.0985);
  return m;
}
