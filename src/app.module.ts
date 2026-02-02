import { Module } from '@nestjs/common';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [AlbumsModule],
})
export class AppModule {}
