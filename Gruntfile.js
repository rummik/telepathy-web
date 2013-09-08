module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					port: 8000,
					hostname: '*',
					base: 'www',
					keepalive: true,
					livereload: true
				}
			}
		},

		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile %>',
				tasks: ['jshint:gruntfile', 'manifest:dist']
			},

			dist: {
				files: '<%= jshint.dist %>',
				tasks: ['jshint:dist', 'browserify:dist', 'manifest:dist']
			},

			livereload: {
				files: 'www/**/*',
				options: {
					livereload: true
				}
			}
		},

		browserify: {
			dist: {
				src: ['src/**/*.js'],
				dest: 'www/js/telepathy.js'
			}
		},

		jshint: {
			gruntfile: 'Gruntfile.js',
			dist: 'src/**/*.{js,json}',

			options: {
				curly: false,
				eqeqeq: false,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				smarttabs: true,
				strict: false,
				browser: true,
				node: true,

				globals: {
				}
			}
		},

		manifest: {
			dist: {
				options: {
					basePath: 'www/',
					preferOnline: true,
					verbose: true,
					timestamp: true
				},

				src: [
					'css/*.css',
					'js/*.js',
					'img/*.png',
					'font/*',
					'index.html'
				],

				dest: 'www/manifest.appcache'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-manifest');

	grunt.registerTask('default', ['test', 'build']);
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('build', ['browserify', 'manifest']);
};
