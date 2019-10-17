class Game2048 {
  constructor() {
    this.board = [];
    this.score = 0;
    this.startY;
    this.startX;
  }

  createHtmlBoard() {
    let boardValues = Array(16).fill('');

    document.body.innerHTML = `
      <nav class="nav">
        <button class="newGame">New Game</button>
        <div class="score_container">
          <div class="score_text">score</div>
          <div class="score_counter">${this.score}</div>
        </div>
      </nav>
      <div class='grid'>
        ${boardValues.map(value => `<div class='grid__item'></div>`).join('')}
      </div>
    `;

    this.setBoard();
  }

  getDivsArr() {
    return [...document.querySelectorAll('.grid__item')];
  }

  getEmptyDivs() {
    return this.getDivsArr().filter(div => div.textContent === '');
  }

  setBoard() {
    let divsArr = this.getDivsArr();
    for (let i = 0; i < 4; i++) {
      this.board.push(divsArr.splice(0, 4));
    } 
  }

  randomNumber() {
    return Math.random() > 0.9 ? 4 : 2; 
  }

  generateNewNumber() {
    let emptyDivs = this.getEmptyDivs();
    let index = Math.floor((Math.random() * emptyDivs.length));
    if (emptyDivs.length > 0) emptyDivs[index].textContent = this.randomNumber();

    this.setDivClass();
  }

  getBoardNumbers(board) {
    return board.map(row => row.filter(div => div.textContent !== ''));
  }

  setGridPosition() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j].style.cssText = `grid-column-start: ${j + 1}; grid-row-start: ${i + 1};`;
      }
    }
  }

  buttonRight() {
    this.setGridPosition();
    let fillDivs = this.getBoardNumbers(this.board);
    let rowC = 0; //row counter
    let randNewNum = false;

    for (const row of this.board) {
      let rowDivs = fillDivs[rowC]; 
      for (let i = row.length - 1; i > 0; i--) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[rowDivs.length - 1].textContent === rowDivs[rowDivs.length - 2].textContent) {
          randNewNum = true;
          let index;
          if(rowDivs[rowDivs.length -1] === row[i]) {
            rowDivs.pop();
            index = row.lastIndexOf(rowDivs.pop(), i - 1);
            row[index].textContent = '';
            row[index].className = 'grid__item';
            row[i].textContent = row[i].textContent * 2;
            this.score += +row[i].textContent;
            row[index].style.cssText = `grid-column-start: ${index + 1}; grid-row-start: ${rowC + 1};`;
            row[i].style.cssText = `grid-column-start: ${i + 1}; grid-row-start: ${rowC + 1};`;
          } else {
            let element = row[i].textContent;
            index = row.lastIndexOf(rowDivs.pop(), i - 1);
            row[index].style.cssText = `grid-column-start: ${i + 1}; grid-row-start: ${rowC + 1};`;
            row[i].style.cssText = `grid-column-start: ${index + 1}; grid-row-start: ${rowC + 1};`;
            let buffer = row[i];
            row[i] = row[index];
            row[index] = buffer;
            row[i].textContent = row[i].textContent * 2;
            this.score += +row[i].textContent;
            row[index].textContent = '';
            row[index].className = 'grid__item';
            index = row.lastIndexOf(rowDivs.pop(), i - 1);
            if (index !== -1 && element === '') {
              row[index].textContent = '';
              row[index].className = 'grid__item';
            }
          } 
        } else if(row[i] === rowDivs[rowDivs.length - 1]) { 
          rowDivs.pop()
        } else if(row[i].textContent === '' && rowDivs.length > 0) {
          randNewNum = true;
          let index = row.lastIndexOf(rowDivs.pop(), i - 1);
          row[index].style.cssText = `grid-column-start: ${i + 1}; grid-row-start: ${rowC + 1};`;
          row[i].style.cssText = `grid-column-start: ${index + 1}; grid-row-start: ${rowC + 1};`;

          let buffer = row[i];
          row[i] = row[index];
          row[index] = buffer;
        }
      }
      rowC++;
    }
   
    this.updateScore();
    if (randNewNum === true) this.generateNewNumber();
    this.setDivClass();
    setTimeout(this.isLose.bind(this), 5);
  }

  buttonLeft() {
    this.setGridPosition();
    let fillDivs = this.getBoardNumbers(this.board);
    let rowC = 0; // row counter
    let randNewNum = false;

    for (const row of this.board) {
      let rowDivs = fillDivs[rowC]; 
      for (let i = 0; i < row.length; i++) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[0].textContent === rowDivs[1].textContent) {
          randNewNum = true;
          let index;
          if(rowDivs[0] === row[i]) {
            rowDivs.shift();
            index = row.indexOf(rowDivs.shift(), i + 1);
            row[index].textContent = '';
            row[index].className = 'grid__item';
            row[i].textContent = row[i].textContent * 2;
            this.score += +row[i].textContent;
          } else {
            let element = row[i].textContent;
            index = row.indexOf(rowDivs.pop(), i + 1);
            row[index].style.cssText = `grid-column-start: ${i + 1}; grid-row-start: ${rowC + 1};`;
            row[i].style.cssText = `grid-column-start: ${index + 1}; grid-row-start: ${rowC + 1};`;
            let buffer = row[i];
            row[i] = row[index];
            row[index] = buffer;
            row[i].textContent = row[i].textContent * 2;
            this.score += +row[i].textContent;
            row[index].textContent = '';
            row[index].className = 'grid__item';
            index = row.indexOf(rowDivs.shift(), i + 1);
            if (index !== -1 && element === '') {
              row[index].textContent = '';
              row[index].className = 'grid__item';
            }
          }
        } else if (row[i] === rowDivs[0]) {
          rowDivs.shift();
        } else if(row[i].textContent === '' && rowDivs.length > 0) {
          randNewNum = true;
          let index = row.indexOf(rowDivs.shift(), i + 1);
          row[index].style.cssText = `grid-column-start: ${i + 1}; grid-row-start: ${rowC + 1};`;
          row[i].style.cssText = `grid-column-start: ${index + 1}; grid-row-start: ${rowC + 1};`;

          let buffer = row[i];
          row[i] = row[index];
          row[index] = buffer;
        }
      }
      rowC++;
    }

    this.updateScore();
    if (randNewNum === true) this.generateNewNumber();
    this.setDivClass();
    setTimeout(this.isLose.bind(this), 5);
  }

  getVerticalBoard () {
    let verticalBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      let varticalRow = [];
      for (let j = 0; j < this.board.length; j++) {
        varticalRow.push(this.board[j][i]);
      }
      verticalBoard.push(varticalRow);
    }

    return verticalBoard;
  }
  
  buttonTop() {
    this.setGridPosition();
    let verticalBoard = this.getVerticalBoard();
    let fillDivs = this.getBoardNumbers(verticalBoard);
    let rowC = 0; //row counter
    let randNewNum = false;

    for (let i = 0; i < this.board.length; i++) {
      let rowDivs = fillDivs[rowC];
      for (let j = 0; j < this.board.length; j++) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[0].textContent === rowDivs[1].textContent) {
          randNewNum = true;
          let index;
          if(rowDivs[0] === this.board[j][i]) {
            rowDivs.shift();
            index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 1);
            verticalBoard[rowC].splice(index, 1, null);
            this.board[index][i].textContent = '';
            this.board[index][i].className = 'grid__item';
            this.board[j][i].textContent = this.board[j][i].textContent * 2;
            this.score += +this.board[j][i].textContent;
          } else {
            let element = this.board[j][i].textContent;
            index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 1);
            verticalBoard[rowC].splice(index, 1, null);
            this.board[index][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${j + 1};`;
            this.board[j][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${index + 1};`;
            let buffer = this.board[j][i];
            this.board[j][i] = this.board[index][i];
            this.board[index][i] = buffer;
            this.board[j][i].textContent = this.board[j][i].textContent * 2;
            this.score += +this.board[j][i].textContent;
            this.board[index][i].textContent = '';
            this.board[index][i].className = 'grid__item';
            index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 2);
            if (index !== -1 && element === '') {
              this.board[index][i].textContent = '';
              this.board[index][i].className = 'grid__item';
              verticalBoard[rowC].splice(index, 1, null);
            }
          }
        } else if (this.board[j][i] === rowDivs[0]) {
          rowDivs.shift();
        } else if(this.board[j][i].textContent === '' && rowDivs.length > 0) {
          randNewNum = true;
          let index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 1);
          this.board[index][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${j + 1};`;
          this.board[j][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${index + 1};`;

          let buffer = this.board[j][i];
          this.board[j][i] = this.board[index][i];
          this.board[index][i] = buffer;
          verticalBoard[rowC].splice(index, 1, null);
        }
      }
      rowC++;
    }

    this.updateScore();
    if (randNewNum === true) this.generateNewNumber();
    this.setDivClass();
    setTimeout(this.isLose.bind(this), 5);
  }

  buttonBottom() {
    this.setGridPosition();
    let verticalBoard = this.getVerticalBoard();
    let fillDivs = this.getBoardNumbers(verticalBoard);
    let rowC = 0;
    let randNewNum = false;

    for (let i = 0; i < this.board.length; i++) {
      let rowDivs = fillDivs[rowC];
      for (let j = this.board.length - 1; j > 0; j--) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[rowDivs.length - 1].textContent === rowDivs[rowDivs.length - 2].textContent) {
          randNewNum = true;
          let index;
          if(rowDivs[rowDivs.length - 1] === this.board[j][i]) {
            rowDivs.pop();
            index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 1);
            verticalBoard[rowC].splice(index, 1, null);
            this.board[index][i].textContent = '';
            this.board[index][i].className = 'grid__item';
            this.board[j][i].textContent = this.board[j][i].textContent * 2;
            this.score += +this.board[j][i].textContent;
          } else {
            let element = this.board[j][i].textContent;
            index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 1);
            verticalBoard[rowC].splice(index, 1, null);
            this.board[index][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${j + 1};`;
            this.board[j][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${index + 1};`;
            let buffer = this.board[j][i];
            this.board[j][i] = this.board[index][i];
            this.board[index][i] = buffer;
            this.board[j][i].textContent = this.board[j][i].textContent * 2;
            this.score += +this.board[j][i].textContent;
            this.board[index][i].textContent = '';
            this.board[index][i].className = 'grid__item';
            index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 2);
            if (index !== -1 && element === '') {
              this.board[index][i].textContent = '';
              this.board[index][i].className = 'grid__item';
              verticalBoard[rowC].splice(index, 1, null);
            }
          }
        } else if (this.board[j][i] === rowDivs[rowDivs.length - 1]) {
          rowDivs.pop();
        } else if(this.board[j][i].textContent === '' && rowDivs.length > 0) {
          randNewNum = true;
          let index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 1);
          this.board[index][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${j + 1};`;
          this.board[j][i].style.cssText = `grid-column-start: ${rowC + 1}; grid-row-start: ${index + 1};`;

          let buffer = this.board[j][i];
          this.board[j][i] = this.board[index][i];
          this.board[index][i] = buffer;
          verticalBoard[rowC].splice(index, 1, null);
        }
      }
      rowC++;
    }
    
    this.updateScore();
    if (randNewNum === true) this.generateNewNumber();
    this.setDivClass();
    setTimeout(this.isLose.bind(this), 5);
  }

  setDivClass() {
    let divs = document.querySelectorAll('.grid__item');

    for (const div of divs) {
      switch(div.textContent) {
        case '2': {
          div.className = 'grid__item val_2';
          break;
        }
        case '4': {
          div.className = 'grid__item val_4';
          break;
        }
        case '8': {
          div.className = 'grid__item val_8';
          break;
        }
        case '16': {
          div.className = 'grid__item val_16';
          break;
        }
        case '32': {
          div.className = 'grid__item val_32';
          break;
        }
        case '64': {
          div.className = 'grid__item val_64';
          break;
        }
        case '128': {
          div.className = 'grid__item val_128';
          break;
        }
        case '256': {
          div.className = 'grid__item val_256';
          break;
        }
        case '512': {
          div.className = 'grid__item val_512';
          break;
        }
        case '1024': {
          div.className = 'grid__item val_1024';
          break;
        }
        case '2048': {
          div.className = 'grid__item val_2048';
          break;
        }
      }
    }
  }

  pressKey(event) {
    switch(event.keyCode) {
      case 37: {
        this.animationLeft(115);
        setTimeout(this.buttonLeft.bind(this), 200);
        break;
      }
      case 38: {
        this.animationTop(115);
        setTimeout(this.buttonTop.bind(this), 200);
        break;
      }
      case 39: {
        this.animationRight(115);
        setTimeout(this.buttonRight.bind(this), 200);
        break;
      }
      case 40: {
        this.animationBottom(115);
        setTimeout(this.buttonBottom.bind(this), 200);
        break;
      }
    }
  }

  start() {
    this.createHtmlBoard();
    this.generateNewNumber();
    this.generateNewNumber();
    document.addEventListener('keydown', this.pressKey.bind(this));
    document.querySelector('.newGame').addEventListener('click', this.newGame.bind(this));

    document.addEventListener('touchstart', this.touchStart.bind(this));
    document.addEventListener('touchend', this.touchEnd.bind(this));
  }

  newGame() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j].textContent = '';
        this.board[i][j].className = 'grid__item';
      }
    } 

    this.score = 0;
    this.updateScore();
    this.generateNewNumber();
    this.generateNewNumber();
  }

  checkLose() {
    let fillDivs = this.getBoardNumbers(this.board);
    let rowC = 0; //row counter

    for (const row of this.board) {
      let rowDivs = fillDivs[rowC];
      for (let i = row.length - 1; i > 0; i--) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[rowDivs.length - 1].textContent === rowDivs[rowDivs.length - 2].textContent) { 
          return false;
        } else if(row[i] === rowDivs[rowDivs.length - 1]) { 
          rowDivs.pop()
        } else if(row[i].textContent === '' && rowDivs.length > 0) {
          return false;
        }
      }
      rowC++;
    }

    let verticalBoard = this.getVerticalBoard();
    fillDivs = this.getBoardNumbers(verticalBoard);
    rowC = 0; //row counter

    for (let i = 0; i < this.board.length; i++) {
      let rowDivs = fillDivs[rowC];
      for (let j = 0; j < this.board.length; j++) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[0].textContent === rowDivs[1].textContent) {
          return false;
        } else if (this.board[j][i] === rowDivs[0]) {
          rowDivs.shift();
        } else if(this.board[j][i].textContent === '' && rowDivs.length > 0) {
          return false;
        }
      }
      rowC++;
    }

    return true;
  }

  isLose() {
    let boardHasEmptyDiv = this.board.some(row => row.some(div => div.textContent === ''));
    if(boardHasEmptyDiv === false) {
      if (this.checkLose() === true) {
        alert('You lose! Try again :)');
        this.newGame();
      }
    }
  }

  updateScore() {
    document.querySelector('.score_counter').textContent = this.score;
  }

  touchStart(event) {
    this.startY = event.touches[0].clientY;
    this.startX = event.touches[0].clientX;
  }

  touchEnd(event) {
    let endY = event.changedTouches[0].clientY;
    let endX = event.changedTouches[0].clientX;
    let verticalResult;
    let horisontalResult;

    if (this.startY < endY) {
      verticalResult = endY - this.startY;
    } else {
      verticalResult = this.startY - endY;
    }

    if (this.startX < endX) {
      horisontalResult = endX - this.startX;
    } else {
      horisontalResult = this.startX - endX;
    }

    if (horisontalResult === verticalResult) return;

    if (horisontalResult > verticalResult) {
      if (horisontalResult - verticalResult < 10) return;
      if (this.startX < endX) {
        this.animationRight(58);
        setTimeout(this.buttonRight.bind(this), 200);       
      } else {
        this.animationLeft(58);
        setTimeout(this.buttonLeft.bind(this), 200);
      }
    } else {
      if (verticalResult - horisontalResult < 10) return;
      if (this.startY < endY) {
        this.animationBottom(58);
        setTimeout(this.buttonBottom.bind(this), 200);   
      } else {
        this.animationTop(58);
        setTimeout(this.buttonTop.bind(this), 200);   
      }
    }
  }

  setDataValue() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j].dataset.value = this.board[i][j].textContent;
      }
    }
  }

  copyArr() {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let j = 0; j < 4; j++) {
        row.push(this.board[i][j]);
      }
      arr.push(row);
    }
    return arr;
  }
  animationLeft(moveWidth) {
    this.setDataValue();
    let animBoard = this.copyArr(this.board);
    let fillDivs = this.getBoardNumbers(animBoard);
    let rowC = 0; // row counter

    for (const row of animBoard) {
      let rowDivs = fillDivs[rowC]; 
      for (let i = 0; i < row.length; i++) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[0].textContent === rowDivs[1].textContent) {
          let index;
          if(rowDivs[0] === row[i]) {
            rowDivs.shift();
            index = row.indexOf(rowDivs.shift(), i + 1);
            row[index].style.cssText += `transition: transform 0.2s; transform: translate(-${(index - i) * moveWidth}px, 0px);`;
            row[index].dataset.value = '';
          } else {
            index = row.indexOf(rowDivs.shift(), i + 1);
            row[index].style.cssText += `transition: transform 0.2s; transform: translate(-${(index - i) * moveWidth}px, 0px);`;
            let buffer = row[i];
            row[i] = row[index];
            row[index] = buffer;
            index = row.indexOf(rowDivs.shift(), i + 1);
            if (index !== -1) {
              row[index].style.cssText += `transition: transform 0.2s; transform: translate(-${(index - i) * moveWidth}px, 0px);`;
            }
          }
        } else if (row[i] === rowDivs[0]) {
          rowDivs.shift();
        } else if(row[i].dataset.value === '' && rowDivs.length > 0) {
          let index = row.indexOf(rowDivs.shift(), i + 1);
          row[index].style.cssText += `transition: transform 0.2s; transform: translate(-${(index - i) * moveWidth}px, 0px);`;

          let buffer = row[i];
          row[i] = row[index];
          row[index] = buffer;
          row[index].dataset.value = '';
        }
      }
      rowC++;
    }
  }

  animationRight(moveWidth) {
    this.setDataValue();
    let animBoard = this.copyArr(this.board);
    let fillDivs = this.getBoardNumbers(animBoard);
    let rowC = 0; //row counter

    for (const row of animBoard) {
      let rowDivs = fillDivs[rowC]; 
      for (let i = row.length - 1; i > 0; i--) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[rowDivs.length - 1].textContent === rowDivs[rowDivs.length - 2].textContent) {
          let index;
          if(rowDivs[rowDivs.length -1] === row[i]) {
            rowDivs.pop();
            index = row.lastIndexOf(rowDivs.pop(), i - 1);
            row[index].style.cssText += `transition: transform 0.2s; transform: translate(${(i - index) * moveWidth}px, 0px);`;
            row[index].dataset.value = '';
          } else {
            index = row.lastIndexOf(rowDivs.pop(), i - 1);
            row[index].style.cssText += `transition: transform 0.2s; transform: translate(${(i - index) * moveWidth}px, 0px);`;
            let buffer = row[i];
            row[i] = row[index];
            row[index] = buffer;
            index = row.lastIndexOf(rowDivs.pop(), i - 1);
            if (index !== -1) {
              row[index].style.cssText += `transition: transform 0.2s; transform: translate(${(i - index) * moveWidth}px, 0px);`;
            }
          } 
        } else if(row[i] === rowDivs[rowDivs.length - 1]) { 
          rowDivs.pop()
        } else if(row[i].textContent === '' && rowDivs.length > 0) {
          let index = row.lastIndexOf(rowDivs.pop(), i - 1);
          row[index].style.cssText += `transition: transform 0.2s; transform: translate(${(i - index) * moveWidth}px, 0px);`;

          let buffer = row[i];
          row[i] = row[index];
          row[index] = buffer;
          row[index].dataset.value = '';
        }
      }
      rowC++;
    }
  }

  animationTop(moveWidth) {
    this.setDataValue();
    let animBoard = this.copyArr(this.board);
    let verticalBoard = this.getVerticalBoard();
    let fillDivs = this.getBoardNumbers(verticalBoard);
    let rowC = 0; //row counter


    for (let i = 0; i < animBoard.length; i++) {
      let rowDivs = fillDivs[rowC];
      for (let j = 0; j < animBoard.length; j++) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[0].textContent === rowDivs[1].textContent) {
          let index;
          if(rowDivs[0] === animBoard[j][i]) {
            rowDivs.shift();
            index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 1);
            verticalBoard[rowC].splice(index, 1, null);
            animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, -${(index - j) * moveWidth}px);`;
            animBoard[index][i].dataset.value = '';
          } else {
            index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 1);
            verticalBoard[rowC].splice(index, 1, null);
            animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, -${(index - j) * moveWidth}px);`;
            let buffer = animBoard[j][i];
            animBoard[j][i] = animBoard[index][i];
            animBoard[index][i] = buffer;
            index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 2);
            if (index !== -1) {
              animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, -${(index - j) * moveWidth}px);`;
              verticalBoard[rowC].splice(index, 1, null);
            }
          }
        } else if (animBoard[j][i] === rowDivs[0]) {
          rowDivs.shift();
        } else if(animBoard[j][i].textContent === '' && rowDivs.length > 0) {
          let index = verticalBoard[rowC].indexOf(rowDivs.shift(), j + 1);
          animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, -${(index - j) * moveWidth}px);`;

          let buffer = animBoard[j][i];
          animBoard[j][i] = animBoard[index][i];
          animBoard[index][i] = buffer;
          verticalBoard[rowC].splice(index, 1, null);
          animBoard[index][i].dataset.value = '';
        }
      }
      rowC++;
    }
  }

  animationBottom(moveWidth) {
    this.setDataValue();
    let animBoard = this.copyArr(this.board);
    let verticalBoard = this.getVerticalBoard();
    let fillDivs = this.getBoardNumbers(verticalBoard);
    let rowC = 0;

    for (let i = 0; i < animBoard.length; i++) {
      let rowDivs = fillDivs[rowC];
      for (let j = animBoard.length - 1; j > 0; j--) {
        if (rowDivs.length === 0) break;
        if (rowDivs.length >= 2 && rowDivs[rowDivs.length - 1].textContent === rowDivs[rowDivs.length - 2].textContent) {
          let index;
          if(rowDivs[rowDivs.length - 1] === animBoard[j][i]) {
            rowDivs.pop();
            index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 1);
            verticalBoard[rowC].splice(index, 1, null);
            animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, ${(j - index) * moveWidth}px);`;
            animBoard[index][i].dataset.value = '';
          } else {
            let element = animBoard[j][i].textContent;
            index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 1);
            verticalBoard[rowC].splice(index, 1, null);
            animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, ${(j - index) * moveWidth}px);`;
            let buffer = animBoard[j][i];
            animBoard[j][i] = animBoard[index][i];
            animBoard[index][i] = buffer;
            index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 2);
            if (index !== -1) {
              animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, ${(j - index) * moveWidth}px);`;
              verticalBoard[rowC].splice(index, 1, null);
            }
          }
        } else if (animBoard[j][i] === rowDivs[rowDivs.length - 1]) {
          rowDivs.pop();
        } else if(animBoard[j][i].textContent === '' && rowDivs.length > 0) {
          let index = verticalBoard[rowC].lastIndexOf(rowDivs.pop(), j - 1);
          animBoard[index][i].style.cssText += `transition: transform 0.2s; transform: translate(0px, ${(j - index) * moveWidth}px);`;

          let buffer = animBoard[j][i];
          animBoard[j][i] = animBoard[index][i];
          animBoard[index][i] = buffer;
          verticalBoard[rowC].splice(index, 1, null);
          animBoard[index][i].dataset.value = '';
        }
      }
      rowC++;
    }
  }
}



let game = new Game2048();
game.start();