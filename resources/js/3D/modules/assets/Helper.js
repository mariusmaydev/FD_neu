
import SPLINT from 'SPLINT';
var SRC = null;
export default function srcList(){
    if(SRC != null){
        return SRC;
    } else {
        SRC = SPLINT.file.loadFromProject("/resources/js/3D/modules/src.list.json").toObject();
        return SRC;
    }
}