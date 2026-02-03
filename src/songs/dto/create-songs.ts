export class CreateSongDto {
  title: string;
  year: string;
  genre: string;
  performer: string;
  duration?: number;
  albumId?: string;
}
