'use strict';
class TFireView {
    constructor() {
        this._FireModel = null;
        this._SceneModel = null;//!!!!
        this._SceneDom = null;
        this._FireImgWidth = null;
        this._FireImgHeight = null;
        //Анимация
        this._frameSpeed = 7;
        this._animation = [];
        this._Elems = [];
    }

    Init (FireMod, SceneMod, Scene) {
        this._FireModel = FireMod;
        this._SceneModel = SceneMod; //!!!
        this._SceneDom = Scene;

        // вычисляем размеры картинки
        this._FireImgWidth = this._SceneDom.offsetWidth / this._SceneModel.HorzBlocks ;
        this._FireImgHeight = this._SceneDom.offsetHeight / this._SceneModel.VertBlocks;

        let Context = [];
        for (let i = 0; i < 5; i++) {
            this._Elems[i] = document.createElement('canvas');
            this._Elems[i].classList.add('flame');
            this._Elems[i].width = this._FireImgWidth;
            this._Elems[i].height = this._FireImgHeight;
            this._SceneDom.appendChild(this._Elems[i]);
            Context[i] = this._Elems[i].getContext('2d');

        }
        //Анимация
        const sprite = new TSpriteSheet('images/Explosion_sprite.png', 60, 60);
        for (let k = 0; k < 5; k++) {
            this._animation[k] = new TAnimation(sprite, 0, 6, Context[k], this._FireImgWidth, this._FireImgHeight, this);
        }
    };

    Update () {
        if (this._FireModel.FireCoordsA) {
            for (let i = 0; i < this._FireModel.FireCoordsA.length; i++) {
                let FireLeftPos = this._FireModel.FireCoordsA[i].X * (this._FireImgWidth/this._SceneModel.BlockWidth);
                let FireTopPos = this._FireModel.FireCoordsA[i].Y * (this._FireImgHeight/this._SceneModel.BlockHeight);

                this._Elems[i].style.display = 'block';
                this._Elems[i].style.left = FireLeftPos + 'px';
                this._Elems[i].style.top = FireTopPos + 'px';

                //Анимация
                this._animation[i].Update();
                this._animation[i].Draw();
            }


        } else {
            for (let j = 0; j < 5; j++)
                this._Elems[j].style.display = 'none';
        }
    };

    Clear () {
        for (let j = 0; j < 5; j++)
            this._SceneDom.removeChild( this._Elems[j] );
    }
}
