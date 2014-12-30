var BOOTSTRAP = Object.freeze({
  lib: [
    '/lib/three.js/three.js',
    '/js/lib-track-control.js',
    '/lib/physijs/physi.js',
    '/js/config-physi.js',
    '/lib/underscore/underscore.js',
    '/lib/angular/angular.js'
  ],
  src: [
    '/vida.js',
    '/js/menu.js',
    '/js/3d-objects.js',
    '/js/3d-render.js',
    '/js/bitmap.js',
    '/js/org-procomyte.js',
    '/js/conway.js',
    '/js/2d-map.js'
  ]
});

if (typeof module !== 'undefined') {
  /*global module*/
  module.exports = BOOTSTRAP;
}
