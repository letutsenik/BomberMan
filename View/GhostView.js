'use strict';
class TGhostView {
    constructor() {
        this._GhostModel = null;
        this._SceneDom = null;
        this._SceneModel = null;
        this._GhostImgWidth = null;
        this._GhostImgHeight = null;

        //Анимация
        this._frameSpeed = 0;
        this._spriteLeft = null;
        this._spriteRight = null;
        this._spriteUp = null;
        this._spriteDown = null;

        this._animationLeft = null;
        this._animationRight = null;
        this._animationUp = null;
        this._animationDown = null;

        this._Elem = null;
        this._lastMovement = null;
    }

    Init (GModel, SModel, Scene) {
        this._GhostModel = GModel;
        this._SceneModel = SModel;
        this._SceneDom = Scene;

        // вычисляем размеры картинки
        this._GhostImgWidth = this._SceneDom.offsetWidth / this._SceneModel.HorzBlocks ;
        this._GhostImgHeight = this._SceneDom.offsetHeight / this._SceneModel.VertBlocks;

        this._Elem = document.createElement('canvas');
        this._Elem.classList.add('ghost');
        this._Elem.width = this._GhostImgWidth;
        this._Elem.height = this._GhostImgHeight;
        this._SceneDom.appendChild(this._Elem);
        const Context = this._Elem.getContext('2d');

        //Анимация
        this._spriteLeft = new TSpriteSheet('images/Ghost_left.png', 64, 64);
        this._spriteRight = new TSpriteSheet('images/Ghost_right.png', 64, 64);
        this._spriteUp = new TSpriteSheet('images/Ghost_up.png', 64, 64);
        this._spriteDown = new TSpriteSheet('images/Ghost_down.png', 64, 64);

        this._animationLeft = new TAnimation(this._spriteLeft, 0, 6, Context, this._GhostImgWidth, this._GhostImgHeight, this);
        this._animationRight = new TAnimation(this._spriteRight, 0, 6, Context, this._GhostImgWidth, this._GhostImgHeight, this);
        this._animationUp = new TAnimation(this._spriteUp, 0, 5, Context, this._GhostImgWidth, this._GhostImgHeight, this);
        this._animationDown = new TAnimation(this._spriteDown, 0, 5, Context, this._GhostImgWidth, this._GhostImgHeight, this);

    };

    Update () {
        if (!this._Elem) return;

        this._Elem.style.left = this._GhostModel.PosX * (this._GhostImgWidth/this._SceneModel.BlockWidth) + 'px';
        this._Elem.style.top = this._GhostModel.PosY * (this._GhostImgHeight/this._SceneModel.BlockHeight) + 'px';

        //Анимация
        switch (this._GhostModel.AnimationDirect) {
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
    };

    RemoveElem () {
        this._SceneDom.removeChild(this._Elem);
        this._Elem = null;
        //Чистим память
        this._spriteLeft = null;
        this._spriteRight = null;
        this._spriteUp = null;
        this._spriteDown = null;

        this._animationLeft = null;
        this._animationRight = null;
        this._animationUp = null;
        this._animationDown = null;
    };
}