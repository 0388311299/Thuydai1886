// Lý lịch cấu kiện thủy đài 1886 — số đo lấy trực tiếp từ mô hình Blender thuy_dai_1886.blend
export const GROUP_ORDER = ["01_Mong_Nen", "02_Than_Tuong", "03_Cua_Trang_Tri", "04_San_Ket_Cau_Go", "05_He_Ong_Cong_Nghe", "06_Dan_Thep_Do_Bon", "07_Bon_Chua", "08_Hanh_Lang", "09_Mai", "10_Thoat_Nuoc_Mua", "11_Chieu_Sang_Noi_That"];
export const GROUP_NAME = {
 "01_Mong_Nen": "01 · Móng – nền",
 "02_Than_Tuong": "02 · Thân tường",
 "03_Cua_Trang_Tri": "03 · Cửa – trang trí",
 "04_San_Ket_Cau_Go": "04 · Sàn & kết cấu gỗ",
 "05_He_Ong_Cong_Nghe": "05 · Hệ ống công nghệ",
 "06_Dan_Thep_Do_Bon": "06 · Dàn thép đỡ bồn",
 "07_Bon_Chua": "07 · Bồn chứa",
 "08_Hanh_Lang": "08 · Hành lang",
 "09_Mai": "09 · Mái",
 "10_Thoat_Nuoc_Mua": "10 · Thoát nước mưa",
 "11_Chieu_Sang_Noi_That": "11 · Chiếu sáng nội thất"
};
export const PARTS = [
 {
  "id": "Ham_Van_Duoi_San",
  "base": "Ham_Van_Duoi_San",
  "name": "Hầm van dưới sàn",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Bê tông"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 16.466,
  "area": 197.55,
  "dim": [
   14.8,
   6.5,
   1.94
  ],
  "ctr": [
   0.0,
   0.0,
   -0.78
  ],
  "zmin": -1.75,
  "zmax": 0.19,
  "faces": 120,
  "kg": 39517,
  "kgNote": "16,47 m³ × 2,40 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Be_Da_Hoc",
  "base": "Be_Da_Hoc",
  "name": "Bệ đá hộc",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Đá hộc",
   "Vữa chèn khe"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 32.566,
  "area": 193.27,
  "dim": [
   23.708,
   13.208,
   1.05
  ],
  "ctr": [
   0.0,
   0.0,
   0.525
  ],
  "zmin": 0.0,
  "zmax": 1.05,
  "faces": 40,
  "kg": 78158,
  "kgNote": "32,57 m³ × 2,40 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Be_Tru_Da_Hoc",
  "base": "Be_Tru_Da_Hoc",
  "name": "Bệ trụ đá hộc",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Đá hộc"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 12.661,
  "area": 75.19,
  "dim": [
   24.614,
   14.114,
   1.05
  ],
  "ctr": [
   0.0,
   0.0,
   0.525
  ],
  "zmin": 0.0,
  "zmax": 1.05,
  "faces": 72,
  "kg": 30386,
  "kgNote": "12,66 m³ × 2,40 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "San_Gach_Tang_Tret",
  "base": "San_Gach_Tang_Tret",
  "name": "Sàn gạch tầng trệt",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Gạch nung",
   "Bê tông"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 22.564,
  "area": 243.34,
  "dim": [
   19.49,
   8.99,
   0.2
  ],
  "ctr": [
   0.0,
   0.0,
   0.1
  ],
  "zmin": 0.0,
  "zmax": 0.2,
  "faces": 220,
  "kg": 40616,
  "kgNote": "22,56 m³ × 1,80 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Nguong_Bac_Cua",
  "base": "Nguong_Bac_Cua",
  "name": "Ngưỡng bậc cửa",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Vữa xám"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 1.492,
  "area": 28.29,
  "dim": [
   26.608,
   2.9,
   0.21
  ],
  "ctr": [
   0.15,
   0.0,
   0.105
  ],
  "zmin": 0.0,
  "zmax": 0.21,
  "faces": 24,
  "kg": 3282,
  "kgNote": "1,49 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Go_Chan_Be",
  "base": "Go_Chan_Be",
  "name": "Gờ chân bệ",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Vữa xám",
   "Vữa chèn khe"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 4.687,
  "area": 71.54,
  "dim": [
   23.908,
   13.408,
   0.2
  ],
  "ctr": [
   0.0,
   0.0,
   1.15
  ],
  "zmin": 1.05,
  "zmax": 1.25,
  "faces": 44,
  "kg": 10311,
  "kgNote": "4,69 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Go_Chan_Tru",
  "base": "Go_Chan_Tru",
  "name": "Gờ chân trụ",
  "group": "01_Mong_Nen",
  "groupName": "01 · Móng – nền",
  "mats": [
   "Vữa xám"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 2.712,
  "area": 37.42,
  "dim": [
   24.748,
   14.248,
   0.2
  ],
  "ctr": [
   0.0,
   0.0,
   1.15
  ],
  "zmin": 1.05,
  "zmax": 1.25,
  "faces": 72,
  "kg": 5967,
  "kgNote": "2,71 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Than_Tuong_Gach",
  "base": "Than_Tuong_Gach",
  "name": "Thân tường gạch",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Gạch trát vôi vàng",
   "Vữa chèn khe",
   "Bê tông"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 1770.144,
  "area": 2393.7,
  "dim": [
   23.508,
   13.008,
   12.9
  ],
  "ctr": [
   0.0,
   0.0,
   6.15
  ],
  "zmin": -0.3,
  "zmax": 12.6,
  "faces": 5557,
  "kg": 3186260,
  "kgNote": "1 770,14 m³ × 1,80 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "De_Chan_Ong_Thoat",
  "base": "De_Chan_Ong_Thoat",
  "name": "Đế chân ống thoát",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Vữa xám"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.137,
  "area": 3.25,
  "dim": [
   24.735,
   14.268,
   0.2
  ],
  "ctr": [
   0.0,
   0.0,
   0.1
  ],
  "zmin": 0.0,
  "zmax": 0.2,
  "faces": 48,
  "kg": 301,
  "kgNote": "0,14 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Tru_Ap_Tuong",
  "base": "Tru_Ap_Tuong",
  "name": "Trụ áp tường",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Gạch trát vôi vàng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 95.18,
  "area": 463.19,
  "dim": [
   24.353,
   13.853,
   10.75
  ],
  "ctr": [
   0.0,
   0.0,
   6.625
  ],
  "zmin": 1.25,
  "zmax": 12.0,
  "faces": 72,
  "kg": 171325,
  "kgNote": "95,18 m³ × 1,80 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Go_Bau_Ngang_Tang_Tren",
  "base": "Go_Bau_Ngang_Tang_Tren",
  "name": "Gờ bậu ngang tầng trên",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Vữa xám"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 4.805,
  "area": 73.74,
  "dim": [
   23.915,
   13.415,
   0.38
  ],
  "ctr": [
   0.0,
   0.0,
   5.39
  ],
  "zmin": 5.2,
  "zmax": 5.58,
  "faces": 32,
  "kg": 10571,
  "kgNote": "4,81 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Dau_Tru_Ap_Tuong",
  "base": "Dau_Tru_Ap_Tuong",
  "name": "Đầu trụ áp tường",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Vữa xám"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 5.05,
  "area": 45.09,
  "dim": [
   24.688,
   14.188,
   0.4
  ],
  "ctr": [
   0.0,
   0.0,
   11.55
  ],
  "zmin": 11.35,
  "zmax": 11.75,
  "faces": 72,
  "kg": 11111,
  "kgNote": "5,05 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Go_Mu_Tuong",
  "base": "Go_Mu_Tuong",
  "name": "Gờ mũ tường",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Đá trắng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 30.797,
  "area": 202.66,
  "dim": [
   24.691,
   14.191,
   1.07
  ],
  "ctr": [
   0.0,
   0.0,
   12.485
  ],
  "zmin": 11.95,
  "zmax": 13.02,
  "faces": 48,
  "kg": 80072,
  "kgNote": "30,80 m³ × 2,60 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Go_Mai_Nho_Tren_Tru",
  "base": "Go_Mai_Nho_Tren_Tru",
  "name": "Gờ mái nhô trên trụ",
  "group": "02_Than_Tuong",
  "groupName": "02 · Thân tường",
  "mats": [
   "Đá trắng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 20.92,
  "area": 181.41,
  "dim": [
   25.759,
   15.259,
   1.07
  ],
  "ctr": [
   0.0,
   0.0,
   12.485
  ],
  "zmin": 11.95,
  "zmax": 13.02,
  "faces": 216,
  "kg": 54392,
  "kgNote": "20,92 m³ × 2,60 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Canh_Cua_Sau_Phia_Tay",
  "base": "Canh_Cua_Sau_Phia_Tay",
  "name": "Cánh cửa sau phía Tây",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Gỗ cánh cửa"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.149,
  "area": 6.05,
  "dim": [
   0.09,
   1.04,
   2.25
  ],
  "ctr": [
   -11.289,
   0.0,
   1.145
  ],
  "zmin": 0.02,
  "zmax": 2.27,
  "faces": 24,
  "kg": 97,
  "kgNote": "0,15 m³ × 0,65 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Khung_Gia_Cua_Tang_Tret",
  "base": "Khung_Gia_Cua_Tang_Tret",
  "name": "Khung giả cửa tầng trệt",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Đá trắng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 1.405,
  "area": 64.05,
  "dim": [
   22.547,
   13.128,
   4.114
  ],
  "ctr": [
   -0.541,
   0.0,
   2.319
  ],
  "zmin": 0.262,
  "zmax": 4.376,
  "faces": 2106,
  "kg": 3654,
  "kgNote": "1,41 m³ × 2,60 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Canh_Chop_Hoc_Tuong_Trong",
  "base": "Canh_Chop_Hoc_Tuong_Trong",
  "name": "Cánh chớp hốc tường trong",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Gỗ cánh cửa"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.852,
  "area": 74.7,
  "dim": [
   18.256,
   9.728,
   2.62
  ],
  "ctr": [
   0.0,
   0.0,
   1.71
  ],
  "zmin": 0.4,
  "zmax": 3.02,
  "faces": 3936,
  "kg": 554,
  "kgNote": "0,85 m³ × 0,65 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Khung_Cua_Chinh",
  "base": "Khung_Cua_Chinh",
  "name": "Khung cửa chính",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Đá trắng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.122,
  "area": 5.52,
  "dim": [
   0.07,
   2.23,
   3.095
  ],
  "ctr": [
   11.779,
   0.0,
   2.809
  ],
  "zmin": 1.262,
  "zmax": 4.357,
  "faces": 174,
  "kg": 318,
  "kgNote": "0,12 m³ × 2,60 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Lo_Thong_Gio_Cua_Sau",
  "base": "Lo_Thong_Gio_Cua_Sau",
  "name": "Lỗ thông gió cửa sau",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Chưa xác định"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.002,
  "area": 0.22,
  "dim": [
   0.032,
   0.97,
   0.25
  ],
  "ctr": [
   -11.29,
   0.0,
   2.875
  ],
  "zmin": 2.75,
  "zmax": 3.0,
  "faces": 24,
  "kg": null,
  "kgNote": "Không tính (cấu kiện rỗng/phi kết cấu)"
 },
 {
  "id": "Song_Sat_O_Vom_Cua",
  "base": "Song_Sat_O_Vom_Cua",
  "name": "Song sắt ô vòm cửa",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Sắt (gỉ đỏ)"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.028,
  "area": 1.83,
  "dim": [
   0.1,
   1.55,
   0.82
  ],
  "ctr": [
   11.404,
   0.0,
   3.61
  ],
  "zmin": 3.2,
  "zmax": 4.02,
  "faces": 84,
  "kg": 217,
  "kgNote": "0,03 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Bau_Cua_So",
  "base": "Bau_Cua_So",
  "name": "Bậu cửa sổ",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Vữa xám"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.803,
  "area": 23.64,
  "dim": [
   23.268,
   12.768,
   0.08
  ],
  "ctr": [
   0.0,
   0.0,
   6.07
  ],
  "zmin": 6.03,
  "zmax": 6.11,
  "faces": 72,
  "kg": 1766,
  "kgNote": "0,80 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Khung_Cua_So_Tang_Tren",
  "base": "Khung_Cua_So_Tang_Tren",
  "name": "Khung cửa sổ tầng trên",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Đá trắng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 1.161,
  "area": 53.37,
  "dim": [
   23.268,
   12.768,
   2.513
  ],
  "ctr": [
   0.0,
   0.0,
   7.318
  ],
  "zmin": 6.062,
  "zmax": 8.575,
  "faces": 1800,
  "kg": 3020,
  "kgNote": "1,16 m³ × 2,60 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Chi_Tiet_Long_Cua_So",
  "base": "Chi_Tiet_Long_Cua_So",
  "name": "Chi tiết lòng cửa sổ",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Gạch trát vôi vàng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 0.633,
  "area": 36.34,
  "dim": [
   22.048,
   11.548,
   1.838
  ],
  "ctr": [
   0.0,
   0.0,
   7.089
  ],
  "zmin": 6.17,
  "zmax": 8.008,
  "faces": 720,
  "kg": 1140,
  "kgNote": "0,63 m³ × 1,80 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Vanh_O_Thong_Gio_Tron",
  "base": "Vanh_O_Thong_Gio_Tron",
  "name": "Vành ô thông gió tròn",
  "group": "03_Cua_Trang_Tri",
  "groupName": "03 · Cửa – trang trí",
  "mats": [
   "Đá trắng"
  ],
  "nien": "1886",
  "nienNote": "Thuộc khối xây nguyên bản của thủy đài (theo hồ sơ dự án).",
  "vol": 2.363,
  "area": 62.52,
  "dim": [
   23.398,
   12.898,
   1.86
  ],
  "ctr": [
   0.0,
   0.0,
   10.35
  ],
  "zmin": 9.42,
  "zmax": 11.28,
  "faces": 2592,
  "kg": 6144,
  "kgNote": "2,36 m³ × 2,60 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Thang_Leo_Sat",
  "base": "Thang_Leo_Sat",
  "name": "Thang leo sắt",
  "group": "04_San_Ket_Cau_Go",
  "groupName": "04 · Sàn & kết cấu gỗ",
  "mats": [
   "Tôn/ống sơn xám"
  ],
  "nien": "1886 (?)",
  "nienNote": "Kết cấu gỗ theo thiết kế nguyên bản; ván và dầm đã thay nhiều lần, chưa rõ năm.",
  "vol": 0.029,
  "area": 2.97,
  "dim": [
   0.564,
   0.445,
   6.25
  ],
  "ctr": [
   -3.194,
   3.864,
   3.325
  ],
  "zmin": 0.2,
  "zmax": 6.45,
  "faces": 272,
  "kg": 228,
  "kgNote": "0,03 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Dam_Go_Chinh",
  "base": "Dam_Go_Chinh",
  "name": "Dầm gỗ chính",
  "group": "04_San_Ket_Cau_Go",
  "groupName": "04 · Sàn & kết cấu gỗ",
  "mats": [
   "Gỗ dầm"
  ],
  "nien": "1886 (?)",
  "nienNote": "Kết cấu gỗ theo thiết kế nguyên bản; ván và dầm đã thay nhiều lần, chưa rõ năm.",
  "vol": 8.54,
  "area": 101.56,
  "dim": [
   15.4,
   9.457,
   0.4
  ],
  "ctr": [
   0.0,
   0.0,
   4.9
  ],
  "zmin": 4.7,
  "zmax": 5.1,
  "faces": 48,
  "kg": 5551,
  "kgNote": "8,54 m³ × 0,65 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Dam_Go_Phu",
  "base": "Dam_Go_Phu",
  "name": "Dầm gỗ phụ",
  "group": "04_San_Ket_Cau_Go",
  "groupName": "04 · Sàn & kết cấu gỗ",
  "mats": [
   "Gỗ dầm"
  ],
  "nien": "1886 (?)",
  "nienNote": "Kết cấu gỗ theo thiết kế nguyên bản; ván và dầm đã thay nhiều lần, chưa rõ năm.",
  "vol": 6.432,
  "area": 194.81,
  "dim": [
   19.991,
   8.2,
   0.22
  ],
  "ctr": [
   0.0,
   -0.2,
   5.21
  ],
  "zmin": 5.1,
  "zmax": 5.32,
  "faces": 1050,
  "kg": 4181,
  "kgNote": "6,43 m³ × 0,65 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "San_Van_Go_Tang_1",
  "base": "San_Van_Go_Tang_1",
  "name": "Sàn ván gỗ tầng 1",
  "group": "04_San_Ket_Cau_Go",
  "groupName": "04 · Sàn & kết cấu gỗ",
  "mats": [
   "Ván sàn gỗ"
  ],
  "nien": "1886 (?)",
  "nienNote": "Kết cấu gỗ theo thiết kế nguyên bản; ván và dầm đã thay nhiều lần, chưa rõ năm.",
  "vol": 9.91,
  "area": 253.41,
  "dim": [
   19.49,
   8.99,
   0.08
  ],
  "ctr": [
   0.0,
   0.0,
   5.36
  ],
  "zmin": 5.32,
  "zmax": 5.4,
  "faces": 334,
  "kg": 6442,
  "kgNote": "9,91 m³ × 0,65 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Ong_Len_Bon_Tay",
  "base": "Ong_Len_Bon_Tay",
  "name": "Ống lên bồn (Tây)",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Gang"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 9.181,
  "area": 86.87,
  "dim": [
   4.505,
   2.21,
   13.646
  ],
  "ctr": [
   -6.397,
   2.4,
   5.483
  ],
  "zmin": -1.34,
  "zmax": 12.306,
  "faces": 3032,
  "kg": 7506,
  "kgNote": "86,9 m² × 12,0 mm × 7,20 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Ong_Xuong_Bon_Tay",
  "base": "Ong_Xuong_Bon_Tay",
  "name": "Ống xuống bồn (Tây)",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Gang"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 9.181,
  "area": 86.87,
  "dim": [
   4.505,
   2.21,
   13.646
  ],
  "ctr": [
   -6.397,
   -2.4,
   5.483
  ],
  "zmin": -1.34,
  "zmax": 12.306,
  "faces": 3032,
  "kg": 7506,
  "kgNote": "86,9 m² × 12,0 mm × 7,20 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Ong_Len_Bon_Dong",
  "base": "Ong_Len_Bon_Dong",
  "name": "Ống lên bồn (Đông)",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Gang"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 9.181,
  "area": 86.87,
  "dim": [
   4.505,
   2.21,
   13.646
  ],
  "ctr": [
   6.397,
   2.4,
   5.483
  ],
  "zmin": -1.34,
  "zmax": 12.306,
  "faces": 3032,
  "kg": 7506,
  "kgNote": "86,9 m² × 12,0 mm × 7,20 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Ong_Xuong_Bon_Dong",
  "base": "Ong_Xuong_Bon_Dong",
  "name": "Ống xuống bồn (Đông)",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Gang"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 9.181,
  "area": 86.87,
  "dim": [
   4.505,
   2.21,
   13.646
  ],
  "ctr": [
   6.397,
   -2.4,
   5.483
  ],
  "zmin": -1.34,
  "zmax": 12.306,
  "faces": 3032,
  "kg": 7506,
  "kgNote": "86,9 m² × 12,0 mm × 7,20 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Kinh_Cuong_Luc_Ho_Van",
  "base": "Kinh_Cuong_Luc_Ho_Van",
  "name": "Kính cường lực hố van",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Kính cường lực"
  ],
  "nien": "Mới – cải tạo",
  "nienNote": "Hạng mục lắp thêm khi cải tạo phục vụ tham quan; chưa xác định năm.",
  "vol": 0.182,
  "area": 15.1,
  "dim": [
   14.4,
   6.1,
   0.025
  ],
  "ctr": [
   0.0,
   0.0,
   0.182
  ],
  "zmin": 0.17,
  "zmax": 0.195,
  "faces": 24,
  "kg": 455,
  "kgNote": "0,18 m³ × 2,50 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Lan_Can_Inox_Ho_Van",
  "base": "Lan_Can_Inox_Ho_Van",
  "name": "Lan can inox hố van",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Inox"
  ],
  "nien": "Mới – cải tạo",
  "nienNote": "Hạng mục lắp thêm khi cải tạo phục vụ tham quan; chưa xác định năm.",
  "vol": 0.086,
  "area": 8.05,
  "dim": [
   11.648,
   6.25,
   0.822
  ],
  "ctr": [
   0.0,
   0.0,
   0.611
  ],
  "zmin": 0.2,
  "zmax": 1.022,
  "faces": 576,
  "kg": 127,
  "kgNote": "8,1 m² × 2,0 mm × 7,90 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Cot_Thep_Giua_Day_Bon",
  "base": "Cot_Thep_Giua_Day_Bon",
  "name": "Cột thép giữa đáy bồn",
  "group": "05_He_Ong_Cong_Nghe",
  "groupName": "05 · Hệ ống công nghệ",
  "mats": [
   "Thép đen"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.634,
  "area": 14.83,
  "dim": [
   11.4,
   2.833,
   6.45
  ],
  "ctr": [
   0.0,
   -0.0,
   8.625
  ],
  "zmin": 5.4,
  "zmax": 11.85,
  "faces": 208,
  "kg": 4975,
  "kgNote": "0,63 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Dan_Thep_Do_Bon_Tay",
  "base": "Dan_Thep_Do_Bon_Tay",
  "name": "Dàn thép đỡ bồn (Tây)",
  "group": "06_Dan_Thep_Do_Bon",
  "groupName": "06 · Dàn thép đỡ bồn",
  "mats": [
   "Thép đen"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 4.876,
  "area": 149.14,
  "dim": [
   9.444,
   9.444,
   0.96
  ],
  "ctr": [
   -5.25,
   0.0,
   11.18
  ],
  "zmin": 10.7,
  "zmax": 11.66,
  "faces": 1224,
  "kg": 38276,
  "kgNote": "4,88 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Dan_Thep_Do_Bon_Dong",
  "base": "Dan_Thep_Do_Bon_Dong",
  "name": "Dàn thép đỡ bồn (Đông)",
  "group": "06_Dan_Thep_Do_Bon",
  "groupName": "06 · Dàn thép đỡ bồn",
  "mats": [
   "Thép đen"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 4.876,
  "area": 149.14,
  "dim": [
   9.444,
   9.444,
   0.96
  ],
  "ctr": [
   5.25,
   0.0,
   11.18
  ],
  "zmin": 10.7,
  "zmax": 11.66,
  "faces": 1224,
  "kg": 38276,
  "kgNote": "4,88 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Day_Bon_Pheu_Tay",
  "base": "Day_Bon_Pheu_Tay",
  "name": "Đáy bồn phễu (Tây)",
  "group": "07_Bon_Chua",
  "groupName": "07 · Bồn chứa",
  "mats": [
   "Thép tấm tán đinh"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 1.688,
  "area": 176.46,
  "dim": [
   9.9,
   9.9,
   1.36
  ],
  "ctr": [
   -5.25,
   0.0,
   12.49
  ],
  "zmin": 11.81,
  "zmax": 13.17,
  "faces": 768,
  "kg": 13252,
  "kgNote": "1,69 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Day_Bon_Pheu_Dong",
  "base": "Day_Bon_Pheu_Dong",
  "name": "Đáy bồn phễu (Đông)",
  "group": "07_Bon_Chua",
  "groupName": "07 · Bồn chứa",
  "mats": [
   "Thép tấm tán đinh"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 1.688,
  "area": 176.46,
  "dim": [
   9.9,
   9.9,
   1.36
  ],
  "ctr": [
   5.25,
   0.0,
   12.49
  ],
  "zmin": 11.81,
  "zmax": 13.17,
  "faces": 768,
  "kg": 13252,
  "kgNote": "1,69 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Than_Bon_Tay",
  "base": "Than_Bon_Tay",
  "name": "Thân bồn (Tây)",
  "group": "07_Bon_Chua",
  "groupName": "07 · Bồn chứa",
  "mats": [
   "Thép tấm tán đinh"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 422.201,
  "area": 341.44,
  "dim": [
   10.24,
   10.24,
   5.6
  ],
  "ctr": [
   -5.25,
   0.0,
   15.85
  ],
  "zmin": 13.05,
  "zmax": 18.65,
  "faces": 1920,
  "kg": 21442,
  "kgNote": "341,4 m² × 8,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Than_Bon_Dong",
  "base": "Than_Bon_Dong",
  "name": "Thân bồn (Đông)",
  "group": "07_Bon_Chua",
  "groupName": "07 · Bồn chứa",
  "mats": [
   "Thép tấm tán đinh"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 422.201,
  "area": 341.44,
  "dim": [
   10.24,
   10.24,
   5.6
  ],
  "ctr": [
   5.25,
   0.0,
   15.85
  ],
  "zmin": 13.05,
  "zmax": 18.65,
  "faces": 1920,
  "kg": 21442,
  "kgNote": "341,4 m² × 8,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Moi_Noi_Gan_Chan_Bon_Tay",
  "base": "Moi_Noi_Gan_Chan_Bon_Tay",
  "name": "Mối nối – gân chân bồn (Tây)",
  "group": "07_Bon_Chua",
  "groupName": "07 · Bồn chứa",
  "mats": [
   "Thép tấm tán đinh"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.219,
  "area": 26.86,
  "dim": [
   10.52,
   10.52,
   5.14
  ],
  "ctr": [
   -5.25,
   0.0,
   15.66
  ],
  "zmin": 13.09,
  "zmax": 18.23,
  "faces": 1152,
  "kg": 1722,
  "kgNote": "0,22 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Moi_Noi_Gan_Chan_Bon_Dong",
  "base": "Moi_Noi_Gan_Chan_Bon_Dong",
  "name": "Mối nối – gân chân bồn (Đông)",
  "group": "07_Bon_Chua",
  "groupName": "07 · Bồn chứa",
  "mats": [
   "Thép tấm tán đinh"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.219,
  "area": 26.86,
  "dim": [
   10.52,
   10.52,
   5.14
  ],
  "ctr": [
   5.25,
   0.0,
   15.66
  ],
  "zmin": 13.09,
  "zmax": 18.23,
  "faces": 1152,
  "kg": 1722,
  "kgNote": "0,22 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "San_Hanh_Lang",
  "base": "San_Hanh_Lang",
  "name": "Sàn hành lang",
  "group": "08_Hanh_Lang",
  "groupName": "08 · Hành lang",
  "mats": [
   "Vữa xám"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 70.923,
  "area": 373.87,
  "dim": [
   24.617,
   14.117,
   0.45
  ],
  "ctr": [
   0.0,
   0.0,
   12.825
  ],
  "zmin": 12.6,
  "zmax": 13.05,
  "faces": 228,
  "kg": 156031,
  "kgNote": "70,92 m³ × 2,20 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Cot_Thep_Hanh_Lang",
  "base": "Cot_Thep_Hanh_Lang",
  "name": "Cột thép hành lang",
  "group": "08_Hanh_Lang",
  "groupName": "08 · Hành lang",
  "mats": [
   "Sắt (gỉ đỏ)"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 5.721,
  "area": 176.71,
  "dim": [
   23.865,
   13.365,
   5.6
  ],
  "ctr": [
   0.0,
   0.0,
   15.85
  ],
  "zmin": 13.05,
  "zmax": 18.65,
  "faces": 336,
  "kg": 11098,
  "kgNote": "176,7 m² × 8,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Lan_Can_Hanh_Lang",
  "base": "Lan_Can_Hanh_Lang",
  "name": "Lan can hành lang",
  "group": "08_Hanh_Lang",
  "groupName": "08 · Hành lang",
  "mats": [
   "Sắt (gỉ đỏ)"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 3.581,
  "area": 157.35,
  "dim": [
   23.769,
   13.269,
   1.3
  ],
  "ctr": [
   0.0,
   0.0,
   13.7
  ],
  "zmin": 13.05,
  "zmax": 14.35,
  "faces": 1536,
  "kg": 4941,
  "kgNote": "157,3 m² × 4,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Diem_Mai_Go",
  "base": "Diem_Mai_Go",
  "name": "Diềm mái",
  "group": "09_Mai",
  "groupName": "09 · Mái",
  "mats": [
   "Tôn/ống sơn xám"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 1.105,
  "area": 54.52,
  "dim": [
   26.077,
   15.577,
   0.33
  ],
  "ctr": [
   0.0,
   0.0,
   18.915
  ],
  "zmin": 18.75,
  "zmax": 19.08,
  "faces": 32,
  "kg": 214,
  "kgNote": "27,3 m² × 1,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Mai_Ton",
  "base": "Mai_Ton",
  "name": "Mái tôn",
  "group": "09_Mai",
  "groupName": "09 · Mái",
  "mats": [
   "Tôn sóng",
   "Gỗ li-tô mái"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 54.694,
  "area": 842.51,
  "dim": [
   26.021,
   15.521,
   4.604
  ],
  "ctr": [
   0.0,
   0.0,
   21.229
  ],
  "zmin": 18.926,
  "zmax": 23.531,
  "faces": 24,
  "kg": 1653,
  "kgNote": "421,3 m² × 0,5 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Song_Mai_Up_Noc",
  "base": "Song_Mai_Up_Noc",
  "name": "Sóng mái úp nóc",
  "group": "09_Mai",
  "groupName": "09 · Mái",
  "mats": [
   "Tôn (gỉ)"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 2.926,
  "area": 65.75,
  "dim": [
   26.166,
   15.666,
   4.632
  ],
  "ctr": [
   0.0,
   0.0,
   21.384
  ],
  "zmin": 19.068,
  "zmax": 23.701,
  "faces": 54,
  "kg": 129,
  "kgNote": "32,9 m² × 0,5 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Ong_Thong_Gio_Noc",
  "base": "Ong_Thong_Gio_Noc",
  "name": "Ống thông gió nóc",
  "group": "09_Mai",
  "groupName": "09 · Mái",
  "mats": [
   "Tôn (gỉ)"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.547,
  "area": 9.01,
  "dim": [
   11.3,
   0.8,
   4.7
  ],
  "ctr": [
   0.0,
   0.0,
   25.781
  ],
  "zmin": 23.431,
  "zmax": 28.131,
  "faces": 178,
  "kg": 35,
  "kgNote": "4,5 m² × 1,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Ong_Thoat_Mua_Gang",
  "base": "Ong_Thoat_Mua_Gang",
  "name": "Ống thoát mưa gang",
  "group": "10_Thoat_Nuoc_Mua",
  "groupName": "10 · Thoát nước mưa",
  "mats": [
   "Gang"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.672,
  "area": 18.43,
  "dim": [
   5.37,
   16.018,
   18.861
  ],
  "ctr": [
   0.0,
   0.0,
   9.459
  ],
  "zmin": 0.029,
  "zmax": 18.89,
  "faces": 744,
  "kg": 796,
  "kgNote": "18,4 m² × 6,0 mm × 7,20 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Ong_Thoat_Mua_Son_Xam",
  "base": "Ong_Thoat_Mua_Son_Xam",
  "name": "Ống thoát mưa sơn xám",
  "group": "10_Thoat_Nuoc_Mua",
  "groupName": "10 · Thoát nước mưa",
  "mats": [
   "Tôn/ống sơn xám"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 1.666,
  "area": 50.29,
  "dim": [
   26.518,
   16.018,
   18.857
  ],
  "ctr": [
   0.0,
   0.0,
   9.462
  ],
  "zmin": 0.033,
  "zmax": 18.89,
  "faces": 2232,
  "kg": 1184,
  "kgNote": "50,3 m² × 3,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Dai_Kep_Ong_Thoat",
  "base": "Dai_Kep_Ong_Thoat",
  "name": "Đai kẹp ống thoát",
  "group": "10_Thoat_Nuoc_Mua",
  "groupName": "10 · Thoát nước mưa",
  "mats": [
   "Thép đen"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.184,
  "area": 10.97,
  "dim": [
   24.452,
   14.068,
   15.52
  ],
  "ctr": [
   0.0,
   0.0,
   9.425
  ],
  "zmin": 1.665,
  "zmax": 17.185,
  "faces": 1728,
  "kg": 1448,
  "kgNote": "0,18 m³ × 7,85 t/m³ (khối đặc trong mô hình)"
 },
 {
  "id": "Mang_Xoi_Tron",
  "base": "Mang_Xoi_Tron",
  "name": "Máng xối tròn",
  "group": "10_Thoat_Nuoc_Mua",
  "groupName": "10 · Thoát nước mưa",
  "mats": [
   "Tôn/ống sơn xám"
  ],
  "nien": "Chưa xác định",
  "nienNote": "Hạng mục bổ sung sau 1886; cần bản vẽ/hồ sơ SAWACO để chốt năm.",
  "vol": 0.264,
  "area": 56.83,
  "dim": [
   26.539,
   16.039,
   0.131
  ],
  "ctr": [
   0.0,
   0.0,
   18.886
  ],
  "zmin": 18.82,
  "zmax": 18.951,
  "faces": 208,
  "kg": 223,
  "kgNote": "28,4 m² × 1,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Choa_Den_Treo_Tang_Tret",
  "base": "Choa_Den_Treo_Tang_Tret",
  "name": "Chóa đèn treo tầng trệt",
  "group": "11_Chieu_Sang_Noi_That",
  "groupName": "11 · Chiếu sáng nội thất",
  "mats": [
   "Thép đen"
  ],
  "nien": "Mới – cải tạo",
  "nienNote": "Hạng mục lắp thêm khi cải tạo phục vụ tham quan; chưa xác định năm.",
  "vol": 0.075,
  "area": 6.79,
  "dim": [
   14.924,
   5.04,
   0.95
  ],
  "ctr": [
   0.0,
   0.0,
   4.425
  ],
  "zmin": 3.95,
  "zmax": 4.9,
  "faces": 1296,
  "kg": 27,
  "kgNote": "3,4 m² × 1,0 mm × 7,85 t/m³ (giả thiết bề dày)"
 },
 {
  "id": "Bong_Den_Tang_Tret",
  "base": "Bong_Den_Tang_Tret",
  "name": "Bóng đèn tầng trệt",
  "group": "11_Chieu_Sang_Noi_That",
  "groupName": "11 · Chiếu sáng nội thất",
  "mats": [
   "Vật liệu phát sáng"
  ],
  "nien": "Mới – cải tạo",
  "nienNote": "Hạng mục lắp thêm khi cải tạo phục vụ tham quan; chưa xác định năm.",
  "vol": 0.021,
  "area": 2.38,
  "dim": [
   14.824,
   4.94,
   0.02
  ],
  "ctr": [
   0.0,
   0.0,
   3.96
  ],
  "zmin": 3.95,
  "zmax": 3.97,
  "faces": 576,
  "kg": null,
  "kgNote": "Không tính (cấu kiện rỗng/phi kết cấu)"
 }
];
