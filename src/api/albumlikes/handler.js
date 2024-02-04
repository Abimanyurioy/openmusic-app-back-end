class AlbumLikesHandler {
  constructor(service, usersService, albumsService, cacheService) {
    this._service = service;
    this._usersService = usersService;
    this._albumsService = albumsService;
    this._cacheService = cacheService;
    this.postAlbumLikeByIdHandler = this.postAlbumLikeByIdHandler.bind(this);
    this.getAlbumLikeByIdHandler = this.getAlbumLikeByIdHandler.bind(this);
    this.deleteAlbumLikeByIdHandler =
      this.deleteAlbumLikeByIdHandler.bind(this);
  }

  async postAlbumLikeByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._usersService.verifyUserExist(credentialId);
    await this._albumsService.getAlbumById(id);
    await this._service.verifyAlbumLikeExist(id, credentialId);
    await this._service.addAlbumLike(id, credentialId);

    const response = h.response({
      status: "success",
      message: "Album Likes berhasil ditambahkan",
    });
    response.code(201);
    return response;
  }

  async getAlbumLikeByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const result = JSON.parse(await this._cacheService.get(`albums:${id}`));
      const response = h.response({
        status: "success",
        data: result,
      });
      response.header("X-Data-Source", "cache");
      return response;
    } catch (error) {
      const { id } = request.params;
      const data = await this._service.getAlbumLikeById(id);
      const response = h.response({
        status: "success",
        data,
      });
      response.header("X-Data-Source", "no cache");
      return response;
    }
  }

  async deleteAlbumLikeByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._usersService.verifyUserExist(credentialId);
    await this._service.deleteAlbumLikeById(id, credentialId);

    return {
      status: "success",
      message: "Album Likes berhasil dihapus",
    };
  }
}

module.exports = AlbumLikesHandler;
