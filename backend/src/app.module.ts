import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ScholarshipsModule } from './modules/scholarships/scholarships.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { MatchingModule } from './modules/matching/matching.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ScholarshipsModule,
    ApplicationsModule,
    MatchingModule,
    NotificationsModule,
    AdminModule,
  ],
})
export class AppModule {}
