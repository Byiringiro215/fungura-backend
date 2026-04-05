import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module';
import { WorkersModule } from './modules/workers/workers.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'fungura'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
        pool: { min: 2, max: 10 },
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    MenuModule,
    OrdersModule,
    KitchenModule,
    InventoryModule,
    PurchaseOrdersModule,
    WorkersModule,
    ReviewsModule,
    MessagesModule,
    NotificationsModule,
    DashboardModule,
    CalendarModule,
    UploadModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
