// UI strings. The page language comes from <html lang>. Arabic pages live in /ar/.
export const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
export const isRTL = lang === 'ar';

const dict = {
  en: {
    skip: 'Skip to content', home: 'Home', products: 'Our Products', industries: 'Industry', brands: 'Brands', about: 'About Us', contact: 'Contact Us', blog: 'Blog',
    quote: "Let's Talk", openMenu: 'Open menu', closeMenu: 'Close menu', menu: 'Menu', allProducts: 'All products',
    switchLang: 'العربية', mission: 'At TTC Distribution our Mission is to deliver the highest Quality, value added Products and services in the Scope of our interests.',
    support: 'Our support is available to help you 24 hours a day, seven days a week, 365 days a year.',
    company: 'Company', product: 'Product', contactH: 'Contact', address: '47 Nabil El Wakad, Ard El Golf, Cairo, Egypt',
    rights: 'All Rights Reserved TTC Distribution', concept: 'Concept by PHAROSLINE', privacy: 'Privacy Policy',
    waLabel: 'Chat on WhatsApp', waBubble: 'Need a quotation? Chat with us', waClose: 'Dismiss',
    results: (n) => `${n} product${n === 1 ? '' : 's'}`, noResults: 'No products match these filters.',
    all: 'All', view3d: 'View in 3D →', addTo: (n) => `Add ${n} to quote`, model3d: (n) => `3D model of ${n}`,
    added: '✓ Added to quote', add: 'Add to quote', titleSuffix: 'Camera | TTC Distribution',
  },
  ar: {
    skip: 'انتقل إلى المحتوى', home: 'الرئيسية', products: 'المنتجات', industries: 'القطاعات', brands: 'العلامات التجارية', about: 'من نحن', contact: 'اتصل بنا', blog: 'المدونة',
    quote: 'تواصل معنا', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة', menu: 'القائمة', allProducts: 'كل المنتجات',
    switchLang: 'English', mission: 'رسالتنا في TTC Distribution هي تقديم منتجات وخدمات بأعلى جودة وقيمة مضافة في مجالات تخصصنا.',
    support: 'فريق الدعم متاح لمساعدتك على مدار الساعة، طوال أيام الأسبوع، طوال العام.',
    company: 'الشركة', product: 'المنتجات', contactH: 'تواصل معنا', address: '47 شارع نبيل الوقاد، أرض الجولف، القاهرة، مصر',
    rights: 'جميع الحقوق محفوظة © TTC Distribution', concept: 'تصميم PHAROSLINE', privacy: 'سياسة الخصوصية',
    waLabel: 'راسلنا على واتساب', waBubble: 'محتاج عرض سعر؟ كلّمنا على واتساب', waClose: 'إغلاق',
    results: (n) => `${n.toLocaleString('ar-EG')} ${n === 1 ? 'منتج' : n === 2 ? 'منتجان' : n <= 10 ? 'منتجات' : 'منتجًا'}`,
    noResults: 'لا توجد منتجات تطابق هذه الفلاتر.',
    all: 'الكل', view3d: 'عرض ثلاثي الأبعاد ←', addTo: (n) => `أضف ${n} إلى عرض السعر`, model3d: (n) => `نموذج ثلاثي الأبعاد لـ ${n}`,
    added: '✓ أُضيف إلى عرض السعر', add: 'أضف إلى عرض السعر', titleSuffix: '| TTC Distribution',
  },
};
export const t = dict[lang];

/** Localised product field: uses `<field>_ar` when on Arabic pages, falls back to English. */
export const pf = (p, field) => (isRTL && p[field + '_ar'] != null ? p[field + '_ar'] : p[field]);

const specKeysAr = {
  Resolution: 'الدقة', Lens: 'العدسة', 'IR range': 'مدى الأشعة تحت الحمراء', 'Low light': 'الإضاءة المنخفضة', Protection: 'الحماية',
  Compression: 'الضغط', Power: 'الطاقة', Temperature: 'درجة حرارة التشغيل', Zoom: 'التقريب', 'Pan / Tilt': 'الدوران / الإمالة',
  'Field of view': 'مجال الرؤية', Sensor: 'المستشعر', 'Detection range': 'مدى الكشف', 'Thermal sensitivity': 'الحساسية الحرارية',
  Analytics: 'التحليلات', Certification: 'الشهادات', Housing: 'الهيكل', Shutter: 'الغالق',
};
export const specKey = (k) => (isRTL ? specKeysAr[k] || k : k);

/** URL of the same page in the other language. */
export function altLangHref() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return (isRTL ? '../' : 'ar/') + file + location.search;
}

/** Path prefix to the site root ('' on EN pages, '../' on AR pages). */
export const root = isRTL ? '../' : '';
