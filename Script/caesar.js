const alphabet = "abcdefghijklmnopqrstuvwxyz";

function encryptWord(key = parseInt(document.getElementById("key").value)) {
  let word = document.getElementById("word").value;
  // const key = parseInt(document.getElementById("key").value);

  // Remove any non-alphabet characters and convert everything to uppercase
  word = word.replace(/[^a-zA-Z]/g, "").toUpperCase();

  const cipheredWord = transformWord(word, key);
  document.getElementById("result").innerText =
    `Ciphered Word: ${cipheredWord}`;
}

function decryptWord() {
  encryptWord(parseInt(document.getElementById("key").value) * -1);
}

function transformWord(word, key) {
  let result = "";
  for (let i = 0; i < word.length; i++) {
    const code = word.charCodeAt(i) - 65; // 'A' is 0

    // This is the "Magic Formula" for wrapping correctly:
    const shiftedCode = (((code + key) % 26) + 26) % 26;

    result += String.fromCharCode(shiftedCode + 65);
  }
  return result;
}
