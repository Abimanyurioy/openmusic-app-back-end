const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapAlbumToModel } = require("../../utils");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = "album-" + nanoid(16);

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `
        SELECT
          a.id AS albumid,
          a.name,
          a.year,
          a.coverurl,
          s.id AS songid,
          s.title,
          s.performer
        FROM
          albums a
        LEFT JOIN
          songs s ON s.album_id = a.id 
        WHERE
          a.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return {
      id: result.rows[0].albumid,
      name: result.rows[0].name,
      year: result.rows[0].year,
      coverUrl: result.rows[0].coverurl,
      songs: result.rows
        .filter((row) => row.songid !== null)
        .map((row) => ({
          id: row.songid,
          title: row.title,
          performer: row.performer,
        })),
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui Album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async editAlbumCoverById(id, coverlocation) {
    const query = {
      text: "UPDATE albums SET coverurl = $1 WHERE id = $2 RETURNING id",
      values: [coverlocation, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui Album. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumsService;
