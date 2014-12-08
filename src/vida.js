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
}]).service('renderer', ['three', function (three) {
    'use strict';

    var renderer = new three.WebGLRenderer(),
        /** @type number */
        x,
        /** @type number */
        y;

    /**
     * @param newX {number}
     * @param newY {number}
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

        return { width: x, height: y};
    }

    /**
     * @param newX {number}
     * @returns {number}
     */
    function accessX(newX) {
        if (newX === undefined || +newX < 0) {
            return x;
        }
        x = +newX;
        return x;
    }

    /**
     * @param newY {number}
     * @returns {number}
     */
    function accessY(newY) {
        if (newY === undefined || +newY < 0) {
            return y;
        }
        y = +newY;
        return y;
    }

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
}]).directive('vidaView', ['renderer', function (renderer) {
    var lastStyle

    function size(el) {
        lastStyle = getComputedStyle(el[0]);

        renderer.width = lastStyle.width;
        renderer.height = lastStyle.height;
    }

    function linkVidaView(scope, elem) {
        size(elem);

    }

    return {
        restrict: 'E',
        replace: true,
        link: linkVidaView(),
        template: '<div class="vida-view"></div>'
    }
}]);
