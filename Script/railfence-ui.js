let currentStep = 0;
let stepsData = [];

document.addEventListener("DOMContentLoaded", function () {
  const encryptBtn = document.getElementById("btn-encrypt");
  const decryptBtn = document.getElementById("btn-decrypt");
  const visualSection = document.getElementById("visualizer-section");
  const exampleSection = document.getElementById("worked-example-section");

  encryptBtn.addEventListener("click", () => handleAction(true));
  decryptBtn.addEventListener("click", () => handleAction(false));

  function handleAction(isEncrypt) {
    const word = document.getElementById("plaintext").value.replace(/\s/g, "");
    const rows = parseInt(document.getElementById("rows").value);

    if (!word || rows < 2) return alert("Please enter text and rows (min 2).");

    const result = isEncrypt
      ? encryptWord(word, rows)
      : decryptWord(word, rows);
    document.getElementById("cipherResult").innerText =
      `${isEncrypt ? "Ciphertext" : "Decrypted"}: ${result}`;

    setupVisuals(word, rows, isEncrypt, result);
  }

  function setupVisuals(word, rows, isEncrypt, result) {
    currentStep = 0;
    stepsData = [];

    // Generate steps for the visualizer
    const matrix = Array.from({ length: rows }, () =>
      Array(word.length).fill(null),
    );
    let currRow = 0;
    let descending = false;

    for (let i = 0; i < word.length; i++) {
      stepsData.push({ row: currRow, col: i, char: word[i] });
      matrix[currRow][i] = word[i];
      if (currRow === 0 || currRow === rows - 1) descending = !descending;
      currRow += descending ? 1 : -1;
    }

    visualSection.style.display = "block";
    renderStep(matrix, rows, word.length);
    generateWorkedExample(word, rows, isEncrypt, result);
  }

  function renderStep(fullMatrix, rows, cols) {
    const display = document.getElementById("interactive-matrix-display");
    const step = stepsData[currentStep];

    let tableHTML = '<table class="matrix-table">';
    for (let r = 0; r < rows; r++) {
      tableHTML += "<tr>";
      for (let c = 0; c < cols; c++) {
        const isActive = r === step.row && c === step.col;
        const char = c <= step.col ? getCharAt(fullMatrix, r, c) : "";
        tableHTML += `<td class="${isActive ? "cell-active" : ""}">${char || ""}</td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";

    display.innerHTML = tableHTML;
    document.getElementById("step-indicator").innerText =
      `Step ${currentStep + 1} of ${stepsData.length}`;
    document.getElementById("rule-text").innerHTML =
      `Placing <strong>${step.char}</strong> at Row ${step.row + 1}, Column ${step.col + 1}`;
  }

  function getCharAt(matrix, r, c) {
    // Find if this specific coordinate was part of the zigzag
    return stepsData.find((s) => s.row === r && s.col === c)?.char || "";
  }

  document.getElementById("btn-next").onclick = () => {
    if (currentStep < stepsData.length - 1) {
      currentStep++;
      const rows = parseInt(document.getElementById("rows").value);
      const word = document
        .getElementById("plaintext")
        .value.replace(/\s/g, "");
      renderStep(null, rows, word.length);
    }
  };

  document.getElementById("btn-prev").onclick = () => {
    if (currentStep > 0) {
      currentStep--;
      const rows = parseInt(document.getElementById("rows").value);
      const word = document
        .getElementById("plaintext")
        .value.replace(/\s/g, "");
      renderStep(null, rows, word.length);
    }
  };

  // function generateWorkedExample(word, rows, isEncrypt, result) {
  //   exampleSection.style.display = "block";
  //   const content = document.getElementById("worked-example-content");

  //   content.innerHTML = `
  //           <p><strong>1. Setup:</strong> Using ${rows} rails for the message "${word}".</p>
  //           <p><strong>2. The Zigzag:</strong> The letters move from top to bottom and back up.</p>
  //           <p><strong>3. Process:</strong> ${
  //             isEncrypt
  //               ? "Read the characters row-by-row to form the ciphertext."
  //               : "Place the ciphertext characters into the rows and read the zigzag path."
  //           }</p>
  //           <p><strong>Final Result:</strong> <code>${result}</code></p>
  //       `;
  // }

  function generateWorkedExample(word, rows, isEncrypt, result) {
    exampleSection.style.display = "block";
    const title = exampleSection.querySelector("h2");
    const content = document.getElementById("worked-example-content");

    title.innerText = isEncrypt
      ? "Worked Example: How Encryption Happened"
      : "Worked Example: How Decryption Happened";

    const step2Title = isEncrypt
      ? "2. Zigzag Transposition"
      : "2. Mapping the Rails";
    const step2Desc = isEncrypt
      ? `The message was written across <strong>${rows} rails</strong> in a zigzag pattern.`
      : `We first mapped out where the letters would land on <strong>${rows} rails</strong> to know how many letters belong on each rail.`;

    const step3Rules = isEncrypt
      ? `<li><strong>Identify Rows:</strong> Grouped letters based on the rail they sit on.</li>
           <li><strong>Concatenate:</strong> Read each rail from top to bottom to create the final string.</li>`
      : `<li><strong>Fill Rails:</strong> Filled the empty zigzag slots row-by-row using the ciphertext letters.</li>
           <li><strong>Read Zigzag:</strong> Followed the "V" shape path to reconstruct the original message.</li>`;

    content.innerHTML = `
        <div style="text-align: left;">
            <p><strong>1. Setup:</strong><br>
            Message: <code>${word.toUpperCase()}</code><br>
            Rails: <strong>${rows}</strong></p>

            <p><strong>${step2Title}:</strong><br>
            ${step2Desc}</p>

            <p><strong>3. Transformation Steps:</strong></p>
            <ul class="step-list" style="margin-top: 10px; margin-bottom: 20px;">
                ${step3Rules}
            </ul>

            <p><strong>4. Final Result:</strong><br>
            The resulting text is: <strong>${result}</strong></p>
        </div>
    `;

    // exampleSection.scrollIntoView({ behavior: "smooth" });
  }
});
