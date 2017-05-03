'use strict';
function TFireView() {
    var self = this;
    var FireModel = null;
    var SceneModel = null;//!!!!
    var SceneDom = null;

    var FireImgWidth, FireImgHeight;

    //Анимация
    self.frameSpeed = 7;
    var animation = [];

    self.Init = function (FireMod, SceneMod, Scene) {
        FireModel = FireMod;
        SceneModel = SceneMod; //!!!
        SceneDom = Scene;

        // вычисляем размеры картинки
        FireImgWidth = SceneDom.offsetWidth / SceneModel.HorzBlocks ;
        FireImgHeight = SceneDom.offsetHeight / SceneModel.VertBlocks;

        self.Elems = [];
        var Context = [];
        for (var i = 0; i < 5; i++)
        {
            self.Elems[i] = document.createElement('canvas');
            self.Elems[i].classList.add('flame');
            self.Elems[i].width = FireImgWidth;
            self.Elems[i].height = FireImgHeight;
            //console.log( self.Elems[i] );
            SceneDom.appendChild(self.Elems[i]);
            Context[i] = self.Elems[i].getContext('2d');
            
        }
        //Анимация
        var sprite = new TSpriteSheet('images/Explosion_sprite.png', 60, 60);
        for (var k = 0; k < 5; k++)
        {
        animation[k] = new TAnimation(sprite, 0, 6, Context[k], FireImgWidth, FireImgHeight, self);
        }
    };

    self.Update = function() {
        if (FireModel.FireCoordsA)
        {
            //console.log('FireModel.FireCoordsA.length = ' + FireModel.FireCoordsA.length);
            for (var i=0; i<FireModel.FireCoordsA.length; i++)
            {
                var FireLeftPos = FireModel.FireCoordsA[i].X * (FireImgWidth/SceneModel.BlockWidth);
                var FireTopPos = FireModel.FireCoordsA[i].Y * (FireImgHeight/SceneModel.BlockHeight);

                self.Elems[i].style.display = 'block';
                self.Elems[i].style.left = FireLeftPos + 'px';
                self.Elems[i].style.top = FireTopPos + 'px';

                //Анимация
                animation[i].Update();
                animation[i].Draw();
            }


        } else
        {
            for (var j=0; j<5; j++)
                self.Elems[j].style.display = 'none';
        }
    };
    
    self.Clear = function () {
        for (var j=0; j<5; j++)
            SceneDom.removeChild( self.Elems[j] );
    }
}