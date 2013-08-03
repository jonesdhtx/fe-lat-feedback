'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['components/requirejs/require.js', '<%= concat.dist.dest %>'],
        dest: 'dist/require.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/require.min.js'
      },
    },
    qunit: {
      files: ['test/unit/**/*.html']
    },
    jshint: {
      src: ['src/**/*.js']
    },
    sass: {
      options: {
        cacheLocation: 'build/.sass-cache',
        loadPath: [
          'components/fe-lat-global/dist/styles',
          'components/fe-lat-nav/dist/styles',
        ]
      },
      dev: {
        src: ['src/styles/*.scss'],
        dest: 'build/feedback.css'
      },
      dist: {
        options: {
          style: 'compact'
        },
        src: ['src/styles/*.scss'],
        dest: 'dist/feedback.css'
      }
    },
    watch: {
      sass: {
        files: [
          '../components/fe-lat-global/dist/styles/*.scss',
          'dist/styles/*.scss'
        ],
        tasks: ['sass:dev'],
      }
    },
    requirejs: {
      compile: {
        options: {
          // optimize: 'none',
          name: 'main',
          mainConfigFile: 'src/main.js',
          out: 'dist/feedback.js'
        }
      }
    },
    connect: {
      development: {
        options: {
          keepalive: false,
        }
      },
      production: {
        options: {
          keepalive: true,
          port: 8000,
          middleware: function(connect, options) {
            return [
              // rewrite requirejs to the compiled version
              function(req, res, next) {
                if (req.url === '/components/requirejs/require.js') {
                  req.url = '/dist/require.min.js';
                }
                next();
              },
              connect.static(options.base),

            ];
          }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('default', ['build']);
  grunt.registerTask('unit', ['jshint', 'sass:dev', 'qunit']);
  grunt.registerTask('build', ['unit', 'clean', 'sass:dist', 'requirejs', 'concat', 'uglify']);
  grunt.registerTask('server', ['sass:dev', 'connect:development', 'watch:sass']);
  grunt.registerTask('preview', ['default', 'connect:production']);

};
