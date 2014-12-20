var mock3d = {
    animationFrame: function mockAnimationFrame() {
        'use strict';

        return arguments;
    },
    scene: {
        simulate: function () {}
    },
    camera: {

    },
    cameras: {
        perspective: {
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            up: {
                clone: function () {}
            }
        }
    }
};