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

  if (encryptBtn) {
    encryptBtn.addEventListener("click", function () {
      const keyword = document.getElementById("keyword").value;
      const plaintext = document.getElementById("plaintext").value;

      if (!keyword || !plaintext) {
        alert("Please enter both a keyword and a message.");
        return;
      }

      handleEncryption();

      prepareVisualizerSteps(keyword, plaintext);
      currentStep = 0;
      visualSection.style.display = "block";
      renderVisualStep();

      generateWorkedExample(keyword, plaintext);
    });
  }

  if (decryptBtn) {
    decryptBtn.addEventListener("click", function () {
      handleDecryption();
      visualSection.style.display = "none";
      exampleSection.style.display = "none";
    });
  }

  nextBtn.onclick = () => {
    if (currentStep < stepsData.length - 1) {
      currentStep++;
      renderVisualStep();
    }
  };
  prevBtn.onclick = () => {
    if (currentStep > 0) {
      currentStep--;
      renderVisualStep();
    }
  };

  function prepareVisualizerSteps(key, text) {
    const matrix = createKeyMatrix(key);
    const cleanText = text
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .replace(/j/g, "i");

    stepsData = [];
    let processed = "";

    // Match preprocessing logic from playfair.js
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
      const charA = processed[i];
      const charB = processed[i + 1];

      // Call processPair from playfair.js to get the exact output letters
      const resultPairStr = processPair(matrix, charA, charB, true);
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
    }
  }

  function renderVisualStep() {
    const step = stepsData[currentStep];
    const display = document.getElementById("interactive-matrix-display");
    const indicator = document.getElementById("step-indicator");
    const ruleText = document.getElementById("rule-text");

    indicator.innerText = `Step ${currentStep + 1} of ${stepsData.length}`;

    const charA = step.pair[0].toUpperCase();
    const charB = step.pair[1].toUpperCase();
    const resA = step.resultPair[0].toUpperCase();
    const resB = step.resultPair[1].toUpperCase();

    let tableHTML = '<table class="matrix-table">';
    for (let r = 0; r < 5; r++) {
      tableHTML += "<tr>";
      for (let c = 0; c < 5; c++) {
        let className = "";
        const char = step.matrix[r][c];

        // Highlight Input Letters (Blue)
        if (
          (r === step.posA[0] && c === step.posA[1]) ||
          (r === step.posB[0] && c === step.posB[1])
        ) {
          className = "cell-plain";
        }
        // Highlight Output Letters (Green)
        else if (
          (r === step.posOutA[0] && c === step.posOutA[1]) ||
          (r === step.posOutB[0] && c === step.posOutB[1])
        ) {
          className = "cell-cipher";
        }

        // Add Rectangle boundary for visual context
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

    // Enhanced Rule Explanation showing transformation
    ruleText.innerHTML = `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                <span style="font-size: 1.2rem; font-weight: bold;">
                    ${charA}${charB} &rarr; <span style="color: #27ae60;">${resA}${resB}</span>
                </span>
            </div>
            <strong>${step.rule} Rule:</strong> Letters <strong>${charA}</strong> and <strong>${charB}</strong> became <strong>${resA}</strong> and <strong>${resB}</strong> because they were in the same ${step.rule.toLowerCase()}.
        `;
  }

  function generateWorkedExample(key, text) {
    exampleSection.style.display = "block";

    // Re-cleaning text for explanation purposes (mirrors logic in Playfair.js)
    let cleanText = text
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .replace(/j/g, "i");
    let digraphs = [];
    for (let i = 0; i < cleanText.length; i++) {
      let a = cleanText[i];
      let b = i + 1 < cleanText.length ? cleanText[i + 1] : "x";

      if (a === b) {
        digraphs.push(a + "x");
        // Don't skip the next letter if we inserted an 'x'
      } else {
        digraphs.push(a + b);
        i++;
      }
    }
    if (
      cleanText.length % 2 !== 0 &&
      digraphs[digraphs.length - 1].length === 1
    ) {
      digraphs[digraphs.length - 1] += "x";
    }

    const result = document
      .getElementById("cipherResult")
      .innerText.replace("Ciphertext: ", "");

    exampleContent.innerHTML = `
            <div style="text-align: left;">
                <p><strong>1. Matrix Construction:</strong><br>
                Using the key <code>${key.toUpperCase()}</code>, we built the 5x5 grid above, replacing 'J' with 'I' and filling remaining slots with the alphabet.</p>

                <p><strong>2. Digraph Formation:</strong><br>
                The message was split into pairs. Repeated letters in a pair or an odd trailing letter were padded with 'X':<br>
                <code>${digraphs.join(" | ").toUpperCase()}</code></p>

                <p><strong>3. Transformation Rules:</strong></p>
                <ul class="step-list" style="margin-top: 10px; margin-bottom: 20px;">
                    <li>Each pair was located in the matrix.</li>
                    <li>If in the <strong>same row</strong>, we shifted right.</li>
                    <li>If in the <strong>same column</strong>, we shifted down.</li>
                    <li>If they formed a <strong>rectangle</strong>, we swapped corners.</li>
                </ul>

                <p><strong>4. Final Result:</strong><br>
                The resulting ciphertext is: <strong>${result}</strong></p>
            </div>
        `;

    exampleSection.scrollIntoView({ behavior: "smooth" });
  }
});
