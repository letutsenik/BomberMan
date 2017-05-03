'use strict';
function TAjaxStorage(showFunc) {

    var self = this;
    var Records = [
        {user: 'dima', score: 20},
        {user: 'roma', score: 20},
        {user: 'vasia', score: 50},
        {user: 'alex', score: 50},
        {user: 'dan', score: 100}
    ];

    var AjaxHandlerScript = "http://fe.it-academy.by/AjaxStringStorage2.php";
    var StringName = 'LIPSKI_BOMBERMAN_DATA';
    var UpdatePassword;
    
    //InsertDataSting();  //!!! Do not decomment!!!

    function InsertDataSting() {
        $.ajax(
            {
                url : AjaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'INSERT', n : StringName, v : JSON.stringify(Records) },
                success : InsertReady, error : ErrorHandler
            }
        );
    }

    function InsertReady(Result) {
        if (Result) alert('Строка данных ' + StringName + ' добавлена!!!');
        console.log(Result);
    }

    self.RestoreRecords = function()
    {
        $.ajax(
            {
                url : AjaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'READ', n : StringName },
                success : ReadReady, error : ErrorHandler
            }
        );
    };

    function ReadReady(ResultH)
    {
        if ( ResultH.error!=undefined )
            alert(ResultH.error);
        else if ( ResultH.result!="" )
        {
            var RecordA = JSON.parse(ResultH.result);
            showFunc( RecordA );
        }
    }

    self.UpdateRecords = function (hash) {
        var CurrentRecordA;
        
        $.ajax(
            {
                url : AjaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'READ', n : StringName },
                success : ReadReady2, error : ErrorHandler
            }
        );

        function ReadReady2(ResultH)
        {
            if ( ResultH.error!=undefined )
                alert(ResultH.error);
            else if ( ResultH.result!="" )
            {
                CurrentRecordA = JSON.parse(ResultH.result); // Comment to clean records table
                //CurrentRecordA = []; // For clean Records Table
                for (var i=0; i<CurrentRecordA.length; i++)
                {
                    if (hash.user === CurrentRecordA[i].user)
                    {
                        //alert('same user!');
                        //alert(hash.score);
                        //alert(CurrentRecordA[i].score);
                        if (hash.score > CurrentRecordA[i].score)
                        {
                            CurrentRecordA[i].score = hash.score;
                            StoreData();
                            return;
                        } else
                            return;
                    }
                }
                CurrentRecordA.push( hash );
                CurrentRecordA.sort(compareNumeric);
                StoreData();
            }

            function compareNumeric(a, b) {
                return b.score - a.score;
            }
        }

        function StoreData() {
            UpdatePassword = Math.random();
            $.ajax(
                {
                    url : AjaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                    data : { f : 'LOCKGET', n : StringName, p : UpdatePassword },
                    success : LockGetReady, error : ErrorHandler
                }
            );
        }

        function LockGetReady(ResultH) {
            if ( ResultH.error != undefined )
                alert(ResultH.error);
            else
            {
                $.ajax(
                    {
                        url : AjaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                        data : { f : 'UPDATE', n : StringName, v : JSON.stringify(CurrentRecordA), p : UpdatePassword },
                        success : UpdateReady, error : ErrorHandler
                    }
                );
            }
        }
    };



    

    function UpdateReady(ResultH) {
        if ( ResultH.error != undefined )
            alert(ResultH.error);
    }

    function ErrorHandler(jqXHR,StatusStr,ErrorStr) {
        alert(StatusStr + ' ' + ErrorStr);
    }
}
