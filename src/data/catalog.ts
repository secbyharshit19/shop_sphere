export type CategoryId =
  | 'all'
  | 'electronics'
  | 'home-kitchen'
  | 'workspace'
  | 'accessories';

export interface Category {
  id: Exclude<CategoryId, 'all'>;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductGalleryImage {
  src: string;
  alt: string;
  label: string;
  zoomClass?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: ProductGalleryImage[];
  deliveryNote: string;
  deliveryDays: number;
  warranty: string;
  availability: string;
  stockCount: number;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  specifications: ProductSpecification[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export function getDiscountPercentage(
  price: number,
  originalPrice?: number
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export const HERO_IMAGE =
  '/src/assets/images/hero_shopsphere_showcase_1795083645266.jpg';

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    tagline: 'Audio & wearables',
    image: '/src/assets/images/product_wireless_headphones_1795083645466.jpg',
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    tagline: 'Espresso & lighting',
    image: '/src/assets/images/product_espresso_machine_1795083643933.jpg',
  },
  {
    id: 'workspace',
    name: 'Workspace',
    tagline: 'Desk hardware',
    image: '/src/assets/images/product_mechanical_keyboard_1795083646873.jpg',
  },
  {
    id: 'accessories',
    name: 'Everyday Carry',
    tagline: 'Bags & travel gear',
    image: '/src/assets/images/product_commuter_backpack_1795083645532.jpg',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'sp-audio-01',
    sku: 'AUR-PRO-ANC2',
    name: 'Auralis Pro Wireless ANC Over-Ear Headphones',
    brand: 'Auralis Audio',
    category: 'electronics',
    categoryLabel: 'Electronics',
    price: 279.0,
    originalPrice: 329.0,
    rating: 4.8,
    reviewCount: 1842,
    image: '/src/assets/images/product_wireless_headphones_1795083645466.jpg',
    gallery: [
      {
        src: '/src/assets/images/product_wireless_headphones_1795083645466.jpg',
        alt: 'Auralis Pro Wireless ANC Headphones front studio profile',
        label: 'Studio Profile',
      },
      {
        src: '/src/assets/images/gallery_headphones_detail_1795084974538.jpg',
        alt: 'Auralis Pro headphones resting on a walnut desk with brushed aluminum hinges and USB-C cable',
        label: 'Desk & Hinge Detail',
      },
      {
        src: '/src/assets/images/product_wireless_headphones_1795083645466.jpg',
        alt: 'Close-up of matte obsidian earcups and anodized gunmetal hardware',
        label: 'Close-Up Finish',
        zoomClass: 'scale-[1.32] origin-center',
      },
    ],
    deliveryNote: 'Free two-day delivery',
    deliveryDays: 2,
    warranty: '2-year acoustic & battery warranty',
    availability: 'In Stock',
    stockCount: 18,
    shortDescription:
      'Adaptive hybrid active noise cancellation with 40mm acoustic drivers, brushed aluminum hinges, and 45 hours of continuous wireless playback.',
    fullDescription:
      'Engineered for focused studio listening and quiet long-haul travel, the Auralis Pro pairs custom 40mm beryllium-coated dynamic drivers with six beamforming microphones that continuously adapt to cabin and office acoustics. Machined gunmetal hinges and breathable lambskin memory-foam cushions distribute clamping force evenly for all-day comfort, while lossless USB-C audio mode lets you plug directly into a workstation whenever needed.',
    highlights: [
      '45-hour battery life with USB-C fast charging (10 min gives 5 hours)',
      'Multipoint Bluetooth 5.3 for instant laptop-to-phone switching',
      'Memory foam lambskin ear cushions and molded travel case included',
      'Dedicated transparency mode for effortless conversation without removing',
    ],
    specifications: [
      { label: 'Driver Unit', value: '40mm Custom Dynamic' },
      { label: 'Battery Life', value: 'Up to 45 hours (ANC On)' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, USB-C Audio' },
      { label: 'Weight', value: '268 grams' },
    ],
  },
  {
    id: 'sp-kitchen-02',
    sku: 'VERO-BAR-58SS',
    name: 'Barista Compact Stainless Steel Espresso Machine',
    brand: 'Vero Kitchen',
    category: 'home-kitchen',
    categoryLabel: 'Home & Kitchen',
    price: 449.0,
    originalPrice: 519.0,
    rating: 4.9,
    reviewCount: 964,
    image: '/src/assets/images/product_espresso_machine_1795083643933.jpg',
    gallery: [
      {
        src: '/src/assets/images/product_espresso_machine_1795083643933.jpg',
        alt: 'Vero Barista Compact Stainless Steel Espresso Machine studio view',
        label: 'Studio Front',
      },
      {
        src: '/src/assets/images/gallery_espresso_detail_1795084976353.jpg',
        alt: 'Close-up espresso shot pulling from walnut-handled portafilter into ceramic cup',
        label: 'Extraction Detail',
      },
      {
        src: '/src/assets/images/product_espresso_machine_1795083643933.jpg',
        alt: 'Close-up of brushed stainless steel control panel and pressure gauge',
        label: 'Gauge & Controls',
        zoomClass: 'scale-[1.35] origin-[52%_38%]',
      },
    ],
    deliveryNote: 'Free two-day delivery',
    deliveryDays: 2,
    warranty: '2-year residential appliance warranty',
    availability: 'In Stock',
    stockCount: 4,
    shortDescription:
      'Precision PID thermoblock espresso maker in brushed 304 stainless steel with a 58mm walnut-handled portafilter and commercial steam wand.',
    fullDescription:
      'Bring café-grade extraction to a compact kitchen counter. Built with a brushed 304 stainless steel chassis and a PID-regulated thermoblock heater, the Barista Compact reaches stable brewing temperature in under 35 seconds. Its commercial 58mm walnut-handled portafilter, front-mounted analog pressure gauge, and articulating steam wand give you full tactile control over espresso shots and microfoam texture.',
    highlights: [
      'Heats to PID-stabilized brewing temperature in under 35 seconds',
      'Built-in extraction pressure gauge for repeatable rich crema',
      '1.8L removable water reservoir and stainless drip tray',
      'Includes 58mm single & double baskets, tamper, and milk pitcher',
    ],
    specifications: [
      { label: 'Portafilter Size', value: '58mm Commercial Brass' },
      { label: 'Heating System', value: 'PID Thermoblock (1450W)' },
      { label: 'Water Tank', value: '1.8L Removable BPA-Free' },
      { label: 'Dimensions', value: '9.8" W × 12.2" D × 13.4" H' },
    ],
  },
  {
    id: 'sp-work-03',
    sku: 'KC-75-ALU-SL',
    name: 'Keycraft 75% Anodized Aluminum Mechanical Keyboard',
    brand: 'Keycraft Labs',
    category: 'workspace',
    categoryLabel: 'Workspace',
    price: 168.0,
    originalPrice: 195.0,
    rating: 4.8,
    reviewCount: 731,
    image: '/src/assets/images/product_mechanical_keyboard_1795083646873.jpg',
    gallery: [
      {
        src: '/src/assets/images/product_mechanical_keyboard_1795083646873.jpg',
        alt: 'Keycraft 75% Anodized Aluminum Mechanical Keyboard overhead angle',
        label: 'Studio Angle',
      },
      {
        src: '/src/assets/images/gallery_keyboard_detail_1795084976592.jpg',
        alt: 'Close-up of Keycraft amber escape keycap and sculpted slate PBT keycaps on felt desk mat',
        label: 'Keycap & Switch Detail',
      },
      {
        src: '/src/assets/images/product_mechanical_keyboard_1795083646873.jpg',
        alt: 'Macro view of anodized aluminum chassis bevel and key legends',
        label: 'Chassis Finish',
        zoomClass: 'scale-[1.35] origin-[30%_45%]',
      },
    ],
    deliveryNote: 'Free two-day delivery',
    deliveryDays: 2,
    warranty: '1-year hardware replacement warranty',
    availability: 'In Stock',
    stockCount: 24,
    shortDescription:
      'CNC-machined aluminum wireless 75% keyboard featuring hot-swappable tactile switches, double-shot PBT keycaps, and gasket-mounted acoustics.',
    fullDescription:
      'Milled from a solid block of 6063 bead-blasted aluminum, the Keycraft 75% delivers crisp, damped typing acoustics through multi-layer silicone gasket mounting. Switch effortlessly between three wireless hosts via Bluetooth 5.1, low-latency 2.4GHz dongle, or braided USB-C cable. Hot-swappable 5-pin sockets and included macOS/Windows modifier keycaps make customization straightforward right out of the box.',
    highlights: [
      'Tri-mode connectivity: 2.4GHz wireless, Bluetooth 5.1, and USB-C',
      'Hot-swappable PCB with factory-lubed tactile mechanical switches',
      'Programmable layouts compatible with macOS, Windows, and Linux',
      'Up to 180 hours battery runtime with backlight dimmed',
    ],
    specifications: [
      { label: 'Layout', value: '75% Compact (84 Keys)' },
      { label: 'Case Material', value: 'CNC 6063 Anodized Aluminum' },
      { label: 'Keycaps', value: 'Double-Shot Matte PBT' },
      { label: 'Battery Capacity', value: '4,000 mAh Rechargeable' },
    ],
  },
  {
    id: 'sp-tech-04',
    sku: 'CHR-TI4-NVY',
    name: 'Chronos Titanium Series 4 GPS Smartwatch',
    brand: 'Chronos Gear',
    category: 'electronics',
    categoryLabel: 'Electronics',
    price: 349.0,
    originalPrice: 389.0,
    rating: 4.7,
    reviewCount: 2150,
    image: '/src/assets/images/product_smartwatch_titanium_1795083645695.jpg',
    gallery: [
      {
        src: '/src/assets/images/product_smartwatch_titanium_1795083645695.jpg',
        alt: 'Chronos Titanium Series 4 GPS Smartwatch three-quarter studio view',
        label: 'Studio View',
      },
      {
        src: '/src/assets/images/gallery_smartwatch_detail_1795084976780.jpg',
        alt: 'Macro close-up of brushed titanium case, tactile crown, and woven navy sport loop',
        label: 'Titanium & Crown Detail',
      },
      {
        src: '/src/assets/images/product_smartwatch_titanium_1795083645695.jpg',
        alt: 'Close-up of sapphire crystal display and braided navy band weave',
        label: 'Display & Band',
        zoomClass: 'scale-[1.34] origin-[45%_45%]',
      },
    ],
    deliveryNote: 'Free two-day delivery',
    deliveryDays: 2,
    warranty: '2-year limited hardware warranty',
    availability: 'In Stock',
    stockCount: 9,
    shortDescription:
      'Aerospace-grade brushed titanium case paired with sapphire crystal glass, dual-frequency GPS, and a breathable woven navy sport loop.',
    fullDescription:
      'Built to transition smoothly from trail runs to client meetings, the Chronos Titanium Series 4 combines a lightweight Grade-5 brushed titanium housing with scratch-resistant flat sapphire glass. Dual-frequency L1+L5 GPS locks onto urban and mountain routes rapidly, while optical heart-rate, blood-oxygen, and sleep recovery metrics run continuously across a 72-hour battery cycle.',
    highlights: [
      'Always-on high-brightness OLED display (2,000 nits peak outdoor legibility)',
      'Water resistant to 50 meters with continuous health & workout tracking',
      '72-hour typical battery life with magnetic rapid charger included',
      'Breathable woven deep-navy nylon band with quick-release titanium lugs',
    ],
    specifications: [
      { label: 'Case Material', value: 'Grade-5 Brushed Titanium (44mm)' },
      { label: 'Crystal', value: 'Flat Sapphire Glass' },
      { label: 'Water Resistance', value: '5 ATM / 50 Meters' },
      { label: 'Battery Runtime', value: 'Up to 72 Hours Typical' },
    ],
  },
  {
    id: 'sp-carry-05',
    sku: 'MRD-22L-NVCL',
    name: 'Meridian 22L Ballistic Nylon & Leather Commuter Pack',
    brand: 'Meridian Carry',
    category: 'accessories',
    categoryLabel: 'Everyday Carry',
    price: 185.0,
    originalPrice: 215.0,
    rating: 4.9,
    reviewCount: 618,
    image: '/src/assets/images/product_commuter_backpack_1795083645532.jpg',
    gallery: [
      {
        src: '/src/assets/images/product_commuter_backpack_1795083645532.jpg',
        alt: 'Meridian 22L dark navy ballistic nylon and leather commuter backpack',
        label: 'Exterior Profile',
      },
      {
        src: '/src/assets/images/gallery_backpack_detail_1795084977450.jpg',
        alt: 'Open interior view of Meridian backpack showing padded laptop sleeve and organized pockets',
        label: 'Interior & Laptop Sleeve',
      },
      {
        src: '/src/assets/images/product_commuter_backpack_1795083645532.jpg',
        alt: 'Close-up of vegetable-tanned cognac leather trim and 1680D ballistic weave',
        label: 'Materials Close-Up',
        zoomClass: 'scale-[1.35] origin-[48%_40%]',
      },
    ],
    deliveryNote: 'Free two-day delivery',
    deliveryDays: 2,
    warranty: 'Lifetime stitch & zipper guarantee',
    availability: 'In Stock',
    stockCount: 5,
    shortDescription:
      'Structured everyday commuter backpack crafted from 1680D water-resistant ballistic nylon and vegetable-tanned full-grain leather trim.',
    fullDescription:
      'Designed to stand upright on conference room floors and slide cleanly beneath airline seats, the Meridian 22L balances rugged weather protection with tailored detail. Its abrasion-resistant 1680D ballistic nylon shell sheds light rain, while full-grain cognac leather handles and base trim develop a rich patina over years of daily commuting.',
    highlights: [
      'Suspended fleece-lined sleeve protects laptops up to 16 inches',
      'Weather-sealed YKK AquaGuard zippers and quick-access passport pocket',
      'Integrated luggage pass-through strap for effortless airport transit',
      'Contoured breathable back panel with hidden magnetic water bottle pocket',
    ],
    specifications: [
      { label: 'Capacity', value: '22 Liters' },
      { label: 'Laptop Fit', value: 'Up to 16-inch MacBook / PC' },
      { label: 'Shell Fabric', value: '1680D Water-Resistant Ballistic Nylon' },
      { label: 'Weight', value: '1.15 kg (2.5 lbs)' },
    ],
  },
  {
    id: 'sp-home-06',
    sku: 'LUMA-ATL-CHBR',
    name: 'Atelier Articulated Architectural LED Desk Lamp',
    brand: 'Luma Studio',
    category: 'home-kitchen',
    categoryLabel: 'Home & Kitchen',
    price: 129.0,
    originalPrice: 149.0,
    rating: 4.7,
    reviewCount: 489,
    image: '/src/assets/images/product_desk_lamp_1795083646430.jpg',
    gallery: [
      {
        src: '/src/assets/images/product_desk_lamp_1795083646430.jpg',
        alt: 'Atelier Articulated Architectural LED Desk Lamp full profile',
        label: 'Studio Profile',
      },
      {
        src: '/src/assets/images/gallery_lamp_detail_1795084976225.jpg',
        alt: 'Atelier LED desk lamp illuminating a hardcover notebook on a dark walnut desk',
        label: 'Warm Task Lighting',
      },
      {
        src: '/src/assets/images/product_desk_lamp_1795083646430.jpg',
        alt: 'Close-up of solid brushed brass friction hinge and matte charcoal arm',
        label: 'Brass Hinge Detail',
        zoomClass: 'scale-[1.4] origin-[55%_32%]',
      },
    ],
    deliveryNote: 'Free two-day delivery',
    deliveryDays: 2,
    warranty: '3-year LED & finish warranty',
    availability: 'In Stock',
    stockCount: 15,
    shortDescription:
      'Precision-balanced matte charcoal aluminum task lamp with solid brushed brass friction joints and high-CRI flicker-free warm LED illumination.',
    fullDescription:
      'Crafted for architects, writers, and late-night readers, the Atelier task lamp delivers clean, glare-free illumination exactly where you direct it. Precision-milled brushed brass friction hinges hold their angle smoothly without exposed springs, while a CRI 97+ optical diffuser renders natural ink, fabric, and paper colors accurately without visual fatigue.',
    highlights: [
      'CRI 97+ optical diffuser reduces eye strain during extended desk sessions',
      'Stepless touch dimming from 2700K warm ambient to 4500K neutral white',
      'Weighted matte steel base with 6-foot braided textile power cord',
      '50,000-hour rated solid-state LED array with zero audible hum',
    ],
    specifications: [
      { label: 'Color Accuracy', value: 'CRI 97+ Flicker-Free LED' },
      { label: 'Color Temperature', value: '2700K – 4500K Adjustable' },
      { label: 'Materials', value: 'Anodized Aluminum & Solid Brass' },
      { label: 'Max Reach Height', value: '22.5 inches' },
    ],
  },
];

export const SEARCH_CATEGORY_OPTIONS: { value: CategoryId; label: string }[] = [
  { value: 'all', label: 'All Departments' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home-kitchen', label: 'Home & Kitchen' },
  { value: 'workspace', label: 'Workspace' },
  { value: 'accessories', label: 'Everyday Carry' },
];
