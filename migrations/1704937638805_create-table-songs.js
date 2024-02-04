
exports.up = (pgm) => {
    pgm.createTable('songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      title: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      year: {
        type: 'INT',
        notNull: true,
      },
      genre: {
        type: 'TEXT',
        notNull: true,
      },
      performer: {
        type: 'TEXT',
        notNull: true,
      },
      duration: {
        type: 'INT',
      },
      album_id: {
        type: 'VARCHAR(50)',
        references: 'albums(id)',
      },
    });
  
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('songs');
  };
