import { COLS_COUNT, ROWS_COUNT, generateRows } from './generateField';

generateRows(ROWS_COUNT, COLS_COUNT);

let turns = [];
let cancelledTurns = [];
const CELLS = Array.from(document.querySelectorAll('.cell'));
const UNDO_BTN = document.querySelector('.undo-btn');
const REDO_BTN = document.querySelector('.redo-btn');
const WON_TITLE = document.querySelector('.won-title');
const RESTART_BTN = document.querySelector('.restart-btn');
const ROWS = ROWS_COUNT;
const COLS = COLS_COUNT;
const CROSSES = document.querySelector('.ch');
const TOES = document.querySelector('.r');
const WINNING_COMBINATIONS = getWinningCombinations(ROWS, COLS);
let currentClass;
let currentTurn = false;
let winCombination;

window.addEventListener('storage', event => {
  if (event.key === 'allTurns' && event.oldValue !== event.newValue && event.newValue !== null) {
    const saved = JSON.parse(localStorage.getItem('allTurns'));
    turns = saved[0];
    cancelledTurns = saved[1];
    turns.forEach(_ => document.querySelector(`#c-${_.id}`).classList.add(_.currentClass));
    cancelledTurns.forEach(_ => document.querySelector(`#c-${_.id}`).classList.remove(_.currentClass));
    if (CROSSES && TOES) {
      currentTurn = CROSSES.length > TOES.length;
    }
    currentTurn = !currentTurn;
    changeButtonsActivity();
    checkDrawWin();
  }
  if (event.newValue === null) {
    restartCheck();
    WON_TITLE.classList.add('hidden');
    turns = [];
    currentTurn = false;
    resetGame();
  }
});

if (JSON.parse(localStorage.getItem('allTurns'))) {
  const saved = JSON.parse(localStorage.getItem('allTurns'));
  turns = saved[0];
  cancelledTurns = saved[1];
  currentTurn = saved[2];
  turns.forEach(_ => document.querySelector(`#c-${_.id}`).classList.add(_.currentClass));
  changeButtonsActivity();
  checkDrawWin();
}

addListeners();

function resetGame() {
  CELLS.map(el => (el.classList = 'cell'));
  UNDO_BTN.disabled = true;
  REDO_BTN.disabled = true;
  WON_TITLE.classList.add('hidden');
  turns = [];
  cancelledTurns = [];
  localStorage.removeItem('allTurns');
}

function addListeners() {
  CELLS.forEach(_ => _.addEventListener('click', processClick));
  UNDO_BTN.addEventListener('click', undo);
  REDO_BTN.addEventListener('click', redo);
  RESTART_BTN.addEventListener('click', resetGame);
}

function processClick(event) {
  setTurn();
  editCell(event.target);
  changeButtonsActivity();
  checkDrawWin();
  setLocalStorage();
}

function editCell(target) {
  if (checkForDraw() || checkForWin()) {
    return;
  }
  const id = CELLS.indexOf(target);
  cancelledTurns = [];
  target.classList.add(currentClass);
  turns.push({ id, currentClass });
}

function setTurn() {
  currentClass = currentTurn ? 'r' : 'ch';
  currentTurn = !currentTurn;
  changeButtonsActivity();
}

function undo() {
  const lastItem = turns.pop();
  cancelledTurns.push(lastItem);
  setLocalStorage();
  CELLS[lastItem.id].classList.remove(lastItem.currentClass);
  setTurn();
}

function redo() {
  const lastItem = cancelledTurns.pop();
  turns.push(lastItem);
  setLocalStorage();
  CELLS[lastItem.id].classList.add(lastItem.currentClass);
  setTurn();
}

function changeButtonsActivity() {
  UNDO_BTN.disabled = turns.length === 0;
  REDO_BTN.disabled = cancelledTurns.length === 0;
}

function getWinningCombinations(ROWS, COLS) {
  let horizontal = [];
  for (let i = 0; i < COLS; i++) {
    horizontal.push(i);
  }
  horizontal = Array.apply(null, Array(COLS)).map(_ => horizontal);
  horizontal = horizontal.map((array, index) => array.map(element => (element += COLS * index)));

  let vertical = [];

  for (let i = 0; i < ROWS; i++) {
    vertical.push(i * ROWS);
  }
  vertical = Array.apply(null, Array(ROWS)).map(() => vertical);
  vertical = vertical.map((array, index) => array.map(element => (element += 1 * index)));

  const diagonalRight = [];

  for (let i = 0; i < ROWS; i++) {
    diagonalRight.push(i + i * ROWS);
  }

  const diagonalLeft = [];

  for (let i = 0; i < ROWS; i++) {
    diagonalLeft.push(i * (ROWS - 1) + (ROWS - 1));
  }

  const winningCombinations = horizontal.concat(vertical);
  winningCombinations.push(diagonalRight);
  winningCombinations.push(diagonalLeft);

  return winningCombinations;
}

function setClassForWinningCells(array, index) {
  if (index >= 0 && index < ROWS) {
    array.forEach(element => CELLS[element].classList.add('win', 'horizontal'));
  } else if (index >= ROWS && index < ROWS * 2) {
    array.forEach(element => CELLS[element].classList.add('win', 'vertical'));
  } else if (index === WINNING_COMBINATIONS.length - 1) {
    array.forEach(element => CELLS[element].classList.add('win', 'diagonal-left'));
  } else if (index === WINNING_COMBINATIONS.length - 2) {
    array.forEach(element => CELLS[element].classList.add('win', 'diagonal-right'));
  }
}

function checkForWin() {
  return WINNING_COMBINATIONS.some((combination, index) => {
    winCombination = index;
    return (
      combination.every(cell => CELLS[cell].classList.contains('r')) ||
      combination.every(cell => CELLS[cell].classList.contains('ch'))
    );
  });
}

function endGame() {
  WON_TITLE.classList.remove('hidden');
  UNDO_BTN.disabled = true;
  REDO_BTN.disabled = true;
  currentTurn = false;
}

function checkForDraw() {
  return CELLS.every(cell => cell.classList.contains('ch') || cell.classList.contains('r'));
}

function setLocalStorage() {
  localStorage.setItem('allTurns', JSON.stringify([turns, cancelledTurns, currentTurn]));
}

function checkDrawWin() {
  if (checkForWin()) {
    setClassForWinningCells(WINNING_COMBINATIONS[winCombination], winCombination);
    endGame();
    document.querySelector('.won-message').textContent = `${
      document.querySelector('.win').classList.contains('ch') ? 'Crosses' : 'Toes'
    } won!`;
  } else if (checkForDraw()) {
    endGame();
    document.querySelector('.won-message').textContent = "It's draw!";
  }
}

function restartCheck() {
  if (localStorage.length === 0) {
    CELLS.forEach(_ => (_.classList = 'cell'));
  }
}
