(function () {
    // Melih Kurtaran Ping Pong Game
    var CONSTS = {
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        winning_score: 5,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        ball2TopSpeed: 0,
        ball2LeftSpeed: 0,
        secondBall: false,
        gameMode: 1, // three different game modes available
        keys: {},
        UP_LEFT: -3 * Math.PI / 4,
        UP_RIGHT : - Math.PI / 4,
        DOWN_LEFT : 3 * Math.PI / 4,
        DOWN_RIGHT : Math.PI / 4
    };
    
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            angle: CONSTS.DOWN_LEFT,
            position: 'absolute',
            top: 300,
            left: 450,
            borderRadius: 50,
            background: '#C6A62F'
        },
         ball2: {
            width: 15,
            height: 15,
            angle: CONSTS.DOWN_LEFT,
            position: 'absolute',
            top: 300,
            left: 450,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 250
        },
        stick2: {
            right: 0,
            top: 250
        },
        score: {
            color: '#C6A62F',  
            'text-align': 'center',
            'font-size': 60,
            'font-family': "Papyrus"        
        },
        info: {
            'font-size': 20,
            'font-family': "Papyrus",
             color: '#C6A62F',
        }
    };


    function start() {
        draw();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        
        $('<h1/>', {id: 'info'}).css(CSS.info).appendTo('#pong-game');
        $('<h1/>', {id: 'info2'}).css(CSS.info).appendTo('#pong-game');
        $('<h1/>', {id: 'score'}).css(CSS.score).appendTo('#pong-game');
              
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick))
        .appendTo('#pong-game');
    }

    function setEvents() {
        
        $('#info').html("Press 'M' for user-controlled game, press 'A' for one CPU player, press 'Q' for two CPU players");
        $('#info2').html("Press SPACE to play with two balls and press again to disappear it");
       
        $(document).on('keydown', function (e) {
            if (e.keyCode == 77) { //pressing M for multi-player
               CONSTS.gameMode = 1;
            }
            if (e.keyCode == 65) { //pressing A to play against AI
                CONSTS.gameMode = 2;
            }
            if (e.keyCode == 81) { //pressing Q for two AI players
                CONSTS.gameMode = 3;
            }
            if (e.keyCode == 32) { //pressing SPACE to create one more ball or disappear it
                if(!CONSTS.secondBall)
                {
                    $('<div/>', {class: 'pong-ball2'}).css(CSS.ball2).appendTo('#pong-game');
                    CONSTS.secondBall = true;
                }else
                {
                    $('.pong-ball2').fadeOut();
                    CONSTS.secondBall = false;
                }
            }
            if(CONSTS.gameMode == 1 || CONSTS.gameMode == 2)
            {
                if (e.keyCode == 87) {
                    CONSTS.stick1Speed = -5;
                }
                if (e.keyCode ==83) {
                    CONSTS.stick1Speed = 5;
                }
            }
            if(CONSTS.gameMode == 1)
            {
                if (e.keyCode == 38) {
                    CONSTS.stick2Speed = -5;
                }
                if (e.keyCode == 40) {
                    CONSTS.stick2Speed = 5;
                }
            }
        });
        

        $(document).on('keyup', function (e) {
            
            if (e.keyCode == 87 || e.keyCode == 83 ) {
                CONSTS.stick1Speed = 0;
            }
            if (e.keyCode == 38 || e.keyCode == 40 ) {
                CONSTS.stick2Speed = 0;
            }
        });      
    }

    function loop() {
               
        window.pongLoop = setInterval(function () {
            if( (CSS.stick1.top > 0 || CONSTS.stick1Speed > 0)
              && ( CSS.stick1.top < CSS.arena.height -CSS.stick.height 
                  || CONSTS.stick1Speed < 0)){
                CSS.stick1.top += CONSTS.stick1Speed;
            }
            if( (CSS.stick2.top > 0 || CONSTS.stick2Speed > 0)
              && ( CSS.stick2.top < CSS.arena.height -CSS.stick.height 
                  || CONSTS.stick2Speed < 0)){
                CSS.stick2.top += CONSTS.stick2Speed;
            }
                        
            $('#stick-1').css('top', CSS.stick1.top);
            $('#stick-2').css('top', CSS.stick2.top);
 
            CSS.ball.top += CONSTS.ballTopSpeed * Math.sin(CSS.ball.angle);
            CSS.ball.left += CONSTS.ballLeftSpeed * Math.cos(CSS.ball.angle);

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1.02;
            }

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});
            
            //CPU Player
            if(CONSTS.gameMode == 2 || CONSTS.gameMode == 3)
            {
                if (CSS.ball.top < CSS.stick2.top ) {
                   CONSTS.stick2Speed = -5;
                }else if(CSS.ball.top > CSS.stick2.top){
                    CONSTS.stick2Speed = 5;
                }else{  CONSTS.stick2Speed = 0; }
            }
            
            //second CPU Player
            if(CONSTS.gameMode == 3)
            {
                if(CSS.ball.top < CSS.stick1.top - CSS.stick1.height / 3) {
                   CONSTS.stick1Speed = -5;
                }else if(CSS.ball.top > CSS.stick1.top - CSS.stick1.height / 3){
                    CONSTS.stick1Speed = 5;
                }else{  CONSTS.stick1Speed = 0; }
            }          
            
            if (CSS.ball.left <= CSS.stick.width - 2) {
            	CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1.05) || roll(1);
            }
            
            if (CSS.ball.left + CSS.ball.width >= CSS.arena.width - CSS.stick.width + 2) {
            	CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1.05) || roll(2);
            }
            
            if(CONSTS.secondBall)
            {  
                CSS.ball2.top += CONSTS.ball2TopSpeed * Math.sin(CSS.ball2.angle);
                CSS.ball2.left += CONSTS.ball2LeftSpeed * Math.cos(CSS.ball2.angle);

                $('.pong-ball2').css({top: CSS.ball2.top,left: CSS.ball2.left});

                if (CSS.ball2.top <= 0 ||
                    CSS.ball2.top >= CSS.arena.height - CSS.ball.height) {
                    CONSTS.ball2TopSpeed = CONSTS.ball2TopSpeed * -1.02;
                }
                
                if (CSS.ball2.left <= CSS.stick.width - 2) {
                   CSS.ball2.top > CSS.stick1.top && CSS.ball2.top < (CSS.stick1.top + CSS.stick.height) && (CONSTS.ball2LeftSpeed = CONSTS.ball2LeftSpeed * -1.05) || roll(1);
                }

                if (CSS.ball2.left + CSS.ball2.width >= CSS.arena.width - CSS.stick.width + 2) {
                   CSS.ball2.top > CSS.stick2.top && CSS.ball2.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ball2LeftSpeed = CONSTS.ball2LeftSpeed * -1.05) || roll(2);
                }
            }
            
            // update the scores
            $('#score').html(CONSTS.score1 + "._." + CONSTS.score2); 
            
            //the info disappears after warming up
            if(CONSTS.score1 == 2 || CONSTS.score2 == 2)
            {
                $('#info').fadeOut();
                $('#info2').fadeOut();
            }
            
            if(CONSTS.score1 == CONSTS.winning_score){
                $('#pong-ball').fadeOut();
                $('.pong-ball2').fadeOut();
                clearInterval(window.pongLoop);
                alert("Player 1 won!");
            }
            
            if(CONSTS.score2 == CONSTS.winning_score){
                $('#pong-ball').fadeOut();
                $('.pong-ball2').fadeOut();
                clearInterval(window.pongLoop);
                alert("Player 2 won!");
            }
            
        }, CONSTS.gameSpeed);    
    }

    function roll(i) {
        if(i==1) CONSTS.score2++;
        else if(i==2) CONSTS.score1++;
        
        CSS.ball.top = CSS.arena.height / 2;
        CSS.ball.left = CSS.arena.width / 2;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -5 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 4 + 3);
        
       
        CSS.ball2.top = CSS.ball.top;
        CSS.ball2.left = CSS.ball.left;
        side = -1;

        CONSTS.ball2TopSpeed = Math.random() * -5 - 3;
        CONSTS.ball2LeftSpeed = side * (Math.random() * 4 + 3);
        
    }

    start();
})();