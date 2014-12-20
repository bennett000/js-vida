var Physijs = {
    scripts: {

    },
    Scene: function Scene() {
        'use strict';

        if (!(this instanceof Scene)) {
            return new Scene();
        }

        function add () {

        }

        this.add = add;
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
    PerspectiveCamera: function PerspectiveCamera() {
        'use strict';

        if (!(this instanceof PerspectiveCamera)) {
            return new PerspectiveCamera();
        }
    },
    createMaterial: function (p1) {
        'use strict';

        return p1;
    }
};