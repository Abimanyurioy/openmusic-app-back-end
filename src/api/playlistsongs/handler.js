class PlaylistSongsHandler {
  constructor(playlistsService, songsService, service, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongByIdHandler =
      this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);

    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._songsService.verifySongExist(songId);
    await this._playlistsService.verifyPlaylistCollaborationOwner(
      playlistId,
      credentialId
    );
    const playlistsongId = await this._service.addPlaylistSong({
      playlistId,
      songId,
    });

    const response = h.response({
      status: "success",
      message: "Playlist Song berhasil ditambahkan",
      data: {
        playlistsongId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistCollaborationOwner(
      playlistId,
      credentialId
    );
    const playlist = await this._service.getPlaylistSongs(playlistId);
    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongByIdHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistCollaborationOwner(
      playlistId,
      credentialId
    );
    this._service.deletePlaylistSongById(playlistId, songId);

    return {
      status: "success",
      message: "Playlist Song berhasil dihapus",
    };
  }
}

module.exports = PlaylistSongsHandler;
