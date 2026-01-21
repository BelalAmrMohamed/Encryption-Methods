// Script/playfair-ui.js

let currentStep = 0;
let stepsData = [];

document.addEventListener("DOMContentLoaded", function () {
  const encryptBtn = document.getElementById("btn-encrypt");
  const decryptBtn = document.getElementById("btn-decrypt");
  const visualSection = document.getElementById("visualizer-section");
  const exampleSection = document.getElementById("worked-example-section");
  const exampleContent = document.getElementById("worked-example-content");

  const nextBtn = document.getElementById("btn-next");
  const prevBtn = document.getElementById("btn-prev");

  // --- Encryption Button Handler ---
  if (encryptBtn) {
    encryptBtn.addEventListener("click", function () {
      const keyword = document.getElementById("keyword").value;
      const plaintext = document.getElementById("plaintext").value;

      if (!keyword || !plaintext) {
        alert("Please enter both a keyword and a message.");
        return;
      }

      handleEncryption(); // Logic from playfair.js

      // Setup Visuals for Encryption (true)
      setupVisuals(keyword, plaintext, true);
    });
  }

  // --- Decryption Button Handler (Updated) ---
  if (decryptBtn) {
    decryptBtn.addEventListener("click", function () {
      const keyword = document.getElementById("keyword").value;
      const ciphertext = document.getElementById("plaintext").value;

      if (!keyword || !ciphertext) {
        alert("Please enter both a keyword and a ciphertext.");
        return;
      }

      handleDecryption(); // Logic from playfair.js

      // Setup Visuals for Decryption (false)
      setupVisuals(keyword, ciphertext, false);
    });
  }

  // --- Helper to trigger UI updates ---
  function setupVisuals(keyword, text, isEncrypt) {
    prepareVisualizerSteps(keyword, text, isEncrypt);
    currentStep = 0;

    // Show sections
    visualSection.style.display = "block";

    // Update visualizer title based on mode
    const vizTitle = visualSection.querySelector("h2");
    vizTitle.innerText = isEncrypt
      ? "Visualizer: Encryption Steps"
      : "Visualizer: Decryption Steps";

    renderVisualStep(isEncrypt);
    generateWorkedExample(keyword, text, isEncrypt);
  }

  nextBtn.onclick = () => {
    if (currentStep < stepsData.length - 1) {
      currentStep++;
      // Determine if we are in encrypt or decrypt mode based on the visualizer title
      // (Simple check to persist state without a global variable)
      const isEncrypt = visualSection
        .querySelector("h2")
        .innerText.includes("Encryption");
      renderVisualStep(isEncrypt);
    }
  };
  prevBtn.onclick = () => {
    if (currentStep > 0) {
      currentStep--;
      const isEncrypt = visualSection
        .querySelector("h2")
        .innerText.includes("Encryption");
      renderVisualStep(isEncrypt);
    }
  };

  // --- Data Preparation for Visualizer ---
  function prepareVisualizerSteps(key, text, isEncrypt) {
    const matrix = createKeyMatrix(key);
    let cleanText = text
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .replace(/j/g, "i");

    stepsData = [];
    let pairs = [];

    if (isEncrypt) {
      // ENCRYPTION: Handle 'X' padding for doubles
      let processed = "";
      for (let i = 0; i < cleanText.length; i++) {
        let a = cleanText[i];
        let b = i + 1 < cleanText.length ? cleanText[i + 1] : "x";
        if (a === b) {
          processed += a + "x";
        } else {
          processed += a + b;
          i++;
        }
      }
      if (processed.length % 2 !== 0) processed += "x";

      for (let i = 0; i < processed.length; i += 2) {
        pairs.push(processed.substring(i, i + 2));
      }
    } else {
      // DECRYPTION: Just split into pairs (Ciphertext is always even)
      if (cleanText.length % 2 !== 0) cleanText += "x"; // Safety fallback
      for (let i = 0; i < cleanText.length; i += 2) {
        pairs.push(cleanText.substring(i, i + 2));
      }
    }

    // Process all pairs
    pairs.forEach((pairStr) => {
      const charA = pairStr[0];
      const charB = pairStr[1];

      // Use core logic to get result
      const resultPairStr = processPair(matrix, charA, charB, isEncrypt);
      const resultPair = resultPairStr.toLowerCase().split("");

      const posA = findPosition(matrix, charA);
      const posB = findPosition(matrix, charB);
      const posOutA = findPosition(matrix, resultPair[0]);
      const posOutB = findPosition(matrix, resultPair[1]);

      let rule = "Rectangle";
      if (posA[0] === posB[0]) rule = "Row";
      else if (posA[1] === posB[1]) rule = "Column";

      stepsData.push({
        pair: [charA, charB],
        resultPair: resultPair,
        posA,
        posB,
        posOutA,
        posOutB,
        rule,
        matrix,
      });
    });
  }

  // --- Render the Grid ---
  function renderVisualStep(isEncrypt) {
    const step = stepsData[currentStep];
    const display = document.getElementById("interactive-matrix-display");
    const indicator = document.getElementById("step-indicator");
    const ruleText = document.getElementById("rule-text");

    indicator.innerText = `Pair ${currentStep + 1} of ${stepsData.length}`;

    const charA = step.pair[0].toUpperCase();
    const charB = step.pair[1].toUpperCase();
    const resA = step.resultPair[0].toUpperCase();
    const resB = step.resultPair[1].toUpperCase();

    // Generate Table
    let tableHTML = '<table class="matrix-table">';
    for (let r = 0; r < 5; r++) {
      tableHTML += "<tr>";
      for (let c = 0; c < 5; c++) {
        let className = "";
        const char = step.matrix[r][c];

        // Highlight Input (Blue)
        if (
          (r === step.posA[0] && c === step.posA[1]) ||
          (r === step.posB[0] && c === step.posB[1])
        ) {
          className = "cell-plain"; // Reused class name for "Input"
        }
        // Highlight Output (Green)
        else if (
          (r === step.posOutA[0] && c === step.posOutA[1]) ||
          (r === step.posOutB[0] && c === step.posOutB[1])
        ) {
          className = "cell-cipher"; // Reused class name for "Output"
        }

        // Rectangle Highlight
        if (step.rule === "Rectangle") {
          if (
            className === "" &&
            r >= Math.min(step.posA[0], step.posB[0]) &&
            r <= Math.max(step.posA[0], step.posB[0]) &&
            c >= Math.min(step.posA[1], step.posB[1]) &&
            c <= Math.max(step.posA[1], step.posB[1])
          ) {
            className = "cell-rect";
          }
        }
        tableHTML += `<td class="${className}">${char.toUpperCase()}</td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    display.innerHTML = tableHTML;

    // --- Dynamic Text Explanations ---
    let explanation = "";
    if (step.rule === "Row") {
      explanation = isEncrypt
        ? "Since they are in the same row, we shift <strong>Right</strong>."
        : "Since they are in the same row, we shift <strong>Left</strong> (reversing the encryption).";
    } else if (step.rule === "Column") {
      explanation = isEncrypt
        ? "Since they are in the same column, we shift <strong>Down</strong>."
        : "Since they are in the same column, we shift <strong>Up</strong> (reversing the encryption).";
    } else {
      explanation =
        "They form a rectangle. We pick the corners on the same row.";
    }

    ruleText.innerHTML = `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                <span style="font-size: 1.2rem; font-weight: bold;">
                    ${charA}${charB} &rarr; <span style="color: #27ae60;">${resA}${resB}</span>
                </span>
            </div>
            <strong>${step.rule} Rule:</strong> ${explanation}
        `;
  }

  // --- Generate Worked Example Text ---
  function generateWorkedExample(key, text, isEncrypt) {
    exampleSection.style.display = "block";
    const title = exampleSection.querySelector("h2");
    title.innerText = isEncrypt
      ? "Worked Example: How Encryption Happened"
      : "Worked Example: How Decryption Happened";

    let cleanText = text
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .replace(/j/g, "i");
    let pairList = [];

    // Reconstruct pairs for display string
    if (isEncrypt) {
      let processed = "";
      for (let i = 0; i < cleanText.length; i++) {
        let a = cleanText[i];
        let b = i + 1 < cleanText.length ? cleanText[i + 1] : "x";
        if (a === b) {
          processed += a + "x";
        } else {
          processed += a + b;
          i++;
        }
      }
      if (processed.length % 2 !== 0) processed += "x";
      for (let i = 0; i < processed.length; i += 2)
        pairList.push(processed.substring(i, i + 2));
    } else {
      if (cleanText.length % 2 !== 0) cleanText += "x";
      for (let i = 0; i < cleanText.length; i += 2)
        pairList.push(cleanText.substring(i, i + 2));
    }

    const result = document
      .getElementById("cipherResult")
      .innerText.split(": ")[1];

    // --- Dynamic Text for Steps ---
    const step2Title = isEncrypt
      ? "2. Digraph Formation (Padding)"
      : "2. Splitting Ciphertext";
    const step2Desc = isEncrypt
      ? "The message was split into pairs. Repeated letters in a pair were padded with 'X'."
      : "The ciphertext was split into pairs. No 'X' padding is needed for decryption.";

    const step3Rules = isEncrypt
      ? `<li><strong>Same Row:</strong> Shift Right.</li>
           <li><strong>Same Column:</strong> Shift Down.</li>`
      : `<li><strong>Same Row:</strong> Shift Left (Reverse).</li>
           <li><strong>Same Column:</strong> Shift Up (Reverse).</li>`;

    exampleContent.innerHTML = `
            <div style="text-align: left;">
                <p><strong>1. Matrix Construction:</strong><br>
                Using the key <code>${key.toUpperCase()}</code>, we built the 5x5 grid.</p>

                <p><strong>${step2Title}:</strong><br>
                ${step2Desc}<br>
                <code>${pairList.join(" | ").toUpperCase()}</code></p>

                <p><strong>3. Transformation Rules:</strong></p>
                <ul class="step-list" style="margin-top: 10px; margin-bottom: 20px;">
                    ${step3Rules}
                    <li><strong>Rectangle:</strong> Swap corners (Same for both).</li>
                </ul>

                <p><strong>4. Final Result:</strong><br>
                The resulting text is: <strong>${result}</strong></p>
            </div>
        `;

    // exampleSection.scrollIntoView({ behavior: "smooth" });
  }
});
