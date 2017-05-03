'use strict';
function TSceneView() {
    var SceneModel = null;
    var Scene = null;

    var BrickFiles = { 1:'SolidBlock.png',
        2:'ExplodableBlock.png' };
    
    this.Init = function(Model,Elem) {

        SceneModel = Model;
        Scene = Elem;
    };

    this.Update = function() {

        // вычисляем размеры картинки
        var BlockImgWidth = Scene.offsetWidth / SceneModel.HorzBlocks ;
        var BlockImgHeight = Scene.offsetHeight / SceneModel.VertBlocks;
        //console.log(BlockImgWidth);
        //console.log(BlockImgHeight);

        // надо создать картинки кирпичей там где они нужны
        // а их ещё нет
        // и удалить там где они не нужны но были созданы
        for ( var R = 0; R < SceneModel.VertBlocks; R++ )
            for ( var C = 0; C < SceneModel.HorzBlocks; C++ )
            {
                var CellH = SceneModel.BlocksA[R][C];
                if ( CellH.kind && !CellH.elem && CellH.kind!=4)
                { // картинка кирпича нужна - создаём
                    CellH.elem = document.createElement('IMG');
                    CellH.elem.classList.add('block');
                    CellH.elem.style.width = BlockImgWidth + 'px';
                    CellH.elem.style.height = BlockImgHeight + 'px';

                    var CoordsH = SceneModel.BlockToScreen(R,C);
                    CellH.elem.style.left = CoordsH.left * (BlockImgWidth/SceneModel.BlockWidth) + 'px';
                    CellH.elem.style.top = CoordsH.top * (BlockImgHeight/SceneModel.BlockHeight)+ 'px';

                    CellH.elem.src = 'images/'
                        + BrickFiles[CellH.kind];
                    Scene.appendChild(CellH.elem);
                }
                if ( (!CellH.kind) && CellH.elem )
                { // картинка кирпича не нужна - удаляем
                    Scene.removeChild(CellH.elem);
                    CellH.elem = null;
                }
            }
    };
}