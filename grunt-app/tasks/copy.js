module.exports = {
  dist: {
    files:[
      {
        src: 'app/index.html',
        dest: 'dist/index.html'
      },
      {
        cwd: 'app/fonts',
        src: '**',
        dest: 'dist/fonts/',
        expand: true
      },
      {
        cwd: 'app/images',
        src: '**/*.*',
        dest: 'dist/images/',
        expand: true
      },
      {
        cwd: 'app/sounds',
        src: '**/*.*',
        dest: 'dist/sounds/',
        expand: true
      },
      {
        cwd: 'app/lib',
        src: '**/*.*',
        dest: 'dist/lib/',
        expand: true
      }
    ]
  },
  www: {
    expand: true,
    cwd: 'dist',
    src: '**',
    dest: '../www'
  }
}
