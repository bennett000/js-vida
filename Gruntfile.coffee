# Vida Gruntfile
#
#

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

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

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

    karma:
      unit:
        configFile: 'etc/karma.conf.js'
        singleRun: true,
        browsers: ['Firefox']


  # 'Natural' tasks
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-insert'
  grunt.loadNpmTasks 'grunt-text-replace'
  grunt.loadNpmTasks 'grunt-strip-code'

  # Alias tasks
  grunt.registerTask 'test', '', ['karma']
  grunt.registerTask 'test-unit', '', ['karma']
  grunt.registerTask 'build-no-test', 'Build but skip tests', ['cssmin', 'replace', 'insert', 'strip_code']
  grunt.registerTask 'build', 'Build for production', ['test', 'jshint', 'build-no-test']

  grunt.registerTask 'default', ['build']
