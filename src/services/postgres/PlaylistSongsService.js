const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { mapDBToModel } = require("../../utils");

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(id) {
    const query = {
      text: `
        SELECT
          p.id as playlistid,
          p.name,
          u.username,
          s.id AS songid,
          s.title,
          s.performer
        FROM
            playlistsongs ps
        INNER JOIN playlists p ON p.id = ps.playlist_id
        INNER JOIN users u ON u.id = p.owner
        LEFT JOIN songs s ON s.id = ps.song_id
        WHERE ps.playlist_id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);
    return {
      id: result.rows[0].playlistid,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: result.rows.map((row) => ({
        id: row.songid,
        title: row.title,
        performer: row.performer,
      })),
    };
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Playlist Song gagal dihapus. Id tidak ditemukan"
      );
    }
  }
}

module.exports = PlaylistSongsService;
