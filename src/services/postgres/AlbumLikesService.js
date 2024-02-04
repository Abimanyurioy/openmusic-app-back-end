const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapAlbumToModel } = require("../../utils");

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(albumid, userid) {
    const id = `albumlike-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albumlikes VALUES($1, $2, $3) RETURNING id",
      values: [id, albumid, userid],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album Like gagal ditambahkan");
    }
    await this._cacheService.delete(`albums:${albumid}`);
    return result.rows[0].id;
  }

  async getAlbumLikeById(albumid) {
    try {
      const result = await this._cacheService.get(`albums:${albumid}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `
          SELECT
            a.id,
            COALESCE(COUNT(al.id), 0) AS likes
          FROM
            albums a
          LEFT JOIN albumlikes al ON al.album_id = a.id
          WHERE
            a.id = $1
          GROUP BY a.id
        `,
        values: [albumid],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError("Album tidak ditemukan");
      }

      const mappedResult = {
        likes: Number(result.rows[0].likes),
      };

      await this._cacheService.set(
        `albums:${albumid}`,
        JSON.stringify(mappedResult)
      );
      return mappedResult;
    }
  }

  async deleteAlbumLikeById(albumid, userid) {
    const query = {
      text: "DELETE FROM albumlikes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumid, userid],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album Likes gagal dihapus. Id tidak ditemukan");
    }
    await this._cacheService.delete(`albums:${albumid}`);
  }

  async verifyAlbumLikeExist(albumid, userid) {
    const query = {
      text: `
        SELECT
          a.*
        FROM
          albumlikes a
        WHERE
          a.album_id = $1
          AND a.user_id = $2
      `,
      values: [albumid, userid],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("Album Likes tidak ditemukan");
    }
  }
}

module.exports = AlbumLikesService;
