/**
 * file: vida.js
 * Created by michael on 07/12/14.
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

/*global angular*/
angular.module('JSVida', [
    'JSVida-Menus',
    'JSVida-3d-Render',
    'JSVida-Organism-Procomyte',
    'JSVida-Bitmap',
    'JSVida-Conway'
]).factory('three', ['$window', function ($window) {
    'use strict';

    /** @todo graceful error here */
    if (!$window.THREE) {
        throw new ReferenceError('Fatal Error: three.js library not found');
    }

    return $window.THREE;
}]).factory('physi', ['$window', function ($window) {
    'use strict';

    /** @todo graceful error here */
    if (!$window.Physijs) {
        throw new ReferenceError('Fatal Error: physi.js library not found');
    }

    return $window.Physijs;

}]).factory('_', ['$window', function ($window) {
    'use strict';

    /** @todo graceful error here */
    if (!$window._) {
        throw new ReferenceError('Fatal Error: underscore.js library not found');
    }

    return $window._;
}]).factory('between', [function () {
    'use strict';

    function between(min, max) {
        return Math.random() * (max - min) + min;
    }

    return between;

}]).service('universe', ['scene', 'between', 'physi', 'three', function (scene, between, physi, three) {
    'use strict';

    var ground = new physi.BoxMesh(
    new three.BoxGeometry(500, 1, 500),
    physi.createMaterial(new three.MeshBasicMaterial({color: 0x333333}), 0.5, 0.6),
    0
    );

    ground.position.y = -1;

    scene.scene.add(ground);


}]).factory('makeListener', ['$timeout', '$log', function ($timeout, $log) {
    'use strict';

    function makeListener(obj) {
        obj = obj || {};
        var listeners = Object.create(null);

        function uid() {
            return Date.now().toString(16) + Math.random();
        }

        function on(msg, fn) {
            if (!angular.isFunction(fn)) {
                return angular.noop;
            }
            if (!listeners[msg]) {
                listeners[msg] = Object.create(null);
            }
            var id = uid();
            listeners[msg][id] = fn;

            function cleanUpMakeListener() {
                delete listeners[msg][id];
            }
        }

        /**
         * @param msg {string}
         */
        function trigger(msg) {
            var args = Array.prototype.slice.call(arguments, 0);
            $timeout(function callTrigger() {
                triggerSync.apply(null, args);
            }, 0);
        }

        /**
         * @param fn {function (...)}
         * @param args {Array}
         */
        function safeCall(fn, args) {
            if (!angular.isFunction(fn)) {
                return;
            }
            try {
                fn.apply(null, args);
            } catch (err) {
                $log.error('makeListener callback failure: ', err.message);
            }
        }

        /**
         * @param msg {string}
         */
        function triggerSync(msg) {
            if (!listeners[msg]) {
                return;
            }
            var args = Array.prototype.slice.call(arguments, 1);
            Object.keys(listeners[msg]).forEach(function (uid) {
                safeCall(listeners[msg][uid], args);
            });
        }


        obj.on = on;
        obj.trigger = trigger;
        obj.triggerSync = triggerSync;

        return obj;
    }

    return makeListener;

}]).factory('planetConway', ['textureSphere', 'three', 'between', 'Conway', 'Bitmap', function (textureSphere, three, between, Conway, Bitmap) {
    'use strict';

    var res = 128,
        map = new Bitmap({
                             x: res,
                             y: res,
                             format: 'RGB',
                             fill: {r: 255, g: 0, b: 0}
                         }),
        c = new Conway({x: res, y: res, seed: getRandomMap(res, res)}),
        material = {
            map: new three.DataTexture(map.map, res, res, three.RGBFormat)
        },
        planet = textureSphere(material),
        /** @type {{ label: { r: {number}, g: {number}, b: {number}, a: {number}= }}} */
        colours = {
            life: {r: 0, g: 200, b: 0},
            death: {r: 0, g: 0, b: 200}
        };

    function getRandomMap(x, y) {
        var roll,
            i, j,
            result = [];

        for (i = 0; i < x; i += 1) {
            result.push([]);
            for (j = 0; j < y; j += 1) {
                roll = between(0, 100);
                if (roll > 75) {
                    result[i].push(1);
                } else {
                    result[i].push(0);
                }
            }
        }

        return result;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param isAlive {boolean}
     */
    function onUpdate(x, y, isAlive) {
        if (isAlive) {
            map.setPixel(x, y,
                         colours.life.r, colours.life.g, colours.life.b);
        } else {
            map.setPixel(x, y,
                         colours.death.r, colours.death.g, colours.death.b);
        }
    }

    function updateMaterial() {
        material.material.map = new three.DataTexture(map.map, res, res,
                                                      three.RGBFormat);
        material.material.map.needsUpdate = true;
        material.material.needsUpdate = true;
    }

    function onTick() {
        updateMaterial();
    }

    function init() {
        planet.position.x = 0;
        planet.position.y = 3;
        planet.position.z = 5;

        c.on('update', onUpdate);
        c.on('tick', onTick);
        c.start().walk(function (el, x, y) {
            if (el === 1) {
                map.setPixel(x, y, colours.life.r, colours.life.g,
                             colours.life.b);
            } else {
                map.setPixel(x, y, colours.death.r, colours.death.g,
                             colours.death.b);
            }
        });
        updateMaterial();
    }

    init();

    function getPlanet() {
        return planet;
    }


    return getPlanet;
}])
//.run(['scene', 'planetConway', 'universe', function (scene, planetConway, universe) {
//    'use strict';
//
//    scene.scene.add(planetConway());
//}])
//.run(['universe', 'procomyte', function (universe, procomyte) {
//    'use strict';
//
//    // go
//
//}])
.directive('vida', [function () {
               'use strict';

               return {
                   restrict: 'E',
                   replace: true,
                   template: '<div class="vida-main"><vida-menu></vida-menu><vida-camera-0></vida-camera-0></div>'
               };
           }]);
