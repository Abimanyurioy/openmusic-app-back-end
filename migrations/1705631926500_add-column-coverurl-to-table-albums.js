exports.up = (pgm) => {
    pgm.addColumn('albums', {
      coverurl: {
        type: 'TEXT',
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropColumn('albums', 'coverurl');
  };