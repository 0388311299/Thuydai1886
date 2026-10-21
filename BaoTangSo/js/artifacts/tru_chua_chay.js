/* Trụ chữa cháy kiểu trụ nổi — dựng theo cấu tạo nguyên lý, trục đứng là Y, cốt đất y = 0. */
import * as THREE from 'three';
import { MATS, cyl, box, ball, ring, flange, compiler } from './kit.js';

export function buildTruChuaChay() {
  const root = new THREE.Group();
  const C = compiler(root);

  /* ---- đế khuỷu và bích DN100 (nằm dưới cốt đất) ---- */
  {
    const g = C.add('de_khuyu', [0, -0.8, 0]);
    const gang = MATS.gangXam();
    g.add(cyl(0.085, 0.085, 0.46, gang, [0, -0.33, 0]));            // cổ đứng
    g.add(cyl(0.09, 0.09, 0.56, gang, [0, -0.52, 0.2], [Math.PI / 2, 0, 0])); // nhánh ngang
    g.add(ball(0.11, gang, [0, -0.52, 0]));                          // khuỷu
    g.add(flange(0.15, 0.03, gang, [0, -0.52, 0.47], 6, MATS.thep()).rotateX(Math.PI / 2));
    g.add(flange(0.15, 0.03, gang, [0, -0.10, 0], 6, MATS.thep()));
    g.add(box(0.56, 0.16, 0.7, MATS.beTong(), [0, -0.70, 0.12]));    // gối bê tông
  }

  /* ---- van chính và đĩa cao su ---- */
  {
    const g = C.add('van_chinh', [0, -0.42, 0]);
    g.add(cyl(0.072, 0.072, 0.1, MATS.dongDo(), [0, -0.2, 0]));
    g.add(cyl(0.082, 0.082, 0.026, MATS.caoSu(), [0, -0.27, 0]));
    g.add(cyl(0.03, 0.03, 0.06, MATS.inox(), [0, -0.12, 0]));
  }

  /* ---- van xả tự động ---- */
  {
    const g = C.add('van_xa', [-0.7, -0.5, 0]);
    const d = MATS.dongThau();
    g.add(box(0.07, 0.07, 0.07, d, [-0.1, -0.16, 0]));
    g.add(cyl(0.018, 0.018, 0.09, d, [-0.15, -0.16, 0], [0, 0, Math.PI / 2]));
  }

  /* ---- khớp an toàn chống đâm ---- */
  {
    const g = C.add('khop_an_toan', [0, -0.16, 0]);
    const gang = MATS.gangXam(), bu = MATS.thep();
    g.add(cyl(0.145, 0.145, 0.022, gang, [0, 0.02, 0]));
    g.add(cyl(0.145, 0.145, 0.022, gang, [0, 0.07, 0]));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      g.add(cyl(0.013, 0.013, 0.085, bu, [Math.cos(a) * 0.115, 0.045, Math.sin(a) * 0.115]));
    }
  }

  /* ---- thân trụ trên ---- */
  {
    const g = C.add('than_tren', [0, 0.14, 0]);
    const do_ = MATS.gangDo();
    g.add(cyl(0.097, 0.12, 0.6, do_, [0, 0.39, 0]));
    g.add(ring(0.1, 0.016, do_, [0, 0.2, 0], [Math.PI / 2, 0, 0]));   // gân ngang
    g.add(cyl(0.135, 0.135, 0.026, do_, [0, 0.1, 0]));                 // bích chân thân
    g.add(cyl(0.128, 0.128, 0.026, do_, [0, 0.69, 0]));                // bích đỉnh
  }

  /* ---- họng chờ và nắp họng ---- */
  {
    const g = C.add('hong_cho', [0, 0.3, 0.8]);
    const nhom = MATS.nhomMo(), gang = MATS.gangDen();
    for (const s of [-1, 1]) {
      g.add(cyl(0.056, 0.062, 0.14, gang, [s * 0.165, 0.46, 0], [0, 0, Math.PI / 2]));
      g.add(ring(0.058, 0.012, nhom, [s * 0.225, 0.46, 0], [0, Math.PI / 2, 0]));
      g.add(cyl(0.062, 0.062, 0.035, nhom, [s * 0.252, 0.46, 0], [0, 0, Math.PI / 2])); // nắp
      g.add(ring(0.035, 0.006, MATS.thep(), [s * 0.23, 0.39, 0], [0, Math.PI / 2, 0])); // dây giữ
    }
  }

  /* ---- ty van ---- */
  {
    const g = C.add('ty_van', [0.55, 0.6, 0]);
    const inox = MATS.inox();
    g.add(cyl(0.019, 0.019, 0.95, inox, [0, 0.26, 0]));
    g.add(cyl(0.03, 0.03, 0.05, inox, [0, 0.7, 0]));
    for (let i = 0; i < 10; i++) g.add(ring(0.022, 0.004, inox, [0, -0.1 + i * 0.012, 0], [Math.PI / 2, 0, 0]));
  }

  /* ---- nắp đỉnh và đai ốc vận hành ---- */
  {
    const g = C.add('nap_dinh', [0, 0.85, 0]);
    const do_ = MATS.gangDo();
    g.add(cyl(0.118, 0.132, 0.06, do_, [0, 0.735, 0]));
    g.add(cyl(0.07, 0.115, 0.07, do_, [0, 0.8, 0]));
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.04, 0.055, 5), MATS.thep());
    nut.position.set(0, 0.86, 0);
    g.add(nut);
    g.add(ring(0.06, 0.008, do_, [0, 0.765, 0], [Math.PI / 2, 0, 0]));
  }

  root.userData.ground = 0;            // cốt đất của vật phẩm
  root.userData.height = 0.9;
  return { group: root, comps: C.map };
}
