import { Module } from '@nestjs/common';
import { AuthClientModule } from './auth/auth-client.module';

@Module({
  imports: [AuthClientModule],
})
export class AppModule {}
