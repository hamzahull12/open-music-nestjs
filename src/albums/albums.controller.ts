import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { createAlbumSchema } from './validation/album.schema';
import { CreateAlbumDto } from './dto/create-album';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @HttpCode(201)
  async postAlbum(
    @Body(new JoiValidationPipe(createAlbumSchema)) payload: CreateAlbumDto,
  ) {
    const albumId = await this.albumsService.addAlbum(payload);
    return {
      status: 'success',
      data: {
        albumId,
      },
    };
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    const album = await this.albumsService.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }
}
