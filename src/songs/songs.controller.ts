import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
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

  @Get()
  async getSongs(
    @Query('title') title?: string,
    @Query('performer') performer?: string,
  ) {
    const songs = await this.songsService.getSongs({ title, performer });
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  @Get(':id')
  async getSongsById(@Param('id') id: string) {
    const song = await this.songsService.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  @Put(':id')
  async putSongById(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(createSongSchema)) payload: CreateSongDto,
  ) {
    await this.songsService.editSongById(id, payload);
    return {
      status: 'success',
      message: 'Lagu Berhasil diperbarui',
    };
  }

  @Delete(':id')
  async deleteSongById(@Param('id') id: string) {
    await this.songsService.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}
