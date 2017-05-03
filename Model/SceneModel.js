'use strict';
function TSceneModel() {
    var self = this;
    self.HorzBlocks = 31; // блоков в комнате по ширине
    self.VertBlocks = 11; // блоков в комнате по высоте
    self.BlockWidth = 10; // ширина блока
    self.BlockHeight = 10; // высота блока
    self.NumExplodableBlock = 30; // количество блоков
    self.BlocksA = null; // здесь будет массив строк,
    // каждая строка - массив ячеек
    // каждая ячейка - хэш
    // { kind:(вид 0-2), elem:(DOM-элемент) }

    self.Width = null; // они будут рассчитаны чуть позже
    self.Height = null;

    var SceneView = null;

    self.Init = function(View) {
        SceneView = View;
    };

    self.UpdateView = function() {
        if ( SceneView )
            SceneView.Update();
    };

    // готовит сцену к первому использованию
    self.Prepare = function() {
        // рассчитываем размеры в пикселях
        self.Width = self.HorzBlocks * self.BlockWidth;
        self.Height = self.VertBlocks * self.BlockHeight;

        // очищаем сцену - массив кирпичей
        self.BlocksA = [];
        for (var R = 0; R < self.VertBlocks; R++) {
            var RowA = [];
            for (var C = 0; C < self.HorzBlocks; C++)
                RowA.push({kind: 0, elem: null});
            self.BlocksA.push(RowA);
        }


        // make Solid Blocks
        for ( var i = 0; i < self.HorzBlocks; i++ ) {
            self.BlocksA[0][i].kind = 1;
            self.BlocksA[self.VertBlocks-1][i].kind = 1;
        }

        for ( var i = 1; i < self.VertBlocks-1; i++ ) {
            self.BlocksA[i][0].kind = 1;
            self.BlocksA[i][self.HorzBlocks-1].kind = 1;
        }

        for ( var j = 2; j <= self.VertBlocks - 3; j+=2 ) {
            for ( var k = 2; k <= self.HorzBlocks - 3; k+=2 ) {
                self.BlocksA[j][k].kind = 1;
            }
        }

        // make Explodable Blocks
        var b = 0;
        while (b < self.NumExplodableBlock) {
            //Math.floor(Math.random()*(M-N+1))+N
            var BlockX = Math.floor(Math.random()*(self.HorzBlocks-2 - 1 + 1))+ 1;
            var BlockY = Math.floor(Math.random()*(self.VertBlocks-2 - 1 + 1))+ 1;
            if ( !self.BlocksA[BlockY][BlockX].kind ) {
                self.BlocksA[BlockY][BlockX].kind = 2;
                b++;
            }
        }
    };

    // возвращает экранные координаты кирпича
    self.BlockToScreen = function(R,C) {
        var Left = C * self.BlockWidth;
        var Top = R * self.BlockHeight;
        return { left:Left, top:Top,
            right: Left + self.BlockWidth,
            bottom: Top + self.BlockHeight };
    };

    // возвращает строку и столбец кирпича
    self.ScreenToBlock = function(X,Y)
    {
        var Col = Math.floor(X/self.BlockWidth);
        var Row = Math.floor(Y/self.BlockHeight);
        return { row:Row, col:Col };
    };

    self.GetImpactX = function(ToX,Ymin,Ymax)
    {
        // FromX может быть и больше чем ToX!
        // возвращает true, если в ToX есть стена или кирпич
        // в интервале Ymin-Ymax

        // проверяем столкновение с кирпичами
        var b = 0;
        for ( var R = 0; R < self.VertBlocks; R++ )
            for ( var C = 0; C < self.HorzBlocks; C++ )
            {
                var CellH = self.BlocksA[R][C];
                if ( CellH.kind )
                {
                    /*if ( CellH.kind == 4)
                    {
                        console.log('R= ' + R);
                        console.log('C= ' + C);
                    }*/


                    var CoordsH = self.BlockToScreen(R,C);
                    // проверим что элемент на одной
                    // горизонтали с кирпичом
                    /*var DeltaY = undefined;
                    if ( ( (Ymin == CoordsH.top) && (Ymax == CoordsH.bottom) ) ||
                        ( (CoordsH.top>Ymin) && (CoordsH.top<Ymax-2) ) ||
                        ( (CoordsH.bottom>Ymin+2) && (CoordsH.bottom<Ymax) ) )
                     {
                         DeltaY = 1000;
                         console.log('DeltaY= ' + DeltaY);
                     if ( CoordsH.left == ToX )
                        return true;
                     if ( CoordsH.right == ToX )
                        return true;
                     }*/

                    var DeltaY = undefined;
                    var IsNear = false;
                    if ( ( (Ymin == CoordsH.top) && (Ymax == CoordsH.bottom) ) ) DeltaY = 10;
                    if ( (CoordsH.top>Ymin) && (CoordsH.top<Ymax) )
                    {
                        DeltaY = Math.round( (CoordsH.top - Ymax)*10) / 10;
                        //--
                        if ( self.BlocksA[R-1][C].kind ) IsNear = true;

                    }
                    if ( (CoordsH.bottom>Ymin) && (CoordsH.bottom<Ymax) )
                    {
                        DeltaY = Math.round( (CoordsH.bottom - Ymin)*10 ) / 10 ;
                        //++
                        if ( self.BlocksA[R+1][C].kind ) IsNear = true;
                        //console.log(DeltaY);
                    }
                    
                    if (DeltaY)
                    {

                        //console.log('DeltaY= ' + DeltaY);
                        if ( CoordsH.left == ToX )
                            return {deltaY: DeltaY, isNear: IsNear};
                        if ( CoordsH.right == ToX )
                            return {deltaY: DeltaY, isNear: IsNear};
                    }
                }
            }
        /* проверяем столкновение со стенами
        if ( ToX > self.Width )
            return true;
        if ( ToX < 0 )
            return true;*/
        return false; // нет столкновения
    };

    self.GetImpactY = function(ToY,Xmin,Xmax)
    {
        // возвращает true, если в ToY есть стена или кирпич
        // в интервале Xmin-Xmax
        
        // проверяем столкновение с кирпичами
       // var b = 0;
        for ( var R = 0; R < self.VertBlocks; R++ )
            for ( var C = 0; C < self.HorzBlocks; C++ )
            {

                var CellH = self.BlocksA[R][C];
                if ( CellH.kind )
                {
                    var CoordsH = self.BlockToScreen(R,C);
                    // проверим что элемент
                    // на одной вертикали с кирпичом
                    /*if ( ( (Xmin == CoordsH.left) && (Xmax == CoordsH.right) ) ||
                        ( (CoordsH.left>Xmin) && (CoordsH.left<Xmax-2) ) ||
                        ( (CoordsH.right>Xmin+2) && (CoordsH.right<Xmax) ))
                    {
                        if ( CoordsH.top == ToY )
                            return true;
                        //console.log('Удар!!!');
                        if ( CoordsH.bottom == ToY )
                            return true;
                        //console.log('Удар!!!');
                    }*/
                    
                    var DeltaX = undefined;
                    var IsNear = false;
                    if ( ( (Xmin == CoordsH.left) && (Xmax == CoordsH.right) ) ) DeltaX = 10;
                    if ( (CoordsH.left>Xmin) && (CoordsH.left<Xmax) )
                    {
                        DeltaX = Math.round( (CoordsH.left - Xmax)*10) / 10;
                        if ( self.BlocksA[R][C-1].kind ) IsNear = true;
                        //--

                    }
                    if ( (CoordsH.right>Xmin) && (CoordsH.right<Xmax) )
                    {
                        DeltaX = Math.round( (CoordsH.right - Xmin)*10 ) / 10 ;
                        if ( self.BlocksA[R][C+1].kind ) IsNear = true;
                        //++
                        //console.log(DeltaX);
                    }


                    if (DeltaX) //console.log('DeltaX= ' + DeltaX);
                    {

                        //console.log('DeltaX= ' + DeltaX);
                        if ( CoordsH.top == ToY )
                            return {deltaX: DeltaX, isNear: IsNear};
                        if ( CoordsH.bottom == ToY )
                            return {deltaX: DeltaX, isNear: IsNear};
                    }

                    /*if ( ( (Xmin == CoordsH.left) && (Xmax == CoordsH.right) ) ||
                        ( (CoordsH.left>Xmin) && (CoordsH.left<Xmax) ) ||
                        ( (CoordsH.right>Xmin) && (CoordsH.right<Xmax) ))
                    {
                        var DeltaX = Math.min(CoordsH.left - Xmin, Xmax - CoordsH.right);

                        if ( CoordsH.top == ToY )
                            return {deltaX: DeltaX};
                            //console.log('Удар!!!');
                        if ( CoordsH.bottom == ToY )
                            return {deltaX: DeltaX};
                            //console.log('Удар!!!');
                    }*/
                }
            }
        //console.log('b= ' + b);
        /* проверяем столкновение со стенами
        if ( ToY > self.Height )
            return true;
        if ( ToY < 0 )
            return true;
        return false; // нет столкновения*/
    };
    
    self.Clear = function () {
        for ( var R = 0; R < self.VertBlocks; R++ )
            for ( var C = 0; C < self.HorzBlocks; C++ ) {

                var CellH = self.BlocksA[R][C];
                CellH.kind = 0;
            }
    }

}