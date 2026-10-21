/* Góc nhìn thứ nhất: nhìn bằng chuột (pointer lock), đi bằng W A S D,
   trên điện thoại thì kéo nửa trái để đi, nửa phải để nhìn.
   Va chạm giải theo hộp có hướng — mỗi vách tường là một hộp.        */
import * as THREE from 'three';

const KEY = {
  KeyW: 'f', ArrowUp: 'f', KeyS: 'b', ArrowDown: 'b',
  KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r'
};

export class Walker {
  constructor(camera, dom, { eye = 1.62, radius = 0.42, bound = 24 } = {}) {
    this.cam = camera; this.dom = dom;
    this.eye = eye; this.radius = radius; this.bound = bound;
    this.pos = new THREE.Vector3(0, eye, 0);
    this.vel = new THREE.Vector3();
    this.yaw = 0; this.pitch = 0;
    this.keys = { f: 0, b: 0, l: 0, r: 0, run: 0 };
    this.colliders = [];
    this.enabled = true;
    this.locked = false;
    this.bob = 0;
    this.touchMove = { x: 0, y: 0 };
    this._bind();
    this.apply();
  }

  setColliders(list) { this.colliders = list; }

  place(x, z, yaw = 0) {
    this.pos.set(x, this.eye, z); this.yaw = yaw; this.pitch = 0;
    this.vel.set(0, 0, 0); this.apply();
  }

  lock() { if (this.dom.requestPointerLock) this.dom.requestPointerLock(); }
  unlock() { if (document.pointerLockElement) document.exitPointerLock(); }

  _bind() {
    const d = this.dom;

    addEventListener('keydown', e => {
      if (!this.enabled) return;
      const k = KEY[e.code];
      if (k) { this.keys[k] = 1; e.preventDefault(); }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keys.run = 1;
    });
    addEventListener('keyup', e => {
      const k = KEY[e.code];
      if (k) this.keys[k] = 0;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keys.run = 0;
    });
    addEventListener('blur', () => { this.keys = { f: 0, b: 0, l: 0, r: 0, run: 0 }; });

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === d;
      this.onLockChange?.(this.locked);
    });

    addEventListener('mousemove', e => {
      if (!this.locked || !this.enabled) return;
      this._look(e.movementX, e.movementY);
    });

    /* dự phòng: nơi nào không khóa được con trỏ thì kéo chuột để nhìn */
    let drag = null;
    d.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' || this.locked || !this.enabled) return;
      drag = [e.clientX, e.clientY];
    });
    addEventListener('pointermove', e => {
      if (!drag || this.locked || !this.enabled) return;
      this._look(e.clientX - drag[0], e.clientY - drag[1]);
      drag = [e.clientX, e.clientY];
    });
    addEventListener('pointerup', () => { drag = null; });

    /* ------------------------------------------------------- cảm ứng */
    const touches = new Map();
    d.addEventListener('touchstart', e => {
      if (!this.enabled) return;
      for (const t of e.changedTouches) {
        touches.set(t.identifier, {
          x: t.clientX, y: t.clientY, ox: t.clientX, oy: t.clientY,
          side: t.clientX < innerWidth / 2 ? 'move' : 'look'
        });
      }
    }, { passive: true });

    d.addEventListener('touchmove', e => {
      if (!this.enabled) return;
      for (const t of e.changedTouches) {
        const st = touches.get(t.identifier); if (!st) continue;
        if (st.side === 'look') {
          this._look((t.clientX - st.x) * 1.5, (t.clientY - st.y) * 1.5);
        } else {
          const r = 56;
          this.touchMove.x = Math.max(-1, Math.min(1, (t.clientX - st.ox) / r));
          this.touchMove.y = Math.max(-1, Math.min(1, (t.clientY - st.oy) / r));
        }
        st.x = t.clientX; st.y = t.clientY;
      }
      e.preventDefault();
    }, { passive: false });

    const end = e => {
      for (const t of e.changedTouches) {
        const st = touches.get(t.identifier);
        if (st?.side === 'move') this.touchMove = { x: 0, y: 0 };
        touches.delete(t.identifier);
      }
    };
    d.addEventListener('touchend', end, { passive: true });
    d.addEventListener('touchcancel', end, { passive: true });
  }

  _look(mx, my) {
    if (Math.abs(mx) > 160 || Math.abs(my) > 160) return;   // nhiễu ngay khi khóa con trỏ
    const s = 0.0024;
    this.yaw -= mx * s;
    this.pitch -= my * s;
    const lim = Math.PI / 2 - 0.05;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
  }

  /* một bước mô phỏng */
  update(dt) {
    if (!this.enabled) { this.apply(); return; }
    const k = this.keys;
    let ix = (k.r - k.l) + this.touchMove.x;
    let iz = (k.f - k.b) - this.touchMove.y;
    const len = Math.hypot(ix, iz);
    if (len > 1) { ix /= len; iz /= len; }

    const speed = (k.run ? 3.9 : 2.1);
    const sinY = Math.sin(this.yaw), cosY = Math.cos(this.yaw);
    /* tiến = -Z cục bộ */
    const wx = (-sinY * iz) + (cosY * ix);
    const wz = (-cosY * iz) + (-sinY * ix);

    const acc = 14;
    this.vel.x += (wx * speed - this.vel.x) * Math.min(1, acc * dt);
    this.vel.z += (wz * speed - this.vel.z) * Math.min(1, acc * dt);

    let nx = this.pos.x + this.vel.x * dt;
    let nz = this.pos.z + this.vel.z * dt;
    const out = this._resolve(nx, nz);
    this.pos.x = out[0]; this.pos.z = out[2];

    const moving = Math.hypot(this.vel.x, this.vel.z);
    this.bob += dt * moving * 7.5;
    this.apply(Math.sin(this.bob) * Math.min(moving, 3) * 0.012);
  }

  /* đẩy ra khỏi vách gần nhất, lặp vài lượt cho góc tường */
  _resolve(x, z) {
    const r = this.radius;
    for (let pass = 0; pass < 3; pass++) {
      let hit = false;
      for (const c of this.colliders) {
        if (c.round) {
          const dx = x - c.x, dz = z - c.z;
          const d = Math.hypot(dx, dz) || 1e-6;
          if (d < c.r + r) {
            const s = (c.r + r) / d;
            x = c.x + dx * s; z = c.z + dz * s; hit = true;
          }
          continue;
        }
        const cs = Math.cos(c.rot), sn = Math.sin(c.rot);
        const dx = x - c.x, dz = z - c.z;
        let lx = dx * cs - dz * sn;
        let lz = dx * sn + dz * cs;
        const ox = c.hx + r - Math.abs(lx);
        const oz = c.hz + r - Math.abs(lz);
        if (ox > 0 && oz > 0) {
          if (ox < oz) lx = Math.sign(lx || 1) * (c.hx + r);
          else lz = Math.sign(lz || 1) * (c.hz + r);
          x = c.x + lx * cs + lz * sn;
          z = c.z - lx * sn + lz * cs;
          hit = true;
        }
      }
      if (!hit) break;
    }
    const rr = Math.hypot(x, z);
    if (rr > this.bound) { x *= this.bound / rr; z *= this.bound / rr; }
    return [x, 0, z];
  }

  apply(bob = 0) {
    this.cam.position.set(this.pos.x, this.eye + bob, this.pos.z);
    this.cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  forward(v = new THREE.Vector3()) {
    return v.set(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
  }
}
