export type Memory = {
  id: string;
  image: string;
  title: string;
  year: string;
  caption: string;
  quote: string;
  rotate: string;
  align: "left" | "right";
};

export const memories: Memory[] = [
  {
    id: "first-light",
    image: "/memories/amma-hero.jpeg",
    title: "The Smile That Raised Me",
    year: "Always",
    caption: "Every ordinary day becomes softer when Amma is in the frame.",
    quote: "Home was never a place. It was you.",
    rotate: "-2deg",
    align: "left"
  },
  {
    id: "sea-breeze",
    image: "/memories/amma-beach.jpeg",
    title: "Beside The Waves",
    year: "A sunny memory",
    caption: "A moment by the sea, held forever like a prayer in sunlight.",
    quote: "Your prayers became my strength.",
    rotate: "2deg",
    align: "right"
  },
  {
    id: "younger-amma",
    image: "/memories/amma-young.jpeg",
    title: "The Grace I Inherited",
    year: "Before my stories began",
    caption: "The woman who carried dreams before I even knew what dreams were.",
    quote: "You carried my dreams before I could even understand them.",
    rotate: "-1.5deg",
    align: "left"
  },
  {
    id: "mirror-day",
    image: "/memories/amma-mirror.jpeg",
    title: "Little Rituals",
    year: "Recent",
    caption: "Small everyday moments become treasures when they are with you.",
    quote: "Every achievement of mine has your sacrifices behind it.",
    rotate: "1.5deg",
    align: "right"
  },
  {
    id: "heart-filter",
    image: "/memories/amma-smiles.jpeg",
    title: "Laughing Like Home",
    year: "Forever favorite",
    caption: "The kind of smile that makes the whole room feel protected.",
    quote: "No matter how old I become, I will always be your little boy.",
    rotate: "-2.5deg",
    align: "left"
  }
];

export const quotes = [
  "Every achievement of mine has your sacrifices behind it.",
  "You loved me before I even knew what love meant.",
  "Behind every strong son is an even stronger mother.",
  "You gave me love in its purest form.",
  "In your lap, every fear of mine learned how to rest.",
  "Your courage became the quiet architecture of my life."
];

export const loveNotes = [
  {
    front: "Your Love",
    back: "You gave without counting, forgave without announcing, and loved me even on the days I was difficult to love."
  },
  {
    front: "Your Strength",
    back: "I learned courage by watching you continue, smile, pray, and protect us through everything."
  },
  {
    front: "Your Prayers",
    back: "So many doors opened for me because somewhere, quietly, you were praying my name into them."
  },
  {
    front: "Your Home",
    back: "Wherever life takes me, one truth stays simple: Amma, being loved by you is my first home."
  }
];
