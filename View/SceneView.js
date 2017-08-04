'use strict';
class TSceneView {
    constructor() {
        this._SceneModel = null;
        this._Scene = null;

        this._BrickFiles = {
            1:'SolidBlock.png',
            2:'ExplodableBlock.png',
        };
    }

    Init(Model,Elem) {
        this._SceneModel = Model;
        this._Scene = Elem;
    };

    Update() {
        // вычисляем размеры картинки
        const BlockImgWidth = this._Scene.offsetWidth / this._SceneModel.HorzBlocks ;
        const BlockImgHeight = this._Scene.offsetHeight / this._SceneModel.VertBlocks;

        // надо создать картинки кирпичей там где они нужны
        // а их ещё нет
        // и удалить там где они не нужны но были созданы
        for ( let R = 0; R < this._SceneModel.VertBlocks; R++ )
            for ( let C = 0; C < this._SceneModel.HorzBlocks; C++ )
            {
                let CellH = this._SceneModel.BlocksA[R][C];
                if ( CellH.kind && !CellH.elem && CellH.kind !== 4)
                { // картинка кирпича нужна - создаём
                    CellH.elem = document.createElement('IMG');
                    CellH.elem.classList.add('block');
                    CellH.elem.style.width = BlockImgWidth + 'px';
                    CellH.elem.style.height = BlockImgHeight + 'px';

                    let CoordsH = this._SceneModel.BlockToScreen(R,C);
                    CellH.elem.style.left = CoordsH.left * (BlockImgWidth/this._SceneModel.BlockWidth) + 'px';
                    CellH.elem.style.top = CoordsH.top * (BlockImgHeight/this._SceneModel.BlockHeight)+ 'px';

                    CellH.elem.src = 'images/'
                        + this._BrickFiles[CellH.kind];
                    this._Scene.appendChild(CellH.elem);
                }
                if ( (!CellH.kind) && CellH.elem )
                { // картинка кирпича не нужна - удаляем
                    this._Scene.removeChild(CellH.elem);
                    CellH.elem = null;
                }
            }
    };
}