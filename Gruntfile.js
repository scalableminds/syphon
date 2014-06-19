/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.5.0',
      banner: '// Syphon, v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Norman Rzepka, scalable minds.\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/scalableminds/syphon\n' +
        '//\n' +
        '// Based on:\n' +
        '// Backbone.Syphon, v0.4.1\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/derickbailey/backbone.syphon'
    },

    rig: {
      build: {
        src: ['<banner:meta.banner>', 'src/umd.js'],
        dest: 'dist/syphon.js'
      }
    },

    uglify: {
      build: {
        src: ['dist/syphon.js'],
        dest: 'dist/syphon.min.js'
      }
    },

    jshint: {
      files: ['src/syphon.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          _: true
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['rig', 'jshint', 'uglify']);

};
