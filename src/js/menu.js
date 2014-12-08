/**
 * file: menu.js
 * Created by michael on 07/12/14.
 */

/*global angular */
angular.module('JSVida-Menus', [
]).directive('vidaMenu', [function () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="vida-menu"></div>'
    }
}]);
