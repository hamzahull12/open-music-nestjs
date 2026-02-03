import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

  async getSongs({ title, performer }: any) {
    const query = await this.pool.query(
      `
    SELECT id, title, performer
    FROM songs
    WHERE ($1::text IS NULL OR title ILIKE $1)
      AND ($2::text IS NULL OR performer ILIKE $2)
    `,
      [title ? `%${title}%` : null, performer ? `%${performer}%` : null],
    );
    return query.rows;
  }

  async getSongById(id: string) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new HttpException(
        {
          status: 'fail',
          message: `Lagu dengan id ${id} tidak ditemukan`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result.rows[0];
  }

  async editSongById(id: string, payload: CreateSongDto) {
    const { title, year, performer, genre, duration, albumId } = payload;
    const query = {
      text: `
        UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6
        WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new HttpException(
        {
          status: 'fail',
          message: `Lagu dengan id ${id} tidak ditemukan`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteSongById(id: string) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new HttpException(
        {
          status: 'fail',
          message: `Lagu dengan id ${id} tidak ditemukan`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
