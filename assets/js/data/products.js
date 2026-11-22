// Product catalog data.
// Later this file is replaced by an API call (e.g. GET /api/products?category=cctv).
// `model` = path to a .glb exported from Hyper3D Rodin. Leave null to use the built-in procedural 3D model.

export const categories = [
  { id: 'cctv', name: 'CCTV & IP Cameras', short: 'CCTV' },
  { id: 'access', name: 'Access Control', short: 'Access' },
  { id: 'vms', name: 'VMS & Storage Servers', short: 'VMS' },
  { id: 'fire', name: 'Fire Alarm Systems', short: 'Fire' },
  { id: 'network', name: 'Networking & Power Management', short: 'Network' },
  { id: 'intercom', name: 'IP Intercom & IP Audio Systems', short: 'Intercom' },
  { id: 'accessories', name: 'Security Systems Accessories', short: 'Accessories' },
];

export const products = [
  {
    id: 'bullet-4k-ir', category: 'cctv', type: 'Bullet', shape: 'bullet', brand: 'Axis',
    name: 'Bullet 4K Outdoor IR', sku: 'TTC-CB-4K40',
    summary: 'Weather-hardened 4K bullet camera with 40 m IR, deep-learning analytics and IK10 housing.',
    specs: { Resolution: '3840×2160 (8 MP)', Lens: '3.9–10 mm varifocal, P-iris', 'IR range': '40 m OptimizedIR', 'Low light': '0.08 lux colour', Protection: 'IP66 / IP67 / IK10', Compression: 'H.265 Zipstream', Power: 'PoE Class 3', Temperature: '−40 °C to 60 °C' },
    tags: ['4K', 'IR', 'Outdoor', 'AI analytics'], model: null,
  },
  {
    id: 'dome-5mp-vandal', category: 'cctv', type: 'Fixed Dome', shape: 'dome', brand: 'Axis',
    name: 'Fixed Dome 5MP Vandal', sku: 'TTC-CD-5MPV',
    summary: 'Discreet vandal-resistant dome with Lightfinder 2.0 for banks, hotels and retail.',
    specs: { Resolution: '2592×1944 (5 MP)', Lens: '3–6 mm, remote zoom', 'IR range': '30 m', 'Low light': 'Lightfinder 2.0', Protection: 'IP66 / IK10', Compression: 'H.264 / H.265', Power: 'PoE Class 2', Temperature: '−40 °C to 55 °C' },
    tags: ['5MP', 'Indoor', 'Outdoor', 'Vandal'], model: null,
  },
  {
    id: 'ptz-32x', category: 'cctv', type: 'PTZ', shape: 'ptz', brand: 'Axis',
    name: 'PTZ 32× Optical Zoom', sku: 'TTC-CP-32X',
    summary: 'High-speed 360° pan, 32× optical zoom and auto-tracking for perimeters and city surveillance.',
    specs: { Resolution: '1920×1080 (2 MP)', Zoom: '32× optical, 12× digital', 'Pan / Tilt': '360° endless / 220°', 'IR range': '250 m', Protection: 'IP66 / NEMA 4X', Compression: 'H.265 Zipstream', Power: 'High PoE 60 W', Temperature: '−50 °C to 65 °C' },
    tags: ['PTZ', 'Long range', 'Outdoor', 'Auto-tracking'], model: null,
  },
  {
    id: 'panoramic-180', category: 'cctv', type: 'Panoramic', shape: 'dome', brand: 'Axis',
    name: 'Panoramic 180° Multi-Sensor', sku: 'TTC-CN-180',
    summary: 'Four sensors stitched into one seamless 180° view — one camera instead of four.',
    specs: { Resolution: '4 × 4 MP', 'Field of view': '180° horizontal', 'Low light': 'Lightfinder 2.0', Protection: 'IP66 / IK10', Compression: 'H.265', Power: 'PoE Class 4', Temperature: '−40 °C to 55 °C' },
    tags: ['Multi-sensor', 'Outdoor', 'Wide area'], model: null,
  },
  {
    id: 'thermal-bullet', category: 'cctv', type: 'Thermal', shape: 'bullet', brand: 'Axis',
    name: 'Thermal Perimeter Bullet', sku: 'TTC-CT-640',
    summary: 'Detects people and vehicles in total darkness, smoke and fog for critical perimeters.',
    specs: { Sensor: '640×480 uncooled', 'Detection range': 'Human up to 640 m', 'Thermal sensitivity': '< 50 mK', Protection: 'IP66 / IP67', Analytics: 'Perimeter Defender', Power: 'PoE Class 3', Temperature: '−40 °C to 60 °C' },
    tags: ['Thermal', 'Perimeter', 'Outdoor'], model: null,
  },
  {
    id: 'ex-proof-ptz', category: 'cctv', type: 'Explosion-protected', shape: 'ptz', brand: 'Axis',
    name: 'Explosion-Protected PTZ', sku: 'TTC-CX-EXPTZ',
    summary: 'ATEX / IECEx certified stainless PTZ for oil, gas and chemical sites.',
    specs: { Resolution: '1920×1080', Zoom: '30× optical', Certification: 'ATEX, IECEx, Class I Div 1', Housing: '316L stainless steel', Protection: 'IP66 / IP68', Temperature: '−50 °C to 60 °C' },
    tags: ['Hazardous area', 'PTZ', 'Industrial'], model: null,
  },
  {
    id: 'mini-dome-2mp', category: 'cctv', type: 'Fixed Dome', shape: 'dome', brand: 'Canon',
    name: 'Mini Dome 2MP Indoor', sku: 'TTC-CD-2MPI',
    summary: 'Compact, cost-effective indoor dome for offices, shops and residential buildings.',
    specs: { Resolution: '1920×1080 (2 MP)', Lens: '2.8 mm fixed', 'IR range': '20 m', Protection: 'IK08', Compression: 'H.265', Power: 'PoE / 12 V DC' },
    tags: ['2MP', 'Indoor', 'Cost-effective'], model: null,
  },
  {
    id: 'bullet-lpr', category: 'cctv', type: 'Bullet', shape: 'bullet', brand: 'Canon',
    name: 'LPR Traffic Bullet', sku: 'TTC-CB-LPR',
    summary: 'License-plate recognition camera for gates, parking and toll roads.',
    specs: { Resolution: '1920×1080', Lens: '10–50 mm motorised', Shutter: '1/100 000 s', 'IR range': '50 m', Protection: 'IP67', Analytics: 'ANPR on-edge' },
    tags: ['LPR', 'Traffic', 'Outdoor', 'AI analytics'], model: null,
  },
];

export const getProduct = (id) => products.find((p) => p.id === id);

// ---------- Arabic content (merged into the objects above) ----------
const categoriesAr = { cctv: 'كاميرات المراقبة وIP', access: 'أنظمة التحكم في الدخول', vms: 'خوادم إدارة وتخزين الفيديو', fire: 'أنظمة إنذار الحريق', network: 'الشبكات وإدارة الطاقة', intercom: 'الإنتركم والصوت عبر IP', accessories: 'ملحقات الأنظمة الأمنية' };
categories.forEach((c) => (c.name_ar = categoriesAr[c.id]));

const typesAr = { Bullet: 'بوليت', 'Fixed Dome': 'قبة ثابتة', PTZ: 'PTZ متحركة', Panoramic: 'بانورامية', Thermal: 'حرارية', 'Explosion-protected': 'مقاومة للانفجار' };
const tagsAr = { '4K': '4K', IR: 'رؤية ليلية', Outdoor: 'خارجية', Indoor: 'داخلية', 'AI analytics': 'تحليلات ذكية', '5MP': '5MP', Vandal: 'مقاومة للتخريب', PTZ: 'PTZ', 'Long range': 'مدى بعيد', 'Auto-tracking': 'تتبع تلقائي', 'Multi-sensor': 'متعددة المستشعرات', 'Wide area': 'مساحات واسعة', Thermal: 'حرارية', Perimeter: 'تأمين المحيط', 'Hazardous area': 'مناطق خطرة', Industrial: 'صناعية', '2MP': '2MP', 'Cost-effective': 'اقتصادية', LPR: 'قراءة اللوحات', Traffic: 'مرور' };
const ar = {
  'bullet-4k-ir': ['كاميرا بوليت 4K خارجية بالأشعة تحت الحمراء', 'كاميرا بوليت بدقة 4K مقاومة للعوامل الجوية، مع رؤية ليلية حتى 40 مترًا وتحليلات بالذكاء الاصطناعي وهيكل IK10.'],
  'dome-5mp-vandal': ['كاميرا قبة 5MP مقاومة للتخريب', 'كاميرا قبة غير لافتة للنظر ومقاومة للتخريب بتقنية Lightfinder 2.0، مناسبة للبنوك والفنادق ومتاجر التجزئة.'],
  'ptz-32x': ['كاميرا PTZ بتقريب بصري 32×', 'دوران سريع 360° مع تقريب بصري 32× وتتبع تلقائي، لتأمين المحيط ومراقبة المدن.'],
  'panoramic-180': ['كاميرا بانورامية 180° متعددة المستشعرات', 'أربعة مستشعرات في صورة واحدة متصلة بزاوية 180°، كاميرا واحدة بدلًا من أربع.'],
  'thermal-bullet': ['كاميرا بوليت حرارية لتأمين المحيط', 'ترصد الأشخاص والمركبات في الظلام التام والدخان والضباب لحماية المواقع الحساسة.'],
  'ex-proof-ptz': ['كاميرا PTZ مقاومة للانفجار', 'كاميرا PTZ من الفولاذ المقاوم للصدأ معتمدة ATEX و IECEx لمواقع البترول والغاز والكيماويات.'],
  'mini-dome-2mp': ['كاميرا قبة صغيرة 2MP داخلية', 'كاميرا قبة صغيرة واقتصادية للمكاتب والمحلات والمباني السكنية.'],
  'bullet-lpr': ['كاميرا بوليت لقراءة لوحات السيارات', 'كاميرا للتعرف على لوحات السيارات للبوابات والجراجات وطرق الرسوم.'],
};
products.forEach((p) => {
  [p.name_ar, p.summary_ar] = ar[p.id] || [];
  p.type_ar = typesAr[p.type] || p.type;
  p.tags_ar = p.tags.map((tg) => tagsAr[tg] || tg);
});
