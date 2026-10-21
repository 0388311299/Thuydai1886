/* Sổ đăng ký builder — thêm vật phẩm mới thì thêm một dòng ở đây. */
import { buildTruChuaChay } from './tru_chua_chay.js';
import { buildTruNuocTaiVoi } from './tru_nuoc_tai_voi.js';

export const BUILDERS = {
  tru_chua_chay: buildTruChuaChay,
  tru_nuoc_tai_voi: buildTruNuocTaiVoi
};

export const buildArtifact = id => (BUILDERS[id] ? BUILDERS[id]() : null);
