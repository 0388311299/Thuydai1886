/* Chế độ xem vật phẩm: vật phẩm xoay chậm trên bàn xoay, kéo để xoay tay,
   thanh trượt tách rời cấu kiện, bấm vào cấu kiện để đọc vật liệu – chức năng. */
import * as THREE from 'three';
import { ARTIFACTS, SRC_LABEL, periodOf } from './data/exhibits.js';
import { buildArtifact } from './artifacts/index.js';

const $ = s => document.querySelector(s);

/* phông studio: sáng ở giữa, tối dần ra rìa */
function backdrop() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(128, 104, 10, 128, 128, 190);
  g.addColorStop(0, '#2b2721');
  g.addColorStop(0.55, '#171410');
  g.addColorStop(1, '#0a0908');
  c.fillStyle = g; c.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Inspector {
  constructor(renderer, env, { onClose } = {}) {
    this.renderer = renderer;
    this.onClose = onClose;
    this.active = false;

    this.scene = new THREE.Scene();
    this.scene.background = backdrop();
    if (env) this.scene.environment = env;

    this.cam = new THREE.PerspectiveCamera(38, 1, 0.01, 60);

    this.scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x3a3228, 0.95));
    const key = new THREE.DirectionalLight(0xfff0d8, 3.4); key.position.set(2.4, 3.4, 2.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0009;
    key.shadow.normalBias = 0.02;
    this.key = key;
    const fill = new THREE.DirectionalLight(0xbcd2ff, 1.2); fill.position.set(-2.6, 1.2, -1.6);
    const rim = new THREE.DirectionalLight(0xffd9a0, 1.6); rim.position.set(0.4, 1.4, -3.2);
    this.scene.add(key.target);
    const bounce = new THREE.DirectionalLight(0xffe3c0, 0.5); bounce.position.set(0, -2.4, 1.2);
    this.scene.add(bounce);
    this.scene.add(key, fill, rim);

    /* bàn xoay */
    const disc = new THREE.Mesh(new THREE.CircleGeometry(1, 56),
      new THREE.MeshStandardMaterial({ color: 0x1b1814, roughness: .7, metalness: .2, transparent: true }));
    disc.rotation.x = -Math.PI / 2;
    disc.receiveShadow = true;
    this.scene.add(disc);
    this.disc = disc;

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    /* trạng thái điều khiển */
    this.spin = true;
    this.spinSpeed = 0.28;
    this.yaw = 0.6; this.pitch = 0.18; this.dist = 3;
    this.target = new THREE.Vector3();
    this.explode = 0; this.explodeGoal = 0;
    this.comps = [];
    this.selected = null;
    this.art = null;

    this.ray = new THREE.Raycaster();
    this._bindUI();
  }

  /* --------------------------------------------------------------- mở/đóng */
  open(artId) {
    const art = ARTIFACTS[artId];
    if (!art) return;
    this.art = art;

    this.pivot.clear();
    this.comps = [];
    const built = buildArtifact(artId);
    if (!built) return;

    const model = built.group;
    const box = new THREE.Box3().setFromObject(model);
    const ctr = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const d = Math.max(size.x, size.y, size.z);

    model.position.sub(ctr);                 // tâm vật phẩm về gốc bàn xoay
    model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    this.pivot.add(model);
    this.model = model;
    this.pivot.position.set(0, size.y * 0.58, 0);
    this.disc.position.y = this.pivot.position.y - size.y * 0.5 - 0.015;
    this.disc.scale.setScalar(Math.max(0.3, Math.max(size.x, size.z) * 0.62));

    for (const [id, g] of built.comps) {
      const meta = art.components.find(c => c.id === id) || { id, name: id };
      const mats = [];
      g.traverse(o => {
        if (!o.isMesh) return;
        const mt = o.material;
        mats.push({ mt, color: mt.color.clone(), op: mt.opacity, tr: mt.transparent });
      });
      this.comps.push({ id, meta, group: g, home: g.position.clone(), dir: g.userData.dir, mats });
    }

    this.yaw = 0.6; this.pitch = 0.16;
    this.target.set(0, this.pivot.position.y, 0);
    this.pivot.rotation.set(0, 0, 0);

    /* bán kính bao của từng cấu kiện, tính quanh tâm bàn xoay — xoay không đổi */
    this.pivot.updateMatrixWorld(true);
    const bb = new THREE.Box3(), sp = new THREE.Sphere();
    for (const c of this.comps) {
      bb.setFromObject(c.group); bb.getBoundingSphere(sp);
      c.sphC = sp.center.clone().sub(this.pivot.position);
      c.sphR = sp.radius;
    }
    this.fitted = -1;
    this._fit(0);
    this.dist = this.dist0;
    this.explode = this.explodeGoal = 0;
    this.zoomed = false;
    this.spin = true;
    this.selected = null;

    this._paintInfo();
    this._paintComps();
    $('#ex').value = 0;
    $('#exVal').textContent = '0%';
    $('#btnSpin').classList.add('on');
    $('#gate').hidden = true;
    $('#hud').hidden = true;
    $('#insp').hidden = false;
    this.active = true;
    this._fit(0);                 // đo lại sau khi bảng chữ đã hiện
    this.dist = this.dist0;
  }

  close() {
    this.active = false;
    $('#insp').hidden = true;
    this.onClose?.();
  }

  /* ----------------------------------------------------------- vòng cập nhật */
  update(dt) {
    if (!this.active) return;
    if (this.spin && !this.drag) this.pivot.rotation.y += this.spinSpeed * dt;

    this.explode += (this.explodeGoal - this.explode) * Math.min(1, dt * 5.5);
    this.disc.material.opacity = Math.max(0, 1 - this.explode * 1.6);
    this.disc.visible = this.disc.material.opacity > 0.02;
    if (Math.abs(this.explode - this.fitted) > 0.015) this._fit(this.explode);
    if (!this.zoomed) this.dist += (this.dist0 - this.dist) * Math.min(1, dt * 4);
    for (const c of this.comps) {
      c.group.position.copy(c.home).addScaledVector(c.dir, this.explode);
    }

    this.target.set(0, this.pivot.position.y - (this.yOff || 0), 0);
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    this.cam.position.set(
      this.target.x + Math.sin(this.yaw) * cp * this.dist,
      this.target.y + sp * this.dist,
      this.target.z + Math.cos(this.yaw) * cp * this.dist
    );
    this.cam.lookAt(this.target);
  }

  /* Khung hình: chỉ dùng dải màn hình không bị bảng chữ che — đo thẳng từ giao diện. */
  _fit(t) {
    this.fitted = t;
    let R = 0.2;
    const v = new THREE.Vector3();
    for (const c of this.comps) {
      if (!c.sphC) continue;
      v.copy(c.sphC).addScaledVector(c.dir, t);
      R = Math.max(R, v.length() + c.sphR);
    }
    const el = this.renderer.domElement;
    const W = el.clientWidth || innerWidth, H = el.clientHeight || innerHeight;
    const nar = W < 900;

    const rect = sel => { const e = $(sel); return e ? e.getBoundingClientRect() : null; };
    const rTop = rect('#inspTop'), rInfo = rect('#inspInfo'),
          rComps = rect('#inspComps'), rTools = rect('#inspTools');
    let top = rTop && rTop.height ? rTop.bottom : H * 0.1;
    let bot = H * 0.9;
    if (nar && rInfo && rInfo.height) bot = Math.min(rInfo.top, rComps ? rComps.top : H);
    else if (rTools && rTools.height) bot = rTools.top;

    let fv = (bot - top) / H;
    if (!(fv > 0.15 && fv <= 1)) { fv = nar ? 0.4 : 0.8; top = H * (0.5 - fv / 2); bot = top + fv * H; }
    const fh = nar ? 0.9 : Math.max(0.4, (W - 760) / W);

    const half = THREE.MathUtils.degToRad(this.cam.fov) / 2;
    const dV = R / (Math.tan(half) * fv);
    const dH = R / (Math.tan(half) * this.cam.aspect * fh);
    this.dist0 = Math.min(18, Math.max(dV, dH) * 1.06);

    /* đưa vật phẩm vào giữa dải trống */
    const offFrac = ((top + bot) / 2 - H / 2) / H;
    this.yOff = -offFrac * 2 * this.dist0 * Math.tan(half);

    /* khung chiếu bóng bám theo cỡ vật phẩm hiện tại */
    if (this.key) {
      const sc = this.key.shadow.camera, e = R * 1.5;
      sc.left = -e; sc.right = e; sc.top = e; sc.bottom = -e;
      sc.near = 0.1; sc.far = R * 12 + 6;
      sc.updateProjectionMatrix();
      this.key.position.set(2.4, 3.4, 2.2).normalize().multiplyScalar(R * 4 + 1.2)
        .add(new THREE.Vector3(0, this.pivot.position.y, 0));
      this.key.target.position.set(0, this.pivot.position.y, 0);
      this.key.target.updateMatrixWorld();
    }
  }

  render() { this.renderer.render(this.scene, this.cam); }

  resize(w, h) {
    this.cam.aspect = w / h;
    this.cam.updateProjectionMatrix();
    if (this.comps.length) { this._fit(this.explode); if (!this.zoomed) this.dist = this.dist0; }
  }

  /* ------------------------------------------------------- chọn cấu kiện */
  select(id) {
    this.selected = (this.selected === id) ? null : id;
    for (const c of this.comps) {
      const on = !this.selected || this.selected === c.id;
      for (const m of c.mats) {
        m.mt.transparent = on ? m.tr : true;
        m.mt.opacity = on ? m.op : 0.12;
        m.mt.depthWrite = on;
        m.mt.color.copy(m.color);
        if (this.selected === c.id) m.mt.color.lerp(new THREE.Color(0xfff0d0), 0.14);
        m.mt.needsUpdate = true;
      }
    }
    if (this.selected && this.explodeGoal < 0.35) this.setExplode(0.6);
    this._paintComps();
    this._paintDetail();
  }

  setExplode(v) {
    this.explodeGoal = Math.max(0, Math.min(1, v));
    $('#ex').value = Math.round(this.explodeGoal * 100);
    $('#exVal').textContent = Math.round(this.explodeGoal * 100) + '%';
  }

  /* --------------------------------------------------------------- bảng chữ */
  _paintInfo() {
    const a = this.art, p = periodOf(a.period);
    $('#inspGian').textContent = `Gian ${p.no} · ${p.years}`;
    $('#inspName').textContent = a.name;
    $('#inspAlt').textContent = a.nameAlt || '';
    const badge = $('#inspDraft');
    badge.hidden = !(a.badge || a.draft);
    badge.textContent = a.badge || 'Dữ liệu tạm';

    const row = (k, v) => `<div class="row"><span>${k}</span><b>${v}</b></div>`;
    $('#inspInfo').innerHTML = `
      <div class="blk">
        <h3>Vật phẩm</h3>
        <p>${a.summary}</p>
      </div>
      <div class="blk">
        <h3>Chức năng</h3>
        <p>${a.func}</p>
      </div>
      <div class="blk specs">
        ${row('Niên đại', a.nien)}
        ${row('Xuất xứ', a.origin)}
        ${row('Kích thước', a.dims)}
        ${row('Khối lượng', a.mass)}
        ${row('Vật liệu', a.matMain)}
      </div>
      <div class="blk">
        <h3>Trong mạng cấp nước</h3>
        <p>${a.history}</p>
      </div>
      ${a.sourceNote ? `<p class="note">⚑ ${a.sourceNote}</p>` : ''}
      <div id="inspDetail"></div>`;
    $('#inspInfo').scrollTop = 0;
    this._paintDetail();
  }

  _paintComps() {
    const list = this.comps.map((c, i) => `
      <button class="comp ${this.selected === c.id ? 'on' : ''}" data-id="${c.id}">
        <i>${String(i + 1).padStart(2, '0')}</i>
        <span><b>${c.meta.name}</b><em>${c.meta.mat || ''}</em></span>
        ${c.meta.src === 'uoc' ? '<u title="Ước lượng theo ảnh">≈</u>' : ''}
      </button>`).join('');
    $('#inspComps').innerHTML = `
      <div class="hd">Cấu kiện <b>${this.comps.length}</b></div>
      <div class="scroll">${list}</div>
      <p class="hint">Bấm một cấu kiện để tách riêng và đọc thông tin. Bấm lại để bỏ chọn.</p>`;
    $('#inspComps').querySelectorAll('.comp').forEach(b =>
      b.onclick = () => this.select(b.dataset.id));
  }

  _paintDetail() {
    const el = $('#inspDetail'); if (!el) return;
    const c = this.comps.find(x => x.id === this.selected);
    if (!c) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div class="blk sel">
        <span class="tag">Cấu kiện đang chọn</span>
        <h3>${c.meta.name}</h3>
        <div class="row"><span>Vật liệu</span><b>${c.meta.mat || '—'}</b></div>
        ${c.meta.src ? `<div class="row"><span>Nguồn số đo</span><b>${SRC_LABEL[c.meta.src] || c.meta.src}</b></div>` : ''}
        <h4>Chức năng</h4><p>${c.meta.func || '—'}</p>
        <h4>Ghi chú</h4><p>${c.meta.info || '—'}</p>
      </div>`;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ------------------------------------------------------- chuột / cảm ứng */
  _bindUI() {
    const cv = this.renderer.domElement;

    $('#inspBack').onclick = () => this.close();
    $('#ex').oninput = e => this.setExplode(+e.target.value / 100);
    $('#btnExplode').onclick = () => this.setExplode(this.explodeGoal > 0.5 ? 0 : 1);
    $('#btnSpin').onclick = () => {
      this.spin = !this.spin;
      $('#btnSpin').classList.toggle('on', this.spin);
    };
    $('#btnResetView').onclick = () => {
      this.yaw = 0.6; this.pitch = 0.16;
      this.pivot.rotation.set(0, 0, 0);
      this.zoomed = false; this._fit(0); this.dist = this.dist0;
      this.setExplode(0);
      if (this.selected) this.select(this.selected);
    };

    let px = 0, py = 0, moved = 0;
    const down = (x, y) => { this.drag = true; px = x; py = y; moved = 0; };
    const move = (x, y) => {
      if (!this.drag) return;
      const dx = x - px, dy = y - py; px = x; py = y;
      moved += Math.abs(dx) + Math.abs(dy);
      this.pivot.rotation.y += dx * 0.008;
      this.pitch = Math.max(-0.5, Math.min(1.25, this.pitch + dy * 0.005));
    };
    const up = (x, y) => {
      if (!this.drag) return;
      this.drag = false;
      if (moved < 6) this._pick(x, y);
    };

    cv.addEventListener('pointerdown', e => { if (this.active) down(e.clientX, e.clientY); });
    addEventListener('pointermove', e => { if (this.active) move(e.clientX, e.clientY); });
    addEventListener('pointerup', e => { if (this.active) up(e.clientX, e.clientY); });
    cv.addEventListener('wheel', e => {
      if (!this.active) return;
      e.preventDefault();
      this.zoomed = true;
      this.dist = Math.max(0.5, Math.min(14, this.dist * (1 + Math.sign(e.deltaY) * 0.1)));
    }, { passive: false });

    addEventListener('keydown', e => {
      if (!this.active) return;
      if (e.code === 'Escape') this.close();
      if (e.code === 'Space') { e.preventDefault(); this.setExplode(this.explodeGoal > 0.5 ? 0 : 1); }
    });
  }

  _pick(cx, cy) {
    const r = this.renderer.domElement.getBoundingClientRect();
    const v = new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(v, this.cam);
    const hit = this.ray.intersectObject(this.pivot, true)[0];
    if (!hit) { if (this.selected) this.select(this.selected); return; }
    let o = hit.object, id = null;
    while (o && !id) { if (o.userData?.compId) id = o.userData.compId; o = o.parent; }
    if (id) this.select(id);
  }
}
