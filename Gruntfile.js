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
			packagejson: {
				files: '<%= jshint.packagejson %>',
				tasks: ['jshint:packagejson', 'browserify:dist']
			},

			gruntfile: {
				files: '<%= jshint.gruntfile %>',
				tasks: ['jshint:gruntfile']
			},

			js: {
				files: '<%= jshint.dist %>',
				tasks: ['jshint:dist', 'browserify:dist']
			},

			css: {
				files: 'css/**/*.{less,css}',
				tasks: ['less']
			},

			html: {
				files: 'html/**/*.{swig,html}',
				tasks: ['swig']
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
				src: 'js/telepathy.js',
				dest: 'www/build/js/telepathy.js'
			}
		},

		jshint: {
			packagejson: 'package.json',
			gruntfile: 'Gruntfile.js',
			dist: 'js/**/*.{js,json}',

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
				src: [
					'v<%= pkg.version %>/css/*.css',
					'v<%= pkg.version %>/js/*.js',
					'v<%= pkg.version %>/img/*.png',
					'v<%= pkg.version %>/font/fontawesome*',
					'v<%= pkg.version %>/font/*.woff',
					'index.html'
				],

				dest: 'www/manifest.appcache',

				options: {
					basePath: 'www/',
					preferOnline: true,
					verbose: true,
					timestamp: true,

					exclude: [
						'v<%= pkg.version %>/img/icon-114x114.png',
						'v<%= pkg.version %>/img/startup-320x480.png',
						'v<%= pkg.version %>/img/startup-640x920.png',
						'v<%= pkg.version %>/img/startup-640x1096.png'
					]
				}
			}
		},

		less: {
			dist: {
				files: {
					'www/build/css/telepathy.css': 'css/telepathy.less'
				},

				options: {
					paths: ['css']
				}
			}
		},

		shell: {
			link: {
				command: 'rm www/v*-*; ln -s build www/v<%= pkg.version %>'
			}
		},

		swig: {
			index: {
				dest: 'www/',
				cwd: 'html/',
				src: 'index.html',

				version: '<%= pkg.version %>',

				init: {
					root: 'html/'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-manifest');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-swig');

	grunt.registerTask('default', ['test', 'build']);
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('build', ['browserify', 'less', 'shell:link', 'swig', 'manifest']);
};
