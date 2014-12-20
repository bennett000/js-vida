/*global THREE */
var Physijs = {
    scripts: {

    },
    Scene: function Scene() {
        'use strict';

        if (!(this instanceof Scene)) {
            return new Scene();
        }

       THREE.Scene.call(this);
    },
    BoxMesh: function BoxMesh() {
        'use strict';

        if (!(this instanceof BoxMesh)) {
            return new BoxMesh();
        }

        function addEventListener() {

        }

        this.position = {
            x: 0,
            y: 0,
            z: 0
        };

        this.addEventListener = addEventListener;
    },
    createMaterial: function (p1) {
        'use strict';

        return p1;
    }
};


Physijs.Scene.prototype = new THREE.Scene();
Physijs.Scene.prototype.constructor = Physijs.Scene;