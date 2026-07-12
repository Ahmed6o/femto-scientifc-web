import { supabase } from './db.js';

export const newProducts = [
  {
    slug: "tensiio-force-tensiometer",
    name: "Tensíío Force Tensiometer",
    brand: "KRÜSS",
    category: "Pharmaceutical Analysis",
    industry: ["Pharmaceutical", "Chemical"],
    description: "KRÜSS Scientific is a leader in surface science, providing precision instruments for measuring surface and interfacial tension, contact angle, and related physical properties.",
    excerpt: "Precision wettability analysis with Tensiometers in the Washburn Direct Method.",
    specifications: [
      "Contact angle (Washburn): 0 to 90°",
      "Contact angle (Wilhelmy plate): 0 to 180°",
      "Interfacial and surface tension Range: 1 to 2000 mN/m",
      "Temperature control Internal: -15 to 300 °C"
    ],
    image: "/images/products/product_3.png",
    featured: true
  },
  {
    slug: "sync-particle-size-shape-analyzer",
    name: "SYNC Particle Size and Shape Analyzer",
    brand: "MICROTRAC",
    category: "Particle Characterization",
    industry: ["Pharmaceutical"],
    description: "MRB integrates its highly accurate patented tri-laser diffraction analyzer technology with its versatile dynamic image analysis capability to provide particle characterization practitioners with a unique measuring experience.",
    excerpt: "Pioneer PARTICLE SIZE AND SHAPE ANALYZER",
    specifications: [
      "Measuring range: 10 nm - 4 mm",
      "Measuring principle: Laser Diffraction (ISO 13320) static light scattering",
      "Measuring time: ~ 10 to 30 seconds"
    ],
    image: "/images/products/product_15.jpeg",
    featured: true
  },
  {
    slug: "turbiscan-lab",
    name: "TURBISCAN LAB",
    brand: "MICROTRAC",
    category: "Particle Characterization",
    industry: ["Pharmaceutical", "Chemical"],
    description: "TurbiscanLAB enables fast and sensitive identification of destabilization mechanisms such as creaming, sedimentation, flocculation, coalescence.",
    excerpt: "Predict long term stability of emulsions with polymers.",
    specifications: [
      "Technology S-MLS 880 nm",
      "Sample Cell Volume 4 or 20mL",
      "Temperature range RT - 60°C"
    ],
    image: "/images/products/product_24.jpeg",
    featured: false
  },
  {
    slug: "silverson-lab-mixer",
    name: "Laboratory Mixers (L5M-A)",
    brand: "Silverson",
    category: "Mixers",
    industry: ["Pharmaceutical", "Food", "Chemical"],
    description: "The L5M-A Laboratory Mixer is suitable for the widest range of applications – mixing, emulsifying, homogenizing, disintegrating and dissolving.",
    excerpt: "High Speed High Shear Mixers for laboratory and small-scale production.",
    specifications: [
      "Capacity 1ml up to 12 liters",
      "Reduces mixing times by up to 90%",
      "Rapid dissolution of solids"
    ],
    image: "/images/products/product_64.jpeg",
    featured: false
  },
  {
    slug: "jacomex-puresmart-glovebox",
    name: "PURESMART GLOVEBOX",
    brand: "Jacomex",
    category: "Isolators",
    industry: ["Pharmaceutical", "Research"],
    description: "The PURESMART Glove Box is a controlled atmosphere glove box for the products’ protection. It is suitable for academic research, start-ups and industries.",
    excerpt: "Glove boxes with stand-alone purification units < 1PPM H2O – O2.",
    specifications: [
      "Preparation",
      "Weighing",
      "Chemical reactions and syntheses"
    ],
    image: "/images/products/product_91.png",
    featured: false
  },
  {
    slug: "steroglass-awlife",
    name: "Water activity analyser aWLife",
    brand: "Steroglass",
    category: "Food Analysis",
    industry: ["Food", "Pharmaceutical", "Cosmetic"],
    description: "aWLife Water Activity Meter is an indispensable tool for the quality control of products and ingredients in the food, pharmaceutical and cosmetic fields.",
    excerpt: "Compliance with ISO 18787:2017. Measurement times: <5 minutes.",
    specifications: [
      "Measurement range: from 0.030 to 1,000 aw",
      "Accuracy: ± 0.003 aw at + 25 ° C",
      "Calibration: on 7 points"
    ],
    image: "/images/products/product_98.jpeg",
    featured: false
  },
  {
    slug: "serstech-arx",
    name: "Handheld RAMAN spectrometer Serstech Arx",
    brand: "Serstech",
    category: "Spectrometry",
    industry: ["Pharmaceutical", "Chemical"],
    description: "Serstech Arx is a revolutionizing instrument, introducing SharpEyeTM – a patented autofocus technology which improves the signal quality dramatically. Identifies unknown substances quickly and precisely.",
    excerpt: "Fast, precise, and handheld RAMAN spectrometer.",
    specifications: [
      "Laser excitation: wavelength 785nm",
      "Max spectral range 400 cm-1 to 2 300 cm-1",
      "Weight 590 g (1.3 lb)",
      "Battery Rechargeable - more than 12 hours of typical use"
    ],
    image: "/images/products/product_103.png",
    featured: false
  },
  {
    slug: "t-and-d-tr7-series",
    name: "TR7 series Data Loggers",
    brand: "T&D Data Logging",
    category: "Data Loggers",
    industry: ["Pharmaceutical", "Food", "Research"],
    description: "Wireless LAN for auto data upload to cloud. USB PC interface, and Bluetooth® connection to PC or mobile device for setup and download.",
    excerpt: "Wireless data loggers with cloud connectivity.",
    specifications: [
      "Vaccine Mode settings for VFC compatible models TR71A2/75A2",
      "Remote access to cloud data via mobile device"
    ],
    image: "/images/products/product_129.png",
    featured: false
  },
  {
    slug: "pi-oxysense",
    name: "Online Dissolved Oxygen Meter OxySense",
    brand: "PI, Process Instruments",
    category: "Online Sensors",
    industry: ["Water Treatment", "Chemical"],
    description: "The OxySense DO controller range of online Dissolved Oxygen Meters utilises the very latest and best optical sensor available in the world today. It is an optical luminescent device which is extremely resistant to abrasion, extremely stable, and has greatly reduced maintenance.",
    excerpt: "Online Dissolved Oxygen Analyser with self-cleaning.",
    specifications: [
      "Down to zero maintenance",
      "No chemicals or moving parts",
      "Up to 24 months between maintenance",
      "No initial calibration required"
    ],
    image: "/images/products/product_134.png",
    featured: false
  },
  {
    slug: "phoenix-benchtop-ph-meter",
    name: "Basic Benchtop pH-Meter",
    brand: "Phoenix Instrument",
    category: "Laboratory Equipment",
    industry: ["Research", "Pharmaceutical", "Chemical"],
    description: "Basic Benchtop pH-Meter with wide backlit LCD display, easy to read icons, timer and continuous function, visual and sound alarm, and program start delay.",
    excerpt: "Reliable and easy to use benchtop pH meter.",
    specifications: [
      "Wide backlit LCD display",
      "Timer and continuous function",
      "Safety temperature for sample protection",
      "Data logger (automatic or manual) 1000 data records"
    ],
    image: "/images/products/product_145.png",
    featured: false
  }
];

async function run() {
  console.log("Starting to insert products...");
  
  // Get max ID
  const { data: maxData, error: maxError } = await supabase
    .from('products')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
    
  let currentId = maxData && maxData.length > 0 ? maxData[0].id : 0;
  
  for (const product of newProducts) {
    // Check if slug exists
    const { data: existing } = await supabase.from('products').select('id').eq('slug', product.slug).maybeSingle();
    
    if (existing) {
        console.log(`Product ${product.slug} already exists. Skipping.`);
        continue;
    }

    currentId++;
    const { data, error } = await supabase.from('products').insert(
      { 
        id: currentId,
        slug: product.slug, 
        name: product.name, 
        category: product.category, 
        brand: product.brand, 
        industry: product.industry, 
        image: product.image, 
        description: product.description, 
        excerpt: product.excerpt, 
        featured: product.featured, 
        specifications: product.specifications 
      }
    );
    
    if (error) {
      console.error(`Failed to insert ${product.name}:`, error.message);
    } else {
      console.log(`Successfully inserted ${product.name}`);
    }
  }
  console.log("Done inserting products.");
}

run();
