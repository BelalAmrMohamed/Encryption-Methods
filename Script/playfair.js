// function createKeyMatrix(key) {
//   let adjustedKey = "";
//   const seen = new Set();
//   for (let c of key.toLowerCase()) {
//     if (c === "j") c = "i";
//     if (/[a-z]/.test(c) && !seen.has(c)) {
//       adjustedKey += c;
//       seen.add(c);
//     }
//   }
//   for (let c of "abcdefghijklmnopqrstuvwxyz") {
//     if (c === "j") continue;
//     if (!seen.has(c)) {
//       adjustedKey += c;
//       seen.add(c);
//     }
//   }
//   const matrix = [];
//   let index = 0;
//   for (let i = 0; i < 5; i++) {
//     matrix.push([]);
//     for (let j = 0; j < 5; j++) {
//       matrix[i].push(adjustedKey[index++]);
//     }
//   }
//   displayMatrix(matrix);
//   return matrix;
// }

// function displayMatrix(matrix) {
//   const matrixDiv = document.getElementById("matrix");
//   let tableHTML = '<table class="matrix-table">';
//   for (let row of matrix) {
//     tableHTML += "<tr>";
//     for (let cell of row) {
//       tableHTML += `<td>${cell.toUpperCase()}</td>`;
//     }
//     tableHTML += "</tr>";
//   }
//   tableHTML += "</table>";
//   matrixDiv.innerHTML = `<h3>5×5 Matrix:</h3>${tableHTML}`;
// }

// function preprocessText(text) {
//   let cleanText = "";
//   for (let c of text.toLowerCase()) {
//     if (/[a-z]/.test(c)) {
//       cleanText += c === "j" ? "i" : c;
//     }
//   }
//   let processedText = "";
//   for (let i = 0; i < cleanText.length; i++) {
//     processedText += cleanText[i];
//     if (i + 1 < cleanText.length && cleanText[i] === cleanText[i + 1]) {
//       processedText += "x";
//     }
//   }
//   if (processedText.length % 2 !== 0) {
//     processedText += "x";
//   }
//   return processedText;
// }

// function findPosition(matrix, char) {
//   for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//       if (matrix[i][j] === char) {
//         return [i, j];
//       }
//     }
//   }
//   return [-1, -1];
// }

// function processPair(matrix, a, b, encrypt) {
//   const [rowA, colA] = findPosition(matrix, a);
//   const [rowB, colB] = findPosition(matrix, b);
//   const shift = encrypt ? 1 : -1;

//   if (rowA === rowB) {
//     return (
//       matrix[rowA][(colA + shift + 5) % 5] +
//       matrix[rowB][(colB + shift + 5) % 5]
//     );
//   } else if (colA === colB) {
//     return (
//       matrix[(rowA + shift + 5) % 5][colA] +
//       matrix[(rowB + shift + 5) % 5][colB]
//     );
//   } else {
//     return matrix[rowA][colB] + matrix[rowB][colA];
//   }
// }

// function playfairCipher(message, matrix, encrypt) {
//   const processedText = preprocessText(message);
//   let result = "";
//   for (let i = 0; i < processedText.length; i += 2) {
//     result += processPair(
//       matrix,
//       processedText[i],
//       processedText[i + 1],
//       encrypt,
//     );
//   }
//   return result.toUpperCase();
// }

// function handleEncryption() {
//   const keyword = document.getElementById("keyword").value;
//   const plaintext = document.getElementById("plaintext").value;
//   const matrix = createKeyMatrix(keyword);
//   const ciphertext = playfairCipher(plaintext, matrix, true);
//   document.getElementById("cipherResult").innerText =
//     `Ciphertext: ${ciphertext}`;
// }

// function handleDecryption() {
//   const keyword = document.getElementById("keyword").value;
//   const ciphertext = document.getElementById("plaintext").value;
//   const matrix = createKeyMatrix(keyword);
//   const plaintext = playfairCipher(ciphertext, matrix, false);
//   document.getElementById("cipherResult").innerText =
//     `Decrypted Text: ${plaintext}`;
// }
function createKeyMatrix(key) {
  let adjustedKey = "";
  const seen = new Set();
  for (let c of key.toLowerCase()) {
    if (c === "j") c = "i";
    if (/[a-z]/.test(c) && !seen.has(c)) {
      adjustedKey += c;
      seen.add(c);
    }
  }
  for (let c of "abcdefghijklmnopqrstuvwxyz") {
    if (c === "j") continue;
    if (!seen.has(c)) {
      adjustedKey += c;
      seen.add(c);
    }
  }
  const matrix = [];
  let index = 0;
  for (let i = 0; i < 5; i++) {
    matrix.push([]);
    for (let j = 0; j < 5; j++) {
      matrix[i].push(adjustedKey[index++]);
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
      tableHTML += `<td>${cell.toUpperCase()}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";
  matrixDiv.innerHTML = `<h3>5×5 Matrix:</h3>${tableHTML}`;
}

function preprocessText(text) {
  let cleanText = "";
  for (let c of text.toLowerCase()) {
    if (/[a-z]/.test(c)) {
      cleanText += c === "j" ? "i" : c;
    }
  }
  let processedText = "";
  for (let i = 0; i < cleanText.length; i++) {
    processedText += cleanText[i];
    if (i + 1 < cleanText.length && cleanText[i] === cleanText[i + 1]) {
      processedText += "x";
    }
  }
  if (processedText.length % 2 !== 0) {
    processedText += "x";
  }
  return processedText;
}

function findPosition(matrix, char) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}

function processPair(matrix, a, b, encrypt) {
  const [rowA, colA] = findPosition(matrix, a);
  const [rowB, colB] = findPosition(matrix, b);
  const shift = encrypt ? 1 : -1;

  if (rowA === rowB) {
    return (
      matrix[rowA][(colA + shift + 5) % 5] +
      matrix[rowB][(colB + shift + 5) % 5]
    );
  } else if (colA === colB) {
    return (
      matrix[(rowA + shift + 5) % 5][colA] +
      matrix[(rowB + shift + 5) % 5][colB]
    );
  } else {
    return matrix[rowA][colB] + matrix[rowB][colA];
  }
}

/**
 * FIXED: Decryption path now avoids destructive preprocessing.
 */
function playfairCipher(message, matrix, encrypt) {
  let processedText = "";

  if (encrypt) {
    // Standard preprocessing for encryption (inserting 'X', padding)
    processedText = preprocessText(message);
  } else {
    // For decryption, only clean non-alphabet characters and handle J->I.
    // Do not insert 'X' between letters, as the ciphertext already contains valid digraphs.
    for (let c of message.toLowerCase()) {
      if (/[a-z]/.test(c)) {
        processedText += c === "j" ? "i" : c;
      }
    }
    // Safety check: Valid Playfair ciphertext is always even in length.
    if (processedText.length % 2 !== 0) {
      processedText += "x";
    }
  }

  let result = "";
  for (let i = 0; i < processedText.length; i += 2) {
    result += processPair(
      matrix,
      processedText[i],
      processedText[i + 1],
      encrypt,
    );
  }
  return result.toUpperCase();
}

function handleEncryption() {
  const keyword = document.getElementById("keyword").value;
  const plaintext = document.getElementById("plaintext").value;
  const matrix = createKeyMatrix(keyword);
  const ciphertext = playfairCipher(plaintext, matrix, true);
  document.getElementById("cipherResult").innerText =
    `Ciphertext: ${ciphertext}`;
}

function handleDecryption() {
  const keyword = document.getElementById("keyword").value;
  const ciphertext = document.getElementById("plaintext").value;
  const matrix = createKeyMatrix(keyword);
  const plaintext = playfairCipher(ciphertext, matrix, false);
  document.getElementById("cipherResult").innerText =
    `Decrypted Text: ${plaintext}`;
}
