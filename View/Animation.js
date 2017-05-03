'use strict';
function TSpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // вычисление количества кадров в строке после загрузки изображения
    var self = this;
    this.image.onload = function() {
        self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };

    this.image.src = path;
}

function TAnimation(sprite, startFrame, endFrame, ctx, canvasWidth, canvasHeight, bombermanView) {
    var Context = ctx;
    var CanvasWidth = canvasWidth;
    var CanvasHeight = canvasHeight;
    var BombermanView = bombermanView;

    var animationSequence = [];
    var currentFrame = 0;
    var counter = 0;

    // создание последовательности из номеров кадров анимации
    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);

    // обновление анимации
    this.Update = function () {
        // если подошло время смены кадра, то меняем
        if (counter == (BombermanView.frameSpeed - 1))
            currentFrame = (currentFrame + 1) % animationSequence.length;
        // обновление счетчика ожидания
        counter = (counter + 1) % BombermanView.frameSpeed;
    };

    this.Draw = function () {
        if ( sprite.framesPerRow )
        {
            Context.clearRect(0,0,64,64);
            Context.drawImage(sprite.image,0,0,sprite.frameWidth*sprite.framesPerRow,sprite.frameHeight,
                -currentFrame*CanvasWidth,0,CanvasWidth*sprite.framesPerRow,CanvasHeight);
        }
    };
}