module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - */\n' +
          '(function (jQuery) {\n',
        footer: '}(jQuery));',
        process: function (src, filepath) {
          // Remove all block comments
          return src.replace(/\/\*[\s\S]*?\*\//g, '');
        }
      },
      dist: {
        src: ['src/<%= pkg.name %>.js', 'src/rules.js', 'src/ui.js', 'src/themes/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>  - v<%= pkg.version %> - */\n' +
          '(function (jQuery) {',
        footer: '}(jQuery));'
      },
      my_target: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js', 'src/rules.js', 'src/ui.js', 'src/themes/*.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'src/themes/*.js'],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);
};
