var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var PORT = 3501;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function(grunt) {

	var folders = {
		app: 'app',
		dist: 'dist',
		tests: 'tests',
		temp: 'temp'
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		folders: folders,
		livereload: {
			port: PORT
		},
		connect: {
			options: {
				port: PORT,
				keepalive: true
			},
			temp: {
				options: {
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, folders.temp), folderMount(connect, folders.app)];
					}
				}
			},
			dist: {
				options: {
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, folders.dist)];
					}
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= connect.options.port %>'
			}
		},
		rubyHaml: {
			options: {
				templatize: false
			},
			temp: {
				files: {
					'<%= folders.temp %>/index.html': '<%= folders.app %>/index.haml',
					'<%= folders.temp %>/templates/forms/login.html': '<%= folders.app %>/templates/forms/login.haml',
					'<%= folders.temp %>/templates/forms/message.html': '<%= folders.app %>/templates/forms/message.haml',
					'<%= folders.temp %>/templates/general/login_message.html': '<%= folders.app %>/templates/general/login_message.haml',
					'<%= folders.temp %>/templates/general/messages.html': '<%= folders.app %>/templates/general/messages.haml',
					'<%= folders.temp %>/templates/general/user_list.html': '<%= folders.app %>/templates/general/user_list.haml'
				}
			},
			dist: {
				files: {
					'<%= folders.app %>/index.html': '<%= folders.app %>/index.haml',
					'<%= folders.temp %>/templates/forms/login.html': '<%= folders.app %>/templates/forms/login.haml',
					'<%= folders.temp %>/templates/forms/message.html': '<%= folders.app %>/templates/forms/message.haml',
					'<%= folders.temp %>/templates/general/login_message.html': '<%= folders.app %>/templates/general/login_message.haml',
					'<%= folders.temp %>/templates/general/messages.html': '<%= folders.app %>/templates/general/messages.haml',
					'<%= folders.temp %>/templates/general/user_list.html': '<%= folders.app %>/templates/general/user_list.haml'
				}
			}
		},
		jshint: {
			options: {
				'node': true,
				'browser': true,
				'esnext': true,
				'bitwise': true,
				'camelcase': true,
				'curly': true,
				'eqeqeq': true,
				'immed': true,
			//	'indent': 4,
				'latedef': true,
				'newcap': true,
				'noarg': true,
				'quotmark': 'single',
				'regexp': true,
			//	'undef': true,
			//	'unused': true,
				'trailing': true,
				'smarttabs': true
			},
			target: {
				src : [
					'<%= folders.app %>/scripts/main.js',
					'<%= folders.app %>/scripts/angular/**/*.js'
				]
			}
		},
		clean: {
			temp: '<%= folders.temp %>/*',
			dist_all: '<%= folders.dist %>/*',
			dist_unused: [
				'<%= folders.dist %>/scripts/templates.js',
				'<%= folders.dist %>/styles/font-awesome.css'
			],
			app_unused: [
				'<%= folders.app %>/scripts/<%= pkg.name %>.min.js',
				'<%= folders.app %>/index.html',
			]
		},
		compass: {
			options: {
				sassDir: '<%= folders.app %>/styles',
				imagesDir: '<%= folders.app %>/images',
				javascriptsDir: '<%= folders.app %>/scripts',
			},
			dist: {
				options: {
					cssDir: '<%= folders.dist %>/styles',
					environment: 'production'
				}
			},
			temp: {
				options: {
					cssDir: '<%= folders.temp %>/styles',
				}
			}
		},
		concat: {
			options: {
				stripBanners: true
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= folders.app %>',
						src: [
							'beep.wav',
							'index.html',
							'images/smileys.png',
							'styles/font/**',
							'scripts/lang/**',
							'scripts/dependencies/**'
						],
						dest: '<%= folders.dist %>'
					},
					{
						src: '<%= folders.app %>/scripts/<%= pkg.name %>.min.js',
						dest: '<%= folders.dist %>/scripts/<%= pkg.name %>.js',
					}
				]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - ' +
						'v<%= pkg.version %> - ' +
						'<%= grunt.template.today("dd/mm/yyyy") %> ' +
						'*/\n'
				},
			dist: {
				src: '<%= folders.app %>/scripts/<%= pkg.name %>.min.js',
				dest: '<%= folders.dist %>/scripts/<%= pkg.name %>.min.js'
			}
		},
		useminPrepare: {
			html: '<%= folders.app %>/index.html',
			dest: '<%= folders.dist %>'
		},
		usemin: {
			options: {
				dirs: [
					'<%= folders.dist %>'
				]
			},
			html: [
				'<%= folders.dist %>/index.html'
			],
			css: []
		},
		'ftp-deploy': {
			dist: {
				auth: {
					host: 'chat.adircdn.com',
					port: '**',
					authKey: 'deploy'
				},
				src: '<%= folders.dist %>',
				dest: '',
				exclusions: []
			}
		},
		ngtemplates: {
			myapp: {
				options: {
					base: '<%= folders.temp %>',
					module: '<%= pkg.name %>',
					concat: '<%= folders.app %>/scripts/<%= pkg.name %>.min.js'
				},
				src: '<%= folders.temp %>/templates/**/*.html',
				dest: '<%= folders.dist %>/scripts/templates.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-ruby-haml');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-angular-templates');

	grunt.registerTask('default', [
		'clean:temp',
		'rubyHaml:temp',
		'compass:temp',
		'open',
		'livereload-start',
		'connect:temp'
	]);

	grunt.registerTask('dist', [
		'rubyHaml:dist',
		'jshint',
		'clean:dist_all',
		'useminPrepare',
		'ngtemplates',
		'concat',
		'uglify:dist',
		'copy:dist',
		'usemin',
		'compass:dist',
		'clean:dist_unused',
		'clean:app_unused'
	]);

	grunt.registerTask('deploy', [
		'ftp-deploy:dist'
	]);

	grunt.registerTask('test', [
		'jshint'
	]);

	grunt.registerTask('dist-server', [
		'dist',
		'open',
		'livereload-start',
		'connect:dist'
	]);

	grunt.registerTask('dist-deploy', [
		'dist',
		'deploy'
	]);
};