const AlbumLikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albumlikes",
  version: "1.0.0",
  register: async (
    server,
    { service, usersService, albumsService, cacheService }
  ) => {
    const albumLikesHandler = new AlbumLikesHandler(
      service,
      usersService,
      albumsService,
      cacheService
    );
    server.route(routes(albumLikesHandler));
  },
};
