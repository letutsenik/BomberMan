'use strict';
function TBombView() {
    var self = this;
    var BombModel = null;
    var SceneModel = null;//!!!!
    var SceneDom = null;

    var BombImgWidth, BombImgHeight;

    //Анимация
    self.frameSpeed = 3;
    var animation = null;

    self.Init = function (BombMod, SceneMod, Scene) {
        BombModel = BombMod;
        SceneModel = SceneMod; //!!!
        SceneDom = Scene;

        // вычисляем размеры картинки
        BombImgWidth = SceneDom.offsetWidth / SceneModel.HorzBlocks ;
        BombImgHeight = SceneDom.offsetHeight / SceneModel.VertBlocks;

        self.Elem = document.querySelector('.bomb');
        self.Elem.width = BombImgWidth;
        self.Elem.height = BombImgHeight;
        var Context = self.Elem.getContext('2d');

        //Анимация
        var sprite = new TSpriteSheet('images/bomb_sprite.png', 48, 48);
        animation = new TAnimation(sprite, 0, 2, Context, BombImgWidth, BombImgHeight, self);
    };

    self.Update = function() {
        if (BombModel.PosX)
        {
            var BombLeftPos = BombModel.PosX * (BombImgWidth/SceneModel.BlockWidth);
            var BombTopPos = BombModel.PosY * (BombImgHeight/SceneModel.BlockHeight);

            self.Elem.style.display = 'block';
            self.Elem.style.left = BombLeftPos + 'px';
            self.Elem.style.top = BombTopPos + 'px';

            //Анимация
            animation.Update();
            animation.Draw();
        } else
        {
            self.Elem.style.display = 'none';
        }
    };
}