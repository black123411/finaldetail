export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'why-ceramic-coating-is-essential',
    title: 'Why Ceramic Coating is Essential for Omaha Winters',
    excerpt: 'Protect your vehicle from harsh road salt, snow, and ice with a professional ceramic coating.',
    content: `
      <h2>The Harsh Reality of Omaha Winters</h2>
      <p>If you live in Omaha, you know that winter driving is brutal on your vehicle's paint. The combination of road salt, brine, ice, and freezing temperatures creates a corrosive environment that can rapidly degrade your clear coat.</p>
      
      <h2>What is Ceramic Coating?</h2>
      <p>Ceramic coating is a liquid polymer that chemically bonds with your vehicle's factory paint, creating a layer of protection. Unlike wax, which washes away after a few weeks, a true ceramic coating lasts for years.</p>

      <h2>Benefits of Ceramic Coating in Winter</h2>
      <ul>
        <li><strong>Salt Resistance:</strong> The hydrophobic nature of the coating prevents corrosive road salts from sticking to your paint.</li>
        <li><strong>Easy Washing:</strong> Snow and slush slide right off, making winter car washes incredibly easy and fast.</li>
        <li><strong>UV Protection:</strong> Even in winter, UV rays can damage your paint. Ceramic coating provides excellent UV resistance.</li>
      </ul>
      
      <p>Don't wait until the first snowfall. Book a ceramic coating appointment today to ensure your vehicle survives the winter looking flawless.</p>
    `,
    author: 'Bryan',
    date: '2026-05-15',
    tags: ['Ceramic Coating', 'Winter Prep', 'Protection'],
    imageUrl: '/20191020_110329.jpg',
  },
  {
    id: '2',
    slug: 'prevent-rust-midwest',
    title: 'How to Prevent Rust on Your Vehicle in the Midwest',
    excerpt: 'Midwest winters are notorious for causing vehicle rust. Learn the professional steps to keep your undercarriage and paint rust-free.',
    content: `
      <h2>Why Midwest Cars Rust Faster</h2>
      <p>In Nebraska and Iowa, the frequent use of liquid magnesium chloride and traditional rock salt on the roads creates a highly corrosive slurry that clings to your vehicle's undercarriage and wheel wells.</p>
      
      <h2>Step 1: Frequent Undercarriage Washes</h2>
      <p>The most critical step in rust prevention is removing the salt before it can oxidize bare metal. During the winter months, we recommend a thorough undercarriage wash at least once every two weeks.</p>

      <h2>Step 2: Paint Correction and Sealing</h2>
      <p>Rust often starts where paint has chipped or scratched. A proper paint correction removes these vulnerabilities, and applying a high-quality sealant or ceramic coating acts as a sacrificial barrier against the elements.</p>
      
      <h2>Step 3: Professional Interior Cleaning</h2>
      <p>Don't forget the inside! Dragging snow and salt onto your carpets can cause the floor pans to rust from the inside out. WeatherTech mats combined with professional interior detailing will save your floorboards.</p>
    `,
    author: 'Bryan',
    date: '2026-05-16',
    tags: ['Maintenance', 'Winter Prep', 'Rust Prevention'],
    imageUrl: '/20191020_062847.jpg',
  },
  {
    id: '3',
    slug: 'car-wash-vs-auto-detailing',
    title: 'The Difference Between a $50 Car Wash and Premium Auto Detailing',
    excerpt: 'Is a quick drive-through wash damaging your paint? Discover why true auto detailing is an investment in your vehicle.',
    content: `
      <h2>The Drive-Through Car Wash Myth</h2>
      <p>We've all been there: you need a clean car fast, so you pull into a $50 automatic wash. What they don't tell you is that the spinning brushes act like sandpaper, whipping dirt from the previous 100 cars directly into your clear coat, causing permanent swirl marks.</p>
      
      <h2>What is Showroom Quality Detailing?</h2>
      <p>Professional detailing isn't just "washing." It's a meticulous process of decontamination, correction, and protection. At Bryan's Showroom Quality Detailing, we use the two-bucket method, pH-neutral soaps, and plush microfiber towels to ensure your paint is never scratched.</p>

      <h2>The Value of Paint Correction</h2>
      <p>A $50 wash leaves scratches. A premium detail includes paint correction—machine polishing the clear coat to remove those scratches, restoring a mirror-like finish that makes your car look brand new.</p>
      
      <h2>Long-Term Investment</h2>
      <p>Regular professional detailing preserves the resale value of your vehicle. While it costs more upfront than an automatic wash, protecting your clear coat and interior materials will save you thousands when it's time to sell or trade in.</p>
    `,
    author: 'Bryan',
    date: '2026-05-17',
    tags: ['Education', 'Paint Correction', 'Detailing Tips'],
    imageUrl: '/20211009_025807-COLLAGE.jpg',
  }
];
