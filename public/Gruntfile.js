var BUILDNUMBER = (new Date()).valueOf();
module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-dependencies');
    grunt.loadNpmTasks('grunt-bower-concat');

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-autopolyfiller');
    grunt.loadNpmTasks('grunt-html-convert');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/*', 'publish/js/*', 'publish/css/*', 'publish/translation/*'],
        bower_concat: {
            all: {
                dest: {
                    'js': 'dist/_bower.js',
                    'css': 'dist/_bower.css'
                },
                include: [],
                exclude: [
                ],
                dependencies: {
                },
                bowerOptions: {
                    relative: true
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            files: {
                expand: true,
                src: ['dist/_main.js'],
                dest: 'dist/tmp/'
            },
        },
        concat: {
            options: {
                separator: '\n'
            },

            source: {
                src: [
                    'src/**/*.js'
                ],
                dest: 'dist/_main.js'
            },
            css: {
                src: [
                    'dist/_bower.css',
                    'css/*.css',
                ],
                dest: 'publish/css/main.css'
            },
            build: {
                src: [
                    'dist/_bower.js',
                    'dist/tmp/dist/_main.js',
                ],
                dest: 'publish/js/main.js'

            }
        },
        uglify: {
            options: {
                report: 'min',
                mangle: false,
                preserveComments: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            js: { //target
                src: ['publish/js/main.js'],
                dest: 'publish/js/main.min.js'
            },
            css: { //target
                src: ['publish/css/main.css'],
                dest: 'publish/css/main.min.css'
            }
        },
        comments: {
            your_target: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: ['publish/js/main.js']
            },
        },
        'string-replace': {
            inline: {
                files: {
                    'dist/': 'dist/main.js',
                    './': 'index.html',
                },
                options: {
                    replacements: [
                        {
                            pattern: /\{\{BUILDNUMBER\}\}/ig,
                            replacement: BUILDNUMBER
                        }
                    ]
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'translation/',
                        src: ['*'],
                        dest: 'publish/translation',
                        filter: 'isFile'
                    }
                ],
            },
        },
        jsbeautifier: {
            files: ["src/**/*.js"],
            options: {
                js: {
                    indentLevel: 0,
                    maxPreserveNewlines: 10,
                    spaceBeforeConditional: true,
                    indentSize: 4,
                    wrapLineLength: 180,
                    indentWithTabs: false,
                }
            }
        }
    });

    grunt.registerTask('build', "Creating dev package", function () {

        grunt.task.run('clean');
        grunt.task.run('jsbeautifier');
        grunt.task.run('bower_concat');
        grunt.task.run('concat:source');
        grunt.task.run('concat:css');
        grunt.task.run('babel');
        grunt.task.run('concat:build');
        grunt.task.run('concat');
        grunt.task.run('copy');

        grunt.task.run('string-replace');
        // grunt.task.run('uglify:js');

    });
}
;