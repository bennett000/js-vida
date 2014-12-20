var Physijs = {
    scripts: {

    },
    Scene: function Scene() {
        'use strict';

        if (!(this instanceof Scene)) {
            return new Scene();
        }
    },
    BoxMesh: function BoxMesh() {
        'use strict';

        if (!(this instanceof BoxMesh)) {
            return new BoxMesh();
        }

        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
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