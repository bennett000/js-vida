# Vida Gruntfile
#
# Vida - Conway inspired life game
# Copyright © 2014 Michael Bennett
#
# This file is part of Vida.
#
# Vida is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
#    Vida is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Vida.  If not, see <http://www.gnu.org/licenses/>.


# Make sure your system has Google's closure compiler
pathCC = '/usr/local/lib/closure-compiler'

# @todo move all configurable strings up here
pathRoot = __dirname + '/src'
prefixPath = (file) -> pathRoot + file
manifest = require(pathRoot + '/manifest.js')
vidaCSS = {}
vidaCSS['tmp/vida.css'] = 'src/css/vida.css'
vidaJS = {}
vidaJS.from = '<!--###BUILDSCRIPT-->'
vidaJS.to = '<script src="/vida.js"></script>'
vidaHTML = {}
vidaHTML.src = 'tmp/index.html'
vidaHTML.dest = 'build/index.html'
vidaSrc = []
vidaSrc = vidaSrc.concat manifest.lib.map prefixPath
vidaSrc = vidaSrc.concat manifest.src.map prefixPath

# actually configure the grunt tasks
module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    'closure-compiler':
      frontend:
        closurePath: pathCC
        js: vidaSrc
        jsOutputFile: 'build/vida.js'
        maxBuffer: 500,
        noreport: true
        options:
          compilation_level: 'SIMPLE_OPTIMIZATIONS'
          language_in: 'ECMASCRIPT5_STRICT'
          # https://www.npmjs.com/package/grunt-append-sourcemapping
          #create_source_map: 'build/vida.js.map'
          #source_map_format: 'V3'

    strip_code:
      options:
        start_comment: 'start-debug-block'
        end_comment: 'end-debug-block'
      files: vidaHTML

    replace:
      vidaJS:
        src: ['src/vida.html']
        dest: 'tmp/index.html'
        replacements: [ vidaJS ]

    insert:
      options: {}
      vidaCSS:
        src: 'tmp/vida.css'
        dest: 'tmp/index.html'
        match: '/**###CSSBUILDLOCATION */'

    jshint:
      vida:
        options:
          smarttabs: true
          sub: true
          browser:true
        src: (manifest.src.map prefixPath)

    cssmin:
      vida:
        files: vidaCSS

    concat:
      vidaPhysiWorker:
        src: ['src/lib/physijs/physijs_worker.js']
        dest: 'build/lib/physijs/physijs_worker.js'
      vidaAmmo:
        src: ['src/lib/ammo.js/builds/ammo.js']
        dest: 'build/lib/ammo.js/builds/ammo.js'

    karma:
      unit:
        configFile: 'etc/karma.conf.js'
        singleRun: true,
        browsers: ['Firefox']


  # 'Natural' tasks
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-insert'
  grunt.loadNpmTasks 'grunt-text-replace'
  grunt.loadNpmTasks 'grunt-strip-code'
  grunt.loadNpmTasks 'grunt-closure-compiler'

  # Alias tasks
  grunt.registerTask 'test', 'Unit, and end to end tests', ['jshint', 'test-unit', 'test-e2e']
  grunt.registerTask 'test-e2e', 'End to end tests', []
  grunt.registerTask 'test-unit', 'Unit tests', ['karma']
  grunt.registerTask 'build-no-test', 'Build but skip tests', ['concat', 'closure-compiler', 'cssmin', 'replace', 'insert', 'strip_code']
  grunt.registerTask 'build', 'Build for production', ['test', 'build-no-test']

  grunt.registerTask 'default', ['build']
