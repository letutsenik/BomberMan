'use strict';

function TGame() {
    var self = this;

    var GhostAmount = 3;
    var BombermanLifes = 3; //3 lives
    var RoundTime = 200; // sec
    var RequestAnimationFrame = null;
    var CancelAnimationFrame = null;
    var TimerId = null;

    /********Game Info******/
    var Promptwrapper = document.querySelector('.prompt-wrapper');
    var GameInfo = document.querySelector('.info');
    var GameDomElem = document.querySelector('.game');
    var NewLevelDomElem = document.querySelector('.new-level');
    var GameOverDomElem = document.querySelector('.game-over');
    var GameLevelNumDomElem = document.querySelector('.level-number');

    var timerObj = GameInfo.querySelector('.time');
    var Lifes = GameInfo.querySelector('.life');
    var Score = GameInfo.querySelector('.score');

    Lifes.innerHTML = BombermanLifes;
    
    self.gameOver = false;

    /********Game Units******/
    var SceneModel = null;
    var SceneView = null;

    var GhostsModelA = null;
    var GhostsViewA = null;

    var BombermanModel = null;
    var BombermanView = null;
    var BombermanController = null;

    var BombModel = null;
    var BombView = null;

    var FireModel = null;
    var FireView = null;


    /********Game Timer******/
    var Timer = {
        counter : 0,

        Init : function () {
            timerObj.innerHTML = RoundTime.toString();
        },

        Update : function () {
            // обновление счетчика ожидания
            this.counter = (this.counter + 1) % 60;
            if (this.counter == 0) +timerObj.innerHTML--;
            if (+timerObj.innerHTML == 0) self.GameOver();
        }
    };


    /********Level Sounds******/
    var GameAudio = new Audio;
    var StartLevelAudio = new Audio;
    var GameOverAudio = new Audio;


    if ( GameAudio.canPlayType("audio/mpeg") == "probably" || GameAudio.canPlayType("audio/mpeg") == "maybe")
    {
        GameAudio.src = "Sounds/gamesound.mp3";
        StartLevelAudio.src = "Sounds/startlevel.mp3";
        GameOverAudio.src = "Sounds/gameover.mp3";
    }
    else 
    {
        GameAudio.src = "Sounds/gamesound.ogg";
        StartLevelAudio.src = "Sounds/startlevel.ogg";
        GameOverAudio.src = "Sounds/gameover.ogg";
    } 
    
    //console.log( GameAudio.canPlayType("audio/ogg; codecs=vorbis") );
    //console.log( GameAudio.canPlayType("audio/mpeg") );
    

    GameAudio.loop = true;

    function StartNewLevel() {
        GameAudioSound();
        Timer.Init();

        self.GhostsLeft = GhostAmount;
        console.log('GhostsLeft = ' + self.GhostsLeft);

        SceneModel = new TSceneModel();
        SceneView = new TSceneView();

        SceneModel.Init(SceneView);
        SceneView.Init(SceneModel, document.querySelector('.scene'));

        SceneModel.Prepare();
        SceneModel.UpdateView();

        // Ghosts
        GhostsModelA = [];
        GhostsViewA = [];
        for (var i = 0; i < GhostAmount; i++) {
            var GhostModel = new TGhostModel();
            var GhostView = new TGhostView();

            GhostModel.Init(GhostView, SceneModel, self);
            GhostView.Init(GhostModel, SceneModel, document.querySelector('.scene'));

            GhostModel.Prepare();
            GhostModel.UpdateView();

            GhostsModelA.push(GhostModel);
            GhostsViewA.push(GhostView);
        }

        // Bomberman
        BombermanModel = new TBombermanModel();
        BombermanView = new TBombermanView();
        BombermanController = new TBombermanController();

        //Bomb
        BombModel = new TBombModel();
        BombView = new TBombView();

        //Fire
        FireModel = new TFireModel();
        FireView = new TFireView();

        // Bomberman
        BombermanModel.Init(BombermanView, SceneModel, BombModel, GhostsModelA, self);
        BombermanView.Init(BombermanModel, SceneModel, document.querySelector('.scene'));
        BombermanController.Init(BombermanModel, document.querySelector('.game'));

        BombermanModel.Prepare();
        BombermanModel.UpdateView();

        //Bomb
        BombModel.Init(BombView, SceneModel, FireModel);
        BombView.Init(BombModel, SceneModel, document.querySelector('.scene'));

        //BombModel.UpdateView(); //!!!

        //Fire
        FireModel.Init(FireView, SceneModel, BombermanModel, GhostsModelA);
        FireView.Init(FireModel, SceneModel, document.querySelector('.scene'));

        FireModel.UpdateView(); //!!!


        RequestAnimationFrame =
            // находим, какой requestAnimationFrame доступен
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            // ни один не доступен - будем работать просто по таймеру
            function (callback) {
                TimerId = window.setTimeout(callback, 1000 / 60);
            };

        //console.log(RequestAnimationFrame);
        console.log(typeof RequestAnimationFrame);

        // планирует следующий вызов обновления
        function PlanNextTick() {
            if (self.GhostsLeft )
                RequestAnimationFrame( Tick );
        }

        function Tick() // вызывается 60 раз в секунду
        {
            if (SceneModel) {

                //SceneModel.UpdateView();

                for (var i = 0; i < GhostAmount; i++) {
                    GhostsModelA[i].FlyTick();
                    GhostsModelA[i].UpdateView();
                }

                BombermanModel.FlyTick();
                BombermanModel.UpdateView();

                BombModel.UpdateView();

                FireModel.UpdateView();

                Timer.Update();

                var levelPassed = isLevelPassed();

                if (levelPassed) {
                    //console.log('Level Passed!!!');
                    endLevel();
                } else
                //console.log("Level isn't Passed!!!");

                // запланируем следующий вызов обновления
                    PlanNextTick();
            }
        }

        function Start() {
            PlanNextTick();
        }

        Start();
    }

    function endLevel() {
        console.log('End Level!!!');
        CancelAnimationFrame =
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame;

        if (typeof RequestAnimationFrame === 'function')
            clearInterval(TimerId);
        else
            CancelAnimationFrame(RequestAnimationFrame);

        /*console.log(GhostsViewA);
         for (var i = 0; i < GhostsViewA.length; i++)
         GhostsViewA[i].RemoveElem();*/


        GameAudio.pause();
        BombermanModel.stopSound();

        setTimeout(function () {
            GameDomElem.style.display = 'none';
            NewLevelDomElem.style.display = 'block';
            StartLevelSound();

            SceneModel.Clear();
            SceneView.Update();

            FireView.Clear();
            BombermanView.MoveSceneToStart();

           +GameLevelNumDomElem.innerHTML++;

            //////////////////////////////
            SceneModel = null;
            SceneView = null;

            for (var i = 0; i < GhostsModelA.length; i++) {
                GhostsModelA[i] = null;
                //GhostsViewA[i].RemoveElem();
                GhostsViewA[i] = null;
            }

            GhostsModelA = null;
            GhostsViewA = null;

            BombermanModel = null;
            BombermanView = null;
            BombermanController = null;

            BombModel = null;
            BombView = null;

            FireModel = null;
            FireView = null;
            //////////////////////////////////////

        }, 1000);

        GhostAmount++;

        setTimeout(function () {
            GameDomElem.style.display = 'block';
            NewLevelDomElem.style.display = 'none';
            StartNewLevel();
        }, 5000);

    }

    self.StartGame = function () {

        GameDomElem.style.display = 'none';
        NewLevelDomElem.style.display = 'block';

        Score.innerHTML = 0;
        Lifes.innerHTML = BombermanLifes;
        GameLevelNumDomElem.innerHTML = 1;


        //SoundInit();
        StartLevelSound(); // Закоментировать в EI !!!!!????????

        setTimeout(function () {
            GameDomElem.style.display = 'block';
            NewLevelDomElem.style.display = 'none';
            StartNewLevel();
        }, 4000);


    };

    /*self.StartGame = function () {
        //GameDomElem.style.display = 'block';
        NewLevelDomElem.style.display = 'none';
        StartNewLevel();

    };*/

    self.GameOver = function () {
        if (typeof RequestAnimationFrame === 'function')
            clearInterval(TimerId);
        else
            CancelAnimationFrame(RequestAnimationFrame);

        GameAudio.pause();



        self.gameOver = true;

        setTimeout(function () {
            GameDomElem.style.display = 'none';
            GameOverDomElem.style.display = 'block';
            GameOverSound();

            SceneModel.Clear();
            SceneView.Update();

            FireView.Clear();
            BombermanView.MoveSceneToStart();

            //////////////////////////////
            SceneModel = null;
            SceneView = null;

            for (var i = 0; i < GhostsModelA.length; i++) {
                GhostsModelA[i] = null;
                GhostsViewA[i].RemoveElem();
                GhostsViewA[i] = null;
            }

            GhostsModelA = null;
            GhostsViewA = null;

            BombermanModel = null;
            BombermanView = null;
            BombermanController = null;

            BombModel = null;
            BombView = null;

            FireModel = null;
            FireView = null;
            //////////////////////////////////////
        }, 1000);


        
        setTimeout(function () {
            //alert('ShowPrompt!!!');
            GameOverDomElem.style.display = 'none';
            Promptwrapper.style.display = 'block';
            Promptwrapper.querySelector('.prompt-wrapper-text').focus();
        }, 3000);
    };
    
    self.StopGame = function () {
        if (typeof RequestAnimationFrame === 'function')
            clearInterval(TimerId);
        else
            CancelAnimationFrame(RequestAnimationFrame);

        GameAudio.pause();

        SceneModel.Clear();
        SceneView.Update();

        FireView.Clear();
        BombermanView.MoveSceneToStart();

        setTimeout(function () {
            //////////////////////////////
            SceneModel = null;
            SceneView = null;

            for (var i = 0; i < GhostsModelA.length; i++) {
                GhostsModelA[i] = null;
                GhostsViewA[i].RemoveElem();
                GhostsViewA[i] = null;
            }

            GhostsModelA = null;
            GhostsViewA = null;

            BombermanModel = null;
            BombermanView = null;
            BombermanController = null;

            BombModel = null;
            BombView = null;

            FireModel = null;
            FireView = null;
            //////////////////////////////////////
        }, 1000);

    };

    /*self.GetLifeAmount = function () {
        return Lifes.innerHTML;
    };*/

    self.LoseLife = function () {
        +Lifes.innerHTML--;
        if ( +Lifes.innerHTML == 0)
            Game.GameOver();
    };

    self.AddScore = function () {
        Score.innerHTML = +Score.innerHTML + 10;
        self.GhostsLeft--;
        console.log('GhostsLeft = ' + self.GhostsLeft);
    };

    function isLevelPassed() {
        return !self.GhostsLeft;
    }

    function SoundInit() {
        StartLevelAudio.play(); // запускаем звук
        StartLevelAudio.pause(); // и сразу останавливаем

        GameOverAudio.play();
        GameOverAudio.pause();
    }

    function GameAudioSound() {
        GameAudio.currentTime=0; // в секундах
        GameAudio.play();
    }

    function StartLevelSound() {
        StartLevelAudio.currentTime=0; // в секундах
        StartLevelAudio.play();
    }

    function GameOverSound() {
        GameOverAudio.currentTime=0; // в секундах
        GameOverAudio.play();
    }
}