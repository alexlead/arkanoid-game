var pjs = new PointJS('2D', 1280 / 2, 720 / 2, { // 16:9
	backgroundColor : '#53769A' // if need
});

pjs.system.initFullPage();

var log    = pjs.system.log;     // log = console.log;
var game   = pjs.game;           // Game Manager


var key   = pjs.keyControl.initKeyControl();


var width  = game.getWH().w; // width of scene viewport
var height = game.getWH().h; // height of scene viewport

pjs.system.setTitle('Арканоид'); // Set Title for Tab or Window

// ракетка
       var racket = game.newRoundRectObject( { 
          x : width/2-50, 
          y : height-30, 
          w : 100, 
          h : 30, 
          radius : 5, 
          fillColor : "#FBFE6F", 
        });

racket.speed = 8;

// мяч

    var ball = game.newCircleObject({
        x: width/2-10,
        y: height/2-10,
        radius : 10, 
          fillColor : "#FBFE6F", 
          strokeColor : "#DA4848", 
          strokeWidth : 2, 
          angle : 0, 
          alpha : 1, 
          visible : true 
    });

    ball.dx = 3;
    ball.dy = 2;
    ball.beginX = ball.x;
    ball.beginY = ball.y;
// кирпичи 
    var brickets = [];
 
function brickets_build(){
    for(var j = 100; j< 180; j+=35){
        for(var i=50; i<width-150; i+=105){
           
        var tmp = game.newRoundRectObject( { 
          x : i, 
          y : j, 
          w : 100, 
          h : 30, 
          radius : 5, 
          fillColor : "#FBFE6F", 
        });
            
            brickets.push(tmp);
        }
    }
}

brickets_build();

// дисплей набранных очков
var score = 0;

var score_display = game.newTextObject( {
  x : width - 200,
  y : 20,
  text : "Score: " + score,
  size : 20,
  padding : 0,
  color : "#000000",
  fillColor : ""
});

// дисплей жизней
var life = 3;

var lives_display = game.newTextObject( {
  x : 70,
  y : 20,
  text : "Lives: " + life,
  size : 20,
  padding : 0,
  color : "#000000",
  fillColor : ""
});

// дисплей уровня
var level = 1;

var level_display = game.newTextObject( {
  x : 170,
  y : 20,
  text : "Level: " + level,
  size : 20,
  padding : 0,
  color : "#000000",
  fillColor : ""
});

var start_display = game.newTextObject( {
  x: width/2-100,
  y: height/2-20,
  text : "PRESS SPACE FOR START",
  size : 20,
  padding : 0,
  color : "#000000",
  fillColor : ""
});

// Поиск и удаление кирпича с которым произошло столкновение
function bricket_remove(x, y){
   for(var i = 0; i<brickets.length; i++){
       if(brickets[i].x==x&&brickets[i].y==y){
           brickets.splice(i,1);
           score += 10;
           score_display.text = "Score: " + score;
               if(!brickets.length){
                   //game.stop();
                   level++;
                   level_display.text = "Level: " + level;
                   life ++;
                   lives_display.text = "Lives: " + life;
                ball.x = ball.beginX;
                ball.y = ball.beginY;
                    ball.dx += 0.5;
                    ball.dy += 0.5;
                   if(ball.dx+3>racket.speed){
                       racket.speed +=3;
                   }
                   brickets_build();
                game.startLoop('waitForStart');
               }
        }
   }
}




// Game Loop
game.newLoop('myGame', function () {

		game.clear(); // clear screen
        
        if(key.isDown('RIGHT')&&(racket.x < (width-racket.w))){
            racket.x +=racket.speed;
        }
       if(key.isDown('LEFT')&&(racket.x > 2)){
            racket.x -=racket.speed;
        }
        
        if ((ball.x)>=width-10||(ball.x)<=0){
            ball.dx *= -1;
        }
 
        if ((ball.y)>= height-10){
            life--;
            if(!life) {
                start_display.text = "GAME END";
                start_display.draw();
                game.stop();}
            ball.x = ball.beginX;
            ball.y = ball.beginY;
            lives_display.text = "Lives: "+ life;
            game.startLoop('waitForStart');
        }
        
    if(ball.isIntersect(racket)||(ball.y)<=0){
        ball.dy *= -1;
    }
    
    if(ball.isArrIntersect(brickets)){
        ball.dy *= -1;
        bricket_remove(ball.isArrIntersect(brickets).x, ball.isArrIntersect(brickets).y);   
    }
    

    
    ball.x +=  ball.dx;
    ball.y +=  ball.dy;
  
        ball.draw();
		racket.draw(); 
        score_display.draw();
        lives_display.draw();
        level_display.draw();
        pjs.OOP.drawArr(brickets);
  
        

});


game.newLoop('waitForStart', function(){
    
    if(key.isPress('SPACE')){
        game.startLoop('myGame');
    }
    
        ball.draw();
		racket.draw(); 
        score_display.draw();
        lives_display.draw();
        level_display.draw();
        start_display.draw();
        pjs.OOP.drawArr(brickets);
        start_display.draw();
    
    
})

       game.startLoop('waitForStart');
