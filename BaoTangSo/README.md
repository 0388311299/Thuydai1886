# Bảo tàng số trong lòng thủy đài 1886

Bản dựng sơ bộ: người xem đi bộ bằng góc nhìn thứ nhất trong một không gian trưng bày
gồm **tiền sảnh tròn + 5 gian theo 5 thời kỳ**, mỗi gian có 6 ô trưng bày.
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

Muốn thêm/bớt thời kỳ thì thêm phần tử vào `PERIODS` — số gian, số cửa và vách tiền sảnh
tự chia lại theo số thời kỳ.

## Còn phải làm

- **Thay nội dung tạm**: hai vật phẩm hiện có mang nhãn “Dữ liệu tạm”, mô tả dựng theo
  cấu tạo chung chứ chưa theo hồ sơ hiện vật thật. Số đo, niên đại, xuất xứ cần thay
  bằng tài liệu của bạn.
- Hình học vật phẩm đang dựng bằng khối cơ bản. Khi có bản quét 3D hoặc mô hình Blender
  của hiện vật thật, thay builder bằng một file `.glb` mỗi vật phẩm, giữ nguyên quy ước
  đặt tên cấu kiện để phần tách rời và bảng chữ chạy y nguyên.
- Chưa có: âm thanh nền, bản dịch tiếng Anh, chế độ xem trên kính VR, ảnh tư liệu kèm
  theo từng vật phẩm.
