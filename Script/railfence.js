function createMatrix(word, rows) {
  const cols = Math.ceil(word.length / rows);
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(""));

  let index = 0;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (index < word.length) {
        matrix[row][col] = word[index++];
      }
    }
  }

  displayMatrix(matrix);
  return matrix;
}

function displayMatrix(matrix) {
  const matrixDiv = document.getElementById("matrix");
  let tableHTML = '<table class="matrix-table">';
  for (let row of matrix) {
    tableHTML += "<tr>";
    for (let cell of row) {
      tableHTML += `<td>${cell || ""}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  matrixDiv.innerHTML = `<h3>Matrix:</h3>${tableHTML}`;
}

function cipherWord(word, rows) {
  const matrix = createMatrix(word, rows);
  let cipheredWord = "";
  for (let row of matrix) {
    for (let cell of row) {
      if (cell) cipheredWord += cell;
    }
  }
  return cipheredWord;
}

function decryptWord() {
  let encrypted = document
    .getElementById("word")
    .value.toUpperCase()
    .replace(/[^A-Z]/g, "");
  const rows = parseInt(document.getElementById("rows").value);
  const cols = Math.ceil(encrypted.length / rows);
  const matrix = Array.from({ length: rows }, () => []);

  // Fill the matrix column by column
  let index = 0;
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (index < encrypted.length) {
        matrix[row][col] = encrypted[index++];
      }
    }
  }

  // Read the matrix row by row
  let decryptedWord = "";
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (matrix[row][col]) decryptedWord += matrix[row][col];
    }
  }

  document.getElementById("result").innerText =
    `Decrypted Word: ${decryptedWord}`;
}

function encryptWord() {
  let word = document
    .getElementById("word")
    .value.toUpperCase()
    .replace(/[^A-Z]/g, "");
  const rows = parseInt(document.getElementById("rows").value);
  const ciphered = cipherWord(word, rows);
  document.getElementById("result").innerText = `Ciphered Word: ${ciphered}`;
}
