/**
 * file: 3d-objects
 * Created by michael on 14/12/14.
 *
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
angular.module('JSVida-3d-Objects', [
    'JSVida',
    'JSVida-3d-Render'
]).factory('simpleCube', ['three', function (three) {
    'use strict';

    function getCube() {
        var geometry = new three.BoxGeometry(1, 1, 1),
            material = new three.MeshBasicMaterial({color: 0x00ff00});

        return new three.Mesh(geometry, material);
    }

    return getCube;

}]).factory('physicsCube', ['three', 'physi', function (three, physi) {
    'use strict';

    function getCube(callbacks) {
        callbacks = callbacks || {};

        var geometry = new three.BoxGeometry(1.5, 0.5, 1.5),
            material = physi.createMaterial(new three.MeshBasicMaterial({color: 0x00ff00}), 0.5),
            box = new physi.BoxMesh(geometry, material, 1);

        if (angular.isFunction(callbacks.collision)) {
            box.addEventListener('collision', callbacks.collision);
        }

        return box;
    }

    return getCube;

}]);
