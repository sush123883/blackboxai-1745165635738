const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const menuItems = [
  {
    name: 'Samosa',
    category: 'Snacks',
    description: 'Crispy fried pastry filled with spiced potatoes and peas.',
    ingredients: ['Potatoes', 'Peas', 'Flour', 'Spices'],
    nutritionalInfo: 'Approx. 150 calories per piece',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Samosa-01.jpg',
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    isSpicy: true,
    isNonVegetarian: false,
    price: 20,
    available: true,
  },
  {
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    description: 'Soft paneer cubes cooked in rich buttery tomato gravy.',
    ingredients: ['Paneer', 'Tomatoes', 'Butter', 'Cream', 'Spices'],
    nutritionalInfo: 'Approx. 300 calories per serving',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Paneer_butter_masala.jpg',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isSpicy: 'medium',
    isNonVegetarian: false,
    price: 150,
    available: true,
  },
  {
    name: 'Chicken Biryani',
    category: 'Main Course',
    description: 'Aromatic basmati rice cooked with tender chicken and spices.',
    ingredients: ['Chicken', 'Basmati Rice', 'Yogurt', 'Spices'],
    nutritionalInfo: 'Approx. 450 calories per serving',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Chicken_Biryani.jpg',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isSpicy: true,
    isNonVegetarian: true,
    price: 180,
    available: true,
  },
  {
    name: 'Gulab Jamun',
    category: 'Desserts',
    description: 'Soft deep-fried dough balls soaked in sugar syrup.',
    ingredients: ['Milk solids', 'Flour', 'Sugar', 'Cardamom'],
    nutritionalInfo: 'Approx. 200 calories per piece',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Gulab_Jamun_2.jpg',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
    isNonVegetarian: false,
    price: 50,
    available: true,
  },
  {
    name: 'Masala Chai',
    category: 'Beverages',
    description: 'Traditional Indian spiced tea with milk and aromatic spices.',
    ingredients: ['Tea leaves', 'Milk', 'Cardamom', 'Ginger', 'Cloves'],
    nutritionalInfo: 'Approx. 100 calories per cup',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Tea_in_India.jpg',
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    isSpicy: true,
    isNonVegetarian: false,
    price: 30,
    available: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding menu items:', err);
    process.exit(1);
  }
}

seed();
