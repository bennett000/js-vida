/**
 * file: org-procomyte
 * Created by michael on 14/12/14.
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
angular.module('JSVida-Organism-Procomyte', [
    'JSVida',
    'JSVida-3d-Objects',
    'JSVida-3d-Render'
]).factory('procomyte', ['physicsCube', 'between', 'scene', '$timeout', 'three', function (physicsCube, between, scene, $timeout, three) {
    'use strict';

    var lifespan = 50,
        /** @const */
        gcThreshold = 200,
        speed = 2,
        offset = 1,
        /** @const */
        hitLimit = 3,
        /** @const */
        breedingMin = 1,
        /** @const */
        breedingFactor = 3,
        /** @const */
        limitPop = 1000,
        /** @type {number} */
        population = 0,
        /** @type Array */
        species = [],
        /** @const */
        initPop = 15,
        /** @const */
        terminalDepth = -512,
        /** @const */
        aiTick = 250;

    /**
     * Kills an organism
     * @param org {Object}
     */
    function kill(org) {
        org.isAlive = false;
        scene.scene.remove(org.avatar);
        population -= 1;
    }

    /**
     * Might kill an organism from old age
     * @param org {Object}
     * @returns {boolean}
     */
    function expire(org) {
        org.age += 1;
        if (+org.age > (lifespan * 0.75)) {
            if (between(0, 50) > 25) {
                kill(org);
                return true;
            }
        }
        return false;
    }

    function onCollision(org, other) {
        if (!other) {
            /*global console*/
            console.warn('onCollision expects two params');
            return;
        }
        if (!other.vidaMeta) {
            // not relevant
            return;
        }
        org.hitSpecies = org.hitSpecies || 0;
        org.hitSpecies += 1;
        if ((org.age < (lifespan / breedingFactor)) && (other.vidaMeta.age < (lifespan / breedingFactor))) {
            return false;
        }

        if (other.vidaMeta.wasHit) {
            return;
        }
        org.hitBreeder = org.hitBreeder || 0;
        org.hitBreeder += 1;
        org.wasHit = true;
    }


    function roam(org) {
        var direction = between(0, 100);

        if (direction < 25) {
            org.avatar.applyImpulse(new three.Vector3(speed, 0, 0),
                                  new three.Vector3(org.avatar.x + offset, org.avatar.y, org.avatar.z));
            //org.avatar.position.x += speed;
            //org.avatar.__dirtyPosition = true;
            return;
        }
        if (direction < 50) {
            org.avatar.applyImpulse(new three.Vector3(speed * -1, 0, 0),
                                  new three.Vector3(org.avatar.x - offset, org.avatar.y, org.avatar.z));
            //org.avatar.position.x -= speed;
            //org.avatar.__dirtyPosition = true;
            return;
        }
        if (direction < 75) {
            org.avatar.applyImpulse(new three.Vector3(0, 0, speed),
                                  new three.Vector3(org.avatar.x, org.avatar.y, org.avatar.z + offset));
            //org.avatar.position.z += speed;
            //org.avatar.__dirtyPosition = true;
            return;
        }
        org.avatar.applyImpulse(new three.Vector3(0, 0, speed * -1),
                              new three.Vector3(org.avatar.x, org.avatar.y, org.avatar.z - offset));
        //org.avatar.position.z -= speed;
        //org.avatar.__dirtyPosition = true;
    }

    function breed(org) {
        makeProcomyte(org.avatar.position.x + between(2, 4),
                      org.avatar.position.y,
                      org.avatar.position.z + between(2, 4));
    }

    /**
     * @param org {Object}
     */
    function resetHits(org) {
        // reset hit counts
        org.hitSpecies = 0;
        org.hitBreeder = 0;
        org.wasHit = false;
    }

    function runHits(org) {
        // process hit counts
        if (org.hitSpecies >= hitLimit) {
            kill(org);
            resetHits(org);
            return true;
        }
        if (org.hitBreeder >= breedingMin) {
            if (org.wasHit) {
                breed(org);
            }
        }
        resetHits(org);
        return false;
    }

    /**
     * Executes each turn
     */
    function turn() {
        //scene.scene.simulate();
        console.debug('population', species.length);
        species.forEach(function (org) {
            // skip dead objects
            if (org.isAlive === false) {
                return;
            }
            // kill if fallen of edge of world
            if (org.avatar.position.y <= terminalDepth) {
                kill(org);
                return;
            }
            // check collisions
            if (runHits(org)) { return; }
            // natural expirey
            if (expire(org)) { return; }
            // do stuff
            roam(org);
        });

        $timeout(turn, aiTick);
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
        var organism = {
                isAlive: true,
                age: 0
            },
            avatar = physicsCube({collision: function (other) { onCollision(organism, other); }});
        avatar.position.x = x;
        avatar.position.y = y;
        avatar.position.z = z;
        avatar.vidaMeta = organism;

        organism.avatar = avatar;

        species.push(organism);
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
        if (population >= limitPop) {
            /*global console*/
            console.warn('Limit of ', limitPop, 'hit');
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
        //if (species.length - population > gcThreshold) {
        //    gc();
        //}

    }


    function populate() {
        var i, x, z;
        for (i = 0; i < initPop; i += 1) {
            x = between(initPop * -1, initPop);
            z = between(initPop * -1, initPop);
            makeProcomyte(x, 3, z);
        }

        $timeout(turn, aiTick);
    }

    populate();


    makeProcomyte.species = species;
    makeProcomyte.turn = turn;
    makeProcomyte.limit = limitPop;

    return makeProcomyte;
}]);
