/* Nội dung trưng bày — bảo tàng số trong lòng thủy đài 1886.
   Mỗi thời kỳ một gian; mỗi gian có 6 ô trưng bày, ô nào chưa có vật phẩm thì để trống.
   Hình học 3D nằm trong js/artifacts/*, phần chữ nghĩa nằm hết ở đây.               */

export const PERIODS = [
  {
    id: 'g1', no: 'I', years: '1878 – 1900',
    name: 'Khởi nguyên — nước máy về Sài Gòn',
    blurb: 'Những giếng khoan đầu tiên ở khu Công trường Quốc tế, thủy đài 1886 và mạng ống gang ' +
           'đưa nước tới các vòi công cộng. Người dân lấy nước tại vòi, chưa có đồng hồ riêng từng nhà.',
    accent: 0xd79a3c,
    slots: ['tru_nuoc_tai_voi', null, null, null, null, null]
  },
  {
    id: 'g2', no: 'II', years: '1900 – 1954',
    name: 'Mạng lưới thời Pháp thuộc',
    blurb: 'Mạng phân phối mở rộng theo các đại lộ mới. Trụ chữa cháy, van khóa gang, đồng hồ nước ' +
           'bắt đầu xuất hiện như thiết bị chuẩn của một đô thị có áp lực nước thường xuyên.',
    accent: 0xa65642,
    slots: ['tru_chua_chay', null, null, null, null, null]
  },
  {
    id: 'g3', no: 'III', years: '1954 – 1975',
    name: 'Thủ Đức và đô thị mở rộng',
    blurb: 'Nhà máy nước Thủ Đức đưa nguồn nước mặt sông Đồng Nai về thành phố. Ống gang dẻo, ' +
           'ống thép đường kính lớn, trạm bơm tăng áp thay dần hệ cấp nước bằng thủy đài.',
    accent: 0x7fa66a,
    slots: [null, null, null, null, null, null]
  },
  {
    id: 'g4', no: 'IV', years: '1975 – 2000',
    name: 'Tiếp quản, phục hồi, chống thất thu',
    blurb: 'Giai đoạn sửa chữa và vá mạng. Thiết bị dò bục, van giảm áp, đồng hồ tổng theo tuyến ' +
           'là công cụ chính của người vận hành.',
    accent: 0x6f8fb0,
    slots: [null, null, null, null, null, null]
  },
  {
    id: 'g5', no: 'V', years: '2000 – nay',
    name: 'Số hóa mạng cấp nước',
    blurb: 'Phân vùng tách mạng (DMA), SCADA, logger áp lực – lưu lượng, đồng hồ thông minh. ' +
           'Vật phẩm của thời kỳ này phần lớn là dữ liệu, không còn là gang thép.',
    accent: 0x9b7fb0,
    slots: [null, null, null, null, null, null]
  }
];

/* ------------------------------------------------------------------ vật phẩm */
/* Mỗi vật phẩm: phần mô tả chung + danh sách cấu kiện (khớp id với builder 3D). */

export const ARTIFACTS = {

  tru_nuoc_tai_voi: {
    id: 'tru_nuoc_tai_voi',
    name: 'Trụ nước tại vòi',
    nameAlt: 'Borne-fontaine · public standpipe',
    period: 'g1',
    nien: 'Cuối thế kỷ 19 – đầu thế kỷ 20',
    origin: 'Gang đúc nhập từ Pháp, lắp trên mạng ống gang nội thành',
    dims: 'Cao ≈ 1,25 m · thân Ø ≈ 260 mm · bệ Ø ≈ 900 mm',
    mass: '≈ 150 kg (thân gang, chưa kể bệ)',
    matMain: 'Gang xám · đồng thau · đá/bê tông',
    draft: true,
    summary:
      'Điểm lấy nước công cộng đặt tại đầu một nhánh ống phân phối. Trụ đưa dòng nước từ ống ngầm ' +
      'lên cao độ thuận tay, cho người dân hứng trực tiếp vào thùng, gánh, lu. Trong giai đoạn ' +
      'chưa có đồng hồ từng hộ, đây là giao diện duy nhất giữa mạng cấp nước và người dùng.',
    func:
      'Mở van tay → nước trong lòng trụ dâng và chảy ra vòi đồng, rơi xuống bệ có rãnh thoát. ' +
      'Van đóng lại cắt dòng ngay tại cổ trụ nên phần ống ngầm luôn giữ áp.',
    history:
      'Mỗi trụ phục vụ một cụm dân cư quanh bán kính vài trăm mét; vị trí trụ thường thành tên gọi ' +
      'của cả góc phố. Khi đồng hồ nước vào từng nhà, các trụ bị tháo dần, chỉ còn lại ở công viên ' +
      'và một số ngã ba cũ.',
    components: [
      { id: 'mu_tru', name: 'Mũ trụ (chóp đỉnh)',
        mat: 'Gang xám đúc',
        func: 'Che mưa bụi cho cổ trụ và cụm van, đồng thời là chi tiết trang trí đúc liền khuôn.',
        info: 'Thường đúc hoa văn thực vật hoặc múi cam. Tháo được bằng ren hoặc chốt ngang để sửa van.' },
      { id: 'than_tru', name: 'Thân trụ',
        mat: 'Gang xám đúc, sơn phủ gốc dầu',
        func: 'Vỏ chịu lực bao ngoài, giữ ống dẫn trong lòng và chịu va đập của xe, gánh nước.',
        info: 'Vách dày 8 – 12 mm, đúc thành một khối với vành bích chân. Gang chịu nén tốt nhưng giòn, ' +
              'nên hỏng do va đập thường là nứt dọc thân.' },
      { id: 'ong_long', name: 'Ống dẫn trong lòng trụ',
        mat: 'Gang hoặc đồng thau',
        func: 'Dẫn nước từ ống nhánh dưới đất lên tới cổ vòi.',
        info: 'Nằm lệch tâm để dành chỗ cho ty van. Đoạn nối với vòi dùng đệm da hoặc gai sợi tẩm chì đỏ.' },
      { id: 'van_tay', name: 'Van khóa và tay mở',
        mat: 'Thân đồng thau, ty thép, đệm da',
        func: 'Đóng – mở dòng nước ngay tại cổ trụ.',
        info: 'Loại tay quay giữ nguyên độ mở; loại tay bóp (lò xo hồi) tự đóng khi thả, dùng để ' +
              'chống bỏ quên gây chảy tràn.' },
      { id: 'voi_dong', name: 'Vòi chảy (ống ngỗng)',
        mat: 'Đồng thau',
        func: 'Định hướng tia nước ra ngoài mép bệ, đủ cao để đặt thùng và gánh bên dưới.',
        info: 'Khoảng hở dưới vòi 350 – 450 mm. Đồng thau được chọn vì không rỉ và không nhiễm vị vào nước.' },
      { id: 'be_thoat', name: 'Bệ và hố thoát',
        mat: 'Đá xanh hoặc bê tông, rãnh gang',
        func: 'Hứng nước rơi, dẫn về rãnh thoát, giữ mặt đất quanh trụ không hóa bùn.',
        info: 'Mặt bệ dốc về tâm 2 – 3 %. Hố thoát đấu vào rãnh đường, không đấu vào ống cấp nước.' },
      { id: 'bich_chan', name: 'Bích chân và ống nhánh',
        mat: 'Gang xám, bu lông thép, đệm chì',
        func: 'Nối trụ với ống phân phối ngầm và truyền lực đứng xuống bệ.',
        info: 'Phần dưới cốt đất là chỗ hỏng kín tiếng nhất: rò ở đệm bích chảy ngầm nhiều năm mới lộ ' +
              'trên mặt đường.' }
    ],
    sourceNote: 'Mô tả và số đo đang là bản tạm, dựng theo cấu tạo chung của trụ nước công cộng gang. ' +
                'Thay bằng hồ sơ / ảnh hiện vật của bạn.'
  },

  tru_chua_chay: {
    id: 'tru_chua_chay',
    name: 'Trụ chữa cháy (trụ nổi)',
    nameAlt: 'Bouche d’incendie · pillar fire hydrant',
    period: 'g2',
    nien: 'Thế kỷ 20 — vẫn còn dùng, thay đổi ít về nguyên lý',
    origin: 'Đấu trên ống phân phối Ø100 trở lên, đặt tại mép đường',
    dims: 'Cao trên đất ≈ 900 mm · họng vào DN100 · 2 họng chờ DN65',
    mass: '≈ 90 – 130 kg',
    matMain: 'Gang đúc sơn đỏ · ty thép không gỉ · đĩa van cao su',
    draft: true,
    summary:
      'Đầu lấy nước dành riêng cho chữa cháy, lấy trực tiếp từ mạng phân phối. Lúc bình thường trụ ' +
      'khô và kín; khi có cháy, xe cứu hỏa đấu vòi rồng vào họng chờ rồi mở van chính bằng chìa chuyên dùng.',
    func:
      'Quay đai ốc đỉnh → ty van hạ đĩa van chính ở chân trụ → nước từ ống dưới đất tràn lên khoang ' +
      'thân và ra họng chờ. Đóng van, van xả tự động mở để rút hết nước đọng trong thân.',
    history:
      'Trụ chữa cháy biến áp lực mạng cấp nước thành một chỉ tiêu an toàn công cộng: mạng phải giữ ' +
      'được áp và lưu lượng chữa cháy ở giờ cao điểm, không chỉ đủ nước sinh hoạt.',
    components: [
      { id: 'nap_dinh', name: 'Nắp đỉnh và đai ốc vận hành',
        mat: 'Gang đúc, đai ốc thép',
        func: 'Nhận chìa khóa chuyên dùng để quay trục van chính.',
        info: 'Đai ốc tiết diện ngũ giác hoặc vuông — cố tình không dùng được cờ lê thường, để người ' +
              'không có nhiệm vụ khó mở trụ.' },
      { id: 'than_tren', name: 'Thân trụ trên',
        mat: 'Gang đúc, sơn đỏ gốc epoxy',
        func: 'Khoang chứa nước khi trụ hoạt động, đồng thời mang các họng chờ.',
        info: 'Sơn đỏ là quy ước nhận dạng. Thân đúc liền, chỉ có mặt bích trên và bích nối ở chân.' },
      { id: 'hong_cho', name: 'Họng chờ và nắp họng',
        mat: 'Gang hoặc hợp kim nhôm, dây giữ thép',
        func: 'Điểm đấu nhanh vòi rồng của xe cứu hỏa.',
        info: 'Hai họng DN65 đối xứng cho hai lăng phun đồng thời. Nắp có dây giữ để không mất khi mở ' +
              'gấp trong đêm; ren hoặc khớp claw phải đúng chuẩn của địa phương.' },
      { id: 'ty_van', name: 'Ty van (trục vận hành)',
        mat: 'Thép không gỉ',
        func: 'Truyền chuyển động quay từ đai ốc đỉnh xuống van chính ở chân trụ.',
        info: 'Dài gần hết chiều cao trụ. Ren ty nằm trong vùng khô nên ít bị kẹt; kẹt ty thường do ' +
              'lệch tâm sau khi trụ bị húc.' },
      { id: 'van_chinh', name: 'Van chính và đĩa cao su',
        mat: 'Thân đồng, đĩa cao su NBR',
        func: 'Giữ kín nước ở chân trụ; mở ra là cấp toàn bộ lưu lượng.',
        info: 'Đặt thấp hơn cốt đất để vùng kín nước không bị ảnh hưởng khi phần trên bị hư hại.' },
      { id: 'khop_an_toan', name: 'Khớp an toàn chống đâm',
        mat: 'Gang, bu lông cắt',
        func: 'Hy sinh có tính toán: xe húc thì khớp gãy, thân trụ bật ra mà van chính vẫn kín.',
        info: 'Nhờ khớp này, một cú húc chỉ tốn một thân trụ chứ không làm bục ống phân phối và ' +
              'mất nước cả khu.' },
      { id: 'van_xa', name: 'Van xả tự động',
        mat: 'Đồng thau',
        func: 'Xả nước đọng trong thân trụ ra lớp đá hộc khi van chính đóng.',
        info: 'Giữ trụ luôn khô giữa hai lần dùng: chống đóng băng ở xứ lạnh, chống nước tù và ăn mòn ' +
              'ở xứ nóng.' },
      { id: 'de_khuyu', name: 'Đế khuỷu và bích DN100',
        mat: 'Gang xám, bu lông thép, gối bê tông',
        func: 'Chuyển hướng dòng từ ống nằm ngang lên trụ đứng và truyền lực xuống gối bê tông.',
        info: 'Phải có gối tựa và lớp đá hộc thoát nước; thiếu gối thì lực đẩy khi mở van sẽ kéo lệch ' +
              'mối nối ống.' }
    ],
    sourceNote: 'Mô tả và số đo đang là bản tạm, dựng theo cấu tạo chung của trụ chữa cháy gang kiểu ' +
                'trụ nổi. Thay bằng hồ sơ / ảnh hiện vật của bạn.'
  }
};

export const periodOf = id => PERIODS.find(p => p.id === id);
