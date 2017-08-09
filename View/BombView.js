'use strict';
class TBombView {
    constructor() {
        this._BombModel = null;
        this._SceneModel = null;//!!!!
        this._SceneDom = null;

        this._BombImgWidth = null;
        this._BombImgHeight = null;

        //Анимация
        this._frameSpeed = 3;
        this._animation = null;

        this._Elem = null;
    }
   

    Init (BombMod, SceneMod, Scene) {
        this._BombModel = BombMod;
        this._SceneModel = SceneMod; //!!!
        this._SceneDom = Scene;

        // вычисляем размеры картинки
        this._BombImgWidth = this._SceneDom.offsetWidth / this._SceneModel.HorzBlocks ;
        this._BombImgHeight = this._SceneDom.offsetHeight / this._SceneModel.VertBlocks;

        this._Elem = document.querySelector('.bomb');
        this._Elem.width = this._BombImgWidth;
        this._Elem.height = this._BombImgHeight;
        const Context = this._Elem.getContext('2d');

        //Анимация
        const sprite = new TSpriteSheet('images/bomb_sprite.png', 48, 48);
        this._animation = new TAnimation(sprite, 0, 2, Context, this._BombImgWidth, this._BombImgHeight, this);
    };

    Update () {
        if (this._BombModel.PosX) {
            const BombLeftPos = this._BombModel.PosX * (this._BombImgWidth/this._SceneModel.BlockWidth);
            const BombTopPos = this._BombModel.PosY * (this._BombImgHeight/this._SceneModel.BlockHeight);

            this._Elem.style.display = 'block';
            this._Elem.style.left = BombLeftPos + 'px';
            this._Elem.style.top = BombTopPos + 'px';

            //Анимация
            this._animation.Update();
            this._animation.Draw();
        } else
        {
            this._Elem.style.display = 'none';
        }
    };
}