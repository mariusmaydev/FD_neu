
// import SPLINT from 'SPLINT';

// console.dir(self)
import {draw} from location.origin + '/fd/resources/js/3D/modules/lighter/index/Core.js';

self.onmessage = function(e){
    console.dir(self)
    draw.get(e.data.canvas)
}
// draw.get