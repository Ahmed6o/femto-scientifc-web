import { initDb, run } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log('Initializing DB...');
  await initDb();
  console.log('Loading static data...');
  
  const productsData = await import('file://' + path.join(__dirname, '../src/data/products.js'));
  const logosData = await import('file://' + path.join(__dirname, '../src/data/logos.js'));
  
  console.log('Migrating products...');
  for (const p of productsData.products) {
    try {
      await run(`
        INSERT INTO products (slug, name, category, brand, industry, image, description, excerpt, featured, url, specifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        p.slug, p.name, p.category, p.brand, JSON.stringify(p.industry || []), p.image, p.description, p.excerpt, p.featured ? 1 : 0, p.url, JSON.stringify(p.specifications || [])
      ]);
      console.log(`Inserted product: ${p.name}`);
    } catch (e) {
      console.log(`Skipped (already exists): ${p.name}`);
    }
  }

  console.log('Migrating settings...');
  const settings = {
    categories: productsData.categories,
    industries: productsData.industries,
    brands: productsData.brands,
    stats: productsData.stats,
    heroSlides: productsData.heroSlides,
    partners: logosData.partners,
    clients: logosData.clients,
    page_home: {
      featuresStrip: [
        { icon: 'fa-truck', title: 'Fast Delivery', desc: 'On-time delivery across Egypt' },
        { icon: 'fa-tools', title: 'Installation & Training', desc: 'Professional setup and training' },
        { icon: 'fa-headset', title: 'After-Sales Support', desc: '24/7 technical assistance' },
        { icon: 'fa-certificate', title: 'Original Products', desc: 'Authorized distributor in Egypt' }
      ],
      about: {
        title1: 'Femto Scientific',
        title2: '& Who We Are',
        p1: 'We are a leading company in Egypt for Supplying, Installing, Training, and after sales support for Scientific and Analytical instruments.',
        p2: 'We work closely with world-class manufacturers like Krüss Scientific, Formulaction, Microtrac MRB, AMEL, and Mast Group to bring the finest equipment to Egyptian laboratories, research centers, and industries.',
        features: [
          { icon: 'fa-check-circle', text: 'Our Mission: Creating sustainable relationships through complete solutions and brilliant support.' },
          { icon: 'fa-eye', text: 'Our Vision: Leading supplier of laboratory and analytical instruments for wide-scope applications.' },
          { icon: 'fa-star', text: 'Our Values: Excellence, integrity, innovation, and customer satisfaction.' }
        ]
      },
      cta: {
        subtitle: "Let's Work Together",
        title: "Ready to Find the Right Instrument?",
        desc: "Our team of experts is ready to help you find the perfect scientific instrument for your specific application. Contact us today for a personalized quote.",
        btn1: "Request a Quote",
        btn2: "Browse Products"
      }
    },
    page_about: {
      hero: { title: "About Us" },
      whoWeAre: {
        subtitle: "Femto Scientific",
        title: "Who We Are",
        p1: "We are a leading company in Egypt for Supplying, Installing, Training, and after sales support for Scientific and Analytical instruments.",
        p2: "Since our founding, we have built strong partnerships with world-class instrument manufacturers, enabling us to offer cutting-edge solutions to laboratories, research institutions, and industries across Egypt and the Middle East region.",
        p3: "Our team of skilled engineers and scientists ensures that every client receives personalized support, technical training, and ongoing maintenance to maximize the value of their investment.",
        mission: "To create sustainable relationships through complete solutions, brilliant support and consulting.",
        vision: "To be the leading company supplying laboratory and analytical instruments for wide-scope applications and different sectors."
      },
      stats: [
        { value: '15+', label: 'Years of Experience', icon: 'fa-history' },
        { value: '2,560+', label: 'Satisfied Clients', icon: 'fa-heart' },
        { value: '9,862', label: 'Finished Projects', icon: 'fa-check-circle' },
        { value: '150+', label: 'Products Available', icon: 'fa-flask' }
      ],
      values: [
        { icon: 'fa-star', title: 'Excellence', desc: 'We strive for excellence in every product and service we deliver.' },
        { icon: 'fa-handshake', title: 'Integrity', desc: 'We build trust through honest, transparent partnerships.' },
        { icon: 'fa-lightbulb', title: 'Innovation', desc: 'Continuously seeking the latest scientific instruments and solutions.' },
        { icon: 'fa-users', title: 'Customer Focus', desc: 'Our customers\' success is our primary measure of achievement.' }
      ],
      services: [
        { icon: 'fa-shipping-fast', title: 'Supply & Delivery', desc: 'Fast and reliable delivery of instruments across Egypt.' },
        { icon: 'fa-tools', title: 'Installation', desc: 'Professional installation by certified technicians.' },
        { icon: 'fa-chalkboard-teacher', title: 'Training', desc: 'Comprehensive training programs for optimal instrument use.' },
        { icon: 'fa-headset', title: 'After-Sales Support', desc: '24/7 technical assistance and maintenance services.' }
      ]
    },
    page_contact: {
      subtitle: "Get in Touch",
      title: "We're Here to Help",
      desc: "Our expert team is ready to assist you with product inquiries, quotations, technical support, and after-sales service. Reach out to us today.",
      cards: [
        { icon: 'fa-map-marker-alt', title: 'Our Location', content: 'Cairo, Egypt', sub: 'Visit us anytime' },
        { icon: 'fa-phone-alt', title: 'Phone Number', content: '+20 123 456 7890', sub: 'Mon-Sat 9AM-6PM' },
        { icon: 'fa-envelope', title: 'Email Address', content: 'info@femto-scientific.com', sub: 'Reply within 24 hours' },
        { icon: 'fa-clock', title: 'Working Hours', content: 'Mon - Sat: 9:00AM - 6:00PM', sub: 'Sunday: Closed' }
      ]
    },
    page_app: {
      title: "Application Notes",
      desc: "Browse our library of scientific application notes and case studies."
    },
    page_sol: {
      title: "Our Solutions",
      desc: "Industry-specific instrument solutions tailored to your needs."
    }
  };

  for (const [key, value] of Object.entries(settings)) {
    try {
      await run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, JSON.stringify(value)]);
      console.log(`Inserted setting: ${key}`);
    } catch (e) {
      await run('UPDATE settings SET value = ? WHERE key = ?', [JSON.stringify(value), key]);
      console.log(`Updated setting: ${key}`);
    }
  }
  
  console.log('Migration complete!');
}

migrate().catch(console.error);
