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
}]).factory('physi', ['$window', function ($window) {
    'use strict';


}]).factory('_', ['$window', function ($window) {
    'use strict';

    /** @todo graceful error here */
    if (!$window._) {
        throw new ReferenceError('Fatal Error: underscore.js library not found');
    }

    return $window._;
}]).factory('_renderer', ['three', function (three) {
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

}]).service('scene', ['three', 'renderer', function (three, renderer) {
    'use strict';

    var that = this;

    function size() {
        that.cameras.perspective = new three.PerspectiveCamera(75, renderer.x() / renderer.y(), 0.1, 1000);
    }

    this.scene = new three.Scene();
    this.cameras = {
        perspective: null
    };
    this.size = size;

    size();

}]).service('movement', ['scene', function (scene) {
    'use strict';

    var speed = 0.1;

    function translate(axis, value) {
        scene.cameras.perspective.position[axis] += value;
    }

    function rotate(axis, value) {
        scene.cameras.perspective.rotation[axis] += value;
    }

    function positiveX() {
        translate('x', speed);
    }

    function positiveY() {
        translate('y', speed);
    }

    function positiveZ() {
        translate('z', speed);
    }

    function negativeX() {
        translate('x', speed * -1);
    }

    function negativeY() {
        translate('y', speed * -1);
    }

    function negativeZ() {
        translate('z', speed * -1);
    }

    function positiveYRotate() {
        rotate('y', speed);
    }

    function negativeYRotate() {
        rotate('y', speed * -1);
    }

    function positiveZRotate() {
        rotate('z', speed);
    }

    function negativeZRotate() {
        rotate('z', speed * -1);
    }

    function positiveXRotate() {
        rotate('x', speed);
    }

    function negativeXRotate() {
        rotate('x', speed * -1);
    }

    this.positiveX = positiveX;
    this.positiveY = positiveY;
    this.positiveZ = positiveZ;
    this.negativeX = negativeX;
    this.negativeY = negativeY;
    this.negativeZ = negativeZ;
    this.positiveYRotate = positiveYRotate;
    this.negativeYRotate = negativeYRotate;
    this.positiveZRotate = positiveZRotate;
    this.negativeZRotate = negativeZRotate;
    this.positiveXRotate = positiveXRotate;
    this.negativeXRotate = negativeXRotate;

}]).factory('between', [function () {
    'use strict';

    function between(min, max) {
        return Math.random() * (max - min) + min;
    }

    return between;

}]).factory('simpleCube', ['three', function (three) {
    'use strict';

    function getCube() {
        var geometry = new three.CubeGeometry(1, 1, 1),
            material = new three.MeshBasicMaterial({color: 0x00ff00});

        return new three.Mesh(geometry, material);
    }

    return getCube;

}]).factory('procomyte', ['simpleCube', 'between', 'scene', function (simpleCube, between, scene) {
    'use strict';

    var lifespan = 10,
        /** @const */
        gcThreshold = 200,
        speed = 1,
        /** @const */
        breedingFactor = 4,
        /** @const */
        senseRange = 2,
        /** @const */
        crowdThreshold = 3,
        /** @const */
        limit = 50000,
        /** @type {number} */
        population = 0,
        /** @type Array */
        species = [];

    /**
     * Kills an organism from old age
     * @param org {Object}
     * @returns {boolean}
     */
    function expire(org) {
        org.age += 1;
        if (+org.age > (lifespan * 0.75)) {
            if (between(0, 50) > 25) {
                org.isAlive = false;
                scene.scene.remove(org.avatar);
                population -= 1;
                return true;
            }
        }
        return false;
    }

    function proximity(org) {
        var neighbours = [];

        species.forEach(function (neighbour) {
            var xdiff = Math.abs(org.avatar.position.x - neighbour.avatar.position.x),
                zdiff = Math.abs(org.avatar.position.z - neighbour.avatar.position.z);

            if ((xdiff <= senseRange) && (zdiff <= senseRange)) {
                neighbours.push(neighbour);
            }
        });

        if (neighbours.length === 0) {
            return false;
        }
        if (neighbours.length >= crowdThreshold) {
            return false;
        }

        if (org.age < (lifespan / breedingFactor)) {
            return false;
        }

        makeProcomyte(org.avatar.position.x,
                      org.avatar.position.y,
                      org.avatar.position.z);

        return true;
    }

    function roam(org) {
        var direction = between(0, 100);

        if (direction < 25) {
            org.avatar.position.x += speed;
            return;
        }
        if (direction < 50) {
            org.avatar.position.x -= speed;
            return;
        }
        if (direction < 75) {
            org.avatar.position.z += speed;
            return;
        }
        org.avatar.position.z -= speed;
    }

    /**
     * Executes each turn
     */
    function turn() {
        console.log('TURN', 'population', population, 'species', species.length);
        species.forEach(function (org) {
            if (org.isAlive === false) {
                return;
            }
            if (expire(org)) { return; }
            if (proximity(org)) { return; }
            roam(org);
        });
    }


    /**
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    function reuseProcomyte(x, y, z) {
        var isDone = false;
        species.forEach(function (org) {
            if (isDone) {
                return;
            }
            if (org.isAlive) {
                return;
            }
            isDone = true;
            org.avatar.position.x = x;
            org.avatar.position.y = y;
            org.avatar.position.z = z;
            org.isAlive = true;
            org.age = 0;
            scene.scene.add(org.avatar);
        });
        return isDone;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    function newProcomyte(x, y, z) {
        var avatar = simpleCube();
        avatar.position.x = x;
        avatar.position.y = y;
        avatar.position.z = z;

        species.push({
                         isAlive: true,
                         avatar: avatar,
                         age: 0
                     });
        scene.scene.add(avatar);
    }

    function gc() {
        species = species.filter(function (el) { return el.isAlive; });
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param z {number}
     */
    function makeProcomyte(x, y, z) {
        if (population >= limit) {
            /*global console*/
            console.warn('Limit of ', limit, 'hit');
            return;
        }

        population += 1;

        if (reuseProcomyte(x, y, z)) {
            if (species.length - population > gcThreshold) {
                gc();
            }
            return;
        }
        newProcomyte(x, y, z);

    }

    makeProcomyte.species = species;
    makeProcomyte.turn = turn;
    makeProcomyte.limit = limit;

    return makeProcomyte;
}]).service('universe', ['scene', '$timeout', 'between', 'procomyte', function (scene, $timeout, between, procomyte) {
    'use strict';

    var speed = 250,
        initPop = 15;


    function populate() {
        var i;
        for (i = 0; i < initPop; i += 1) {
            var x = between(initPop * -1, initPop),
                z = between(initPop * -1, initPop);
            procomyte(x, 0, z);
        }

        $timeout(turn, speed);
    }

    function turn() {
        procomyte.turn();
        $timeout(turn, speed);
    }


    this.populate = populate;

}]).directive('vida', [function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="vida-main"><vida-menu></vida-menu><vida-view></vida-view></div>'
    };
}]).directive('vidaView', ['renderer', 'scene', 'three', '$log', '$window', '_', 'movement', 'universe', function (renderer, scene, three, $log, $window, _, movement, universe) {
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
        universe.populate();

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
