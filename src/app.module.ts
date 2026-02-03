import { Module } from '@nestjs/common';
import { AlbumsModule } from './albums/albums.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [AlbumsModule, SongsModule],
})
export class AppModule {}
