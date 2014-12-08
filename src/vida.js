/**
 * file: vida.js
 * Created by michael on 07/12/14.
 */

/*global angular*/
angular.module('JSVida', [
    'JSVida-Menus'
]).factory('three', ['$window', function ($window) {
    'use strict';

    /** @todo graceful error here */
    if (!$window.THREE) {
        throw new ReferenceError('Fatal Error: three.js library not found');
    }

    return $window.THREE;
}]).factory('_renderer', ['three', function (three) {
    'use strict';

    return new three.WebGLRenderer();
}]).service('renderer', ['_renderer', function (_renderer) {
    'use strict';

    var renderer = _renderer,
        /** @type number */
        x = 0,
        /** @type number */
        y = 0;

    /**
     * @param newX {number=}
     * @param newY {number=}
     * @returns {{ width: number, height: number}}
     */
    function size(newX, newY) {
        if (newX === undefined || newY === undefined) {
            return { width: x, height: y};
        }
        if (+newX < 0 || +newY < 0) {
            return { width: x, height: y};
        }
        x = +newX;
        y = +newY;

        renderer.setSize(x, y);

        return { width: x, height: y};
    }

    /**
     * @param newX {number=}
     * @returns {number}
     */
    function accessX(newX) {
        if (newX === undefined || +newX < 0) {
            return x;
        }
        x = +newX;
        renderer.setSize(x, y);
        return x;
    }

    /**
     * @param newY {number=}
     * @returns {number}
     */
    function accessY(newY) {
        if (newY === undefined || +newY < 0) {
            return y;
        }
        y = +newY;
        renderer.setSize(x, y);
        return y;
    }

    function start(scene, camera, onFrame) {
        requestAnimationFrame(function reStart() { start(scene, camera, onFrame); });
        renderer.render(scene, camera)
        onFrame();
    }

    this.start = start;
    this.size = size;
    this.x = accessX;
    this.y = accessY;
    this.width = accessX;
    this.height = accessY;
    this.renderer = renderer;

}]).directive('vida', [function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="vida-main"><vida-menu></vida-menu><vida-view></vida-view></div>'
    };
}]).directive('vidaView', ['renderer', 'three', function (renderer, three) {
    var lastStyle,
        /** @const */
        shrinkConstant = 25,
        /** @const */
        shrinkFactor = 1;

    function size(el) {
        lastStyle = getComputedStyle(el[0]);

        if (!lastStyle) {
            /** @todo clean up*/
            console.error('Fatal Error: could not compute viewport size');
            return;
        }

        var x = lastStyle.width.substring(0, lastStyle.width.length - 2),
        y = lastStyle.height.substring(0, lastStyle.height.length - 2);

        x -= shrinkConstant;
        y -= shrinkConstant;

        x = x/shrinkFactor;
        y = y/shrinkFactor;

        renderer.size(x, y);
    }

    function linkVidaView(scope, elem) {
        size(elem);

        var camera = new three.PerspectiveCamera( 75, renderer.x() / renderer.y(), 0.1, 1000),
        scene = new three.Scene(),
        geometry = new three.BoxGeometry(1, 1, 1),
        material = new three.MeshBasicMaterial({ color: 0x00ff00}),
        cube = new three.Mesh(geometry, material);

        scene.add(cube);
        camera.position.z = 5;

        renderer.start(scene, camera, function () {
            cube.rotation.x += 0.1;
            cube.rotation.y += 0.01;
            cube.rotation.z += 0.001;
        });


        angular.element(elem).append(renderer.renderer.domElement);
    }

    return {
        restrict: 'E',
        replace: true,
        link: linkVidaView,
        template: '<div class="vida-view"></div>'
    }
}]);
