'use strict';
function TBombermanController() {
    var BombermanModel = null;
    var GameDom = null;
    var TouchUpButton, TouchDownButton, TouchLeftButton, TouchRightButton, TouchBombButton;

    var pressedKeys = {};
    var keyCodeUp = 87;
    var keyCodeDown = 83;
    var keyCodeLeft = 65;
    var keyCodeRight = 68;
    var keyCodePlaceBomb = 32;
    var controlKeys = {65:1, 68:1, 87:1, 83:1, 32:1};
    
    this.Init = function(Model, Game) {
        BombermanModel = Model;
        GameDom = Game;

        TouchUpButton = GameDom.querySelector('.up');
        TouchDownButton = GameDom.querySelector('.down');
        TouchLeftButton = GameDom.querySelector('.left');
        TouchRightButton = GameDom.querySelector('.right');
        TouchBombButton = GameDom.querySelector('.controls-bomb');
    };

    document.onkeydown = function (event) {
        if (event.keyCode in pressedKeys) return;

        if ( event.keyCode in controlKeys ) pressedKeys[event.keyCode] = true;
        if ( event.keyCode == keyCodeLeft) BombermanModel.SetSpeedX(-0.4);
        if ( event.keyCode == keyCodeRight) BombermanModel.SetSpeedX(0.40);

        if ( event.keyCode == keyCodeUp) BombermanModel.SetSpeedY(-0.4);
        if ( event.keyCode == keyCodeDown) BombermanModel.SetSpeedY(0.4);

        if ( event.keyCode == keyCodePlaceBomb) BombermanModel.PlaceBomb();
    };

    document.onkeyup = function (event) {
        if ( !(event.keyCode in pressedKeys) ) return;
        if ( event.keyCode in pressedKeys ) delete pressedKeys[event.keyCode];
        if ( event.keyCode == keyCodePlaceBomb ) return;

        BombermanModel.SetSpeedX(0);
        BombermanModel.SetSpeedY(0);
    };

    document.addEventListener('touchstart', function(event) {
        //event.preventDefault();
        //event.stopPropagation();
        /* Код обработки события*/

        var target = event.target;
        var isVibrate = false;

        if ( navigator.vibrate ) isVibrate = true;

        //if ( !target.children.classList.contains('controls-button') ) return;
        //if ( !target.classList.contains('controls-bomb') ) return;
        //console.log(target.classList);


        if ( target.classList.contains('up') )
        {
            BombermanModel.SetSpeedY(-0.4);
            target.classList.add('controls-button-pressed');


            if ( isVibrate ) window.navigator.vibrate(50);
        }

        if ( target.classList.contains('down') )
        {
            BombermanModel.SetSpeedY(0.4);
            target.classList.add('controls-button-pressed');

            if ( isVibrate ) window.navigator.vibrate(50);
        }

        if ( target.classList.contains('left') )
        {
            BombermanModel.SetSpeedX(-0.4);
            target.classList.add('controls-button-pressed');

            if ( isVibrate ) window.navigator.vibrate(50);
        }

        if ( target.classList.contains('right') )
        {
            BombermanModel.SetSpeedX(0.4);
            target.classList.add('controls-button-pressed');

            if ( isVibrate ) window.navigator.vibrate(50);
        }

        if ( target.parentNode.classList.contains('controls-bomb') )
        {
            target.parentNode.classList.add('controls-bomb-pressed');
            BombermanModel.PlaceBomb();

            if ( isVibrate ) window.navigator.vibrate(50);

        }

    }, false);

    document.addEventListener('touchend', function(event) {
        //event.preventDefault();
        //event.stopPropagation();
        /* Код обработки события*/
        var target = event.target;
        //if ( !target.classList.contains('controls-button') ) return;
        //if ( !target.classList.contains('controls-bomb') ) return;
        if ( target.parentNode.classList.contains('controls-bomb') )
        {
            target.parentNode.classList.remove('controls-bomb-pressed');
            return;
        }

        target.classList.remove('controls-button-pressed');
        BombermanModel.SetSpeedY(0);
        BombermanModel.SetSpeedX(0);

    }, false);

    //Mouse control
    var PriorClientX = 0;
    var PriorClientY = 0;
    document.onmousedown = function () {
        //console.log('mousedown');

        document.onmousemove = function (e) {
            if (BombermanModel.SpeedX || BombermanModel.SpeedY) return;
            if (Math.abs(e.clientX - PriorClientX) > Math.abs(e.clientY - PriorClientY))
            {
                if ( Math.abs(e.clientX - PriorClientX) < 20 ) return;
                if (e.clientX - PriorClientX > 0) BombermanModel.SetSpeedX(0.4);
                else BombermanModel.SetSpeedX(-0.4);
            }
            else {
                if ( Math.abs(e.clientY - PriorClientY) < 20 ) return;
                if (e.clientY - PriorClientY > 0) BombermanModel.SetSpeedY(0.4);
                else BombermanModel.SetSpeedY(-0.4);
            }

            PriorClientX = e.clientX;
            PriorClientY = e.clientY;

            return false;
        };
        return false;
    };

    document.onmouseup = function () {
        //console.log('mouseup');
        document.onmousemove = null;

        BombermanModel.SetSpeedY(0);
        BombermanModel.SetSpeedX(0);

        return false;
    };

    /*document.oncontextmenu = function (event) {
        event.preventDefault();
        BombermanModel.PlaceBomb();
        return false;
    }*/
}
