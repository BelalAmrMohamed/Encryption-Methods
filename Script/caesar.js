const alphabet = "abcdefghijklmnopqrstuvwxyz";

function encryptWord() {
  let word = document.getElementById("word").value;
  const key = parseInt(document.getElementById("key").value);

  // Remove any non-alphabet characters and convert everything to uppercase
  word = word.replace(/[^a-zA-Z]/g, "").toUpperCase();

  const cipheredWord = transformWord(word, key);
  document.getElementById("result").innerText =
    `Ciphered Word: ${cipheredWord}`;
}

function decryptWord() {
  let word = document.getElementById("word").value;
  const key = parseInt(document.getElementById("key").value);

  // Remove any non-alphabet characters and convert everything to uppercase
  word = word.replace(/[^a-zA-Z]/g, "").toUpperCase();

  const decipheredWord = transformWord(word, -key);
  document.getElementById("result").innerText =
    `Deciphered Word: ${decipheredWord}`;
}

function transformWord(word, shift) {
  let result = "";

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const lowerChar = char.toLowerCase();

    if (alphabet.includes(lowerChar)) {
      const oldPos = alphabet.indexOf(lowerChar);
      const newPos = (oldPos + shift + 26) % 26; // Add 26 to handle negative shifts
      const newChar = alphabet[newPos];
      result += newChar.toUpperCase(); // Ensure the output is uppercase
    }
  }

  return result;
}
