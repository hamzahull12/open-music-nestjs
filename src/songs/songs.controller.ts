import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { createSongSchema } from './validation/song.schema';
import { CreateSongDto } from './dto/create-songs';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @HttpCode(201)
  async postSong(
    @Body(new JoiValidationPipe(createSongSchema)) payload: CreateSongDto,
  ) {
    const songId = await this.songsService.addSong(payload);
    return {
      status: 'success',
      data: {
        songId,
      },
    };
  }
}
