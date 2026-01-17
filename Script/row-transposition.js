function prepareMessage(message) {
  return message.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function createMatrix(message, rows, cols) {
  let matrix = [];
  let index = 0;
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(index < message.length ? message[index++] : "X");
    }
    matrix.push(row);
  }
  return matrix;
}

function displayMatrix(matrix, key) {
  const table = document.getElementById("matrix");
  table.innerHTML = "";

  // Display the header row (original key order)
  const headerRow = document.createElement("tr");
  key.split("").forEach((char) => {
    const th = document.createElement("th");
    th.innerText = char;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Append the matrix rows
  matrix.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.innerText = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

function encryptMessage(message, key) {
  const cols = key.length;
  const rows = Math.ceil(message.length / cols);
  const matrix = createMatrix(message, rows, cols);

  const keyOrder = key
    .split("")
    .map((char, i) => ({ char, index: i }))
    .sort((a, b) => a.char.localeCompare(b.char));

  displayMatrix(matrix, key);

  let ciphertext = "";
  keyOrder.forEach((pair) => {
    const col = pair.index;
    for (let row = 0; row < rows; row++) {
      ciphertext += matrix[row][col];
    }
  });
  return ciphertext;
}

function decryptMessage(ciphertext, key) {
  const cols = key.length;
  const rows = Math.ceil(ciphertext.length / cols);
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(""));

  const keyOrder = key
    .split("")
    .map((char, i) => ({ char, index: i }))
    .sort((a, b) => a.char.localeCompare(b.char));

  let index = 0;
  keyOrder.forEach((pair) => {
    const col = pair.index;
    for (let row = 0; row < rows; row++) {
      matrix[row][col] = ciphertext[index++];
    }
  });

  let plaintext = "";
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      plaintext += matrix[row][col];
    }
  }

  displayMatrix(matrix, key); // Display the matrix for decryption
  return plaintext.replace(/X+$/, "");
}

function encrypt() {
  const plaintext = document.getElementById("plaintext").value;
  const key = document.getElementById("key").value;

  if (!plaintext || !key) {
    alert("Please fill in both the message and the key.");
    return;
  }

  const preparedMessage = prepareMessage(plaintext);
  const ciphertext = encryptMessage(preparedMessage, key);

  document.getElementById("output").innerText = "Ciphertext: " + ciphertext;
}

function decrypt() {
  const ciphertext = document.getElementById("plaintext").value.trim();
  const key = document.getElementById("key").value;

  if (!ciphertext || !key) {
    alert("Please fill in both the message and the key.");
    return;
  }

  const plaintext = decryptMessage(ciphertext, key);

  document.getElementById("output").innerText = "Plaintext: " + plaintext;
}
