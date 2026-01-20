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
