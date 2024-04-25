$(document).ready(function(){
  
/*
Base game settings 
min - min figure for game
max - max figure for game
operation - type of operation (0 = plus, 1 = minus, 2 = random)
level - level of game (0 = 5 answers, 1 = 6 answers, 2 = 7 answers)
mistakes - 3 mistakes for game over
correct - 10 correct answers = level + 1
*/   
  let baseSetting = {
    min: 1,
    max: 20,
    operation: 2,
    level: 0,
    answers: 5
  };
  
/*
Game loop data
all data are random

*/   
  
  let gameData = {
    fig1: 0,
    fig2: 2,
    answer: 0,
    operation: 0,
    mistakes: 0,
    correct: 0,
    apples: [],
    disposition: []
  };
/*
answers positions on tree
*/   
let applePos = [[50, 50], [250, 50], [150, 100], [50, 200], [250, 200], [150, 250], [50, 300], [250, 300]];  
  
  var  counter;
  
/*
Random figure generator
*/ 
let getRandomInRange = function(min = 1, max = 20) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
Answer generator depend on operation
*/ 
let answerGen = function(fig1, fig2, oper){
  switch(oper){
    case 0:
      return fig1+fig2;
      break;
    case 1:
      if (fig1<fig2){
        return fig2-fig1;
      }
      return fig1-fig2;
  }
};
  
  let createProblemCode = function(fig1, fig2, oper){
    switch(oper){
      case 0:
        return ("" + fig1 + " + " + fig2 + " = ?");
        break;
      case 1:
        if (fig1<fig2){
        return ("" + fig2 + " - " + fig1 + " = ?");
      }
      return ("" + fig1 + " - " + fig2 + " = ?");
    }
  };
/*
Create code for answer apples on tree
*/   
  let createApple = function(num, x, y){
  let numPos = num > 9 ? 10: 15;
  
  return (`<div class="apple" style="right: ${x}px; top: ${y}px;" answ="${num}"><svg viewBox="0 0 50 50"  height="100" width="100">  <path    style="fill:#ff3b00;fill-opacity:1;stroke:none;stroke-width:0.120804" d="m 42.322881,30.085047 c 0.30156,7.574906 -5.934838,13.767774 -17.039566,14.890036 -1.008771,0.101948 -3.819766,-1.738584 -3.819766,-1.738584 0,0 -2.298941,1.803316 -3.794853,1.624351 C 7.3231486,43.623161 0,35.386525 0,26.145515 0,17.145531 6.6113179,14.464875 16.518831,13.04414 c 1.736271,-0.248982 5.936964,2.55169 5.936964,2.55169 0,0 3.354857,-2.779664 5.256482,-2.487496 9.864495,1.515597 14.245523,7.806162 14.610604,16.976713 z" />   <path     style="fill:#008000;stroke:none;stroke-width:0.120804" d="M 25.277321,4.9920424 C 27.311209,1.4320098 33.348537,0.916597 38.858341,0 35.773646,3.8325416 37.364107,9.3934307 28.769584,11.189061 c -1.24227,1.341156 -3.121999,0.985547 -4.850364,1.032836 -0.734352,-1.883345 -0.977526,-3.9845897 1.358101,-7.2298546 z"/>  <path       style="fill:#ff7f2a;stroke:none;stroke-width:0.120804"   d="m 17.322725,6.885576 c 1.940145,1.4918741 3.362918,1.8361538 4.268319,1.0328364 l 0.864751,7.6774176 c -3.273081,-2.516694 -4.0309,-5.165364 -5.13307,-8.710254 z" />   <text y="35" x="${numPos}" font-size="20" font-weight="bold"  font-family="Avenir, Helvetica, sans-serif" fill="#fff">  ${num} </text> </svg></div>`);
}
  
  let mistakePicture = function(){
    return (`<svg viewBox="0 0 30 30"> <path    d="m 23.80731,15.338009 c 0.149723,3.86185 -2.9466,7.019109 -8.460003,7.591262 -0.500851,0.05198 -1.896485,-0.886371 -1.896485,-0.886371 0,0 -1.141405,0.919372 -1.884112,0.828133 -5.1364824,-0.631 -8.772367,-4.830218 -8.772367,-9.541484 0,-4.5883869 3.2824658,-5.9550433 8.201465,-6.6793642 0.862044,-0.1269366 2.947658,1.3009067 2.947658,1.3009067 0,0 1.665656,-1.4171329 2.6098,-1.2681795 4.897639,0.7726842 7.072785,3.97975 7.254044,8.655097 z" style="fill:#ff3b00;fill-opacity:1;stroke:none;stroke-width:0.060778" />
    <ellipse  ry="1.3042388"
       rx="2.4944077"
       cy="11.547613"
       cx="7.3047223"
       style="fill:#ffe6d5;fill-opacity:1;stroke-width:0.0145815" />
    <ellipse
       style="fill:#ffb380;fill-opacity:1;stroke-width:0.0145815"
       cx="7.208611"
       cy="11.362373"
       rx="2.4944077"
       ry="1.3042388" />
    <ellipse
       style="fill:#ffe6d5;stroke-width:0.0113803"
       cx="5.6295776"
       cy="9.6611929"
       rx="2.471523"
       ry="1.4176508" />
    <ellipse
       ry="1.4176508"
       rx="2.471523"
       cy="9.5553446"
       cx="5.405313"
       style="fill:#ffb380;fill-opacity:1;stroke-width:0.0113803" />
    <path
       style="fill:#ffe6d5;stroke-width:0.0216815"
       d="m 5.3549661,7.1169832 c 0,1.2631548 -0.9835895,2.2871435 -2.196909,2.2871435 -1.2133195,0 -2.1969096,-1.0239887 -2.1969096,-2.2871435 0,-1.1495966 0.4332285,-2.258527 1.8254577,-2.2554477 0.1375248,3.11e-4 -0.00872,0.5602537 0.1543743,0.5714076 0.1393399,0.00953 0.3378234,-0.6947519 0.4752107,-0.6774128 1.0548457,0.1331308 1.9387759,1.2438578 1.9387759,2.3614529" />
    <path
       style="fill:#ffb380;stroke-width:0.0216815"
       d="M 5.080353,7.0905209 C 5.069748,8.3536451 4.0967629,9.3776638 2.8834435,9.3776638 c -1.2133199,0 -2.19690911,-1.0239888 -2.19690911,-2.2871429 0,-1.0541789 0.70723931,-1.8935604 1.61699211,-2.2066165 0.5381163,-0.1851723 0.6036219,0.7081077 0.5601829,0.7833772 -0.07267,0.1259178 0.3192046,-0.9468158 0.8124425,-0.7952239 1.249552,0.384038 1.4130272,1.1674671 1.4042011,2.2184632 z" />
    <path
       style="fill:#ff9955;fill-opacity:1;stroke-width:0.0145815"
       d="m 3.1694993,9.1456173 c 0.023112,0.1574971 -0.2437746,0.0087 -0.6744902,0.0087 -0.4307152,0 -0.5480229,-0.041562 -0.5480229,-0.2002124 0,-0.1586495 1.0193501,-1.1929057 1.0960456,-0.6702758 z" />
    <path
       d="m 3.0733839,9.066229 c 0.023112,0.1574965 -0.2437746,0.0087 -0.6744897,0.0087 -0.4307152,0 -0.5480227,-0.041562 -0.5480227,-0.200213 0,-0.1586489 1.0193494,-1.1929057 1.0960455,-0.6702752 z"
       style="fill:#ffaaaa;fill-opacity:1;stroke-width:0.0145815" />
    <ellipse
       ry="0.7938844"
       rx="1.3959532"
       cy="7.899529"
       cx="1.4920644"
       style="fill:#ff9955;stroke-width:0.0162065" />
    <ellipse
       ry="0.7938844"
       rx="1.3959532"
       cy="8.1112299"
       cx="1.5881793"
       style="fill:#ffe6d5;stroke-width:0.0162065" />
    <ellipse
       style="fill:#ffb380;stroke-width:0.0162065"
       cx="1.3959532"
       cy="7.9789162"
       rx="1.3959532"
       ry="0.7938844" />
    <ellipse
       style="fill:#ffe6d5;fill-opacity:1;stroke-width:0.0145815"
       cx="2.0375493"
       cy="5.8983178"
       rx="0.43480504"
       ry="0.4536483" />
    <ellipse
       style="fill:#ffe6d5;fill-opacity:1;stroke-width:0.0145815"
       cx="3.8193891"
       cy="5.8950276"
       rx="0.41192055"
       ry="0.4725503" />
    <ellipse
       style="fill:#000000;fill-opacity:1;stroke-width:0.00746888"
       cx="2.074887"
       cy="6.0060101"
       rx="0.22222029"
       ry="0.23901096" />
    <ellipse
       ry="0.23901096"
       rx="0.22222029"
       cy="5.9905291"
       cx="3.8332376"
       style="fill:#000000;fill-opacity:1;stroke-width:0.00746888" />
    <path
       style="fill:#ff0000;fill-opacity:1;stroke-width:0.0145815"
       d="M 2.3891386,8.9164547 2.7461813,8.6076179 c -0.019413,0.084178 -0.048611,0.1683554 0.050072,0.2525325 -0.060588,-0.099231 0.00193,-0.2238813 0.032575,-0.341955 L 2.9658291,8.3569551 3.0733857,9.066229 c -0.087742,0.072641 -0.2557713,0.097052 -0.6110158,0.009 z" />
    <path
       d="M 15.344328,2.5450515 C 16.354138,0.73006964 19.351623,0.46730097 22.087195,0 20.555671,1.9539128 21.345321,4.7889741 17.078212,5.7044252 16.46143,6.3881755 15.528164,6.2068784 14.670042,6.2309873 14.305444,5.2708173 14.184706,4.1995576 15.344328,2.5450515 Z"
       style="fill:#008000;stroke:none;stroke-width:0.060778" />
    <path 
       d="m 11.394938,3.5104159 c 0.963264,0.7605896 1.669658,0.9361105 2.119182,0.5265622 l 0.429346,3.9141134 C 12.318404,6.6680265 11.942157,5.3176771 11.394938,3.5104159 Z"style="fill:#ff7f2a;stroke:none;stroke-width:0.060778" /></svg>`);
  };
  
  let correctPicture = function(){
    return(` <svg  viewBox="0 0 30 30"><path
       d="m 23.80731,15.338009 c 0.149723,3.86185 -2.9466,7.019109 -8.460003,7.591262 -0.500851,0.05198 -1.896485,-0.886371 -1.896485,-0.886371 0,0 -1.141405,0.919372 -1.884112,0.828133 -5.1364824,-0.631 -8.772367,-4.830218 -8.772367,-9.541484 0,-4.5883869 3.2824658,-5.9550433 8.201465,-6.6793642 0.862044,-0.1269366 2.947658,1.3009067 2.947658,1.3009067 0,0 1.665656,-1.4171329 2.6098,-1.2681795 4.897639,0.7726842 7.072785,3.97975 7.254044,8.655097 z"
       style="fill:#ff3b00;fill-opacity:1;stroke:none;stroke-width:0.060778" />
    <path
       d="M 15.344328,2.5450515 C 16.354138,0.73006964 19.351623,0.46730097 22.087195,0 20.555671,1.9539128 21.345321,4.7889741 17.078212,5.7044252 16.46143,6.3881755 15.528164,6.2068784 14.670042,6.2309873 14.305444,5.2708173 14.184706,4.1995576 15.344328,2.5450515 Z"
       style="fill:#008000;stroke:none;stroke-width:0.060778" />
    <path
       d="m 11.394938,3.5104159 c 0.963264,0.7605896 1.669658,0.9361105 2.119182,0.5265622 l 0.429346,3.9141134 C 12.318404,6.6680265 11.942157,5.3176771 11.394938,3.5104159 Z"
       style="fill:#ff7f2a;stroke:none;stroke-width:0.060778" /> </svg>`);
  };
  
  
  let resetLoop = function(){
    gameData.fig1 = 0;
    gameData.fig1 = 0;
    gameData.answer = 0;
    gameData.apples = [];
    gameData.disposition = [];
    $('.apple').detach();
 
  };
  
  
/*
check level
*/   
  let checkStatus = function(){
    if(gameData.mistakes>2){
       $('.problem').text("Game Over");
      return;
    } 
    if(gameData.correct>9){
      gameData.correct = 0;
      baseSetting.level++;
      if(baseSetting.answers<8){
        baseSetting.answers++;
      }
      $(".correct svg").detach()
    }
    gameLoop();
  };
  
  
/*
Get answer from dropped documents
restart loop
*/  
  let handleDropEvent = function(e, ui){
        if(ui.draggable.attr('answ')==gameData.answer){
      gameData.correct++;
          $(".correct").append(correctPicture());
    } else {
      gameData.mistakes++;      
      $(".mistakes").append(mistakePicture());
    }
    
    resetLoop();
    checkStatus();
 
  };
  
  let gameLoop = function(){
// operation check     
gameData.operation = (baseSetting.operation == 2) ? getRandomInRange(0, 1) : baseSetting.operation;

 // problem generator
gameData.fig1 = getRandomInRange(baseSetting.min, baseSetting.max);

    while(gameData.answer < baseSetting.min ||  gameData.answer > baseSetting.max){
      gameData.fig2 = getRandomInRange(baseSetting.min, baseSetting.max);
gameData.answer = answerGen(gameData.fig1, gameData.fig2, gameData.operation);
    }
   gameData.apples.push(gameData.answer);
  
  while (gameData.apples.length < baseSetting.answers){
      var curAnsw = getRandomInRange(baseSetting.min, baseSetting.max);
      if(gameData.apples.indexOf(curAnsw)<0){
        gameData.apples.push(curAnsw);
      }
    }
    
// disposition generator    
    while (gameData.disposition.length < baseSetting.answers){
      var curPos = getRandomInRange(0, baseSetting.answers-1);
if(gameData.disposition.indexOf(curPos)<0){
    gameData.disposition.push(curPos);
      }  
    }
  $('.problem').text(createProblemCode(gameData.fig1, gameData.fig2, gameData.operation));
   
   for(var i = 0; i < gameData.disposition.length; i++){
     $(".math").append(createApple(gameData.apples[i],applePos[gameData.disposition[i]][0],applePos[gameData.disposition[i]][1]));
   };
  $('.apple').draggable({
    containment: '.math',
    cursor: 'move'
  });
  $(".problem").droppable({
        drop: handleDropEvent,
        tolerance: "touch"
    });
  };
  
  
  
  gameLoop();
  
  
});