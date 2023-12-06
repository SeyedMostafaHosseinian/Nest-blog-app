import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
