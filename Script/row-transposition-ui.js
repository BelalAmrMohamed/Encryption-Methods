/* row-ui.js - Bridge script for UI and Visualization */

let visualSteps = [];
let currentStep = 0;
let isEncryptMode = true;

document.addEventListener("DOMContentLoaded", () => {
  const encryptBtn = document.getElementById("btn-encrypt-trigger");
  const decryptBtn = document.getElementById("btn-decrypt-trigger");

  // FIX: Restored original button logic and event bindings
  if (encryptBtn) {
    encryptBtn.addEventListener("click", () => {
      handleAction(true);
    });
  }

  if (decryptBtn) {
    decryptBtn.addEventListener("click", () => {
      handleAction(false);
    });
  }

  document.getElementById("next-step").onclick = () => {
    if (currentStep < visualSteps.length - 1) {
      currentStep++;
      renderStep();
    }
  };

  document.getElementById("prev-step").onclick = () => {
    if (currentStep > 0) {
      currentStep--;
      renderStep();
    }
  };
});

function handleAction(isEncrypt) {
  const message = document.getElementById("plaintext").value;
  const key = document.getElementById("key").value;

  if (!message || !key) {
    alert("Please fill in both the message and the key.");
    return;
  }

  isEncryptMode = isEncrypt;

  // FIX: Restore core calculation and Matrix rendering in the Interactive Tool
  if (isEncrypt) {
    encrypt(); // Calls function in row-transposition.js
  } else {
    decrypt(); // Calls function in row-transposition.js
  }

  // Setup Visualizer
  const section = document.getElementById("visualizer-section");
  section.style.display = "block";

  if (isEncrypt) {
    setupEncryptionVisuals(message, key);
    generateEncryptionExample(message, key);
  } else {
    setupDecryptionVisuals(message, key);
    generateDecryptionExample(message, key);
  }
}

// ==========================================
// ENCRYPTION VISUALS
// ==========================================

function setupEncryptionVisuals(message, key) {
  const prepared = message.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const cols = key.length;
  const rows = Math.ceil(prepared.length / cols);

  let matrix = [];
  let idx = 0;
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(idx < prepared.length ? prepared[idx++] : "X");
    }
    matrix.push(row);
  }

  const keyOrder = key
    .split("")
    .map((char, i) => ({ char, index: i }))
    .sort((a, b) => a.char.localeCompare(b.char));

  visualSteps = []; // FIX: Removed the empty "Step 0"
  let currentCiphertext = "";

  keyOrder.forEach((pair, stepIdx) => {
    const colIdx = pair.index;
    let extractedChars = "";
    for (let r = 0; r < rows; r++) {
      extractedChars += matrix[r][colIdx];
    }
    currentCiphertext += extractedChars;

    visualSteps.push({
      matrix: matrix,
      activeCol: colIdx,
      key: key,
      accumulated: currentCiphertext, // FIX: Now shows actual ciphertext
      explanation: `<strong>Order #${stepIdx + 1}:</strong> Reading column <strong>${colIdx + 1}</strong> (Key: '${pair.char}'). Extracted: "<strong>${extractedChars}</strong>".`,
    });
  });

  currentStep = 0;
  renderStep();
}

// ==========================================
// DECRYPTION VISUALS
// ==========================================

function setupDecryptionVisuals(ciphertext, key) {
  const cleanCipher = ciphertext.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const cols = key.length;
  const rows = Math.ceil(cleanCipher.length / cols);

  // 1. Calculate the "ragged" shape of the original grid
  // This is vital so students see how many letters go into each column.
  const numLongCols =
    cleanCipher.length % cols === 0 ? cols : cleanCipher.length % cols;

  let matrix = Array.from({ length: rows }, () => Array(cols).fill(""));
  const keyOrder = key
    .split("")
    .map((char, i) => ({ char, index: i }))
    .sort((a, b) => a.char.localeCompare(b.char));

  visualSteps = [];
  let charsUsed = 0;

  // STEP-BY-STEP COLUMN FILLING
  keyOrder.forEach((pair, stepIdx) => {
    const colIdx = pair.index;
    // Columns from 0 to (numLongCols - 1) have 'rows' letters. Others have 'rows - 1'.
    const itemsInThisCol = colIdx < numLongCols ? rows : rows - 1;
    const chunk = cleanCipher.substr(charsUsed, itemsInThisCol);
    charsUsed += itemsInThisCol;

    // Place the chunk into the specific column
    for (let r = 0; r < itemsInThisCol; r++) {
      matrix[r][colIdx] = chunk[r];
    }

    visualSteps.push({
      matrix: JSON.parse(JSON.stringify(matrix)),
      activeCol: colIdx,
      key: key,
      accumulated: `Placed "${chunk}" into its Column`,
      explanation: `<strong>Step ${stepIdx + 1}:</strong> We take the next ${itemsInThisCol} letters from the ciphertext (<strong>${chunk}</strong>). Since '${pair.char}' is the #${stepIdx + 1} letter in the sorted key, we fill <strong>Column ${colIdx + 1}</strong>.`,
    });
  });

  // FINAL STEP: READING ROWS
  let finalText = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c]) finalText += matrix[r][c];
    }
  }

  visualSteps.push({
    matrix: matrix,
    activeCol: -1,
    key: key,
    accumulated: finalText,
    explanation: `<strong>Final Step: Reading the Message.</strong> Now that the columns are restored, we read <strong>Row-by-Row</strong> (Left-to-Right) to find the original message: <strong>${finalText}</strong>.`,
  });

  currentStep = 0;
  renderStep();
}

// ==========================================
// RENDERER
// ==========================================

function renderStep() {
  const step = visualSteps[currentStep];
  const area = document.getElementById("visual-matrix-area");
  const info = document.getElementById("step-info");
  const explanation = document.getElementById("visual-explanation");
  const resultBox = document.getElementById("visual-accumulated-text");

  info.innerText = `Step ${currentStep + 1} of ${visualSteps.length}`;
  explanation.innerHTML = step.explanation;
  resultBox.innerText = step.accumulated;

  let html = `<table class="matrix-table"><tr>`;
  step.key.split("").forEach((c, i) => {
    const activeClass = i === step.activeCol ? "active-key" : "";
    html += `<th class="${activeClass}">${c.toUpperCase()}</th>`;
  });
  html += `</tr>`;

  step.matrix.forEach((row) => {
    html += `<tr>`;
    row.forEach((cell, i) => {
      let cssClass = i === step.activeCol ? "highlight-col" : "";
      // In decryption, highlight cells that have been filled to show progress
      if (!isEncryptMode && cell) cssClass += " filled-cell";
      html += `<td class="${cssClass}">${cell.toUpperCase()}</td>`;
    });
    html += `</tr>`;
  });
  html += `</table>`;
  area.innerHTML = html;
}

// Worked Example functions remain unchanged to preserve existing detail
function generateEncryptionExample(message, key) {
  const section = document.getElementById("worked-example-section");
  const content = document.getElementById("worked-example-content");
  section.style.display = "block";
  section.querySelector("h2").innerText = "Worked Example: Encryption";

  const prepared = message.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const sortedKey = key.split("").sort().join(" - ");
  const cols = key.length;

  content.innerHTML = `
        <div style="text-align: left;">
            <p><strong>1. Data Preparation:</strong><br>
            Message cleaned: <code>${prepared}</code><br>
            Key Length: <strong>${cols}</strong> (So we need ${cols} columns).</p>
            
            <p><strong>2. Fill the Grid:</strong><br>
            We write the message horizontally (row by row). Since the length isn't a perfect multiple of ${cols}, we pad with 'X'.</p>

            <p><strong>3. Determine Column Order:</strong><br>
            We sort the key letters alphabetically: <br>
            <code>${sortedKey}</code><br>
            This tells us which column to read first, second, etc.</p>

            <p><strong>4. Extract Ciphertext:</strong><br>
            We go through the sorted key, find the corresponding column in the grid, and read the letters from <strong>Top to Bottom</strong>. Combining these column chunks gives the final result.</p>
        </div>
    `;
  section.scrollIntoView({ behavior: "smooth" });
}

function generateDecryptionExample(ciphertext, key) {
  const section = document.getElementById("worked-example-section");
  const content = document.getElementById("worked-example-content");
  section.style.display = "block";
  section.querySelector("h2").innerText = "Worked Example: Decryption";

  const cleanCipher = ciphertext.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const cols = key.length;
  const rows = Math.ceil(cleanCipher.length / cols);

  content.innerHTML = `
        <div style="text-align: left;">
            <p><strong>1. Analyze Dimensions:</strong><br>
            Ciphertext Length: ${cleanCipher.length}<br>
            Key Length: ${cols}<br>
            Grid Height (Rows): ${rows} (Calculated as Ceiling(${cleanCipher.length} / ${cols}))</p>
            
            <p><strong>2. Determine Column Shapes:</strong><br>
            When the message was written, not all rows may have been full. 
            The "ragged" empty spots are always at the bottom-right.
            We calculate exactly how many letters belong in each column based on its position.</p>

            <p><strong>3. Fill by Sorted Key:</strong><br>
            We take the sorted key (Alphabetical). We identify which original column that letter corresponds to.
            We grab the correct number of letters from the ciphertext and drop them into that column.</p>

            <p><strong>4. Read Plaintext:</strong><br>
            Once all columns are filled, the grid is reconstructed. We read <strong>Left-to-Right, Top-to-Bottom</strong> to reveal the hidden message.</p>
        </div>
    `;
  section.scrollIntoView({ behavior: "smooth" });
}
