var THREE = {
    EventDispatcher: {
        prototype: {
            addEventListener: function () {

            }
        }
    },
    Quaternion: function Quaternion() {
        'use strict';

        if (!(this instanceof Quaternion)) {
            return new Quaternion();
        }

        function clone() {
            return new Quaternion();
        }

        this.clone = clone;
    },
    Vector3: function Vector3() {
        'use strict';

        if (!(this instanceof Vector3)) {
            return new Vector3();
        }

        function clone() {
            return new Vector3();
        }

        function subVectors() {

        }

        function dot() {

        }

        function length() {

        }

        function lengthSq() {

        }

        function sub() {

        }

        function distanceToSquared() {

        }

        this.clone = clone;
        this.subVectors = subVectors;
        this.dot = dot;
        this.length = length;
        this.lengthSq = lengthSq;
        this.copy = clone;
        this.sub = sub;
        this.distanceToSquared = distanceToSquared;
    },
    Vector2: function Vector2() {
        'use strict';

        if (!(this instanceof Vector2)) {
            return new Vector2();
        }

        function clone() {
            return new Vector2();
        }

        function subVectors() {

        }

        function dot() {

        }

        function sub() {

        }

        function length() {

        }

        function lengthSq() {

        }

        function distanceToSquared() {

        }

        this.clone = clone;
        this.subVectors = subVectors;
        this.dot = dot;
        this.length = length;
        this.lengthSq = lengthSq;
        this.copy = clone;
        this.sub = sub;
        this.distanceToSquared = distanceToSquared;
    },
    WebGLRenderer: function WebGLRenderer() {
        'use strict';

        if (!(this instanceof WebGLRenderer)) {
            return new WebGLRenderer();
        }

        function setSize() {

        }

        function render() {

        }

        this.setSize = setSize;
        this.render = render;
    },
    Scene: function Scene() {
        'use strict';

        if (!(this instanceof Scene)) {
            return new Scene();
        }

        function add() {

        }

        this.add = add;
    },
    BoxGeometry: function BoxGeometry() {
        'use strict';

        if (!(this instanceof BoxGeometry)) {
            return new BoxGeometry();
        }
    },
    MeshBasicMaterial: function MeshBasicMaterial() {
        'use strict';

        if (!(this instanceof MeshBasicMaterial)) {
            return new MeshBasicMaterial();
        }
    },
    PerspectiveCamera: function PerspectiveCamera() {
        'use strict';

        if (!(this instanceof PerspectiveCamera)) {
            return new PerspectiveCamera();
        }

        function updateProjectionMatrix() {

        }

        function lookAt() {

        }

        this.position = {
            x: 0,
            y: 0,
            z: 0,
            clone: function () {

            },
            addVectors: function () {

            }
        };

        this.up = {
            clone: function () {}
        };

        this.updateProjectionMatrix = updateProjectionMatrix;
        this.lookAt = lookAt;
    },
    Mesh: function Mesh() {
        'use strict';

        if (!(this instanceof Mesh)) {
            return new Mesh();
        }

    }
};
