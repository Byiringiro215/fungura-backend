import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../modules/users/entities/user.entity';
import { MenuItem } from '../modules/menu/entities/menu-item.entity';
import { Worker, WorkerRole, WorkerStatus } from '../modules/workers/entities/worker.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { InventoryItem } from '../modules/inventory/entities/inventory-item.entity';

export async function seed(dataSource: DataSource) {
  console.log('🌱 Starting database seed...');

  // Seed default admin user
  const userRepo = dataSource.getRepository(User);
  const existingAdmin = await userRepo.findOne({ where: { email: 'orlando@fungura.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('FunguraAdmin2026!', 12);
    await userRepo.save(userRepo.create({
      name: 'Orlando Laurentius',
      email: 'orlando@fungura.com',
      password: hashedPassword,
      role: UserRole.MANAGER,
      position: 'Restaurant Manager',
      department: 'Management',
      employeeId: 'EMP-2024-001',
      phone: '+1 (555) 123-4567',
      address: '123 Market Street, San Francisco, CA 94103',
    }));
    console.log('✅ Admin user created');
  }

  // Seed menu items
  const menuRepo = dataSource.getRepository(MenuItem);
  const menuCount = await menuRepo.count();
  if (menuCount === 0) {
    const menuItems = [
      { name: 'Classic Italian Penne', slug: 'classic-italian-penne', category: 'Pasta', price: 12.99, rating: 4.9, mealTime: 'Lunch', tags: ['italian', 'pasta'], image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop', description: 'A delightful dish with perfectly cooked penne pasta.', orderCount: 350, isAvailable: true },
      { name: 'Grilled Salmon', slug: 'grilled-salmon', category: 'Seafood', price: 18.99, rating: 4.8, mealTime: 'Dinner', tags: ['seafood', 'healthy'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', description: 'Fresh and succulent salmon, expertly cooked.', orderCount: 278, isAvailable: true },
      { name: 'Fluffy Scrambled Egg', slug: 'fluffy-scrambled-egg', category: 'Breakfast', price: 8.99, rating: 4.6, mealTime: 'Breakfast', tags: ['breakfast', 'eggs'], image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop', description: 'A fresh take on a classic breakfast.', orderCount: 216, isAvailable: true },
      { name: 'Chocolate Lava Cake', slug: 'chocolate-lava-cake', category: 'Dessert', price: 9.99, rating: 4.9, mealTime: 'Dinner', tags: ['dessert', 'chocolate'], image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop', description: 'Warm, gooey chocolate center with a rich flavor.', orderCount: 418, isAvailable: true },
      { name: 'Margherita Pizza', slug: 'margherita-pizza', category: 'Pizza', price: 14.99, rating: 4.7, mealTime: 'Lunch', tags: ['pizza', 'italian'], image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop', description: 'Classic pizza with fresh mozzarella and basil.', orderCount: 520, isAvailable: true },
      { name: 'Caesar Salad', slug: 'caesar-salad', category: 'Salad', price: 10.99, rating: 4.4, mealTime: 'Lunch', tags: ['salad', 'healthy'], image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', description: 'Fresh romaine lettuce with tangy Caesar dressing.', orderCount: 185, isAvailable: true },
      { name: 'Beef Burger', slug: 'beef-burger', category: 'Burgers', price: 13.99, rating: 4.8, mealTime: 'Lunch', tags: ['burgers', 'beef'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', description: 'Juicy beef patty with fresh toppings.', orderCount: 642, isAvailable: true },
      { name: 'Sushi Platter', slug: 'sushi-platter', category: 'Seafood', price: 24.99, rating: 4.9, mealTime: 'Dinner', tags: ['sushi', 'japanese'], image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', description: 'Incredibly fresh fish and expertly prepared rice.', orderCount: 395, isAvailable: true },
      { name: 'Tiramisu', slug: 'tiramisu', category: 'Dessert', price: 8.99, rating: 4.7, mealTime: 'Dinner', tags: ['dessert', 'italian'], image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', description: 'Rich and creamy with coffee and cocoa.', orderCount: 287, isAvailable: true },
      { name: 'Chicken Alfredo', slug: 'chicken-alfredo', category: 'Pasta', price: 14.99, rating: 4.5, mealTime: 'Dinner', tags: ['pasta', 'chicken'], image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop', description: 'Creamy and satisfying pasta with tender chicken.', orderCount: 312, isAvailable: true },
    ];
    await menuRepo.save(menuRepo.create(menuItems));
    console.log('✅ Menu items seeded');
  }

  // Seed workers
  const workerRepo = dataSource.getRepository(Worker);
  const workerCount = await workerRepo.count();
  if (workerCount === 0) {
    const workers = [
      { name: 'John Doe', role: WorkerRole.KITCHEN, status: WorkerStatus.ACTIVE, email: 'john.doe@fungura.com', phone: '(250) 788-123-456', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200' },
      { name: 'Jane Smith', role: WorkerRole.MANAGER, status: WorkerStatus.ON_DUTY, email: 'jane.smith@fungura.com', phone: '(250) 789-987-654', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
      { name: 'Mike Johnson', role: WorkerRole.DELIVERY, status: WorkerStatus.ACTIVE, email: 'mike.j@fungura.com', phone: '(250) 782-333-444', image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=200' },
      { name: 'Sara Wilson', role: WorkerRole.WAITER, status: WorkerStatus.OFFLINE, email: 'sara.w@fungura.com', phone: '(250) 785-555-666', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
      { name: 'David Brown', role: WorkerRole.KITCHEN, status: WorkerStatus.ACTIVE, email: 'david.b@fungura.com', phone: '(250) 781-111-222', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
    ];
    await workerRepo.save(workerRepo.create(workers));
    console.log('✅ Workers seeded');
  }

  // Seed inventory items
  const inventoryRepo = dataSource.getRepository(InventoryItem);
  const inventoryCount = await inventoryRepo.count();
  if (inventoryCount === 0) {
    const items = [
      { name: 'Olive Oil', category: 'Oils', stock: 10, reorderPoint: 15, status: 'Low Stock' },
      { name: 'Tomato Sauce', category: 'Sauces', stock: 8, reorderPoint: 10, status: 'Low Stock' },
      { name: 'Mozzarella Cheese', category: 'Dairy', stock: 40, reorderPoint: 15, status: 'Available' },
      { name: 'Penne Pasta', category: 'Grains', stock: 60, reorderPoint: 20, status: 'Available' },
      { name: 'Fresh Basil', category: 'Herbs', stock: 25, reorderPoint: 10, status: 'Available' },
      { name: 'Chicken Breast', category: 'Proteins', stock: 30, reorderPoint: 15, status: 'Available' },
      { name: 'Salmon Fillet', category: 'Proteins', stock: 0, reorderPoint: 10, status: 'Out of Stock' },
      { name: 'All-Purpose Flour', category: 'Grains', stock: 50, reorderPoint: 20, status: 'Available' },
    ];
    await inventoryRepo.save(inventoryRepo.create(items));
    console.log('✅ Inventory items seeded');
  }

  // Seed reviews
  const reviewRepo = dataSource.getRepository(Review);
  const reviewCount = await reviewRepo.count();
  if (reviewCount === 0) {
    const reviews = [
      { menuItemName: 'Classic Italian Penne', category: 'Pasta', rating: 5, reviewCount: 350, overallRating: 4.9, text: 'A delightful dish with perfectly cooked penne pasta.', author: 'Alice Johnson', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
      { menuItemName: 'Grilled Salmon', category: 'Seafood', rating: 4.5, reviewCount: 278, overallRating: 4.8, text: 'Fresh and succulent salmon, expertly cooked.', author: 'Bob Smith', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop' },
      { menuItemName: 'Chocolate Lava Cake', category: 'Dessert', rating: 5, reviewCount: 418, overallRating: 4.9, text: 'Warm, gooey center that melts in your mouth!', author: 'Grace Lee', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop' },
      { menuItemName: 'Beef Burger', category: 'Burgers', rating: 4.9, reviewCount: 642, overallRating: 4.8, text: 'Juicy and flavorful! Best burger in a while!', author: 'Frank Anderson', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
    ];
    await reviewRepo.save(reviewRepo.create(reviews));
    console.log('✅ Reviews seeded');
  }

  console.log('🌱 Seed complete!');
}
