class CollaborationHandler {
  constructor(playlistsService, usersService, service, validator) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._service = service;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._usersService.verifyUserExist(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._service.addCollaboration({
      playlistId,
      userId,
    });

    const response = h.response({
      status: "success",
      message: "Collaboration berhasil ditambahkan",
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._usersService.verifyUserExist(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    this._service.deleteCollaboration(playlistId, userId);

    return {
      status: "success",
      message: "Collaboration berhasil dihapus",
    };
  }
}

module.exports = CollaborationHandler;
