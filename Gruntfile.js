/*
 *  WPE Test Framework task runner
 *  Creates the build (cleans the directory, copy's static files, concats the js and runs an uglification)
 */

var scripts = [],
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/img', 'build/css', 'build/js' ],
            main: 'js/main.js'
        },
        concat: {
            options: {
                separator: ';'
            },
            build: {
                src: '<%= scripts %>',
                dest: 'build/js/main.js'
            }
        },
        connect: {
            server: {
                options: {
                    port: 1234,
                    base: 'src',
                    keepalive: true
                }
            }
        },
        copy: {
            images: {
                expand: true,
                cwd: 'src/img/',
                src: '**',
                dest: 'build/img/'
            },
            css: {
                expand: true,
                cwd: 'src/css/',
                src: '**',
                dest: 'build/css/'
            },
            html: {
                src: 'src/index.html',
                dest: 'build/index.html'
            },
            tests: {
                src : '<%= testScripts =>',
                dest : 'build/js/tests/'
            },
            lib : {
                src : 'src/js/lib',
                dest : 'build/js/lib'
            }
        },
        // removed 'src/js/tests/*.js' for the time being, until we converted that into a web useable format
        jshint: {
            files: ['Gruntfile.js', 'src/js/*.js', 'src/js/core/*.js', 'src/js/views/*.js', 'src/js/plugins/*.js'],
            options: {
                'esversion': 6
            }
        },   
        uglify: {
            main: {
                files: {
                    'build/js/main.js': ['<%= concat.build.dest %>'],
                }
            },
            task: {
                files: {
                    'build/js/task/task.js': 'src/js/task/task.js'
                }
            }

        },
        watch: {
            base : {
                files: ['src/js/*.js'],
                tasks: ['compile']
            },
            plugins : {
                files: ['src/js/plugins/*.js'],
                tasks: ['compile']
            },
            layouts : {
                files: ['src/js/layout/*.js'],
                tasks: ['compile']
            }
        }
    });

    //custom task to load the core files
    grunt.task.registerTask('loadScripts', 'Loads the required files for all plugins', function() {

        //reset our globals
        var cwd = process.cwd();
        var jsDir = path.join( cwd, 'src', 'js');
        var coreDir = path.join(jsDir, 'core');
        var pluginDir = path.join( jsDir, 'plugins');
        var layoutDir = path.join( jsDir, 'layout');
        var scripts = [];

        // add conf
        scripts.push('js/conf.js');

        shell.cd(coreDir);
        shell.ls('*.js').forEach( function(p) {
            scripts.push('js/core/' + p);
        });

        shell.cd(pluginDir);
        shell.ls('*.js').forEach( function(p) {
            scripts.push('js/plugins/' + p);
        });

        shell.cd(layoutDir);
        shell.ls('*.js').forEach( function(p) {
            scripts.push('js/layout/' + p);
        });        

        shell.cd(cwd);

        console.log('Found scripts: \n ', JSON.stringify(scripts, null, 4));

        // write debug scripts.json
        var scriptsJson = path.join(jsDir, 'scripts.json');
        console.log('Writing to debug json: ', scriptsJson);
        grunt.file.write( scriptsJson, JSON.stringify(scripts, null, 4) );

        //set the files we just read
        var gruntScripts = [];
        for (var i=0; i<scripts.length; i++) {
            gruntScripts.push('src/' + scripts[i]);
        }

        grunt.config.set('scripts', gruntScripts);
    });

    //custom task to load the tests
    grunt.task.registerTask('loadTests', 'Loads the tests that can be run', function() {

        //reset our globals
        var cwd = process.cwd();
        var jsDir = path.join( cwd, 'src', 'js');
        var testsDir = path.join(jsDir, 'tests');
        var tests = [];


        shell.cd(testsDir);
        shell.ls('*.js').forEach( function(p) {
            tests.push( JSON.stringify({ 'name' : p, 'file' : 'js/tests/' + p }, null, 4) );
        }); 

        shell.cd(cwd);

        console.log(`Found ${tests.length} tests: \n `);

        // write debug tests.json
        var testsJson = path.join(jsDir, 'tests.json');
        console.log('Writing to tests json: ', testsJson);
        grunt.file.write( testsJson, JSON.stringify(tests, null, 4) );

        //set the files we just read
        var testScripts = [];
        for (var i=0; i<tests.length; i++) {
            testScripts.push('src/' + tests[i]);
        }

        grunt.config.set('tests', testScripts);
    });    

    //grunt contrib packages
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('help', function() {
        console.log('Please provide the tast to run to the grunt');
        console.log('test - to run jshint');
        console.log('compile - to compile the plugins to a concated file');
        console.log('release - to build the source and create the build output');
    });

    //add the tasks
    grunt.registerTask('test', ['jshint']); //just runs jshint to validate all the javascript
    grunt.registerTask('compile', ['loadTests', 'loadScripts', 'test']);
    grunt.registerTask('release', ['compile', 'clean', 'copy', 'concat', 'uglify']); //generates the build

    grunt.registerTask('default', ['compile']);
};
