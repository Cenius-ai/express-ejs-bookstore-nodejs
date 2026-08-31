const bcrypt = require("bcryptjs");
const { getDb } = require("./db");

// Ensure tables exist by connecting
const db = getDb();

// ── Seed demo books ──────────────────────────────────────────────
const books = [
  {
    title: "The Rustic Algorithm",
    author: "Mira Chandrasekhar",
    description:
      "A gentle tour of algorithms through the lens of everyday village life in rural India — sorting grains, finding water, and navigating by the stars.",
    price: 24.99,
    cover_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    stock: 12,
  },
  {
    title: "Concrete & Chrysanthemums",
    author: "Diego Marques",
    description:
      "A memoir of growing up between São Paulo's brutalist skyline and a grandmother's flower garden, tracing how both shaped a designer's eye.",
    price: 18.50,
    cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    stock: 7,
  },
  {
    title: "How Tax Brackets Actually Work",
    author: "Ruth Okafor",
    description:
      "A clear, illustrated guide to progressive taxation that debunks the most common myths and helps readers understand their own returns.",
    price: 15.00,
    cover_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    stock: 20,
  },
  {
    title: "The Last Sound of the Dial-Up",
    author: "Kenji Takeda",
    description:
      "A nostalgic history of the early internet era — BBS forums, modem tones, and the communities that thrived before the web became a shopping mall.",
    price: 22.00,
    cover_url: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=400&h=600&fit=crop",
    stock: 5,
  },
  {
    title: "Permafrost",
    author: "Anya Volkova",
    description:
      "When a thawing Siberian crater reveals a perfectly preserved ancient settlement, a team of archaeologists races to document it before the world's attention — and looters — arrive.",
    price: 27.99,
    cover_url: "https://images.unsplash.com/photo-1518281361980-b26c0b1a7258?w=400&h=600&fit=crop",
    stock: 9,
  },
  {
    title: "Twelve Breads of Anatolia",
    author: "Leyla Demir",
    description:
      "A baker's pilgrimage through Turkey, collecting recipes for flatbreads, stuffed breads, and festival loaves — each one a story of the village that bakes it.",
    price: 31.00,
    cover_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=600&fit=crop",
    stock: 3,
  },
  {
    title: "The Quiet Compiler",
    author: "Samuel Rhee",
    description:
      "A biography of Frances Allen, the compiler-optimization pioneer who transformed how programs run — told through interviews, letters, and annotated code fragments.",
    price: 19.99,
    cover_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    stock: 14,
  },
  {
    title: "Saffron & Salt",
    author: "Priya Nair",
    description:
      "A culinary detective story tracing the spice routes from Kerala to Venice, with 40 original recipes reconstructed from medieval manuscripts.",
    price: 34.50,
    cover_url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop",
    stock: 6,
  },
];

// ── Seed admin accounts ──────────────────────────────────────────
// Two accounts: 'admin' (plan requirement) and 'cenius' (platform brief)
const ADMIN_ACCOUNTS = [
  { username: "admin",  password: "password123" },
  { username: "cenius", password: "cenius" },
];

// ── Run ──────────────────────────────────────────────────────────
const insertBook = db.prepare(`
  INSERT INTO books (title, author, description, price, cover_url, stock)
  VALUES (@title, @author, @description, @price, @cover_url, @stock)
`);

const insertAdmin = db.prepare(`
  INSERT OR IGNORE INTO admins (username, password_hash)
  VALUES (@username, @password_hash)
`);

const salt = bcrypt.genSaltSync(10);

const seedAll = db.transaction(() => {
  // Only seed books if the table is empty
  const bookCount = db.prepare("SELECT COUNT(*) AS c FROM books").get().c;
  if (bookCount === 0) {
    for (const book of books) {
      insertBook.run(book);
    }
    console.log(`Seeded ${books.length} demo books.`);
  } else {
    console.log(`Books table already has ${bookCount} rows — skipping seed.`);
  }

  // Seed admin accounts
  const adminCount = db.prepare("SELECT COUNT(*) AS c FROM admins").get().c;
  if (adminCount === 0) {
    for (const acct of ADMIN_ACCOUNTS) {
      const hash = bcrypt.hashSync(acct.password, salt);
      insertAdmin.run({ username: acct.username, password_hash: hash });
      console.log(`Seeded admin user "${acct.username}".`);
    }
  } else {
    console.log("Admin table already populated — skipping seed.");
  }
});

seedAll();
console.log("Seed complete.");
