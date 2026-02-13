import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// PrismaModule is global, so no need to import it here if we marked it @Global

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}