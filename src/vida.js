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
}]);
