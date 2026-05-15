const gridElement = document.getElementById('grid');
const shuffleButton = document.getElementById('shuffleButton');
const messageElement = document.getElementById('message');

let tiles = [];

function createTiles() {
  tiles = [1, 2, 3, 4, 5, 6, 7, 8, null];
}

function shuffleTiles() {
  const copy = [...tiles];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (!isSolvable(copy) || isSolved(copy)) {
    return shuffleTiles();
  }
  tiles = copy;
}

function isSolvable(array) {
  const numbers = array.filter((n) => n !== null);
  let inversions = 0;
  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      if (numbers[i] > numbers[j]) inversions += 1;
    }
  }
  return inversions % 2 === 0;
}

function isSolved(array) {
  for (let i = 0; i < 8; i += 1) {
    if (array[i] !== i + 1) return false;
  }
  return array[8] === null;
}

function renderGrid() {
  gridElement.innerHTML = '';
  tiles.forEach((value, index) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    if (value === null) {
      tile.classList.add('empty');
      tile.textContent = '';
      tile.setAttribute('aria-label', 'Case vide');
    } else {
      tile.textContent = value;
      tile.setAttribute('aria-label', `Nombre ${value}`);
    }
    tile.addEventListener('click', () => handleTileClick(index));
    gridElement.appendChild(tile);
  });
}

function handleTileClick(index) {
  const emptyIndex = tiles.indexOf(null);
  const canMove = isAdjacent(index, emptyIndex);
  if (!canMove) return;
  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  renderGrid();
  if (isSolved(tiles)) {
    messageElement.textContent = 'Bravo ! Vous avez réussi à réordonner les nombres.';
  } else {
    messageElement.textContent = '';
  }
}

function isAdjacent(indexA, indexB) {
  const rowA = Math.floor(indexA / 3);
  const colA = indexA % 3;
  const rowB = Math.floor(indexB / 3);
  const colB = indexB % 3;
  return (Math.abs(rowA - rowB) === 1 && colA === colB) ||
         (Math.abs(colA - colB) === 1 && rowA === rowB);
}

shuffleButton.addEventListener('click', () => {
  shuffleTiles();
  renderGrid();
  messageElement.textContent = 'Le carré est mélangé. Cliquez sur une case adjacente à la case vide pour la déplacer.';
});

createTiles();
renderGrid();
messageElement.textContent = 'Cliquez sur "Générer les nombres" pour commencer.';
