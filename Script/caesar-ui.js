// caesar-ui.js

document.addEventListener("DOMContentLoaded", function () {
  const encryptBtn = document.getElementById("btn-encrypt");
  const decryptBtn = document.getElementById("btn-decrypt");
  const visualSection = document.getElementById("visualizer-section");
  const visualizerContainer = document.getElementById("caesar-visualizer");
  const visualExplanation = document.getElementById("visualizer-explanation");
  const exampleSection = document.getElementById("worked-example-section");
  const exampleContent = document.getElementById("worked-example-content");

  // --- Encryption Handler ---
  if (encryptBtn) {
    encryptBtn.addEventListener("click", function () {
      if (!validateInput()) return;

      // 1. Core Logic (from caesar.js)
      encryptWord();

      // 2. Setup Visuals
      const word = document.getElementById("word").value;
      const key = parseInt(document.getElementById("key").value);
      const resultText = document
        .getElementById("result")
        .innerText.replace("Ciphered Word: ", "");

      renderVisualizer(key, true);
      showWorkedExample(word, key, resultText, true);
    });
  }

  // --- Decryption Handler ---
  if (decryptBtn) {
    decryptBtn.addEventListener("click", function () {
      if (!validateInput()) return;

      // 1. Core Logic (from caesar.js)
      decryptWord();

      // 2. Setup Visuals
      const word = document.getElementById("word").value;
      const key = parseInt(document.getElementById("key").value);
      const resultText = document
        .getElementById("result")
        .innerText.replace("Ciphered Word: ", "");

      renderVisualizer(key, false);
      showWorkedExample(word, key, resultText, false);
    });
  }

  function validateInput() {
    const word = document.getElementById("word").value;
    const key = document.getElementById("key").value;
    if (!word || !key) {
      alert("Please enter both a message and a shift key.");
      return false;
    }
    return true;
  }

  // --- Visualizer Logic ---
  function renderVisualizer(key, isEncrypt) {
    visualSection.style.display = "block";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Create Top Row (Plaintext)
    let topRowHTML = `<span class="alphabet-label">Plaintext Alphabet:</span><div class="alphabet-row">`;
    for (let char of alphabet) {
      topRowHTML += `<div class="cell">${char}</div>`;
    }
    topRowHTML += `</div>`;

    // Create Bottom Row (Ciphertext / Shifted)
    // If Encrypting: Bottom row shifts Left (A maps to D)
    // Note: In visual representation, if A -> D (key 3), the D aligns under A.
    // So the bottom row starts at index 'key'.

    let bottomRowHTML = `<span class="alphabet-label">Ciphertext Alphabet (Shifted by ${isEncrypt ? key : -key}):</span><div class="alphabet-row">`;

    // for (let i = 0; i < 26; i++) {
    //   // Calculate which letter aligns here
    //   // If Key=3: Top A (idx 0) -> Bottom D (idx 3)
    //   // So the letter at bottom index 'i' is alphabet[(i + key) % 26]
    //   const shiftedIndex = (i + (isEncrypt ? key : -key)) % 26;
    //   const char = alphabet[shiftedIndex];
    //   bottomRowHTML += `<div class="cell highlight">${char}</div>`;
    // }

    for (let i = 0; i < 26; i++) {
      // Use the formula: ((n % m) + m) % m to handle negative numbers
      const shift = isEncrypt ? key : -key;
      const shiftedIndex = (((i + shift) % 26) + 26) % 26;

      const char = alphabet[shiftedIndex];
      bottomRowHTML += `<div class="cell highlight">${char}</div>`;
    }

    bottomRowHTML += `</div>`;

    visualizerContainer.innerHTML = topRowHTML + bottomRowHTML;

    // Explanation Text
    if (isEncrypt) {
      visualExplanation.innerText = `Look at the top row for your letter, then pick the letter directly below it to encrypt.`;
    } else {
      visualExplanation.innerText = `Look at the bottom row (Ciphertext) for your letter, then pick the letter directly above it to decrypt.`;
    }
  }

  // --- Worked Example Logic ---
  function showWorkedExample(original, key, result, isEncrypt) {
    const cleaned = original.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const resultClean = result.replace(/[^a-zA-Z]/g, "").toUpperCase();

    exampleSection.style.display = "block";

    // Dynamic Headers based on mode
    const modeTitle = isEncrypt ? "Encryption" : "Decryption";
    const mathSign = isEncrypt ? "+" : "-";
    const actionText = isEncrypt ? "Adding" : "Subtracting";

    // Generate step-by-step rows
    let tableRows = "";
    for (let i = 0; i < cleaned.length; i++) {
      const inputChar = cleaned[i];
      const outputChar = resultClean[i];

      // Calculate numeric values for explanation
      const inputCode = inputChar.charCodeAt(0) - 65;
      let mathStep = "";

      if (isEncrypt) {
        // (X + K) % 26
        const sum = inputCode + key;
        mathStep = `(${inputCode} + ${key}) = ${sum} &rarr; ${sum % 26}`;
      } else {
        // (X - K) % 26 ... handling negatives
        const diff = inputCode - key;
        // logic to show wrapping if negative
        if (diff < 0) {
          mathStep = `(${inputCode} - ${key}) = ${diff} (+26 wrap) &rarr; ${diff + 26}`;
        } else {
          mathStep = `(${inputCode} - ${key}) = ${diff}`;
        }
      }

      tableRows += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${inputChar}</strong> (${inputCode})</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${mathStep}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${outputChar}</strong></td>
            </tr>
        `;
    }

    exampleContent.innerHTML = `
        <div style="text-align: left;">
            <p><strong>1. Clean the Input:</strong><br>
            We remove spaces and symbols to get: <code>${cleaned}</code></p>
            
            <p><strong>2. The Formula (${modeTitle}):</strong><br>
            Each letter is treated as a number (A=0, B=1, ... Z=25).<br>
            We perform the shift by <strong>${actionText} ${key}</strong>.</p>
            
            <p><strong>3. Step-by-Step Transformation:</strong></p>
            <table style="width: 100%; border-collapse: collapse; font-family: monospace; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f4f4f4; text-align: left;">
                        <th style="padding: 8px;">Letter (Num)</th>
                        <th style="padding: 8px;">Math (${mathSign} ${key})</th>
                        <th style="padding: 8px;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>

            <p><strong>4. Final Result:</strong><br>
            Combining the letters gives: <strong>${result}</strong></p>
        </div>
    `;

    // Scroll smoothly to the example
    // exampleSection.scrollIntoView({ behavior: "smooth" });
  }
});
