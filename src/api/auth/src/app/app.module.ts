import { Module } from '@nestjs/common';
import { AuthPrismaModule } from '@org/database-auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [AuthPrismaModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
