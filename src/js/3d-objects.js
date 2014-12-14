/**
 * file: 3d-objects
 * Created by michael on 14/12/14.
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
