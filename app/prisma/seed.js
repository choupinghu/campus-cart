/**
 * Seed script for NUS Campus Marketplace.
 *
 * Populates the database with demo users (loginable via better-auth),
 * categories, listings, and requests.
 *
 * Usage:  pnpm run db:seed
 *         (or)  node prisma/seed.js
 *
 * Safe to run multiple times — clears existing data first.
 */
import dotenv from 'dotenv';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { auth } from '../server/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root (one level above app/)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
// Also load app-level .env if it exists (overrides)
dotenv.config();

const prisma = new PrismaClient();

// ── Demo users (20 NUS students) ─────────────────────────────────────
// Emails and passwords are set like this for easy dev access
const USERS = [
  { name: 'Alice Tan', email: 'alice@u.nus.edu', password: 'Password123' },
  { name: 'Bob Lim', email: 'bob@u.nus.edu', password: 'Password123' },
  { name: 'Charlie Wong', email: 'charlie@u.nus.edu', password: 'Password123' },
  { name: 'Diana Chen', email: 'diana@u.nus.edu', password: 'Password123' },
  { name: 'Ethan Ng', email: 'ethan@u.nus.edu', password: 'Password123' },
  { name: 'Fiona Lee', email: 'fiona@u.nus.edu', password: 'Password123' },
  { name: 'George Koh', email: 'george@u.nus.edu', password: 'Password123' },
  { name: 'Hannah Yeo', email: 'hannah@u.nus.edu', password: 'Password123' },
  { name: 'Ivan Tay', email: 'ivan@u.nus.edu', password: 'Password123' },
  { name: 'Jasmine Ong', email: 'jasmine@u.nus.edu', password: 'Password123' },
  { name: 'Kevin Chua', email: 'kevin@u.nus.edu', password: 'Password123' },
  { name: 'Lisa Goh', email: 'lisa@u.nus.edu', password: 'Password123' },
  { name: 'Marcus Ho', email: 'marcus@u.nus.edu', password: 'Password123' },
  { name: 'Natalie Sim', email: 'natalie@u.nus.edu', password: 'Password123' },
  { name: 'Oscar Pang', email: 'oscar@u.nus.edu', password: 'Password123' },
  { name: 'Priya Raj', email: 'priya@u.nus.edu', password: 'Password123' },
  { name: 'Qian Wei', email: 'qianwei@u.nus.edu', password: 'Password123' },
  { name: 'Rachel Loh', email: 'rachel@u.nus.edu', password: 'Password123' },
  { name: 'Samuel Teo', email: 'samuel@u.nus.edu', password: 'Password123' },
  { name: 'Tiffany Wee', email: 'tiffany@u.nus.edu', password: 'Password123' },
];

// ── Categories ───────────────────────────────────────────────────────
const CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Sports',
];

// ── Listings (sellerIdx references USERS array index) ────────────────
const LISTINGS = [
  // ── Alice (0) ──
  { title: 'CS2030S Textbook — Programming Methodology II', description: 'Used for one semester, no highlights. Covers OOP, generics, streams, and concurrency in Java.', price: 15.0, condition: 'Like New', location: 'UTown Residence', sellerIdx: 0, categoryIdx: 0 },
  { title: 'Logitech MX Master 3S Mouse', description: 'Barely used, comes with USB-C cable and dongle. Great for productivity.', price: 65.0, condition: 'Like New', location: 'Kent Ridge MRT', sellerIdx: 0, categoryIdx: 1 },
  { title: 'IKEA MARKUS Office Chair', description: 'Black mesh office chair, adjustable height. Selling because graduating.', price: 80.0, condition: 'Used', location: 'Prince George\'s Park', sellerIdx: 0, categoryIdx: 2 },

  // ── Bob (1) ──
  { title: 'MA2001 Linear Algebra Textbook', description: 'Friedberg, Insel, Spence 5th edition. Some pencil annotations, easily erasable.', price: 12.0, condition: 'Used', location: 'Central Library', sellerIdx: 1, categoryIdx: 0 },
  { title: 'Apple iPad Air (5th Gen) 64 GB WiFi', description: 'Space grey, includes Apple Pencil 2 and magnetic case. Screen protector applied.', price: 520.0, condition: 'Like New', location: 'Raffles Hall', sellerIdx: 1, categoryIdx: 1 },
  { title: 'Uniqlo Dry-EX Polo Shirt (Size M)', description: 'Navy blue, worn twice. Too small for me.', price: 10.0, condition: 'Like New', location: 'Kent Ridge Hall', sellerIdx: 1, categoryIdx: 3 },

  // ── Charlie (2) ──
  { title: 'Casio fx-991EX Scientific Calculator', description: 'Allowed for most NUS exams. Comes with slide cover.', price: 18.0, condition: 'Used', location: 'Eusoff Hall', sellerIdx: 2, categoryIdx: 1 },
  { title: 'MUJI Gel Ink Pens (Pack of 10)', description: 'Brand new, 0.38 mm black. Bought extra pack by accident.', price: 8.0, condition: 'New', location: 'UTown Residence', sellerIdx: 2, categoryIdx: 4 },
  { title: 'Wilson Tennis Racket — Beginner', description: 'Great starter racket. Grip size 2. Comes with a carrying bag.', price: 35.0, condition: 'Used', location: 'MPSH Court', sellerIdx: 2, categoryIdx: 5 },

  // ── Diana (3) ──
  { title: 'CS1101S Structure and Interpretation of Computer Programs', description: 'Source Academy companion textbook, printed edition. Clean, no marks.', price: 10.0, condition: 'Like New', location: 'COM1', sellerIdx: 3, categoryIdx: 0 },
  { title: 'Sony WH-1000XM5 Headphones', description: 'Silver, excellent noise cancelling. Comes with original case and cables.', price: 280.0, condition: 'Like New', location: 'UTown Residence', sellerIdx: 3, categoryIdx: 1 },

  // ── Ethan (4) ──
  { title: 'Standing Desk Converter', description: 'Adjustable height sit-stand riser. Fits monitors up to 27". Very stable.', price: 55.0, condition: 'Used', location: 'Tembusu College', sellerIdx: 4, categoryIdx: 2 },
  { title: 'Adidas Ultraboost Running Shoes (US 10)', description: 'Black colourway, worn a few times on treadmill only. Excellent cushioning.', price: 90.0, condition: 'Like New', location: 'UTown Gym', sellerIdx: 4, categoryIdx: 5 },

  // ── Fiona (5) ──
  { title: 'GE2101 Quantitative Reasoning Textbook', description: 'Required for the GE module. Minimal usage, no dog-ears.', price: 8.0, condition: 'Used', location: 'Central Library', sellerIdx: 5, categoryIdx: 0 },
  { title: 'IKEA KALLAX Shelf Unit (2x2)', description: 'White, fits perfectly in hall rooms. Easy to disassemble for transport.', price: 25.0, condition: 'Used', location: 'Sheares Hall', sellerIdx: 5, categoryIdx: 2 },

  // ── George (6) ──
  { title: 'Mechanical Keyboard — Keychron K2 (Brown Switches)', description: 'Wireless Bluetooth + USB-C. Great for coding. Includes keycap puller.', price: 60.0, condition: 'Used', location: 'Kent Ridge Hall', sellerIdx: 6, categoryIdx: 1 },
  { title: 'Nike Dri-FIT Training T-Shirt (Size L)', description: 'Grey, only worn to gym twice. Decided I prefer cotton.', price: 15.0, condition: 'Like New', location: 'MPSH Court', sellerIdx: 6, categoryIdx: 3 },

  // ── Hannah (7) ──
  { title: 'EC1101E Microeconomics Textbook', description: 'Mankiw 9th edition. Some highlighting in chapters 1-5, rest is clean.', price: 14.0, condition: 'Used', location: 'Biz Library', sellerIdx: 7, categoryIdx: 0 },
  { title: 'Desk Organizer Set (Bamboo)', description: 'Includes pen holder, file sorter, and phone stand. Barely used.', price: 18.0, condition: 'Like New', location: 'Cinnamon College', sellerIdx: 7, categoryIdx: 4 },

  // ── Ivan (8) ──
  { title: 'Samsung 27" IPS Monitor (FHD)', description: '1080p, 75Hz, HDMI + VGA. Great for coding and watching lectures.', price: 120.0, condition: 'Used', location: 'Prince George\'s Park', sellerIdx: 8, categoryIdx: 1 },
  { title: 'Yonex Badminton Racket — Astrox 88S', description: 'Intermediate level, 4U G5. Comes with a racket bag and extra grip.', price: 75.0, condition: 'Used', location: 'MPSH Court', sellerIdx: 8, categoryIdx: 5 },

  // ── Jasmine (9) ──
  { title: 'IS1108 Digital Ethics Readings Pack', description: 'Printed compilation of all assigned readings. Saved me a lot of printing.', price: 5.0, condition: 'Used', location: 'COM2', sellerIdx: 9, categoryIdx: 0 },
  { title: 'NUS Law Camp T-Shirt (Size S)', description: 'From orientation. Worn once, washed and ironed.', price: 5.0, condition: 'Like New', location: 'Bukit Timah Campus', sellerIdx: 9, categoryIdx: 3 },

  // ── Kevin (10) ──
  { title: 'Raspberry Pi 4 Model B (4GB)', description: 'Comes with case, power supply, and 32GB SD card with Raspberry Pi OS.', price: 45.0, condition: 'Used', location: 'COM1', sellerIdx: 10, categoryIdx: 1 },
  { title: 'Decathlon Yoga Mat (6mm)', description: 'Purple, used for one semester of yoga class. Clean, no tears.', price: 12.0, condition: 'Used', location: 'UTown Gym', sellerIdx: 10, categoryIdx: 5 },

  // ── Lisa (11) ──
  { title: 'ACC1701 Financial Accounting Textbook', description: 'Pearson 6th edition. Some sticky tabs on key chapters.', price: 18.0, condition: 'Used', location: 'Biz Library', sellerIdx: 11, categoryIdx: 0 },
  { title: 'Bedside Table Lamp (Warm LED)', description: 'Adjustable brightness, USB charging port. Used in hall for 1 year.', price: 15.0, condition: 'Used', location: 'Raffles Hall', sellerIdx: 11, categoryIdx: 2 },

  // ── Marcus (12) ──
  { title: 'Logitech C920 Webcam', description: '1080p, great for Zoom tutorials and presentations. Clip-on mount.', price: 35.0, condition: 'Used', location: 'Kent Ridge Hall', sellerIdx: 12, categoryIdx: 1 },
  { title: 'Pilot Frixion Erasable Pens (Set of 5)', description: 'Assorted colours. Two pens still sealed.', price: 6.0, condition: 'New', location: 'Central Library', sellerIdx: 12, categoryIdx: 4 },

  // ── Natalie (13) ──
  { title: 'CS2040S Data Structures & Algorithms Textbook', description: 'Cormen (CLRS) 4th edition. Pristine condition, bought but never used.', price: 35.0, condition: 'New', location: 'COM1', sellerIdx: 13, categoryIdx: 0 },
  { title: 'H&M Oversized Hoodie (Size M)', description: 'Beige, super comfy for lecture halls. No stains or pilling.', price: 20.0, condition: 'Like New', location: 'UTown Residence', sellerIdx: 13, categoryIdx: 3 },

  // ── Oscar (14) ──
  { title: 'BenQ ScreenBar Monitor Light', description: 'Auto-dimming, USB powered. Great for late-night study sessions.', price: 40.0, condition: 'Like New', location: 'Tembusu College', sellerIdx: 14, categoryIdx: 1 },
  { title: 'Mikasa V200W Volleyball', description: 'Official FIVB match ball. Used for hall games, still in great shape.', price: 30.0, condition: 'Used', location: 'MPSH Court', sellerIdx: 14, categoryIdx: 5 },

  // ── Priya (15) ──
  { title: 'GET1050 Computational Thinking Reader', description: 'All lecture notes and tutorial solutions bound together. Very handy.', price: 7.0, condition: 'Used', location: 'Central Library', sellerIdx: 15, categoryIdx: 0 },
  { title: 'Cotton On Cargo Pants (Size 28)', description: 'Olive green, trendy cut. Tried on once, wrong size for me.', price: 22.0, condition: 'New', location: 'Kent Ridge MRT', sellerIdx: 15, categoryIdx: 3 },

  // ── Qian Wei (16) ──
  { title: 'Apple Magic Keyboard (Touch ID)', description: 'Silver, wireless. Works perfectly with Mac. Includes Lightning cable.', price: 85.0, condition: 'Like New', location: 'COM2', sellerIdx: 16, categoryIdx: 1 },
  { title: 'Kokuyo Campus Notebooks (Pack of 5)', description: 'B5 dotted grid, 40 pages each. Unopened pack.', price: 9.0, condition: 'New', location: 'UTown Residence', sellerIdx: 16, categoryIdx: 4 },

  // ── Rachel (17) ──
  { title: 'IKEA SKÅDIS Pegboard', description: 'White, with hooks and containers. Great for organising hall desk space.', price: 20.0, condition: 'Used', location: 'Eusoff Hall', sellerIdx: 17, categoryIdx: 2 },
  { title: 'EE2211 Machine Learning Textbook', description: 'Bishop "Pattern Recognition and Machine Learning". Some pen underlines.', price: 25.0, condition: 'Used', location: 'E3 Engineering', sellerIdx: 17, categoryIdx: 0 },

  // ── Samuel (18) ──
  { title: 'Anker 20000mAh Power Bank', description: 'USB-C + USB-A. Charges phone 4-5 times. Slight cosmetic scratches.', price: 28.0, condition: 'Used', location: 'Central Library', sellerIdx: 18, categoryIdx: 1 },
  { title: 'Speedo Swimming Goggles', description: 'Anti-fog mirror lens. Used for one semester of PE swimming module.', price: 10.0, condition: 'Used', location: 'UTown Pool', sellerIdx: 18, categoryIdx: 5 },

  // ── Tiffany (19) ──
  { title: 'MKT1705 Principles of Marketing Textbook', description: 'Kotler & Armstrong 18th edition. Clean, highlighted only in pencil.', price: 16.0, condition: 'Used', location: 'Biz Library', sellerIdx: 19, categoryIdx: 0 },
  { title: 'Mini Portable Fan (USB Rechargeable)', description: 'White, 3 speed settings. Lifesaver for non-aircon lecture halls.', price: 8.0, condition: 'Like New', location: 'LT27', sellerIdx: 19, categoryIdx: 1 },
];

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', // Textbooks
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800', // Electronics
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800', // Furniture
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800', // Clothing
  'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800', // Stationery
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800', // Sports
];

// ── Requests ─────────────────────────────────────────────────────────
const REQUESTS = [
  // Textbooks
  { title: 'Looking for ST2334 Textbook', description: 'Need "Probability and Statistics for Engineering and the Sciences" by Devore. Any edition.', budget: 20.0, condition: 'Used', location: 'Anywhere on campus', userIdx: 1, categoryIdx: 0 },
  { title: 'CS2100 Lab Manual', description: 'Desperately need this by tomorrow! Willing to pay extra for immediate collection.', budget: 25.0, condition: 'Good', location: 'COM1', userIdx: 14, categoryIdx: 0 },
  { title: 'WTB: CS3230 Algorithm Design Textbook', description: 'Kleinberg & Tardos preferred. Will take any condition.', budget: 25.0, condition: null, location: 'COM1', userIdx: 4, categoryIdx: 0 },
  { title: 'Looking for LSM1301 General Biology Textbook', description: 'Campbell Biology, any recent edition. Highlighting is fine.', budget: 15.0, condition: 'Used', location: 'Science Library', userIdx: 9, categoryIdx: 0 },

  // Electronics
  { title: 'Need a 24" Monitor', description: 'Preferably IPS panel with USB-C. Budget flexible for good condition.', budget: 120.0, condition: 'Like New', location: 'UTown Residence', userIdx: 0, categoryIdx: 1 },
  { title: 'MacBook Air Charger (30W/60W)', description: 'Magsafe 3 or USB-C. Mine just broke and I have a deadline tonight!', budget: 45.0, condition: 'Used', location: 'UTown / PGP', userIdx: 5, categoryIdx: 1 },
  { title: 'WTB: USB-C Hub / Dongle', description: 'Need HDMI + USB-A ports at minimum. For connecting to lecture hall projectors.', budget: 25.0, condition: null, location: null, userIdx: 7, categoryIdx: 1 },
  { title: 'Looking for Cheap Tablet for Note-Taking', description: 'Any tablet that supports stylus input. Mostly for PDF annotation.', budget: 200.0, condition: 'Used', location: null, userIdx: 12, categoryIdx: 1 },

  // Furniture
  { title: 'Wanted: Desk Lamp for Study', description: 'Looking for an LED desk lamp, preferably with adjustable brightness.', budget: 25.0, condition: null, location: 'Kent Ridge Hall', userIdx: 2, categoryIdx: 2 },
  { title: 'Clothes Hanging Rack', description: 'Moving in today and need a place for my clothes ASAP! Urgent!', budget: 20.0, condition: 'Any', location: 'PGP House 7', userIdx: 13, categoryIdx: 2 },
  { title: 'Need Small Bookshelf for Hall Room', description: 'Max 80cm tall, prefer white or light wood. Must fit beside single bed.', budget: 30.0, condition: 'Used', location: 'Sheares Hall', userIdx: 8, categoryIdx: 2 },

  // Clothing
  { title: 'Looking for NUS Engineering Jacket (Size L)', description: 'Any colour, preferably recent batch. Can meet on campus.', budget: 30.0, condition: 'Used', location: null, userIdx: 1, categoryIdx: 3 },
  { title: 'Formal Blazer for Interview (Navy)', description: 'Size M or L. Career fair is tomorrow and mine survived a coffee spill. Help!', budget: 40.0, condition: 'Good', location: 'Kent Ridge Hall', userIdx: 19, categoryIdx: 3 },
  { title: 'WTB: NUS Computing Club Polo', description: 'Any year, size M or L. Willing to buy multiples.', budget: 15.0, condition: 'Used', location: 'COM1', userIdx: 6, categoryIdx: 3 },

  // Stationery
  { title: 'Need Whiteboard Markers (Assorted)', description: 'For group study room sessions. Prefer non-toxic brands.', budget: 8.0, condition: 'New', location: 'Central Library', userIdx: 15, categoryIdx: 4 },
  { title: 'Graphic Calculator TI-84 Plus', description: 'Math finals in 2 days. Urgent request!', budget: 100.0, condition: 'Working', location: 'UTown', userIdx: 10, categoryIdx: 1 }, // Map to electronics or stationery? Categorized as electronics in title but using categoryIdx 1

  // Sports
  { title: 'Need Badminton Racket', description: 'Intermediate-level racket for hall games. Yonex preferred.', budget: 40.0, condition: 'Like New', location: 'MPSH Court', userIdx: 0, categoryIdx: 5 },
  { title: 'Football Cleats (Size 10)', description: 'Match tonight at 7 PM. Desperately need a pair!', budget: 45.0, condition: 'Good', location: 'MPSH Field', userIdx: 3, categoryIdx: 5 },
  { title: 'Looking for Resistance Bands Set', description: 'For home workouts in hall room. Full set preferred.', budget: 15.0, condition: null, location: 'UTown Gym', userIdx: 11, categoryIdx: 5 },
  { title: 'WTB: Football Boots (US 9)', description: 'For interhall games. Nike or Adidas preferred, firm ground studs.', budget: 50.0, condition: 'Used', location: 'MPSH Field', userIdx: 18, categoryIdx: 5 },
];

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding NUS Campus Marketplace …\n');

  // 1. Clean existing data (FK-safe order) ────────────────────────────
  console.log('🗑  Clearing existing data …');
  await prisma.listing.deleteMany();
  await prisma.request.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log('   Done.\n');

  // 2. Create users via better-auth API ───────────────────────────────
  console.log('👤 Creating users …');
  const createdUsers = [];
  for (const u of USERS) {
    const result = await auth.api.signUpEmail({
      body: {
        name: u.name,
        email: u.email,
        password: u.password,
      },
    });
    createdUsers.push(result.user);
    console.log(`   ✓ ${u.name} <${u.email}>`);
  }
  console.log();

  // 3. Upsert categories ──────────────────────────────────────────────
  console.log('📂 Creating categories …');
  const createdCategories = [];
  for (const name of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdCategories.push(cat);
    console.log(`   ✓ ${name}`);
  }
  console.log();

  // 4. Create listings ────────────────────────────────────────────────
  console.log('🏷  Creating listings …');
  for (let i = 0; i < LISTINGS.length; i++) {
    const l = LISTINGS[i];
    // Spread over the last 14 days
    const daysAgo = Math.random() * 14;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const listing = await prisma.listing.create({
      data: {
        title: l.title,
        description: l.description,
        price: l.price,
        condition: l.condition,
        location: l.location,
        imageUrl: l.imageUrl || CATEGORY_IMAGES[l.categoryIdx],
        sellerId: createdUsers[l.sellerIdx].id,
        categoryId: createdCategories[l.categoryIdx].id,
        createdAt,
      },
    });
    console.log(`   ✓ ${listing.title}`);
  }
  console.log();

  // 5. Create requests ────────────────────────────────────────────────
  console.log('🔍 Creating requests …');
  for (let i = 0; i < REQUESTS.length; i++) {
    const r = REQUESTS[i];
    // Spread over the last 7 days
    const hoursAgo = Math.random() * 168; // 7 days * 24 hours
    const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const request = await prisma.request.create({
      data: {
        title: r.title,
        description: r.description,
        budget: r.budget,
        condition: r.condition,
        location: r.location,
        userId: createdUsers[r.userIdx].id,
        categoryId: createdCategories[r.categoryIdx].id,
        createdAt,
      },
    });
    console.log(`   ✓ ${request.title}`);
  }
  console.log();

  // Summary
  console.log('━'.repeat(50));
  console.log(`✅ Seed complete!`);
  console.log(`   ${createdUsers.length} users`);
  console.log(`   ${createdCategories.length} categories`);
  console.log(`   ${LISTINGS.length} listings`);
  console.log(`   ${REQUESTS.length} requests`);
  console.log();
  console.log('🔑 Login credentials (all passwords: Password123):');
  for (const u of USERS) {
    console.log(`   ${u.email}`);
  }
  console.log('━'.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
