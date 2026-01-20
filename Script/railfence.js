/**
 * Creates the zigzag matrix for a given word and row count.
 * Returns an array of arrays where unused spots are null.
 */
function createMatrix(word, rows) {
  if (rows < 2) return [[...word]];

  const matrix = Array.from({ length: rows }, () =>
    Array(word.length).fill(null),
  );
  let currRow = 0;
  let descending = false;

  for (let i = 0; i < word.length; i++) {
    matrix[currRow][i] = "*"; // Mark the path

    // Change direction at top or bottom row
    if (currRow === 0 || currRow === rows - 1) {
      descending = !descending;
    }
    currRow += descending ? 1 : -1;
  }
  return matrix;
}

/**
 * Encrypts a word by reading the zigzag matrix row by row.
 */
function encryptWord(word, rows) {
  if (rows < 2) return word;

  const matrix = createMatrix(word, rows);
  let charIndex = 0;

  // Place letters in the zigzag path
  // (Re-running logic to place actual letters)
  let currRow = 0;
  let descending = false;
  for (let i = 0; i < word.length; i++) {
    matrix[currRow][i] = word[i];
    if (currRow === 0 || currRow === rows - 1) descending = !descending;
    currRow += descending ? 1 : -1;
  }

  // Read row by row, ignoring empty spots
  return matrix
    .flat()
    .filter((char) => char !== null)
    .join("");
}

/**
 * Decrypts a word by filling the matrix row by row and reading in a zigzag.
 */
function decryptWord(word, rows) {
  if (rows < 2) return word;

  const matrix = createMatrix(word, rows); // Get the "*" path
  let charIndex = 0;

  // Fill the marked path row by row with encrypted characters
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < word.length; c++) {
      if (matrix[r][c] === "*" && charIndex < word.length) {
        matrix[r][c] = word[charIndex++];
      }
    }
  }

  // Read the matrix in a zigzag to get the original word
  let result = "";
  let currRow = 0;
  let descending = false;
  for (let i = 0; i < word.length; i++) {
    result += matrix[currRow][i];
    if (currRow === 0 || currRow === rows - 1) descending = !descending;
    currRow += descending ? 1 : -1;
  }
  return result;
}

// ========== Online functions ==========
function encryptWord(text, key) {
  // create the matrix to cipher plain text
  // key = rows , text.length = columns
  let rail = new Array(key).fill().map(() => new Array(text.length).fill("\n"));

  // filling the rail matrix to distinguish filled
  // spaces from blank ones
  let dir_down = false;
  let row = 0,
    col = 0;

  for (let i = 0; i < text.length; i++) {
    // check the direction of flow
    // reverse the direction if we've just
    // filled the top or bottom rail
    if (row == 0 || row == key - 1) dir_down = !dir_down;

    // fill the corresponding alphabet
    rail[row][col++] = text[i];

    // find the next row using direction flag
    dir_down ? row++ : row--;
  }

  // now we can construct the cipher using the rail matrix
  let result = "";
  for (let i = 0; i < key; i++)
    for (let j = 0; j < text.length; j++)
      if (rail[i][j] != "\n") result += rail[i][j];

  return result;
}

function decryptWord(cipher, key) {
  // create the matrix to cipher plain text
  // key = rows , text.length = columns
  let rail = new Array(key)
    .fill()
    .map(() => new Array(cipher.length).fill("\n"));

  // filling the rail matrix to mark the places with '*'
  let dir_down = false;
  let row = 0,
    col = 0;

  for (let i = 0; i < cipher.length; i++) {
    // check the direction of flow
    if (row == 0) dir_down = true;
    if (row == key - 1) dir_down = false;

    // place the marker
    rail[row][col++] = "*";

    // find the next row using direction flag
    dir_down ? row++ : row--;
  }

  // now we can construct the rail matrix by filling the marked places with cipher text
  let index = 0;
  for (let i = 0; i < key; i++)
    for (let j = 0; j < cipher.length; j++)
      if (rail[i][j] == "*" && index < cipher.length)
        rail[i][j] = cipher[index++];

  // now read the matrix in zig-zag manner to construct the resultant text
  let result = "";
  ((row = 0), (col = 0));
  for (let i = 0; i < cipher.length; i++) {
    // check the direction of flow
    if (row == 0) dir_down = true;
    if (row == key - 1) dir_down = false;

    // place the marker
    if (rail[row][col] != "*") result += rail[row][col++];

    // find the next row using direction flag
    dir_down ? row++ : row--;
  }

  return result;
}
