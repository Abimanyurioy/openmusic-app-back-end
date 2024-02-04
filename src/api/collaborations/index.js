const CollaborationHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "collaborations",
  version: "1.0.0",
  register: async (
    server,
    { playlistsService, usersService, service, validator }
  ) => {
    const collaborationHandler = new CollaborationHandler(
      playlistsService,
      usersService,
      service,
      validator
    );
    server.route(routes(collaborationHandler));
  },
};
