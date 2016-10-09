module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {

            scss: {
                files: 'src/styles.scss',
                tasks: ['sass:dev', 'postcss']
            },

            css: {
                files: 'assets/styles.css',
                options: {
                    livereload: true
                }
            },

            self: {
                files: 'Gruntfile.js'
            },
            js: {
                files: 'assets/*.js',
                options: {
                    livereload: true
                }
            },

            livereload: {
                files: '**/*.{html,svg,png,jpg}',
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            dev: {
                files: {
                    'src/styles.css': 'src/styles.scss'
                },
                options: {
                    'style': 'expanded'
                }
            },

            build: {
                files: {
                    'src/styles.css': 'src/styles.scss'
                }
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('postcss-cssnext')({warnForDuplicates: false}),
                    require('postcss-flexbugs-fixes')()
                ]
            },
            dev: {
                src: 'src/styles.css',
                dest: 'assets/styles.css'
            },
            build: {
                options: {
                    processors: [
                        require('postcss-cssnext')({warnForDuplicates: false}),
                        require('postcss-flexbugs-fixes')(),
                        require('cssnano')()
                    ]
                },
                src: 'src/styles.css',
                dest: 'dist/assets/styles.min.css'
            }
        },

        cacheBust: {
            build: {
                options: {
                    assets: ['assets/**/*'],
                    queryString: true,
                    baseDir: 'dist/'
                },
                src: ['dist/index.html']
            }
        },

        clean: ['dist/**/*'],

        copy: {
            build: {
                files: [
                    {src: 'assets/img/**', dest: 'dist/'},
                    {src: '*.php', dest: 'dist/'}
                ]
            }
        },

        processhtml: {
            build: {
                files: {
                    'dist/index.html': 'index.html'
                }
            }
        },

        uglify: {
            options:{
                compress: {
                    drop_console: true
                }
            },
            js: {
                files: {
                    'dist/assets/scripts.min.js': 'assets/*.js'
                }
            }
        },

        run: {
            deploy: {
                cmd: "./deploy.sh"
            }
        }
    });

    grunt.registerTask('default', 'watch');
    grunt.registerTask('build', ['clean', 'copy', 'processhtml', 'uglify', 'sass:build', 'postcss:build', 'cacheBust']);

    // Deploy task depends on deploy.sh which contains necessary commands for deployment (eg. scp)
    grunt.registerTask('deploy', ['build','run:deploy']);
};