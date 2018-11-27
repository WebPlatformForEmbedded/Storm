/*
 *  WPE Test Framework task runner
 *  Creates the build (cleans the directory, copy's static files, concats the js and runs an uglification)
 */

var scripts = [],
    tests = {},
    testScripts = [],
    readline = require('readline'),
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
        },
        jsdoc2md: {
            doc: {
                files : [
                    { src: 'src/js/plugins/*.js', dest: 'doc/documentation.md' },
                ]
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
        let cwd = process.cwd();
        let jsDir = path.join( cwd, 'src', 'js');
        let testsDir = path.join(jsDir, 'tests');

        shell.cd(testsDir);
        shell.ls('*.js').forEach( function(p) {
            let name = p.split('.')[0];
            tests[ name ] = { 'name' : name, 'file' : 'js/tests/' + p };
        });

        shell.cd(cwd);

        console.log(`Found ${Object.keys(tests).length} tests \n `);

        grunt.config.set('tests', tests);
    });

    grunt.task.registerTask('parseTests', 'Parse the contents of the tests that can be run', function() {
        let cwd = process.cwd();
        let srcDir = path.join( cwd, 'src');
        let testList = Object.keys(tests);
        let done = this.async();
        let testIdx = 0;

        // this is a line by line text parsing function
        // since we cannot import the test natively, that would trip unresolved function errors and
        // force us to load the entire framework just for creating a manifest
        // so its rudimentary, but hopefully effective.
        function readTest(pathToTest, cb) {
            let _t = tests[ testList[ testIdx ] ];
            let filePath = path.join(srcDir, _t.file);

            const rl = readline.createInterface({
                input: fs.createReadStream( filePath ),
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                //console.log('reading :: ' + line);

                // title and description is already filled in, ignore
                // added this because the description is used in the individual steps as well
                if (_t.title !== undefined && _t.description !== undefined)
                    return;

                // see if it has a seperator
                let splittedLine = line.split(':');

                // it has a key / value
                if (splittedLine.length > 0) {
                    // search for our words test or description
                    let key = splittedLine[0];
                    let value = splittedLine[1];

                    if ( key.search(/"title"/i) !== -1 || key.search(/'title'/i) !== -1)  {
                        _t.title = findTextString(value);
                    }

                    if ( key.search(/"description"/i) !== -1 || key.search(/'description'/i) !== -1)  {
                        _t.description = findTextString(value);
                    }
                }
            });

            rl.on('close', () => {
                console.log('Succesfully parsed: ' + _t.name);

                testIdx++;

                if (testIdx >= testList.length-1)
                    done();
                else
                    readTest();
            });

        }

        // small test parser, finds the starting " or ' and returns the text inbetween the ending " or '
        function findTextString(text) {
            let startIdx = text.search("'") || text.search('"');
            let curStr = text.substr(startIdx +1, text.length);
            let endIdx = curStr.search("'") || curStr.search('"');
            return curStr.substr(0, endIdx);
        }

        readTest();
    });

    grunt.task.registerTask('writeTestManifest', 'Write the tests.json manifest file', function() {
        var cwd = process.cwd();
        var jsDir = path.join( cwd, 'src', 'js');
        var testsDir = path.join(jsDir, 'tests');

        // write debug tests.json
        let testsJson = path.join(jsDir, 'tests.json');
        console.log('Writing to tests json: ', testsJson);
        grunt.file.write( testsJson, JSON.stringify(tests, null, 4) );
    });

    //grunt contrib packages
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

    grunt.registerTask('help', function() {
        console.log('Please provide the tast to run to the grunt');
        console.log('test - to run jshint');
        console.log('compile - to compile the plugins to a concated file');
        console.log('release - to build the source and create the build output');
    });

    //add the tasks
    grunt.registerTask('test', ['jshint']); //just runs jshint to validate all the javascript
    grunt.registerTask('doc', ['jsdoc2md']);
    grunt.registerTask('compile', ['loadScripts', 'loadTests', 'parseTests', 'writeTestManifest', 'test']);
    grunt.registerTask('release', ['compile', 'clean', 'copy', 'concat', 'uglify', 'doc']); //generates the build

    grunt.registerTask('default', ['compile']);
};
