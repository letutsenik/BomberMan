'use strict';
function TBombModel() {
    var self = this;
    var BombView = null;
    var SceneModel = null;
    var FireModel = null;
    
    self.isBombPlaced = false;

    // Sounds
    var BombTicTakAudio = new Audio;
    var ExplosionAudio = new Audio;
    // результат canPlayType: "probably" - скорее всего, "maybe" - неизвестно, "" - нет
    console.log( BombTicTakAudio.canPlayType("audio/ogg; codecs=vorbis") );
    console.log( BombTicTakAudio.canPlayType("audio/mpeg") );

    if ( BombTicTakAudio.canPlayType("audio/mpeg")== "probably" || BombTicTakAudio.canPlayType("audio/mpeg") == "maybe")
    {
        BombTicTakAudio.src = "Sounds/tictac.mp3";
        ExplosionAudio.src = "Sounds/explosion.mp3";
    }

    else
    {
        BombTicTakAudio.src = "Sounds/tictac.ogg";
        ExplosionAudio.src = "Sounds/explosion.ogg";
    }

    /*self.SoundInit = function () {
        BombTicTakAudio.play();
        BombTicTakAudio.pause();

        ExplosionAudio.play();
        ExplosionAudio.pause();
    };

    self.SoundInit();*/



    self.Init = function (View, SceneMod, FireMod) {
        BombView = View;
        SceneModel = SceneMod;
        FireModel = FireMod;
    };

    self.UpdateView = function () {
        if (BombView)
            BombView.Update();
    };

    self.Width = 10; // размеры bomb
    self.Height = 10;

    self.InitBombCoords = function (BombX, BombY) {

        self.isBombPlaced = true;
        self.PosX = BombX;
        self.PosY = BombY;

        TicTakSound();
    };

    self.BombExplosion = function () {
        self.isBombPlaced = false;
        FireModel.InitFireCoords(self.PosX, self.PosY);
        FireModel.DestroyBlocks();
        FireModel.DestroyGhost();
        FireModel.DestroyBomberMan();

        SceneModel.UpdateView();

        self.PosX = undefined;
        self.PosY = undefined;

        ExplosionSound();

        if ( navigator.vibrate ) // есть поддержка Vibration API?
            window.navigator.vibrate(300); // вибрация 300мс

        setTimeout(function () {
            FireModel.FireBlowOut();
        }, 500);
        
    };

    function ExplosionSound() {
        ExplosionAudio.currentTime = 0;
        ExplosionAudio.play();
    }

    function TicTakSound() {
        BombTicTakAudio.currentTime = 0;
        BombTicTakAudio.play();
    }
}
