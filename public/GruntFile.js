module.exports = function (grunt) {
  grunt.initConfig({
    bower: grunt.file.readJSON('bower.json'),
    clean: {
      dist: ['dist/*'],
      tmp: ['.tmp'],
      js: ['dist/scripts']
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{ expand: true, cwd: 'app/', src: '**/*.js', dest: 'dist/app/' }]
      }
    },
    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'app/', src: ['**', '!**/*.js'], dest: 'dist/app/' },
          { expand: true, cwd: 'assets/', src: ['**', '!**/scss/**'], dest: 'dist/assets/' },
          { expand: true, cwd: 'libs/', src: '**', dest: 'dist/libs/' }
        ]
      },
      js: {
        files: [
          { src: 'dist/app.angular.js', dest: 'dist/app/app.angular.js' }
        ]
      },
      libs: {
        files: '<%= bower.copy %>'
      }
    },
    htmlmin: {
      dist: {
        options: { removeComments: true, collapseWhitespace: true },
        files: [
          { expand: true, cwd: 'views/', src: ['*.html', '**/*.html'], dest: 'dist/views/' }
        ]
      }
    },
    watch: {
      sass: {
        files: ['assets/scss/*.scss'],
        tasks: ['sass']
      },
      js_html: {
        files: ['app/**/*.js', 'app/**/*.html'],
        tasks: ['build']
      }
    },
    sass: {
      dist: {
        files: [
          { 'assets/styles/app.css': ['assets/scss/app.scss'] }
        ]
      }
    },
    useminPrepare: {
      html: ['dist/app/index.html']
    },
    usemin: {
      html: ['dist/app/index.html']
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    }
  });

  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-assemble');

  grunt.registerTask('build', [
    'clean:dist',
    'babel',
    'copy',
    'sass',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'usemin',
    'htmlmin',
    'clean:tmp',
    'copy:js',
    'clean:js'
  ]);

  grunt.registerTask('release', [
    'bump'
  ]);

  grunt.registerTask('html', [
    'clean:html',
    'assemble'
  ]);
};
