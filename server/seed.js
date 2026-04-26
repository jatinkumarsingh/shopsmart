const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: 'Minimalist Smartwatch',
    description:
      'A sleek, modern smartwatch with vital health tracking, a gorgeous OLED display, and 7-day battery life.',
    price: 199.99,
    imageUrl:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Acoustic Noise-Cancelling Headphones',
    description:
      'Experience silence with premium active noise cancellation and high-fidelity lossless audio.',
    price: 299.0,
    imageUrl:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    description:
      'Custom-tuned switches for the ultimate typing experience, featuring RGB backlighting and tactile feedback.',
    price: 159.5,
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Ultra-Wide Curve Monitor',
    description:
      'A 34-inch immersive display designed for creative professionals and gaming enthusiasts.',
    price: 649.99,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Wireless Charging Pad',
    description:
      'Fast-charging, elegant fabric-wrapped pad that powers up all your devices simultaneously.',
    price: 49.99,
    imageUrl:
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Smart VR Headset',
    description:
      'Immerse yourself in new worlds with crystal clear 8K resolution and spatial audio technology.',
    price: 499.0,
    imageUrl:
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Bluetooth Record Player',
    description:
      'Classic vinyl sound meets modern convenience with wireless streaming and high-fidelity output.',
    price: 189.5,
    imageUrl:
      'https://images.unsplash.com/photo-1542204113-e935417936c9?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: '4K Handheld Gaming Console',
    description:
      'Play your favorite AAA titles on the go with a vibrant OLED screen and ergonomic controls.',
    price: 349.0,
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Pro Max Smartphone',
    description:
      'Experience the pinnacle of mobile technology with a stunning 6.9-inch display and professional-grade camera system.',
    price: 1199.0,
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Professional Mirrorless Camera',
    description:
      'Capture stunning 4K video and high-resolution stills with industry-leading autofocus performance.',
    price: 1299.99,
    imageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Modular Studio Speakers',
    description: 'Crystal clear audio production with adjustable EQ and premium wooden casing.',
    price: 450.0,
    imageUrl:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Ultrabook Pro 14',
    description:
      'Powerful, portable, and persistent. The ultimate laptop for creators and developers on the move.',
    price: 1499.0,
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Mechanical Glow Keyboard',
    description:
      'Ultra-responsive mechanical switches with customizable RGB lighting and premium aluminum build.',
    price: 145.0,
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Noise-Cancelling Earbuds',
    description: 'Compact, true wireless earbuds with immersive sound and all-day comfort.',
    price: 179.0,
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Smart Home Hub',
    description:
      'Control your entire home with a single, elegant interface and advanced voice recognition.',
    price: 129.0,
    imageUrl:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Foldable Tablet Pro',
    description:
      'The future of productivity. A high-performance tablet that folds into a compact smartphone form factor.',
    price: 1799.0,
    imageUrl:
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400',
  },
];

async function main() {
  console.log('Seeding products...');
  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: p,
      });
      console.log(`Updated: ${p.name}`);
    } else {
      await prisma.product.create({ data: p });
      console.log(`Created: ${p.name}`);
    }
  }

  console.log(`Successfully processed ${products.length} products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
