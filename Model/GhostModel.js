/**
 * Created by Dima on 11.04.2017.
 */
'use strict';
function TGhostModel() {
    var self = this;
    var GhostView = null;
    var SceneModel = null;
    self.Elem = null;//!!!!
    var Game = null;
    
    self.Init = function(View, SceneMod, game) {
        GhostView = View;
        SceneModel = SceneMod;
        Game = game;
    };

    self.UpdateView = function() {
        if ( GhostView )
            GhostView.Update();
    };

    self.Width = 10; // размеры ghost
    self.Height = 10;

    //self.AnimationDirect = 'stop';

    // Sounds
    var GhostDestroyAudio = new Audio;

    if ( GhostDestroyAudio.canPlayType("audio/mpeg")== "probably" || GhostDestroyAudio.canPlayType("audio/mpeg") == "maybe")
        GhostDestroyAudio.src = "Sounds/ghostdestroy.mp3";

    else
        GhostDestroyAudio.src = "Sounds/ghostdestroy.ogg";

    /*self.DestroySoundInit = function () {
        GhostDestroyAudio.play(); // запускаем звук
        GhostDestroyAudio.pause(); // и сразу останавливаем
    };

    self.DestroySoundInit(); ////!!!!*/


    var GhostSpeeds = [0, 0.2, -0.2];
    // Начальная инициализация скорости
    self.SpeedX = GhostSpeeds[Math.floor(Math.random()*GhostSpeeds.length)];
    do {
        self.SpeedY = GhostSpeeds[Math.floor(Math.random()*GhostSpeeds.length)];
    }
    while ( Math.abs(self.SpeedY) == Math.abs(self.SpeedX) );

    //Animation
    if (self.SpeedX)
    {
        self.AnimationDirect = (self.SpeedX > 0) ? 'right' : 'left';
    } else {
        self.AnimationDirect = (self.SpeedY > 0) ? 'down' : 'up';
    }

    //console.log('SpeedX= ' + self.SpeedX);
    //console.log('SpeedY= ' + self.SpeedY);
    
    // сгенерируем положение ghost, но чтоб
    // не налазил на кирпичи

    self.Prepare = function() {
        while (true) {
            var GhostX = Math.floor(Math.random() * (SceneModel.HorzBlocks - 2 - 1 + 1)) + 1;
            var GhostY = Math.floor(Math.random() * (SceneModel.VertBlocks - 2 - 1 + 1)) + 1;
            if (!SceneModel.BlocksA[GhostY][GhostX].kind) {
                //SceneModel.BlocksA[GhostY][GhostX].kind = 3; // !!!
                var CoordsH = SceneModel.BlockToScreen(GhostY, GhostX);
                self.PosX = CoordsH.left;
                self.PosY = CoordsH.top;
                //console.log(CoordsH.left);
                //console.log(CoordsH.top);
                break;
            }
        }

    };

    self.FlyTick = function() {
        if (!self.PosX) return;
        
        if (self.PosX % SceneModel.BlockWidth == 0 &&
        self.PosY % SceneModel.BlockHeight == 0)
        {
            //вероятность смены направления движения
            var chance = Math.random();
            if (chance < 0.5) // 50%
                //console.log('SpeedChange!!!');
                self.SpeedX = GhostSpeeds[Math.floor(Math.random()*GhostSpeeds.length)];
                do {
                    self.SpeedY = GhostSpeeds[Math.floor(Math.random()*GhostSpeeds.length)];
                }
                while (Math.abs(self.SpeedY) == Math.abs(self.SpeedX));
        }

        var ImpactXLeft = SceneModel.GetImpactX(self.PosX, self.PosY, self.PosY + self.Height);
        var ImpactXRight = SceneModel.GetImpactX(self.PosX + self.Width,
            self.PosY, self.PosY + self.Height);
        //console.log('ImpactXLeft = ' + ImpactXLeft);
        //console.log('ImpactXRight = ' + ImpactXRight);
        if ( ImpactXLeft && self.SpeedX<0 )
        {
            // меняем скорость по Y на противоположную
            self.SpeedX=-self.SpeedX;
            /*self.SpeedX = 0;
            self.SpeedY = 0.2;*/
        }
        if ( ImpactXRight && self.SpeedX>0 )
        {
            // меняем скорость по Y на противоположную
            self.SpeedX=-self.SpeedX;
        }
        if ( ImpactXLeft && ImpactXRight )
        {
            self.SpeedX = 0;
        }

        self.PosX = Math.round( (self.PosX + self.SpeedX)*10 ) / 10;
       /*
        // слева ударится?
        var ImpactX = SceneModel.GetImpactX(self.PosX, self.PosY, self.PosY + self.Height);
        if ( !ImpactX ) // слева не ударится, а справа?
            ImpactX = SceneModel.GetImpactX(self.PosX + self.Width, self.PosY, self.PosY + self.Height);
        if ( ImpactX )
        {
            // меняем скорость по X на противоположную
            self.SpeedX=-self.SpeedX;
        }
        self.PosX = Math.round( (self.PosX + self.SpeedX)*10 ) / 10;*/

        var ImpactYTop = SceneModel.GetImpactY(self.PosY, self.PosX, self.PosX + self.Width);
        var ImpactYBottom = SceneModel.GetImpactY(self.PosY + self.Height,
            self.PosX, self.PosX + self.Width);

        if ( ImpactYTop && self.SpeedY<0 )
        {
            // меняем скорость по Y на противоположную
            self.SpeedY=-self.SpeedY;
        }
        if ( ImpactYBottom && self.SpeedY>0 )
        {
            // меняем скорость по Y на противоположную
            self.SpeedY=-self.SpeedY;
        }
        if ( ImpactYTop && ImpactYBottom )
        {
            self.SpeedY = 0;
        }

        self.PosY = Math.round( (self.PosY + self.SpeedY)*10 ) / 10;

        //Animation
        if (self.SpeedX)
        {
            self.AnimationDirect = (self.SpeedX > 0) ? 'right' : 'left';
        } else {
            self.AnimationDirect = (self.SpeedY > 0) ? 'down' : 'up';
        }
/*
        // сверху ударится?
        var ImpactY = SceneModel.GetImpactY(self.PosY, self.PosX, self.PosX + self.Width);

        if ( !ImpactY ) // сверху не ударится, а снизу?
            ImpactY = SceneModel.GetImpactY(self.PosY + self.Height, self.PosX, self.PosX + self.Width);
        if ( ImpactY )
        {
            // меняем скорость по Y на противоположную
            self.SpeedY=-self.SpeedY;
        }
        self.PosY = Math.round( (self.PosY + self.SpeedY)*10 ) / 10;*/
    };
    
    self.Destroy = function () {
        self.PosX = undefined;
        self.PosY = undefined;
        GhostView.RemoveElem();
        Game.AddScore();

        DestroySound();
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
            secondPointRow :SecondPoint.row,
            secondPointCol :SecondPoint.col
        }
    };


    function DestroySound()
    {
        GhostDestroyAudio.currentTime=0; // в секундах
        GhostDestroyAudio.play();
    }
}