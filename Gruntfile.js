module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			test: {
				options: {
					port: 8000,
					base: 'tmp'
				}
			},

			server: {
				options: {
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
				tasks: ['jshint:packagejson', 'pkgreload']
			},

			gruntfile: {
				files: '<%= jshint.gruntfile %>',
				tasks: ['jshint:gruntfile']
			},

			js: {
				files: '<%= jshint.dist %>',
				tasks: ['jshint:dist', 'browserify:dist', 'karma:unit:run']
			},

			test: {
				files: ['<%= jshint.test %>'],
				tasks: ['jshint:test', 'karma:unit:run']
			},

			css: {
				files: 'css/**/*.{less,css}',
				tasks: ['less']
			},

			html: {
				files: 'html/**/*.{swig,html}',
				tasks: ['swig', 'htmlmin', 'karma:unit:run']
			},

			ln: {
				files: 'www/build/**/*',
				tasks: ['shell:link']
			},

			livereload: {
				files: [
					'www/**/*',
					'!www/build/**/*',
					'!www/img/**/*',
					'!www/font/**/*',
					'!www/robots.txt',
					'!www/sitemap.xml'
				],

				options: {
					livereload: true
				}
			}
		},

		browserify: {
			test: {
				src: 'js/telepathy.js',
				dest: 'tmp/build/js/telepathy.js'
			},

			dist: {
				src: 'js/telepathy.js',
				dest: 'www/build/js/telepathy.js'
			}
		},

		jshint: {
			packagejson: 'package.json',
			gruntfile: 'Gruntfile.js',
			dist: 'js/**/*.{js,json}',
			test: 'test/**/*.{js,json}',

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
					describe: false,
					it: false,
					before: false,
					after: false,
					beforeEach: false,
					afterEach: false,
					__html__: false
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
			test: {
				dest: 'tmp/',
				cwd: 'html',
				src: 'index.html',
				version: '<%= pkg.version %>',
				generateSitemap: false,
				generateRobotstxt: false,
				init: { root: 'html' }
			},

			index: {
				dest: 'www/',
				cwd: 'html',
				src: 'index.html',
				version: '<%= pkg.version %>',
				init: { root: 'html' }
			}
		},

		uglify: {
			dist: {
				files: {
					'www/build/js/telepathy.js': 'www/build/js/telepathy.js'
				}
			}
		},

		htmlmin: {
			dist: {
				files: {
					'www/index.html': 'www/index.html'
				},

				options: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'www/build/css/telepathy.css': 'www/build/css/telepathy.css'
				}
			}
		},

		karma: {
			unit: {
				hostname: '0.0.0.0',
				browsers: ['Firefox', 'Chrome', 'PhantomJS']
			},

			phantom: {
				singleRun: true,
				browsers: ['PhantomJS']
			},

			options: {
				reporters: 'dots',
				frameworks: ['mocha', 'browserify'],

				files: [
					'tmp/**/*.html',
					'www/**/*.html',
					'test/**/*.html',
					'test/**/*_test.js'
				],

				browserify: {
					watch: true
				},

				preprocessors: {
					'test/**/*.js': ['browserify'],
					'test/**/*.html': ['html2js'],
					'www/**/*.html': ['html2js'],
					'tmp/**/*.html': ['html2js']
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
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('default', ['test', 'build', 'minify']);
	grunt.registerTask('test', ['jshint', 'browserify:test', 'swig:test', 'connect:test', 'karma:phantom']);
	grunt.registerTask('build', ['browserify:dist', 'less', 'shell:link', 'swig:index', 'manifest']);
	grunt.registerTask('minify', ['htmlmin', 'cssmin']);

	grunt.registerTask('pkgreload', 'Reload package.json', function() {
		grunt.log.writeln('Reloading package.json');
		grunt.config.data.pkg = grunt.file.readJSON('package.json');
	});
};
