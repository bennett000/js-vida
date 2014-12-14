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
        template: '<div class="vida-main"><vida-menu></vida-menu><vida-camera-0></vida-camera-0></div>'
    };
}])
