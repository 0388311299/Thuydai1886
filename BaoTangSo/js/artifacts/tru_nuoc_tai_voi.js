/* Trụ nước tại vòi (borne-fontaine) — trục đứng là Y, mặt bệ y = 0. */
import * as THREE from 'three';
import { MATS, cyl, box, ball, ring, flange, lathe, compiler } from './kit.js';

export function buildTruNuocTaiVoi() {
  const root = new THREE.Group();
  const C = compiler(root);

  /* ---- bệ và hố thoát ---- */
  {
    const g = C.add('be_thoat', [0, -0.5, 0]);
    const da = MATS.da(), gang = MATS.gangDen();
    g.add(lathe([[0.46, 0], [0.46, 0.1], [0.4, 0.13], [0.26, 0.15], [0.26, 0.05], [0, 0.04]], da, [0, 0, 0]));
    g.add(ring(0.17, 0.02, gang, [0, 0.05, 0], [Math.PI / 2, 0, 0]));  // vành hố thoát
    for (let i = 0; i < 5; i++) g.add(box(0.33, 0.015, 0.025, gang, [0, 0.055, -0.12 + i * 0.06])); // nan rãnh
  }

  /* ---- bích chân và ống nhánh ---- */
  {
    const g = C.add('bich_chan', [0, -0.95, 0]);
    const gang = MATS.gangXam();
    g.add(flange(0.175, 0.055, gang, [0, 0.19, 0], 6, MATS.thep()));
    g.add(cyl(0.075, 0.075, 0.5, gang, [0, -0.1, 0]));
    g.add(ring(0.09, 0.022, gang, [0, -0.33, 0], [Math.PI / 2, 0, 0]));
  }

  /* ---- thân trụ ---- */
  {
    const g = C.add('than_tru', [0, 0.06, 0]);
    g.add(lathe([
      [0.155, 0.22], [0.155, 0.27], [0.135, 0.3], [0.13, 0.45],
      [0.145, 0.56], [0.13, 0.66], [0.112, 0.88], [0.112, 0.98],
      [0.125, 1.02], [0.125, 1.05], [0, 1.05]
    ], MATS.gangXam(), [0, 0, 0]));
    g.add(ring(0.128, 0.014, MATS.gangXam(), [0, 0.56, 0], [Math.PI / 2, 0, 0]));
  }

  /* ---- ống dẫn trong lòng trụ ---- */
  {
    const g = C.add('ong_long', [-0.75, 0.3, 0]);
    const d = MATS.dongDo();
    g.add(cyl(0.036, 0.036, 0.84, d, [-0.028, 0.56, 0]));
    g.add(ring(0.042, 0.009, d, [-0.028, 0.26, 0], [Math.PI / 2, 0, 0]));
    g.add(ring(0.042, 0.009, d, [-0.028, 0.92, 0], [Math.PI / 2, 0, 0]));
  }

  /* ---- van khóa và tay mở ---- */
  {
    const g = C.add('van_tay', [0, 0.7, -0.4]);
    const dt = MATS.dongThau(), th = MATS.thep();
    g.add(cyl(0.055, 0.055, 0.1, dt, [0, 0.96, 0]));
    g.add(cyl(0.016, 0.016, 0.12, th, [0, 0.96, 0.08], [Math.PI / 2, 0, 0]));
    g.add(ring(0.075, 0.012, dt, [0, 0.96, 0.15], [0, 0, 0]));          // tay quay
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      g.add(box(0.012, 0.075, 0.012, dt, [Math.sin(a) * 0.038, 0.96 + Math.cos(a) * 0.038, 0.15], [0, 0, -a]));
    }
  }

  /* ---- vòi chảy (ống ngỗng) ---- */
  {
    const g = C.add('voi_dong', [0, 0.22, 0.8]);
    const dt = MATS.dongThau();
    g.add(cyl(0.03, 0.03, 0.12, dt, [0, 0.9, 0.16], [Math.PI / 2, 0, 0]));
    g.add(ring(0.07, 0.03, dt, [0, 0.83, 0.22], [0, Math.PI / 2, 0], Math.PI / 2));
    g.add(cyl(0.03, 0.034, 0.1, dt, [0, 0.75, 0.29]));
    g.add(ring(0.04, 0.012, dt, [0, 0.705, 0.29], [Math.PI / 2, 0, 0]));  // miệng vòi
  }

  /* ---- mũ trụ ---- */
  {
    const g = C.add('mu_tru', [0, 0.78, 0]);
    const gang = MATS.gangXam();
    g.add(lathe([
      [0.135, 1.05], [0.142, 1.08], [0.13, 1.13], [0.1, 1.18],
      [0.055, 1.21], [0.03, 1.22], [0, 1.22]
    ], gang, [0, 0, 0]));
    g.add(ball(0.035, gang, [0, 1.245, 0]));
  }

  root.userData.ground = 0;
  root.userData.height = 1.25;
  return { group: root, comps: C.map };
}
