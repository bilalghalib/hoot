
module.exports = {
    main: {
      options: {
        archive: '../www.zip'
      },
      files: [
        {expand: true, cwd: '', src: ['../www/**/*.*'], dest: '../www'}
      ]
    }
};
