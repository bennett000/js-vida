/**
 * file: vida.js
 * Created by michael on 07/12/14.
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

}]).service('universe', ['scene', 'between', 'physi', 'three', function (scene, between, physi, three) {
    'use strict';

    var ground = new physi.BoxMesh(
    new three.BoxGeometry(500, 1, 500),
    physi.createMaterial( new three.MeshBasicMaterial({color: 0x333333}), 0.5, 0.6),
    0
    );

    ground.position.y = -1;

    scene.scene.add(ground);


}]).run(['universe', 'procomyte', function (universe, procomyte) {
    'use strict';

    // go

}]).directive('vida', [function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="vida-main"><vida-menu></vida-menu><vida-view></vida-view></div>'
    };
}]);
