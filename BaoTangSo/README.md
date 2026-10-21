# Bảo tàng số trong lòng thủy đài 1886

Bản dựng sơ bộ: người xem đi bộ bằng góc nhìn thứ nhất trong một không gian trưng bày
gồm **tiền sảnh tròn + 5 gian theo 5 thời kỳ**, mỗi gian có 6 ô trưng bày.

Hai hiện vật đầu tiên nằm ở **gian V (2000 – nay)** vì cả hai đều là thiết bị đang lưu hành:
**trụ nước uống tại vòi SAWACO** và **trụ chữa cháy Thảo Tín Vũ DN100**. Hình học của chúng
dựng lại từ chính hồ sơ Blender trong kho này (`Tru_nuoc_tai_voi_20261016/build_fountain.py`
và `Tru_Thao_Tin_Vu/dung_tru_DN100.py`), giữ nguyên số đo gốc; mỗi cấu kiện ghi rõ số đo đến
từ catalogue, bản vẽ phê duyệt, website hãng hay chỉ là ước lượng theo ảnh (dấu ≈ trong danh sách).
Nhìn vào một vật phẩm rồi nhấn `E` → vật phẩm xoay chậm trên bàn xoay, có thể
**tách rời từng cấu kiện** và đọc vật liệu – chức năng – ghi chú của từng cấu kiện.

Bố cục các gian **không theo kết cấu thật của thủy đài** (đúng như yêu cầu), chỉ mượn
hình khối tròn và mái nón có giếng trời.

## Chạy thử

Phải chạy qua một máy chủ tĩnh **từ thư mục gốc của repo** (mở thẳng `file://` sẽ bị
trình duyệt chặn ES module, và trang dùng chung thư viện three.js nằm ở `../ThuyDai_Explode/vendor`).

```bash
cd <thư mục repo>
python3 -m http.server 8777
# rồi mở http://localhost:8777/BaoTangSo/
```

## Chạy trên web (GitHub Pages)

Repo này công khai nên bật Pages là có link bấm thẳng từ trình duyệt, không cần cài gì:

**Settings → Pages → Source: “Deploy from a branch” → chọn nhánh + thư mục `/ (root)` → Save.**

Sau 1–2 phút trang chạy tại `https://<tài-khoản>.github.io/Thuydai1886/`
(ở đây là https://0388311299.github.io/Thuydai1886/). Chọn nhánh `main` thì nhớ gộp
nhánh phát triển vào `main` trước; hoặc chọn thẳng nhánh phát triển để xem bản thử
mà chưa gộp. File `.nojekyll` ở gốc repo để GitHub phục vụ nguyên file tĩnh.

Muốn xem nhanh một nhánh bất kỳ mà không bật Pages: thay `github.com` bằng
`raw.githack.com` trong đường dẫn tới file, ví dụ
`https://raw.githack.com/0388311299/Thuydai1886/<nhánh>/BaoTangSo/index.html`.

## Điều khiển

| | |
|---|---|
| `W A S D` / phím mũi tên | đi lại |
| chuột | nhìn quanh (tự khóa con trỏ; nơi nào trình duyệt chặn thì kéo chuột để nhìn) |
| `Shift` | đi nhanh |
| `E` hoặc bấm chuột | xem vật phẩm đang ngắm |
| `M` | sơ đồ bảo tàng, bấm để dịch chuyển tới từng gian |
| `Esc` | tạm dừng / thoát chế độ xem |
| Điện thoại | kéo nửa màn hình trái để đi, nửa phải để nhìn |

Trong chế độ xem vật phẩm: kéo để xoay, con lăn để phóng, thanh trượt **Tách cấu kiện**
hoặc phím `Space` để bung, bấm vào cấu kiện (trên mô hình hoặc trong danh sách bên trái)
để chọn riêng.

## Cấu trúc mã

```
BaoTangSo/
├── index.html              khung giao diện (HUD, bảng xem vật phẩm)
├── css/museum.css
└── js/
    ├── museum.js           khởi động: cảnh, vòng lặp, ngắm – chọn, sơ đồ
    ├── architecture.js     dựng tiền sảnh, 5 gian, ô trưng bày, vật cản, đèn
    ├── walker.js           góc nhìn thứ nhất + va chạm + cảm ứng
    ├── inspector.js        chế độ xem vật phẩm: xoay, tách cấu kiện, bảng chữ
    ├── label.js            chữ 3D vẽ bằng canvas (biển gian, bảng tên hiện vật)
    ├── data/exhibits.js    ❶ nội dung: thời kỳ, vật phẩm, cấu kiện
    └── artifacts/          ❷ hình học 3D của từng vật phẩm
        ├── kit.js          vật liệu + khối cơ bản dùng chung
        ├── tru_nuoc_tai_voi.js
        ├── tru_chua_chay.js
        └── index.js        sổ đăng ký builder
```

## Thêm một vật phẩm mới

1. **Viết nội dung** trong `js/data/exhibits.js` → thêm một mục vào `ARTIFACTS`
   (tên, niên đại, kích thước, chức năng, và mảng `components`: mỗi cấu kiện có
   `id`, `name`, `mat`, `func`, `info`).
2. **Dựng hình** trong `js/artifacts/<id>.js`: dùng `compiler(root)` rồi
   `C.add('<id cấu kiện>', [dx, dy, dz])` — vector đó là **quãng đường cấu kiện bay ra
   khi tách 100 %**. `id` phải trùng với `id` trong `components`.
3. **Đăng ký** builder trong `js/artifacts/index.js`.
4. **Đặt vào ô trưng bày**: thêm id vào mảng `slots` của thời kỳ tương ứng trong `PERIODS`
   (6 ô mỗi gian, thứ tự: trái–gần cửa, phải–gần cửa, trái–trong, phải–trong, sau–trái, sau–phải).

Hai tuỳ chọn hay dùng trong mục `ARTIFACTS`: `mount: 'san'` cho hiện vật có cả phần móng —
tủ trưng bày tự sâu thêm, hiện vật đứng thẳng trên sàn tủ thay vì trên bệ; và
`root.userData.groundLine = true` trong builder để tủ vẽ thêm vạch **cốt đất** cho phần chôn ngầm.
Trường `src` của mỗi cấu kiện (`cat`, `pdf`, `web`, `nguon`, `uoc`) quyết định nhãn nguồn số đo.

Muốn thêm/bớt thời kỳ thì thêm phần tử vào `PERIODS` — số gian, số cửa và vách tiền sảnh
tự chia lại theo số thời kỳ.

## Chất liệu và độ thật của mô hình

Hiện vật đang được dựng bằng khối cơ bản nhưng đã có lớp vật liệu thật sự:

- `js/artifacts/materials.js` sinh thẳng bằng canvas ba bản đồ cho mỗi chất liệu —
  **màu** (gỉ, tróc sơn, gỉ đồng), **độ nhám + độ kim loại** (kênh lục và lam của
  cùng một ảnh), **pháp tuyến** (rỗ đúc, xước, hạt đá). Không cần tệp ảnh ngoài.
- Mật độ hoạ tiết tính theo kích thước thật: `TILE` trong `kit.js` là bề rộng một ô
  hoạ tiết (0,22 m). Nhờ vậy khối nhỏ không bị nén hoạ tiết, khối tròn xoay không nổi
  vân như gỗ.
- Bóng đổ thật trong chế độ xem vật phẩm (đèn chính đổ bóng, khung chiếu bám theo cỡ
  vật phẩm), cộng vệt bóng tiếp đất trong tủ trưng bày.

Muốn thật hơn nữa thì theo thứ tự hiệu quả giảm dần:

1. **Thay bằng mô hình thật**: quét ảnh hiện vật (50–120 tấm quanh vật, ánh sáng đều,
   dùng RealityCapture / Meshroom / Polycam) hoặc dựng trong Blender, nung (bake)
   màu + nhám + pháp tuyến vào texture rồi xuất `.glb`. Giữ nguyên tên cấu kiện là
   phần tách rời và bảng chữ chạy y nguyên.
2. **Vát cạnh**: cạnh vuông tuyệt đối là dấu hiệu rõ nhất của hàng dựng máy. Thêm vài
   điểm biên dạng trong `lathe(...)` hoặc vòng `ring(...)` ở chỗ giao khối.
3. **Ảnh môi trường thật** (HDRI) thay cho `RoomEnvironment` dựng sẵn — phản chiếu
   trên gang và đồng sẽ có hình khối thay vì loang đều.
4. **Hậu kỳ**: bloom nhẹ và che khuất môi trường (SSAO) — cần nạp thêm
   `EffectComposer` vào `vendor/three/jsm`.

## Còn phải làm

- **Bốn gian đầu còn trống.** Gian I–IV chờ hiện vật của từng thời kỳ; mỗi ô trống hiện
  bảng “chờ hiện vật”.
- **Chưa nạp thẳng từ `.blend`.** Hình học hiện được chép tay từ mã dựng Blender. Khi nào
  tiện, xuất `.glb` từ hai file `.blend` rồi nạp bằng `GLTFLoader`, giữ nguyên tên cấu kiện
  là phần tách rời và bảng chữ chạy y nguyên — lúc đó sửa mô hình chỉ cần sửa trong Blender.
- **Chưa dựng cơ cấu van bên trong trụ chữa cháy** (hồ sơ gốc cũng chưa có), và các chi tiết
  đánh dấu ≈ vẫn là ước lượng theo ảnh, không dùng để chế tạo.
- Chưa có: âm thanh nền, bản dịch tiếng Anh, chế độ xem trên kính VR, ảnh tư liệu kèm
  theo từng vật phẩm.
