var THREE = {
    EventDispatcher: {
        prototype: {

        }
    },
    WebGLRenderer: function WebGLRenderer() {
        'use strict';

        if (!(this instanceof WebGLRenderer)) {
            return new WebGLRenderer();
        }

        function setSize( ) {

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

        function add () {

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

        function updateProjectionMatrixx() {

        }

        this.updateProjectionMatrix = updateProjectionMatrix;
    }
};
