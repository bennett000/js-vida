/*global THREE, Physi*/
var mock3d = {
    animationFrame: function mockAnimationFrame() {
        'use strict';

        return arguments;
    },
    scene: {
        simulate: function () {}
    },
    cameras: {
        perspective: new THREE.PerspectiveCamera()
    }
};