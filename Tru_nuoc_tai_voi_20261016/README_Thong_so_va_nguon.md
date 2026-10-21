# Trụ nước uống tại vòi SAWACO - mô hình tham khảo 16/10/2026

Mở `Tru_nuoc_SAWACO.blend`. Blender đang mở ở scene `TRU_NUOC_SAWACO`.
- `TRU_NUOC_SAWACO`: ngoại hình trụ, chậu, vòi, nhãn và bệ đá.
- `TRU_NUOC_KY_THUAT`: minh hoạ neo, cốt thép, ống cấp/thoát và hình nhân 1.700 mm.
- `Scene`: cảnh ban đầu được giữ nguyên, gồm Cube, Camera và Light.

## Theo PDF người dùng
`BV phe duyet TH 12 13 14.pdf`, trang 2/4/6: bệ bê tông M250 1.000 x 1.000 x 150 mm; thép 8Ø10 mỗi phương, L950; lỗ chờ Ø120; neo J M10; mặt đá granit 1.040 x 1.080 x 20 mm; vữa M75 dày 20 mm; ốp đá 3 mặt 250 x 1.040 x 20 mm; gạch nâng cao độ 200 mm, bê tông lót M100 dày 100 mm. Vị trí tâm lỗ cách mép trái 700 mm trên mặt bằng. Mô hình dùng tâm trụ x=+200 mm so với tâm bệ. Mặt đá được đặt z=+250 mm so với cỏ.
Trang 1/3/5: cấp LLDPE OD27, thoát PVC D42, dây cấp inox ren 1/2, van bi và phụ kiện tương ứng.

## Ước lượng theo ảnh - chưa phải kích thước chế tạo
Thân cao 1.100 mm tính từ mặt đá; đường kính miệng 450 mm, chân 320 mm; vỏ dày 1,5 mm; chậu sâu khoảng 75 mm; vòi cao khoảng 85 mm. Hình dáng nút bấm, đầu phun, lưới rác, hướng đường ống và vị trí các phụ kiện bên trong là minh hoạ. Chưa xác nhận mác inox, model vòi hoặc thiết bị nội bộ.
Số lượng neo 4 và vòng tâm neo khoảng 230 mm là ước lượng theo sơ đồ. Một thanh Y được dịch tránh lỗ chờ; vị trí thanh, lớp bảo vệ và neo cần bản vẽ chi tiết để dùng cho chế tạo. Người 1.700 mm là mốc tỷ lệ minh hoạ, không phải chiều cao đo được của người trong ảnh.

## Phạm vi
Đã dựng trụ và bệ dùng chung; chưa chọn và dựng tuyến ống ngoài trụ theo TH12 (DN100, nhánh 4m), TH13 (D63, nhánh 4m) hoặc TH14 (DN300, nhánh 10m). Chiều dài ống trong bảng vật tư và tuyến lắp đặt là các thông số khác nhau, không tự đồng nhất.
Các mesh/curve, vật liệu và nhãn tách riêng trong collection. Hai dòng chữ đã được uốn theo thân trụ thành mesh; chuỗi gốc lưu trong custom property `editable_text_source`. Mã dựng lưu trong file Python và Text Editor của Blender. File Python dựng mới, không dùng để chồng lên scene đang có cùng tên.

## Nguồn tham khảo trực tuyến
- Logo gốc SAWACO, dùng alpha để in đen trên thân: https://portalapi.sawaco.com.vn/Upload/Tmp/Account/admin/20230614201052807_logo_chuan.png
- Ảnh trụ cạnh trẻ em: https://sawaco.com.vn/post-detail/sawaco-vung-buoc-tren-hanh-trinh-cap-nuoc-an-toan-%E2%80%93-nam-2025-ghi-dau-nhieu-chuyen-bien-tich-cuc-251113152307.html
- Ảnh lắp đặt, đối chiếu tỷ lệ người/trụ: https://sawaco.com.vn/post-detail/cap-nuoc-an-toan-huong-den-tien-ich-cho-nguoi-dan-260406164952
Không tìm được kích thước chế tạo xác thực cho đúng mẫu trên nguồn đã tra. Không dùng kích thước của sản phẩm khác thay cho mẫu này.
