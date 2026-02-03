import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import {
  createAlbumSchema,
  updateAlbumSchema,
} from './validation/album.schema';
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

  @Put(':id')
  async putAlbumById(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateAlbumSchema))
    payload: CreateAlbumDto,
  ) {
    await this.albumsService.editAlbumById(id, payload);
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  @Delete(':id')
  async deleteAlbumById(@Param('id') id: string) {
    await this.albumsService.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}
