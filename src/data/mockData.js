export const categories = [
  'All Pieces', 'Dresses', 'Outerwear', 'Accessories'
];

export const products = [
  {
    id: '1',
    name: 'Aura of Ardh',
    price: 1450.00,
    category: 'Dresses',
    collection: 'Artisanal Heritage Series',
    image: 'https://images.unsplash.com/photo-1594938298596-eb5fd3f24bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: true,
    badges: ['Limited Release'],
  },
  {
    id: '2',
    name: 'Azure Silk Guntiino',
    price: 340.00,
    category: 'Dresses',
    collection: 'Indigo Heritage',
    image: 'https://images.unsplash.com/photo-1621251343750-622cd5342a78?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // replacement
    isTrending: true,
    badges: ['Perfect Match'],
  },
  {
    id: '3',
    name: 'Ardh Sunset Wrap',
    price: 220.00,
    category: 'Accessories',
    collection: 'Hand-Woven Gold',
    image: 'https://images.unsplash.com/photo-1574634534894-89d02081f964?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: false,
    badges: [],
  },
  {
    id: '4',
    name: 'Nomad Linen Trench',
    price: 580.00,
    category: 'Outerwear',
    collection: 'Sahara Minimalist',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: true,
    badges: ['Limited Drop'],
  },
  {
    id: '5',
    name: 'Coral Coast Veil',
    price: 145.00,
    category: 'Accessories',
    collection: 'Indian Ocean Sheer',
    image: 'https://images.unsplash.com/photo-1618220048123-bc97b764ebdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: false,
    badges: [],
  },
  {
    id: '6',
    name: 'Onyx Alindi Macawiis',
    price: 290.00,
    category: 'Dresses',
    collection: 'Digital Noir Heritage',
    image: 'https://images.unsplash.com/photo-1583391733959-f183063f3146?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: false,
    badges: [],
  },
  {
    id: '7',
    name: 'Ivory Court Kaftan',
    price: 410.00,
    category: 'Dresses',
    collection: 'Structured Elegance',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: true,
    badges: ['Best for You'],
  },
  {
    id: '8',
    name: 'Zeyla Filigree Gold Set',
    price: 890.00,
    category: 'Accessories',
    collection: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isTrending: false,
    badges: ['Style Sync'],
  }
];

export const lessons = [
  {
    id: '1',
    title: 'Somali Fashion Heritage 101',
    description: 'An introduction to the rich history of Somali textiles and traditional designs.',
    urls: [
      { id: 'u1', label: 'Intro Video', url: 'https://www.youtube.com/watch?v=example1' },
      { id: 'u2', label: 'History PDF', url: 'https://example.com/somali-heritage.pdf' }
    ],
    createdAt: '2026-03-30T10:00:00Z'
  },
  {
    id: '2',
    title: 'Modern Stylist Techniques',
    description: 'Learn how to combine traditional elements with modern fashion trends.',
    urls: [
      { id: 'u3', label: 'Styling Guide', url: 'https://example.com/styling-guide.pdf' }
    ],
    createdAt: '2026-03-31T14:30:00Z'
  }
];
