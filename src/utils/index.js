const mapAlbumToModel = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const mapSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapAlbumToModel, mapSongToModel };
