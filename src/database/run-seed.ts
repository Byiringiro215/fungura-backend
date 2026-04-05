import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { seed } from './seed';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fungura',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function run() {
  try {
    await dataSource.initialize();
    console.log('📦 Database connection established');
    await seed(dataSource);
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

run();
