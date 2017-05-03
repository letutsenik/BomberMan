'use strict';
function TBombermanView() {
    var self = this;
    var BombermanModel = null;
    var SceneDom = null;
    var SceneModel = null;

    var BombermanImgWidth, BombermanImgHeight;
    var SceneMarginLeft, SceneWidth, documentWidth;

    var BombermanMovePoint; // Точка относительного смещения Scene

    //Анимация
    self.frameSpeed = 0;

    var animationLeft = null;
    var animationRight = null;
    var animationUp = null;
    var animationDown = null;



    self.Init = function(BModel,SModel,Scene) {
        BombermanModel = BModel;
        SceneModel = SModel;
        SceneDom = Scene;

        // вычисляем размеры картинки bomberman
        BombermanImgWidth = SceneDom.offsetWidth / SceneModel.HorzBlocks ;
        BombermanImgHeight = SceneDom.offsetHeight / SceneModel.VertBlocks;
        //console.log(BombermanImgWidth);
        //console.log(BombermanImgHeight);


        //self.Elem.src ='images/Bomberman.png';    
        self.Elem = SceneDom.querySelector('.bomberman');
        self.Elem.width = BombermanImgWidth;
        self.Elem.height = BombermanImgHeight;
        var Context = self.Elem.getContext('2d');

        //Анимация
        var spriteLeft = new TSpriteSheet('images/Bman_left.png', 64, 64);
        var spriteRight = new TSpriteSheet('images/Bman_right.png', 64, 64);
        var spriteUp = new TSpriteSheet('images/Bman_up.png', 64, 64);
        var spriteDown = new TSpriteSheet('images/Bman_down.png', 64, 64);

        animationLeft = new TAnimation(spriteLeft, 0, 7, Context, BombermanImgWidth, BombermanImgHeight, self);
        animationRight = new TAnimation(spriteRight, 0, 7, Context, BombermanImgWidth, BombermanImgHeight, self);
        animationUp = new TAnimation(spriteUp, 0, 7, Context, BombermanImgWidth, BombermanImgHeight, self);
        animationDown = new TAnimation(spriteDown, 0, 7, Context, BombermanImgWidth, BombermanImgHeight, self);


        var ScenecomputedStyle = getComputedStyle(SceneDom);

        SceneMarginLeft = parseInt(ScenecomputedStyle.marginLeft);
        //console.log( 'SceneMarginLeft = ' + SceneMarginLeft ); // выведет MarginLeft в пикселях

        SceneWidth = parseInt(ScenecomputedStyle.width);
        //console.log( 'SceneWidth = ' + SceneWidth ); // выведет SceneWidth в пикселях

        //console.log( 'SceneHeight = ' + parseInt(ScenecomputedStyle.height) ); // выведет SceneHeight в пикселях

        documentWidth = document.body.offsetWidth;
        //console.log( 'documentWidth = ' + documentWidth ); // выведет documentWidth в пикселях
        BombermanMovePoint = (SceneMarginLeft) ? documentWidth*2/3 : documentWidth/2;

        //console.log( (documentWidth*2/3 - SceneMarginLeft) );
    };

    self.Update = function() {
        if (!BombermanModel.PosX) {
            self.Elem.style.display = 'none';
            return;
        }

        var BombermanLeftPos = BombermanModel.PosX * (BombermanImgWidth/SceneModel.BlockWidth);
        var BombermanTopPos = BombermanModel.PosY * (BombermanImgHeight/SceneModel.BlockHeight);

        self.Elem.style.left = BombermanLeftPos + 'px';
        self.Elem.style.top = BombermanTopPos + 'px';
        self.Elem.style.display = 'block';

        //Анимация
        switch (BombermanModel.AnimationDirect) {
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

        //console.log( 'BombermanLeftPos = ' + BombermanLeftPos );

        var ScenecomputedStyle = getComputedStyle(SceneDom);
        //Двигаем сцену
        if (BombermanLeftPos > (BombermanMovePoint - SceneMarginLeft) && BombermanModel.SpeedX > 0 ) {
            //console.log('MarginScene!!!');
            if (parseInt(ScenecomputedStyle.marginLeft) > (documentWidth - SceneWidth)) {
                SceneDom.style.marginLeft = parseInt(ScenecomputedStyle.marginLeft) -
                    BombermanModel.SpeedX * (BombermanImgWidth / SceneModel.BlockWidth) + 'px';
            }
        }
        if (BombermanLeftPos - SceneMarginLeft < (BombermanMovePoint - SceneMarginLeft) && BombermanModel.SpeedX < 0 ) {

            if (parseInt(ScenecomputedStyle.marginLeft) < SceneMarginLeft)
            {
                SceneDom.style.marginLeft = parseInt(ScenecomputedStyle.marginLeft) -
                    BombermanModel.SpeedX * (BombermanImgWidth/SceneModel.BlockWidth) + 'px';
            }
        }
    };
    
    self.MoveSceneToStart = function () {
        SceneDom.classList.add('scene-animated-move');
        SceneDom.style.marginLeft = SceneMarginLeft + 'px';
        setTimeout(function () {
            SceneDom.classList.remove('scene-animated-move');
        }, 2000);
    }
}

