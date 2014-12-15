# Vida Gruntfile
#
#

pathRoot = __dirname + '/src'
prefixPath = (file) -> pathRoot + file
manifest = require(pathRoot + '/manifest.js')
vidaCSS = {}
vidaCSS['build/css/vida.css'] = 'src/css/vida.css'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

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

  # Alias tasks
  grunt.registerTask 'test', '', ['karma']
  grunt.registerTask 'test-unit', '', ['karma']
  grunt.registerTask 'build-no-test', 'Build but skip tests', ['test']
  grunt.registerTask 'build', 'Build for production', ['test', 'jshint', 'build-no-test']

  grunt.registerTask 'default', ['build']
