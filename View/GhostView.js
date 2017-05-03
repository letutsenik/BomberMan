'use strict';
function TGhostView() {
    var self = this;
    var GhostModel = null;
    var SceneDom = null;
    var SceneModel = null;
    var GhostImgWidth, GhostImgHeight;

    //Анимация
    self.frameSpeed = 0;
    var spriteLeft = null;
    var spriteRight = null;
    var spriteUp = null;
    var spriteDown = null;

    var animationLeft = null;
    var animationRight = null;
    var animationUp = null;
    var animationDown = null;

    self.Init = function(GModel,SModel,Scene) {
        GhostModel = GModel;
        SceneModel = SModel;
        SceneDom = Scene;

        // вычисляем размеры картинки
        GhostImgWidth = SceneDom.offsetWidth / SceneModel.HorzBlocks ;
        GhostImgHeight = SceneDom.offsetHeight / SceneModel.VertBlocks;
        //console.log(GhostImgWidth);
        //console.log(GhostImgHeight);

        /*GhostModel.Elem = document.createElement('img');
        GhostModel.Elem.style.position='absolute';
        GhostModel.Elem.src ='images/Ghost.png';
        GhostModel.Elem.style.width = GhostImgWidth + 'px';
        GhostModel.Elem.style.height = GhostImgHeight + 'px';
         SceneDom.appendChild(GhostModel.Elem);*/

        self.Elem = document.createElement('canvas');
        self.Elem.classList.add('ghost');
        self.Elem.width = GhostImgWidth;
        self.Elem.height = GhostImgHeight;
        SceneDom.appendChild(self.Elem);
        var Context = self.Elem.getContext('2d');

        //Анимация
        spriteLeft = new TSpriteSheet('images/Ghost_left.png', 64, 64);
        spriteRight = new TSpriteSheet('images/Ghost_right.png', 64, 64);
        spriteUp = new TSpriteSheet('images/Ghost_up.png', 64, 64);
        spriteDown = new TSpriteSheet('images/Ghost_down.png', 64, 64);

        animationLeft = new TAnimation(spriteLeft, 0, 6, Context, GhostImgWidth, GhostImgHeight, self);
        animationRight = new TAnimation(spriteRight, 0, 6, Context, GhostImgWidth, GhostImgHeight, self);
        animationUp = new TAnimation(spriteUp, 0, 5, Context, GhostImgWidth, GhostImgHeight, self);
        animationDown = new TAnimation(spriteDown, 0, 5, Context, GhostImgWidth, GhostImgHeight, self);

    };

    self.Update = function() {
        //if (!GhostModel.PosX) SceneDom.removeChild(self.Elem);
        if (!self.Elem) return;
        //SceneDom.removeChild(self.Elem);
        //console.log('Delete Ghost!!!');
        self.Elem.style.left = GhostModel.PosX * (GhostImgWidth/SceneModel.BlockWidth) + 'px';
        self.Elem.style.top = GhostModel.PosY * (GhostImgHeight/SceneModel.BlockHeight) + 'px';

        //Анимация
        switch (GhostModel.AnimationDirect) {
            case 'down' :
                self.frameSpeed = 3;
                self.lastMovement = 'down';
                animationDown.Update();
                animationDown.Draw();
                break;

            case 'up' :
                self.frameSpeed = 3;
                self.lastMovement = 'up';
                animationUp.Update();
                animationUp.Draw();
                break;

            case 'left' :
                self.frameSpeed = 3;
                self.lastMovement = 'left';
                animationLeft.Update();
                animationLeft.Draw();
                break;

            case 'right' :
                self.frameSpeed = 3;
                self.lastMovement = 'right';
                animationRight.Update();
                animationRight.Draw();
                break;
            case 'stop' :
                self.frameSpeed = 0;
                if (self.lastMovement === 'down') animationDown.Draw();
                if (self.lastMovement === 'up') animationUp.Draw();
                if (self.lastMovement === 'left') animationLeft.Draw();
                if (self.lastMovement === 'right') animationRight.Draw();
                if (!self.lastMovement) animationDown.Draw();
                break;
        }
    };

    self.RemoveElem = function () {
        SceneDom.removeChild(self.Elem);
        self.Elem = null;
        //Чистим память
        spriteLeft = null;
        spriteRight = null;
        spriteUp = null;
        spriteDown = null;

        animationLeft = null;
        animationRight = null;
        animationUp = null;
        animationDown = null;
    };
}