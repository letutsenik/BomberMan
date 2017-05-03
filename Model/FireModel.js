'use strict';
function TFireModel() {
    var self = this;
    var FireView = null;
    var SceneModel = null;
    var BombermanModel = null;
    var GhostsModelA = null;

    self.FireCoordsA = null;

    self.Init = function (View, SceneMod, BombermanMod, GhostsMod) {
        FireView = View;
        SceneModel = SceneMod;
        BombermanModel = BombermanMod;
        GhostsModelA = GhostsMod;
    };

    self.UpdateView = function () {
        if (FireView)
            FireView.Update();
    };

    self.Width = 10; // размеры bomb
    self.Height = 10;

    self.InitFireCoords = function (FireCenterX, FireCenterY) { ///!!!!!!
        var CoordsCenter = SceneModel.ScreenToBlock(FireCenterX, FireCenterY);
        var CoordH1, CoordH2, CoordH3, CoordH4;
        var FirePlaceType;
        //console.log('FireRow = ' + CoordsCenter.row );
        //console.log('FireCol = ' + CoordsCenter.col );
        self.FireCoordsA = [];
        self.FireCoordsA[0] = {X:FireCenterX, Y:FireCenterY};

        if (CoordsCenter.row%2 !=0 && CoordsCenter.col%2 !=0)
        {
            FirePlaceType = 1; // Тип 1
            if (CoordsCenter.row == 9 && CoordsCenter.col%2 !=0) FirePlaceType = 2; // Тип 2 //!!!
            if (CoordsCenter.row == 1 && CoordsCenter.col%2 !=0) FirePlaceType = 3; // Тип 3 //!!!

        }

        if (CoordsCenter.row%2 !=0 && CoordsCenter.col%2 == 0) FirePlaceType = 8; // Тип 8 //!!!
        if (CoordsCenter.row%2 !=0 && CoordsCenter.col == 1) {
            FirePlaceType = 9; // Тип 9 //!!!
            if (CoordsCenter.row == 1 && CoordsCenter.col == 1) FirePlaceType = 4; // Тип 4 //!!!
            if (CoordsCenter.row == 9 && CoordsCenter.col == 1) FirePlaceType = 5; // Тип 5 //!!!
        }
        if (CoordsCenter.row%2 !=0 && CoordsCenter.col == 29) {
            FirePlaceType = 10; // Тип 10 //!!!
            if (CoordsCenter.row == 1 && CoordsCenter.col == 29) FirePlaceType = 6; // Тип 6 //!!!
            if (CoordsCenter.row == 9 && CoordsCenter.col == 29) FirePlaceType = 7; // Тип 7 //!!!
        }
        if (CoordsCenter.row%2 ==0 && CoordsCenter.col%2 !=0) FirePlaceType = 11;// Тип 11 //!!!

        console.log('FirePlaceType = ' + FirePlaceType );
        if (FirePlaceType == 1) // Тип 1
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH2 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);
            CoordH4 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH2.left, Y:CoordH2.top};
            self.FireCoordsA[3] = {X:CoordH3.left, Y:CoordH3.top};
            self.FireCoordsA[4] = {X:CoordH4.left, Y:CoordH4.top};
        }

        if (FirePlaceType == 2) // Если четные координаты// Тип 2
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);
            CoordH4 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH3.left, Y:CoordH3.top};
            self.FireCoordsA[3] = {X:CoordH4.left, Y:CoordH4.top};
        }

        if (FirePlaceType == 3) // Если Тип 3
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);
            CoordH4 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH3.left, Y:CoordH3.top};
            self.FireCoordsA[3] = {X:CoordH4.left, Y:CoordH4.top};
        }

        if (FirePlaceType == 4) // Если Тип 4
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH3.left, Y:CoordH3.top};
        }

        if (FirePlaceType == 5) // Если Тип 5
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH3.left, Y:CoordH3.top};
        }

        if (FirePlaceType == 6) // Если Тип 6
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH3.left, Y:CoordH3.top};
        }

        if (FirePlaceType == 7) // Если Тип 7
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH3.left, Y:CoordH3.top};
        }

        if (FirePlaceType == 8) // Если Тип 8
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);
            CoordH2 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH2.left, Y:CoordH2.top};
        }

        if (FirePlaceType == 9) // Если Тип 9
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH2 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col+1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH2.left, Y:CoordH2.top};
            self.FireCoordsA[3] = {X:CoordH3.left, Y:CoordH3.top};
        }

        if (FirePlaceType == 10) // Если Тип 10
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH2 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);
            CoordH3 = SceneModel.BlockToScreen(CoordsCenter.row, CoordsCenter.col-1);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH2.left, Y:CoordH2.top};
            self.FireCoordsA[3] = {X:CoordH3.left, Y:CoordH3.top};
        }

        if (FirePlaceType == 11) // Если Тип 11
        {
            CoordH1 = SceneModel.BlockToScreen(CoordsCenter.row+1, CoordsCenter.col);
            CoordH2 = SceneModel.BlockToScreen(CoordsCenter.row-1, CoordsCenter.col);

            self.FireCoordsA[1] = {X:CoordH1.left, Y:CoordH1.top};
            self.FireCoordsA[2] = {X:CoordH2.left, Y:CoordH2.top};
        }

    };

    self.FireBlowOut = function () {
        self.FireCoordsA = null;
    };

    self.DestroyBlocks = function () {
        for (var i = 0; i < self.FireCoordsA.length; i++)
        {
            var FireCurCoordCRH = SceneModel.ScreenToBlock(self.FireCoordsA[i].X, self.FireCoordsA[i].Y);
            if (SceneModel.BlocksA[FireCurCoordCRH.row][FireCurCoordCRH.col].kind == 2)
                SceneModel.BlocksA[FireCurCoordCRH.row][FireCurCoordCRH.col].kind = 0;
        }
    };

    self.DestroyGhost = function () {
        for (var i = 0; i < self.FireCoordsA.length; i++)
        {
            var FireCurCoordCRH = SceneModel.ScreenToBlock(self.FireCoordsA[i].X, self.FireCoordsA[i].Y);
            //console.dir('GhostsModelA[0] = ' + GhostsModelA[0].);
            for (var j = 0; j < GhostsModelA.length; j++)
            {
                var GhostControlPoints = GhostsModelA[j].getControlPoints();
                //console.log('GhostCurCoordCRH.row = ' + GhostCurCoordCRH.row);
                //console.log('GhostCurCoordCRH.col = ' + GhostCurCoordCRH.col);
                if (FireCurCoordCRH.row == GhostControlPoints.firstPointRow && FireCurCoordCRH.col == GhostControlPoints.firstPointCol ||
                    FireCurCoordCRH.row == GhostControlPoints.secondPointRow && FireCurCoordCRH.col == GhostControlPoints.secondPointCol)
                {
                    console.log('Destroy Ghost!!!');
                    GhostsModelA[j].Destroy();
                }
            }

        }
    };

    self.DestroyBomberMan = function () {
        var BombManControlPoints = BombermanModel.getControlPoints();

        /*console.log( 'BombManControlPoints.firstPointRow = ' + BombManControlPoints.firstPointRow );
        console.log( 'BombManControlPoints.firstPointCol = ' + BombManControlPoints.firstPointCol );
        console.log( 'BombManControlPoints.secondPointRow = ' + BombManControlPoints.secondPointRow );
        console.log( 'BombManControlPoints.secondPointCol = ' + BombManControlPoints.secondPointCol );*/

        for (var i = 0; i < self.FireCoordsA.length; i++) {
            var FireCurCoordCRH = SceneModel.ScreenToBlock(self.FireCoordsA[i].X, self.FireCoordsA[i].Y);
            if (FireCurCoordCRH.row == BombManControlPoints.firstPointRow && FireCurCoordCRH.col == BombManControlPoints.firstPointCol ||
                FireCurCoordCRH.row == BombManControlPoints.secondPointRow && FireCurCoordCRH.col == BombManControlPoints.secondPointCol)
            {
                console.log('Destroy Bomberman!!!');
                BombermanModel.Destroy();
                return;
            }
        }
    };
}
