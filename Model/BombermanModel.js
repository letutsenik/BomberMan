'use strict';
function TBombermanModel() {
    var self = this;
    var BombermanView = null;
    var SceneModel = null;
    var BombModel = null;
    var GhostsModelA = null;
    var Game = null;

    // Sounds
    var BManStepAudio = new Audio;
    var BManDestroyAudio = new Audio;
    // результат canPlayType: "probably" - скорее всего, "maybe" - неизвестно, "" - нет
    console.log( BManStepAudio.canPlayType("audio/ogg; codecs=vorbis") );
    console.log( BManStepAudio.canPlayType("audio/mpeg") );

    if ( BManStepAudio.canPlayType("audio/mpeg")== "probably" || BManStepAudio.canPlayType("audio/mpeg") == "maybe")
    {
        BManStepAudio.src = "Sounds/step.mp3";
        BManDestroyAudio.src = "Sounds/bmandestroy.mp3";
    }

    else
    {
        BManStepAudio.src = "Sounds/step.ogg";
        BManDestroyAudio.src = "Sounds/bmandestroy.ogg";
    }

    BManStepAudio.loop = true;

    /*self.SoundInit = function () {
        BManStepAudio.play();
        BManStepAudio.pause();

        BManDestroyAudio.play();
        BManDestroyAudio.pause();
    };

    self.SoundInit();*/


    self.Init = function (View, SceneMod, BombMod, GhostsMod, game) {
        BombermanView = View;
        SceneModel = SceneMod;
        BombModel = BombMod;
        GhostsModelA = GhostsMod;
        Game = game;
    };

    self.UpdateView = function () {
        if (BombermanView)
            BombermanView.Update();
    };

    self.Width = 10; // размеры bomberman
    self.Height = 10;

    self.AnimationDirect = 'stop';

    self.Prepare = function() {
        while (true) {
            //Math.floor(Math.random()*(M-N+1))+N
            var BombermanX = Math.floor(Math.random() * (SceneModel.HorzBlocks-25 - 2 - 1 + 1)) + 1;
            var BombermanY = Math.floor(Math.random() * (SceneModel.VertBlocks-2 - 5 + 1)) + 5;
            //console.log('BombermanX = ' + BombermanX );
            //console.log('BombermanY = ' + BombermanY );
            if (!SceneModel.BlocksA[BombermanY][BombermanX].kind) {
                //SceneModel.BlocksA[GhostY][GhostX].kind = 3; // !!!
                var CoordsH = SceneModel.BlockToScreen(BombermanY, BombermanX);
                self.PosX = CoordsH.left;
                self.PosY = CoordsH.top;
                //console.log(CoordsH.left);
                //console.log(CoordsH.top);
                break;
            }
        }
    };
    self.SpeedX = 0;
    self.SpeedY = 0;

    self.FlyTick = function() {
        //console.log('SpeedX= ' + self.SpeedX);
        //console.log('SpeedY= ' + self.SpeedY);
        var ImpactXLeft = SceneModel.GetImpactX(self.PosX, self.PosY, self.PosY + self.Height);
        var ImpactXRight = SceneModel.GetImpactX(self.PosX + self.Width,
            self.PosY, self.PosY + self.Height);

        //console.log(ImpactXLeft);
        //console.log(ImpactXRight);
        if ( ImpactXLeft && self.SpeedX<0 )
        {
            //console.log('ImpactXLeft');
            //console.log('ImpactXLeft.deltaY= ' + ImpactXLeft.deltaY);
            //console.log('ImpactXLeft.isNear= ' + ImpactXLeft.isNear);
            if ( Math.abs(ImpactXLeft.deltaY) < self.Height/2 && !ImpactXLeft.isNear) {
                self.PosY+= ImpactXLeft.deltaY;
                //console.log('self.SpeedX =' + self.SpeedX );
            } else {
                //console.log('Speed 0');
                self.SpeedX = 0;
            }
            
        }
        if ( ImpactXRight && self.SpeedX>0 )
        {
            //console.log('ImpactXRight');
            //console.log('ImpactXRight.deltaY= ' + ImpactXRight.deltaY);
            //console.log('ImpactXRight.isNear= ' + ImpactXRight.isNear);
            if ( Math.abs(ImpactXRight.deltaY) < self.Height/2 && !ImpactXRight.isNear) {
                self.PosY+= ImpactXRight.deltaY;
                //self.PosX+= 1;
                //console.log('self.SpeedX =' + self.SpeedX );
            } else {
                //console.log('Speed 0');
                self.SpeedX = 0;
            }
        }
        /*if ( ImpactXLeft && ImpactXRight )
        {
            console.log('Speed 0!!!');
            self.SpeedX = 0;
        }*/

        self.PosX = Math.round( (self.PosX + self.SpeedX)*10 ) / 10;

        var ImpactYTop = SceneModel.GetImpactY(self.PosY, self.PosX, self.PosX + self.Width);
        var ImpactYBottom = SceneModel.GetImpactY(self.PosY + self.Height,
            self.PosX, self.PosX + self.Width);
        //console.log(ImpactYTop);
        //console.log(ImpactYBottom);

        if ( ImpactYTop && self.SpeedY<0 )
        {
            //console.log('ImpactYTop');
            //console.log( 'ImpactYTop.deltaX= ' + ImpactYTop.deltaX );
            if ( Math.abs(ImpactYTop.deltaX) < self.Width/2 && !ImpactYTop.isNear) {
                self.PosX+= ImpactYTop.deltaX;
                //console.log('self.SpeedY =' + self.SpeedY );
            } else {
                //console.log('Speed 0');
                self.SpeedY = 0;
            }

        }
        if ( ImpactYBottom && self.SpeedY>0 )
        {
            //console.log('ImpactYBottom');
            //console.log( 'ImpactYTop.deltaX= ' + ImpactYBottom.deltaX );
            if ( Math.abs(ImpactYBottom.deltaX) < self.Width/2 && !ImpactYBottom.isNear) {
                self.PosX+= ImpactYBottom.deltaX;
                //console.log('self.SpeedY =' + self.SpeedY );
            } else {
                //console.log('Speed 0');
                self.SpeedY = 0;
            }
        }
        /*if ( ImpactYTop && ImpactYBottom )
        {
            self.SpeedY = 0;
        }*/

        self.PosY = Math.round( (self.PosY + self.SpeedY)*10 ) / 10;

        self.IsGhostEatMe();

        StepSound();
    };
    
    self.SetSpeedX = function (speed) {
        self.SpeedX = speed;
        self.AnimationDirect = (speed > 0) ? 'right' : 'left';
        if (speed == 0) self.AnimationDirect = 'stop';
    };

    self.SetSpeedY = function (speed) {
        self.SpeedY = speed;
        self.AnimationDirect = (speed > 0) ? 'down' : 'up';
        if (speed == 0) self.AnimationDirect = 'stop';
    };

    self.PlaceBomb = function () {
        if (BombModel.isBombPlaced) return;
        
        //console.log('BombX = ' + Math.round(self.PosX/10)*10 );
        //console.log('BombY = ' + Math.round(self.PosY/10)*10 );
        var CoordsCRH = SceneModel.ScreenToBlock(Math.round(self.PosX/10)*10, Math.round(self.PosY/10)*10);
        //console.log('BombRow = ' + CoordsCRH.row );
        //console.log('BombCol = ' + CoordsCRH.col );
        //SceneModel.BlocksA[CoordsCRH.row][CoordsCRH.col].kind = 4; //Помечаем ячейку занятую бомбой kind=4
        BombModel.InitBombCoords( Math.round(self.PosX/10)*10, Math.round(self.PosY/10)*10 );
        setTimeout(function () {
            BombModel.BombExplosion();
        }, 3000);
    };

    self.IsGhostEatMe = function () {
        var BombManControlPoints = self.getControlPoints();
        //console.log('BombManRow = ' + BobManCurCoordCRH.row );
        //console.log('BombManCol = ' + BobManCurCoordCRH.col );
        for (var i = 0; i < GhostsModelA.length; i++)
        {
            var GhostCurCoordCRH = SceneModel.ScreenToBlock(GhostsModelA[i].PosX, GhostsModelA[i].PosY);
            if (BombManControlPoints.firstPointRow == GhostCurCoordCRH.row && BombManControlPoints.firstPointCol == GhostCurCoordCRH.col ||
                BombManControlPoints.secondPointRow == GhostCurCoordCRH.row && BombManControlPoints.secondPointCol == GhostCurCoordCRH.col )
                self.Destroy();
        }
    };

    self.Destroy = function () {  ///!!!
        console.log('Bomberman dead!!!');
        self.PosX = undefined;
        self.PosY = undefined;
        DestroySound();

        Game.LoseLife();

        BManStepAudio.loop = false;
        
        setTimeout(function () {
            self.Prepare();
            BombermanView.MoveSceneToStart();
            BManStepAudio.loop = true;
        }, 2000);
    };

    self.getControlPoints = function () { // Контрольные точки положения на поле
        var FirstPoint, SecondPoint;
        if (self.PosX % self.Width == 0)
        {
            FirstPoint = SceneModel.ScreenToBlock(self.PosX+self.Width/2, self.PosY);
            SecondPoint = SceneModel.ScreenToBlock(self.PosX+self.Width/2, self.PosY+self.Height);
        } else
        {
            FirstPoint = SceneModel.ScreenToBlock(self.PosX, self.PosY+self.Height/2);
            SecondPoint = SceneModel.ScreenToBlock(self.PosX+self.Width, self.PosY+self.Height/2);
        }
            return {
                firstPointRow: FirstPoint.row, 
                firstPointCol : FirstPoint.col,
                secondPointRow : SecondPoint.row,
                secondPointCol : SecondPoint.col
            }
    };
    
    self.stopSound = function () {
        console.log('StopSound!!!');
        BManStepAudio.pause();
        BManStepAudio.loop = false;
        BManStepAudio = null;

        BManDestroyAudio = null;
    };

    function StepSound() {
        if (self.SpeedX || self.SpeedY)
        {
            //BManStepAudio.currentTime = 0;
            BManStepAudio.play();
        }
        else
            BManStepAudio.pause();
    }

    function DestroySound() {
        BManDestroyAudio.currentTime = 0;
        BManDestroyAudio.play();
    }
}