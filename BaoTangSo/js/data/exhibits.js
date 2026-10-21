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
    slots: [null, null, null, null, null, null]
  },
  {
    id: 'g2', no: 'II', years: '1900 – 1954',
    name: 'Mạng lưới thời Pháp thuộc',
    blurb: 'Mạng phân phối mở rộng theo các đại lộ mới. Trụ chữa cháy, van khóa gang, đồng hồ nước ' +
           'bắt đầu xuất hiện như thiết bị chuẩn của một đô thị có áp lực nước thường xuyên.',
    accent: 0xa65642,
    slots: [null, null, null, null, null, null]
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
    blurb: 'Thiết bị đang vận hành trên mạng hôm nay: trụ chữa cháy gang đúc trong nước, ' +
           'trụ nước uống công cộng bằng inox, bên cạnh phân vùng tách mạng (DMA), SCADA và ' +
           'đồng hồ thông minh. Hai hiện vật ở đây dựng theo hồ sơ Blender trong chính kho này.',
    accent: 0x9b7fb0,
    slots: ['tru_nuoc_tai_voi', 'tru_chua_chay', null, null, null, null]
  }
];

/* ------------------------------------------------------------------ vật phẩm */
/* Mỗi vật phẩm: phần mô tả chung + danh sách cấu kiện (khớp id với builder 3D). */

export const ARTIFACTS = {

  tru_nuoc_tai_voi: {
    id: 'tru_nuoc_tai_voi',
    name: 'Trụ nước uống tại vòi',
    nameAlt: 'SAWACO · public drinking fountain',
    period: 'g5',
    mount: 'san',
    badge: 'Mô hình tham khảo',
    nien: 'Mẫu đang lắp đặt · hồ sơ dựng 16/10/2026',
    origin: 'SAWACO · lắp trên hè phố, công viên và trường học TP.HCM',
    dims: 'Thân cao 1.100 mm · Ø miệng 450 mm · Ø chân 320 mm · bệ 1.000 × 1.000 × 150 mm',
    mass: 'Chưa xác định — vỏ inox tôn 1,5 mm nên phần lớn khối lượng nằm ở bệ bê tông',
    matMain: 'Inox tôn 1,5 mm · vòi và viền mạ crôm · bê tông M250, mặt đá granit',
    summary:
      'Điểm uống nước công cộng: người dân bấm nút, nước đã xử lý phun thành tia cong để uống ' +
      'trực tiếp, không cần ly. Đây là hình thức “lấy nước tại vòi” của thời nay — cùng chức năng ' +
      'xã hội với trụ nước công cộng ngày xưa, nhưng đổi từ gang sang inox và từ hứng sang uống.',
    func:
      'Nước theo ống cấp LLDPE OD27 lên trụ, qua hai van bi 1/2 và dây cấp inox tới vòi bấm. ' +
      'Nhả nút là dòng tắt; nước thừa rơi xuống chậu inox, qua lưới chắn rác và thoát bằng ' +
      'ống PVC D42 xuống rãnh.',
    history:
      'Trụ uống nước công cộng là chỉ dấu của một mạng cấp nước đã đạt chất lượng uống tại vòi: ' +
      'áp lực ổn định, chất lượng kiểm soát được tới tận đầu vòi, và đơn vị cấp nước dám đứng tên ' +
      'ngay trên thân trụ.',
    components: [
      { id: 'than_tru', name: 'Thân côn inox', src: 'uoc',
        mat: 'Inox tấm, tôn dày 1,5 mm',
        func: 'Vỏ chịu lực, nâng chậu lên cao độ uống thuận tay và che toàn bộ đường ống bên trong.',
        info: 'Côn thu từ Ø450 ở miệng xuống Ø320 ở chân, cao 1.100 mm tính từ mặt đá. ' +
              'Dáng côn giúp trụ khó bị đổ và dễ lau rửa.' },
      { id: 'chau', name: 'Chậu thu nước và lỗ thoát', src: 'uoc',
        mat: 'Inox dập, viền cuốn mạ crôm, lưới chắn rác',
        func: 'Hứng nước thừa, dẫn về lỗ thoát Ø42, giữ cho mặt bệ không đọng nước.',
        info: 'Lòng chậu sâu khoảng 75 mm, đáy dốc về tâm. Viền cuốn ở miệng vừa cứng mép vừa ' +
              'tránh cạnh sắc khi trẻ em tì vào.' },
      { id: 'voi_bam', name: 'Vòi bấm (bubbler)', src: 'uoc',
        mat: 'Thép mạ crôm, gioăng cao su',
        func: 'Phun tia nước cong lên để uống trực tiếp; nút bấm cạnh vòi mở dòng.',
        info: 'Đầu phun chếch để tia nước không rơi ngược vào miệng vòi. Cao khoảng 85 mm so với ' +
              'mép chậu. Model vòi và mác inox chưa được xác nhận.' },
      { id: 'nhan_dien', name: 'Nhận diện SAWACO', src: 'nguon',
        mat: 'Mực in đen trên thân inox',
        func: 'Cho người dùng biết ai cấp nước và nước này uống được trực tiếp.',
        info: 'Logo chính thức của SAWACO kèm hai dòng “NƯỚC UỐNG TRỰC TIẾP / Drinking water”, ' +
              'uốn theo mặt côn của thân trụ.' },
      { id: 'be_da', name: 'Bệ bê tông và mặt đá granit', src: 'pdf',
        mat: 'Bê tông M250, vữa M75 dày 20 mm, đá granit dày 20 mm, gạch nâng cao độ',
        func: 'Truyền tải trọng xuống nền, nâng mặt đứng cao hơn cỏ 250 mm để không ngập khi mưa.',
        info: 'Theo bản vẽ phê duyệt: bệ 1.000 × 1.000 × 150 mm, mặt đá 1.040 × 1.080 × 20 mm, ' +
              'ốp đá ba mặt, bê tông lót M100 dày 100 mm. Tâm trụ lệch +200 mm so với tâm bệ.' },
      { id: 'ket_cau_neo', name: 'Cốt thép và neo J M10', src: 'pdf',
        mat: 'Thép Ø10 (8 thanh mỗi phương, L950), neo J M10, long đền và đai ốc',
        func: 'Giữ bệ không nứt và khoá chân trụ xuống bệ.',
        info: 'Một thanh thép được dịch tránh lỗ chờ Ø120. Số lượng neo 4 và vòng tâm neo ' +
              'khoảng 230 mm là ước lượng theo sơ đồ, cần bản vẽ chi tiết nếu dùng để chế tạo.' },
      { id: 'cap_thoat', name: 'Tuyến cấp và thoát giấu trong trụ', src: 'pdf',
        mat: 'Ống cấp LLDPE OD27, ống thoát PVC D42, dây cấp inox ren 1/2, van bi',
        func: 'Đưa nước sạch lên vòi và dẫn nước thừa xuống rãnh, toàn bộ nằm khuất trong thân trụ.',
        info: 'Đường kính lấy theo bản vẽ; tuyến đi, cao độ và hình dáng phụ kiện là minh hoạ. ' +
              'Hai van bi cho phép khoá nước ngay trong trụ khi bảo trì vòi.' }
    ],
    sourceNote: 'Dựng lại từ Tru_nuoc_tai_voi_20261016/build_fountain.py trong kho này. ' +
                'Kích thước bệ, cốt thép và đường kính ống lấy theo bản vẽ phê duyệt ' +
                '(BV phe duyet TH 12 13 14.pdf); kích thước thân, chậu và vòi là ước lượng theo ảnh, ' +
                'chưa phải kích thước chế tạo.'
  },

  tru_chua_chay: {
    id: 'tru_chua_chay',
    name: 'Trụ chữa cháy Thảo Tín Vũ DN100',
    nameAlt: 'Pillar fire hydrant · DN100',
    period: 'g5',
    mount: 'san',
    badge: 'Mô hình tham khảo',
    nien: 'Sản phẩm đang lưu hành · hồ sơ dựng 16/10/2026',
    origin: 'Thảo Tín Vũ (Việt Nam) · đấu trên ống phân phối, đặt tại mép đường',
    dims: 'Trên đất h1 = 750 mm · dưới đất h2 = 800 – 1.010 mm · tổng H = 1.550 – 1.760 mm · ' +
          'tâm hai họng bên h = 490 mm · bích đế Ø328 mm',
    mass: 'Catalogue chưa ghi khối lượng',
    matMain: 'Gang đúc sơn đỏ (phần nổi) · sơn xanh (đoạn ngầm) · bạc đồng thau · bu lông thép',
    summary:
      'Đầu lấy nước dành riêng cho chữa cháy, đấu trực tiếp vào mạng phân phối. Phần nổi sơn đỏ ' +
      'mang ba họng chờ; phần ngầm sơn xanh nối xuống cổ 90 và mặt bích DN100. Mô hình dựng ở ' +
      'cấu hình lắp ngắn nhất của catalogue.',
    func:
      'Quay đầu vuông trên nắp vàng để mở van, nước từ ống phân phối dâng lên thân trụ và ra họng ' +
      'chờ. Họng lớn phía trước cấp cho xe chữa cháy, hai họng nhỏ hai bên cấp cho lăng phun. ' +
      'Cổ lồng điều chỉnh cho phép chỉnh cao độ trụ theo cốt vỉa hè.',
    history:
      'Trụ chữa cháy biến áp lực mạng cấp nước thành một chỉ tiêu an toàn công cộng: mạng phải giữ ' +
      'được áp và lưu lượng chữa cháy ở giờ cao điểm, không chỉ đủ nước sinh hoạt.',
    components: [
      { id: 'than_tru', name: 'Thân trụ gang sơn đỏ', src: 'cat',
        mat: 'Gang đúc, sơn đỏ',
        func: 'Khoang chứa nước khi trụ làm việc, mang ba họng chờ và chữ đắp nổi của nhà sản xuất.',
        info: 'Biên dạng thân lấy theo catalogue hình trang 4–5. Gân dọc ở chân trụ và vòng hoa văn ' +
              'vừa tăng cứng vừa là chi tiết nhận dạng của hãng.' },
      { id: 'bich_de', name: 'Mặt bích đế và bu lông', src: 'web',
        mat: 'Gang đúc, bu lông thép',
        func: 'Nối phần nổi với đoạn ngầm và truyền lực xuống bệ.',
        info: 'Đường kính đế Ø328 mm là số lấy từ website hãng, chưa có bản vẽ xác nhận tương thích ' +
              'với biến thể cao 750 mm trong catalogue hình.' },
      { id: 'nap_dinh', name: 'Nắp đỉnh vàng và đầu vuông vận hành', src: 'cat',
        mat: 'Gang đúc sơn vàng, đầu vuông thép',
        func: 'Nhận chìa chuyên dùng để mở van chính; nắp gân toả che mưa nắng cho cổ ty van.',
        info: 'Đỉnh đầu vuông nằm đúng cao độ h1 = 750 mm của catalogue. Đầu vuông cố tình không ' +
              'dùng được cờ lê thường.' },
      { id: 'hong_lon', name: 'Họng lớn phía trước', src: 'uoc',
        mat: 'Gang đúc, bạc đồng thau, nắp có tay giữ',
        func: 'Đấu vòi rồng lớn của xe chữa cháy.',
        info: 'Tâm họng ở cao độ 438 mm. Bạc đồng ở miệng họng chống ăn mòn chỗ tháo lắp nhiều. ' +
              'Kích thước lòng họng và nắp là ước lượng theo ảnh sản phẩm.' },
      { id: 'hong_ben', name: 'Hai họng nhỏ hai bên', src: 'cat',
        mat: 'Gang đúc, bạc đồng thau',
        func: 'Cấp cho hai lăng phun hoạt động đồng thời.',
        info: 'Tâm hai họng ở cao độ h = 490 mm theo catalogue. Nắp có tay giữ chữ U và chốt bản lề ' +
              'để không rơi mất khi mở gấp trong đêm.' },
      { id: 'bau_duoi', name: 'Bầu dưới đoạn ngầm', src: 'uoc',
        mat: 'Gang đúc, sơn xanh',
        func: 'Nối thân trụ xuống ống đứng ngầm, là nơi đặt vùng kín nước dưới cốt đất.',
        info: 'Sơn xanh để phân biệt phần chôn với phần nổi. Mô hình chỉ dựng ngoại hình, ' +
              'không dựng cơ cấu van bên trong.' },
      { id: 'co_dieu_chinh', name: 'Cổ lồng điều chỉnh cao độ', src: 'uoc',
        mat: 'Gang đúc, bích kẹp và bu lông thép',
        func: 'Chỉnh chiều cao trụ theo cốt vỉa hè thực tế mà không phải thay cả trụ.',
        info: 'Nhờ bộ phận này mà h2 chạy được từ 800 đến 1.010 mm, tức tổng cao 1.550 – 1.760 mm.' },
      { id: 'ong_ngam', name: 'Ống đứng ngầm', src: 'cat',
        mat: 'Gang đúc, sơn xanh',
        func: 'Dẫn nước từ cổ 90 dưới đất lên thân trụ.',
        info: 'Chiều dài ống quyết định cấu hình lắp; mô hình để ở cấu hình ngắn nhất h2 = 800 mm.' },
      { id: 'co_90', name: 'Cổ 90, bích đầu vào DN100 và chân co', src: 'uoc',
        mat: 'Gang đúc, bu lông thép',
        func: 'Chuyển hướng dòng từ ống nằm ngang lên trụ đứng và truyền lực xuống chân đỡ.',
        info: 'DN100 là cỡ danh nghĩa đầu vào, không phải đường kính thân trụ. Vòng bu lông ' +
              '8 lỗ Ø18 trên bích là chi tiết minh hoạ, chưa đối chiếu bản vẽ của sản phẩm này.' }
    ],
    sourceNote: 'Dựng lại từ Tru_Thao_Tin_Vu/dung_tru_DN100.py trong kho này. Số đo chính theo ' +
                'catalogue hình trang 4–5 của Thảo Tín Vũ (h=490, h1=750, h2=800–1.010, ' +
                'H=1.550–1.760 mm). Website và PDF cũ ghi phần nổi 620 mm — không trộn hai biến thể. ' +
                'Biên dạng chi tiết, họng, bu lông và hoa văn là ước lượng theo ảnh, không phải ' +
                'hình học chế tạo; không dựng cơ cấu van bên trong.'
  }
};

/* nguồn của từng số đo, hiện thành nhãn nhỏ trong bảng cấu kiện */
export const SRC_LABEL = {
  cat: 'Theo catalogue',
  pdf: 'Theo bản vẽ phê duyệt',
  web: 'Theo website hãng',
  nguon: 'Theo nguồn chính thức',
  uoc: 'Ước lượng theo ảnh'
};

export const periodOf = id => PERIODS.find(p => p.id === id);
