import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/database/database.module';
import { CreateSongDto } from './dto/create-songs';
import { nanoid } from 'nanoid';

@Injectable()
export class SongsService {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
  ) {}
  async addSong(payload: CreateSongDto) {
    interface NotRow {
      id: string;
    }
    const { title, year, genre, performer, duration, albumId } = payload;

    const id = `song-${nanoid(16)}`;
    const query = {
      text: `
        INSERT INTO songs (id, title, year, genre, performer, duration, album_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this.pool.query<NotRow>(query);
    return result.rows[0].id;
  }
}
