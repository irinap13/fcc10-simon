$(document).ready(function() {
  var generatedMoves = [], count = 0, movesDone = [], computerReady = false, interval, userFinished = false, wrongColor = false, userClickCount = 0, pressed = 0, userMoves = [], strictMode = false;
  
  $("#btn-onoff").on("click", function(){
    if ($(this).hasClass('btn-primary')) {
      Simon.turnOff();
      $(this).removeClass('btn-primary');
      $(this).find('h5').text('OFF');
    } else {
      Simon.turnOn();
      $(this).addClass('btn-primary');
      $(this).find('h5').text('ON');
    }
  });
  
  $("#btn-strict").on("click", function(){
    if ($(this).hasClass('btn-primary')) {
      Simon.strictMode(false);
      $(this).removeClass('btn-primary');
    } else {
      Simon.strictMode(true);
      $(this).addClass('btn-primary');
    }
  });
  
  $(".btn-disabled button").on("click", function(){
    return false;
  });
  
  var Simon = {
    turnOn: function() {
      $(".todisable").removeClass('btn-disabled');
      $("#btn-start").one("click",function(){
        Simon.start();
      });
    },
    turnOff: function() {
      $(".todisable").addClass('btn-disabled');
      $("#btn-start, #btn-strict").removeClass("btn-primary");
      $("#count_text").text('--');
      Simon.reset();
    },
    reset: function() {
      generatedMoves = [], count = 0, movesDone = [], computerReady = false, userFinished = false, wrongColor = false, userClickCount = 0, pressed = 0, userMoves = [], strictMode = false;
      $("#count_text").text('--');
    },
    strictMode: function(cond) {
      strictMode = cond;
    },
    generateMoves: function() {
      function makeRandom(mn,mx) {
        return Math.floor(Math.random() * (mx - mn + 1)) + mn;
      }
      for (var i=0;i<10;i++) {
        generatedMoves.push(makeRandom(1,4));
      }
    },
    highlightColor: function(colorArr) {
      computerReady = false;
      for (var i=0;i<colorArr.length;i++) {
        Simon.highlight(colorArr[i],i);
        
        if (i === colorArr.length-1) {
          computerReady = true;
        }
      }
    },
    highlight: function(col,ct) {
      setTimeout(function(){
        $("#c"+col).addClass('highlight');
        setTimeout(function(){
          $("#c"+col).removeClass('highlight');
        },500);
        $("#audio"+col)[0].play();
      },1000*ct);
    },
    start: function() {
      $("#btn-start").addClass("btn-primary");
      Simon.generateMoves();
      count = 1;
      Simon.makeMove();
    },
    makeMove: function() {
      var color = generatedMoves[count-1];
      movesDone.push(color);
      $("#count_text").text(movesDone.length);
      Simon.highlightColor(movesDone);
      
      if (movesDone.length === generatedMoves.length - 1) {
        Simon.generateMoves();
      }
      
      if (computerReady) {
        $(".color-block").removeClass("btn-disabled");
        Simon.waitForUser();
        count++;
      }
    },
    waitForUser: function() {
      var counter = 0;
          userClickCount = 1;
          interval = setInterval(function() {
            counter++;
            if (counter === 10) {
              Simon.lostGame();
            }
          }, 1000);
      
      userMoves = [];
      
      $(".color-block").unbind("click").on("click",function(){
        if ($(this)[0].className.match(/btn-disabled/g) !== null) {
          return false;
        } else {
          clearInterval(interval);
          var pressed = parseInt($(this)[0].id.replace('c',''));
          userMoves.push(pressed);
          Simon.highlight(pressed,0);
          Simon.checkUserMove(userMoves,pressed);
          userClickCount++;
        }
      });
    },
    checkUserMove: function(userMoves,pressed) {
      userFinished = false;
      wrongColor = false;
      
      function checkMoves(userMoves,movesDone) {
        if (userMoves.length === movesDone.length) {
          $(".color-block").addClass("btn-disabled");
          userFinished = true;
        }
        for (var i=userMoves.length; i--;) {
          if (userMoves[i] !== movesDone[i]) {
            $(".color-block").addClass("btn-disabled");
            wrongColor = true;
          }
        }
      }
      
      checkMoves(userMoves,movesDone);
      
      if (wrongColor) {
        Simon.lostGame();
      }
      if (userFinished && !wrongColor) {
        setTimeout(function(){Simon.makeMove()},1000);
      }
    },
    lostGame: function() {
      if (strictMode) {
        $("#count_text").text("! !");
        setTimeout(function(){Simon.reset()},1000);
        setTimeout(function(){Simon.start()},2000);
      } else {
        $("#count_text").text("! !");
        count--;
        movesDone.pop();
        setTimeout(function(){Simon.makeMove()},1000);
      }
    }
  }
});