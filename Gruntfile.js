module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      version: '<%= pkg.version %>',
      banner: (
        '// Backbone.Syphon, v<%= meta.version %>\n' +
        '// Copyright (c) <%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/marionettejs/backbone.syphon\n'
      )
    },

    clean: {
      lib: 'lib/'
    },

    preprocess: {
      lib: {
        files : [{
          src: 'src/build/backbone.syphon.js',
          dest: 'lib/backbone.syphon.js'
        }, {
          src: 'src/build/syphon.js',
          dest: 'lib/syphon.js'
        }]
      },
      tmp: {
        files: [{
          src: 'src/build/backbone.syphon.js',
          dest: 'tmp/backbone.syphon.js'
        }, {
          src: 'src/build/syphon.js',
          dest: 'tmp/syphon.js'
        }]
      }
    },

    template: {
      options: {
        data: {
          version: '<%= pkg.version %>'
        }
      },
      lib: {
        files: [{
          src: '<%= preprocess.lib.files[0].dest %>',
          dest: '<%= preprocess.lib.files[0].dest %>'
        },{
          src: '<%= preprocess.lib.files[1].dest %>',
          dest: '<%= preprocess.lib.files[1].dest %>'
        }]
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>',
        sourceMap: true
      },
      lib: {
        files: [{
          src: '<%= preprocess.lib.files[0].dest %>',
          dest: 'lib/backbone.syphon.min.js'
        }, {
          src: '<%= preprocess.lib.files[1].dest %>',
          dest: 'lib/syphon.min.js'
        }]
      }
    },

    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['src/**.js']
      },

      spec: {
        options: {
          jshintrc: 'spec/.jshintrc'
        },
        src: ['spec/javascripts/**.js']
      }
    },

    jasmine: {
      tests: {
        src: [
          'tmp/backbone.syphon.js'
        ],
        options: {
          specs: 'spec/javascripts/*.spec.js',
          vendor: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/underscore/underscore.js',
            'bower_components/backbone/backbone.js',
            'spec/javascripts/helpers/jasmine-jquery.js',
            'spec/javascripts/helpers/SpecHelper.js'
          ]
        }
      }
    },

    mochaTest: {
      withBackbone: {
        options: {
          require: 'spec/javascripts/setup/node.js',
          reporter: 'dot',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'spec/javascripts/setup/helpers.js',
          'spec/javascripts/*.spec.js'
        ]
      },
      noBackbone: {
        options: {
          require: 'spec/javascripts/setup/node-nobackbone.js',
          reporter: 'dot',
          clearRequireCache: true,
          mocha: require('mocha')
        },
        src: [
          'spec/javascripts/setup/helpers.js',
          'spec/javascripts/*.spec.js'
        ]
      }
    }
  });

  grunt.registerTask('build', [
    'jshint:src',
    'clean:lib',
    'preprocess:lib',
    'template:lib',
    'uglify'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'preprocess:tmp',
    'mochaTest'
  ]);

  grunt.registerTask('default', [
    'build',
    'test'
  ]);
};
