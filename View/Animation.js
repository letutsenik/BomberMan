'use strict';
function TSpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // вычисление количества кадров в строке после загрузки изображения
    const self = this;
    this.image.onload = function() {
        self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };

    this.image.src = path;
}

class TAnimation {
    constructor(sprite, startFrame, endFrame, ctx, CanvasWidth, CanvasHeight, view) {
        this._Context = ctx;
        this._CanvasWidth = CanvasWidth;
        this._CanvasHeight = CanvasHeight;
        this._view = view;
        this._animationSequence = [];
        this._currentFrame = 0;
        this._counter = 0;
        this._sprite = sprite;
        // создание последовательности из номеров кадров анимации
        for (let frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
            this._animationSequence.push(frameNumber);
    }

    // обновление анимации
    Update () {
        // если подошло время смены кадра, то меняем
        if (this._counter === (this._view._frameSpeed - 1))
            this._currentFrame = (this._currentFrame + 1) % this._animationSequence.length;
        // обновление счетчика ожидания
        this._counter = (this._counter + 1) % this._view._frameSpeed;
    };

    Draw () {
        if ( this._sprite.framesPerRow )
        {
            this._Context.clearRect(0, 0, 64, 64);
            this._Context.drawImage(this._sprite.image,0,0,this._sprite.frameWidth*this._sprite.framesPerRow,this._sprite.frameHeight,
                - this._currentFrame*this._CanvasWidth,0,this._CanvasWidth*this._sprite.framesPerRow,this._CanvasHeight);
        }
    };
}
