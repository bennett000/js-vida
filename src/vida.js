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
    'JSVida-Organism-Procomyte'
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

}]).factory('Conway', ['$timeout', 'makeListener', function ($timeout, makeListener) {
    'use strict';

    var popMin = 2,
        popMax = 3,
        tickInterval = 150;

    /**
     * @param seed {Array.<Number>}
     * @param x [number}
     * @param y {number}
     * @returns {Array}
     */
    function validateSeed(seed, x, y) {
        if (!Array.isArray(seed)) {
            seed = [];
        }
        x = +x || 0;
        y = +y || 0;

        if ((x * y) > seed.length) {
            seed = [];
        }
        return seed;
    }

    /**
     * @param seed {Array.<Number>}
     * @param x {number}
     * @param y {number}
     * @returns {Array}
     */
    function completeSeed(seed, x, y) {
        x = +x || 0;
        y = +y || 0;
        seed = validateSeed(seed, x, y);
        var i;

        for (i = 0; i < (x * y); i += 1) {
            if (seed[i]) {
                seed[i] = 1;
            } else {
                seed[i] = 0;
            }
        }

        return seed;
    }

    ///**
    // * @param x {number}
    // * @param y {number}
    // * @param limitX {number}
    // * @param limitY {number}
    // * @returns {number}
    // */
    //function getNeighbour(x, y, limitX, limitY) {
    //    // way too big
    //    if (x >= limitX) {
    //        x = 0;
    //    }
    //    if (y >= limitY) {
    //        y = 0;
    //    }
    //    if (x < 0) {
    //        x = limitX - 1;
    //    }
    //    if (y < 0) {
    //        y = limitY - 1;
    //    }
    //
    //    return x + (y * limitX);
    //}

    /**
     * @param offset {number}
     * @param relX {number}
     * @param relY {number}
     * @param limitX {number}
     * @param limitY {number}
     * @returns {number}
     */
    function getNeighbour(offset, relX, relY, limitX, limitY) {
        /** @type {number} */
        var neighbour, limit = limitX * limitY;

        // perform x operation
        neighbour = offset + relX;
        if (neighbour < 0) {
            neighbour = limit;
        }
        // perform y operation
        neighbour += relY * limitX;
        if (neighbour > limit) {
            neighbour = neighbour - limit;
        }
        return neighbour;
    }


    /**
     * @param seed {Array.<Number>}
     * @param offset {number}
     * @param limitX {number}
     * @param limitY {number}
     * @returns {number}
     */
    function liveNeighbours(seed, offset, limitX, limitY) {
        /** @type {number} */
        var count = 0;

        // top left
        if (seed[getNeighbour(offset, -1, 1, limitX, limitY)]) {
            count += 1;
        }

        // top
        if (seed[getNeighbour(offset, 0, 1, limitX, limitY)]) {
            count += 1;
        }

        // top right
        if (seed[getNeighbour(offset, 1, 1, limitX, limitY)]) {
            count += 1;
        }

        // mid left
        if (seed[getNeighbour(offset, -1, 0, limitX, limitY)]) {
            count += 1;
        }

        // mid right
        if (seed[getNeighbour(offset, 1, 0, limitX, limitY)]) {
            count += 1;
        }

        // bottom left
        if (seed[getNeighbour(offset, -1, -1, limitX, limitY)]) {
            count += 1;
        }

        // bottom
        if (seed[getNeighbour(offset, 0, -1, limitX, limitY)]) {
            count += 1;
        }

        // bottom right
        if (seed[getNeighbour(offset, 1, -1, limitX, limitY)]) {
            count += 1;
        }

        return count;
    }

    /**
     * @param seed {Array.<number>}
     * @param x {number}
     * @param y {number}
     */
    function tick(seed, x, y) {
        /** @type {number} */
        var neighbours;

        return seed.map(function (cell, offset) {
            neighbours = liveNeighbours(seed, offset, x, y);
            // alive cases
            if (cell === 1) {
                // under pop case
                if (neighbours < popMin) {
                    return 0;
                }
                // even pop case
                if (neighbours <= popMax) {
                    return 1;
                }
                // over pop case
                return 0;
            }
            // dead cases

            // birth case
            if (neighbours === 3) {
                return 1;
            }
            // dead is dead case
            return 0;
        });
    }

    function Conway(x, y, seed) {
        if (!(this instanceof Conway)) {
            return new Conway(x, y, seed);
        }
        var that = makeListener(this),
            doStop = false,
            isRunning = false;

        seed = completeSeed(seed, x, y);

        function onTick() {
            if (doStop) {
                doStop = false;
                isRunning = false;
                return;
            }
            seed = tick(seed, x, y);
            that.triggerSync('tick', seed);
            $timeout(onTick, tickInterval);
        }

        function start() {
            if (doStop) {
                return;
            }
            isRunning = true;
            onTick();
        }

        function stop() {
            doStop = true;
        }

        this.start = start;
        this.stop = stop;
    }

    return Conway;
}]).factory('planetConway', ['textureSphere', 'three', 'between', 'Conway', function (textureSphere, three, between, Conway) {
    'use strict';

    var res = 256,
        map = new Uint8Array(3 * res * res),
        c = new Conway(res, res, getRandomArray(res * res)),
        material = {
            map: map
        },
        planet = textureSphere(material);

    planet.position.x = 0;
    planet.position.y = 3;
    planet.position.z = 5;

    function getRandomArray(len) {
        var roll,
            i,
            result = [];

        for (i = 0; i < len; i += 1) {
            roll = between(0, 100);
            if (roll > 75) {
                result.push(1);
            } else {
                result.push(0);
            }
        }

        return result;
    }

    function onLifeUpdate(lifeMap) {
        lifeMap.forEach(function (cell, i) {
            if (cell === 1) {
                map[i * 3] = 0;
                map[i * 3 + 1] = 200;
                map[i * 3 + 2] = 0;
            } else {
                map[i * 3] = 0;
                map[i * 3 + 1] = 0;
                map[i * 3 + 2] = 200;
            }
        });
        material.material.map = new three.DataTexture(map, res, res, three.RGBFormat);
        material.material.map.needsUpdate = true;
        material.material.needsUpdate = true;
    }

    c.on('tick', onLifeUpdate);
    c.start();

    //function getMap() {
    //    var len = 1024,
    //        x = len, y = len,
    //        size = x * y,
    //        data = new Uint8Array(3 * size),
    //        map,
    //        i;
    //
    //    for (i = 0; i < size; i += 1) {
    //        data[i * 3] = Math.floor(between(0, 255));
    //        data[i * 3 + 1] = Math.floor(between(0, 255));
    //        data[i * 3 + 2] = Math.floor(between(0, 255));
    //    }
    //
    //    map = new three.DataTexture(data, x, y, three.RGBFormat);
    //    map.needsUpdate = true;
    //
    //    return map;
    //}

    //function tick() {
    //    material.material.map = getMap();
    //    material.material.needsUpdate = true;
    //    $timeout(tick, 150);
    //}
    //
    //tick();

    function getPlanet() {
        return planet;
    }


    return getPlanet;
}])
.run(['scene', 'planetConway', function (scene, planetConway) {
         'use strict';

         scene.scene.add(planetConway());
     }])
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
