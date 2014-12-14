/**
 * file: 3d-render
 * Created by michael on 14/12/14.
 *
 @license
 Vida - Conway inspired life game
 Copyright © 2014 Michael Bennett

 This file is part of Vida.

 Vida is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Vida is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Vida.  If not, see <http://www.gnu.org/licenses/>.
 */

/*global angular */
angular.module('JSVida-3d-Render', [
    'JSVida'
]).factory('_renderer', ['three', function (three) {
    'use strict';

    return new three.WebGLRenderer();
}]).service('renderer', ['_renderer', function (_renderer) {
    'use strict';

    var renderer = _renderer,
        /** @type {boolean} */
        doStop = false,
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
            return {width: x, height: y};
        }
        if (+newX < 0 || +newY < 0) {
            return {width: x, height: y};
        }
        x = +newX;
        y = +newY;

        renderer.setSize(x, y);

        return {width: x, height: y};
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

    /**
     *  stops the rendering
     */
    function stop() {
        doStop = true;
    }

    /**
     * render loop
     * @param scene {THREE.Scene}
     * @param camera {THREE.Camera}
     * @param onFrame {function(...)=}
     */
    function start(scene, camera, onFrame) {
        if (doStop) {
            doStop = false;
            return;
        }
        requestAnimationFrame(function reStart() { start(scene, camera, onFrame); });
        scene.simulate();
        renderer.render(scene, camera);

        if (angular.isFunction(onFrame)) {
            onFrame();
        }
    }

    this.start = start;
    this.stop = stop;
    this.size = size;
    this.x = accessX;
    this.y = accessY;
    this.width = accessX;
    this.height = accessY;
    this.renderer = renderer;

}]).service('scene', ['physi', 'three', 'renderer', function (physi, three, renderer) {
    'use strict';

    var that = this;

    function size() {
        that.cameras.perspective = new three.PerspectiveCamera(75, renderer.x() / renderer.y(), 0.1, 1000);
    }

    function onUpdate() {
        // not sure what this is for?
        that.scene.simulate(undefined, 1);
    }


    this.scene = new physi.Scene();

    // not essential yet
    //this.scene.addEventListener('update', onUpdate);

    this.cameras = {
        perspective: null
    };
    this.size = size;

    size();

}]).directive('vidaView', ['renderer', 'scene', 'three', '$log', '$window', '_', 'movement', function (renderer, scene, three, $log, $window, _, movement) {
    'use strict';

    var lastStyle,
        /** @const */
        shrinkConstant = 25,
        /** @const */
        shrinkFactor = 1;

    function size(el) {
        lastStyle = getComputedStyle(el[0]);

        if (!lastStyle) {
            /** @todo clean up*/
            $log.error('Fatal Error: could not compute viewport size');
            return;
        }

        var x = lastStyle.width.substring(0, lastStyle.width.length - 2),
            y = lastStyle.height.substring(0, lastStyle.height.length - 2);

        x -= shrinkConstant;
        y -= shrinkConstant;

        x = x / shrinkFactor;
        y = y / shrinkFactor;

        renderer.size(+x, +y);
        scene.size();
    }

    function linkVidaView(scope, elem) {
        var debounceResize = _.debounce(onWindowResize, 150);

        size(elem);

        renderer.start(scene.scene, scene.cameras.perspective);
        scene.cameras.perspective.position.y = 10;
        scene.cameras.perspective.position.z = 20;

        angular.element(elem).append(renderer.renderer.domElement);

        elem.on('$destroy', destroy);
        $window.addEventListener('resize', debounceResize);
        $window.addEventListener('keydown', onKey);

        function onWindowResize() {
            size(elem);
        }

        function onKey(val) {
            switch (val.keyCode) {
                case 65:
                    // neg x
                    movement.negativeX();
                    break;
                case 68:
                    // pos x
                    movement.positiveX();
                    break;
                case 87:
                    // pos z
                    movement.positiveZ();
                    break;
                case 83 :
                    // neg z
                    movement.negativeZ();
                    break;
                case 82:
                    // pos y
                    movement.positiveY();
                    break;
                case 70 :
                    // neg u
                    movement.negativeY();
                    break;
                case 84:
                    // pos y
                    movement.positiveXRotate();
                    break;
                case 71 :
                    // neg u
                    movement.negativeXRotate();
                    break;
                default:
                    break;
            }
        }

        function destroy() {
            scene.stop();
            $window.removeEventListener('resize', debounceResize);
            $window.removeEventListener('keydown', onKey);
        }
    }

    return {
        restrict: 'E',
        replace: true,
        link: linkVidaView,
        template: '<div class="vida-view"></div>'
    };
}]);
