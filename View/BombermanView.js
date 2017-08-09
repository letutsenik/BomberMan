'use strict';
class TBombermanView {
    constructor() {
        this._BombermanModel = null;
        this._SceneDom = null;
        this._SceneModel = null;
        
        this._BombermanImgWidth = null; 
        this._BombermanImgHeight = null;

        this._SceneMarginLeft = null;
        this._SceneWidth = null;
        this._documentWidth = null;

        this._BombermanMovePoint = null; // Точка относительного смещения Scene

        //Анимация
        this._frameSpeed = 0;

        this._animationLeft = null;
        this._animationRight = null;
        this._animationUp = null;
        this._animationDown = null;

        this._Elem = null;

        this._lastMovement = null;
    }


    Init (BModel, SModel, Scene) {
        this._BombermanModel = BModel;
        this._SceneModel = SModel;
        this._SceneDom = Scene;

        // вычисляем размеры картинки bomberman
        this._BombermanImgWidth = this._SceneDom.offsetWidth / this._SceneModel.HorzBlocks ;
        this._BombermanImgHeight = this._SceneDom.offsetHeight / this._SceneModel.VertBlocks;

        //this._Elem.src ='images/Bomberman.png';    
        this._Elem = this._SceneDom.querySelector('.bomberman');
        this._Elem.width = this._BombermanImgWidth;
        this._Elem.height = this._BombermanImgHeight;
        const Context = this._Elem.getContext('2d');

        //Анимация
        const spriteLeft = new TSpriteSheet('images/Bman_left.png', 64, 64);
        const spriteRight = new TSpriteSheet('images/Bman_right.png', 64, 64);
        const spriteUp = new TSpriteSheet('images/Bman_up.png', 64, 64);
        const spriteDown = new TSpriteSheet('images/Bman_down.png', 64, 64);

        this._animationLeft = new TAnimation(spriteLeft, 0, 7, Context, this._BombermanImgWidth, this._BombermanImgHeight, this);
        this._animationRight = new TAnimation(spriteRight, 0, 7, Context, this._BombermanImgWidth, this._BombermanImgHeight, this);
        this._animationUp = new TAnimation(spriteUp, 0, 7, Context, this._BombermanImgWidth, this._BombermanImgHeight, this);
        this._animationDown = new TAnimation(spriteDown, 0, 7, Context, this._BombermanImgWidth, this._BombermanImgHeight, this);

        const ScenecomputedStyle = getComputedStyle(this._SceneDom);

        this._SceneMarginLeft = parseInt(ScenecomputedStyle.marginLeft);

        this._SceneWidth = parseInt(ScenecomputedStyle.width);

        this._documentWidth = document.body.offsetWidth;

        this._BombermanMovePoint = (this._SceneMarginLeft) ? this._documentWidth * 2 / 3 : this._documentWidth / 2;
    };

    Update () {
        if (!this._BombermanModel.PosX) {
            this._Elem.style.display = 'none';
            return;
        }

        const BombermanLeftPos = this._BombermanModel.PosX * (this._BombermanImgWidth/this._SceneModel.BlockWidth);
        const BombermanTopPos = this._BombermanModel.PosY * (this._BombermanImgHeight/this._SceneModel.BlockHeight);

        this._Elem.style.left = BombermanLeftPos + 'px';
        this._Elem.style.top = BombermanTopPos + 'px';
        this._Elem.style.display = 'block';

        //Анимация
        switch (this._BombermanModel.AnimationDirect) {
            case 'down' :
                this._frameSpeed = 3;
                this._lastMovement = 'down';
                this._animationDown.Update();
                this._animationDown.Draw();
                break;

            case 'up' :
                this._frameSpeed = 3;
                this._lastMovement = 'up';
                this._animationUp.Update();
                this._animationUp.Draw();
                break;

            case 'left' :
                this._frameSpeed = 3;
                this._lastMovement = 'left';
                this._animationLeft.Update();
                this._animationLeft.Draw();
                break;

            case 'right' :
                this._frameSpeed = 3;
                this._lastMovement = 'right';
                this._animationRight.Update();
                this._animationRight.Draw();
                break;
            case 'stop' :
                this._frameSpeed = 0;
                if (this._lastMovement === 'down') this._animationDown.Draw();
                if (this._lastMovement === 'up') this._animationUp.Draw();
                if (this._lastMovement === 'left') this._animationLeft.Draw();
                if (this._lastMovement === 'right') this._animationRight.Draw();
                if (!this._lastMovement) this._animationDown.Draw();
                break;
        }

        const ScenecomputedStyle = getComputedStyle(this._SceneDom);
        //Двигаем сцену
        if (BombermanLeftPos > (this._BombermanMovePoint - this._SceneMarginLeft) && this._BombermanModel.SpeedX > 0 ) {
            if (parseInt(ScenecomputedStyle.marginLeft) > (this._documentWidth - this._SceneWidth)) {
                this._SceneDom.style.marginLeft = parseInt(ScenecomputedStyle.marginLeft) -
                    this._BombermanModel.SpeedX * (this._BombermanImgWidth / this._SceneModel.BlockWidth) + 'px';
            }
        }
        if (BombermanLeftPos - this._SceneMarginLeft < (this._BombermanMovePoint - this._SceneMarginLeft) && this._BombermanModel.SpeedX < 0 ) {

            if (parseInt(ScenecomputedStyle.marginLeft) < this._SceneMarginLeft)
            {
                this._SceneDom.style.marginLeft = parseInt(ScenecomputedStyle.marginLeft) -
                    this._BombermanModel.SpeedX * (this._BombermanImgWidth/this._SceneModel.BlockWidth) + 'px';
            }
        }
    };
    
    MoveSceneToStart () {
        this._SceneDom.classList.add('scene-animated-move');
        this._SceneDom.style.marginLeft = this._SceneMarginLeft + 'px';
        setTimeout(function () {
            this._SceneDom.classList.remove('scene-animated-move');
        }, 2000);
    }
}

