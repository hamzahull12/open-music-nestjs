import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/database/database.module';
import { CreateAlbumDto } from './dto/create-album';
import { nanoid } from 'nanoid';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
  ) {}

  async addAlbum(payload: CreateAlbumDto) {
    interface NotRow {
      id: string;
    }
    const { name, year } = payload;
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this.pool.query<NotRow>(query);
    return result.rows[0].id;
  }

  async getAlbumById(id: string) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new HttpException(
        {
          status: 'fail',
          message: `album dengan id ${id} tidak ditemukan`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result.rows[0];
  }
}
