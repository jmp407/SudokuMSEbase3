
function solveSudoku(inputBoard, stats) {
  
  var stats = stats || {};
  stats['easy'] = true;
  var board = JSON.parse(JSON.stringify(inputBoard));
  var possibilities = [[], [], [], [], [], [], [], [], []];
  
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++) {
      possibilities[i][j] = [false, true, true, true, true, true, true, true, true, true];
    }
  }
  
  var solved = false;
  var impossible = false;
  var mutated = false;
  var needCheckFreedoms = false;
  
  //TODO: check input is a valid puzzle
  
  var loopCount = 0;
  
// outerLoop ends at 120
  outerLoop: while(!solved && !impossible) {
    solved = true;
    mutated = false;
    loopCount++;
    
    var leastFree = [];
    var leastRemaining = 9;
    
// this loop ends at 105
    for(var i = 0; i < 9; i++) {
      for(var j = 0; j < 9; j++) {
        
        if(board[i][j] === 0) {
          
          solved = false;
          var currentPos = possibilities[i][j];
          
          var zoneRow;
          var zoneCol;
          
          if(loopCount === 1) {
            zoneRow = getZone(i) * 3;
            zoneCol = getZone(j) * 3;
            currentPos[10] = zoneRow;
            currentPos[11] = zoneCol;
          } else {
            zoneRow = currentPos[10];
            zoneCol = currentPos[11];
          }

          var wasMutated =  reducePossibilities(board, i, j, currentPos, zoneRow, zoneCol);
          
          if(wasMutated) {
            mutated = true;
          }
          
          
          // check if the contraints above left us with only one valid option
          var remaining = 0;
          var lastDigit = 0;
        
          for(var k = 1; k <= 9; k++) {
            if(currentPos[k]) {
              remaining++;
              lastDigit = k;
            }
          }
        
          if(remaining === 0) {
            //console.log("no remaining " + i + " " + j);
            impossible = true;
            break outerLoop;
          }
          else if(remaining === 1) {
            board[i][j] = lastDigit;
            mutated = true;
            continue;
          }

          if(needCheckFreedoms) {
            var solution = checkFreedoms(board, i, j, possibilities, zoneRow, zoneCol);
            
            if(solution !== 0) {
              
              board[i][j] = solution;
              mutated = true;
              continue;
            }

            if(remaining === leastRemaining) {
              leastFree.push([i,j]);
            }
            else if(remaining < leastRemaining) {
              leastRemaining = remaining;
              leastFree = [[i,j]];
            }
          }
          
        }
      }
    }
    
    if(mutated === false && solved === false) {
      
      // time to break out freedom checking
      if(needCheckFreedoms === false) {
        needCheckFreedoms = true;
        stats['medium'] = true;
        continue;
      }
      
      // we're stuck, time to start guessing
      return solveByGuessing(board, possibilities, leastFree, stats);
      
    }
  }
  
  if(impossible) {
    //window.console && console.log("board is impossible");
    return null;
  }
  else {
//      renderBoard(board);
    return board;
  }
}
