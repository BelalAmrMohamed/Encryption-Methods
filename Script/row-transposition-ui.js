/* row-ui.js - Bridge script for UI and Visualization */

let visualSteps = [];
let currentStep = 0;

document.addEventListener("DOMContentLoaded", () => {
  const encryptBtn = document.getElementById("btn-encrypt-trigger");
  const decryptBtn = document.getElementById("btn-decrypt-trigger");

  encryptBtn.addEventListener("click", () => {
    const message = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value;
    if (message && key) {
      setupVisualizer(message, key);
      generateWorkedExample(message, key);
    }
  });

  decryptBtn.addEventListener("click", () => {
    document.getElementById("visualizer-section").style.display = "none";
    document.getElementById("worked-example-section").style.display = "none";
  });

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

function setupVisualizer(message, key) {
  const prepared = message.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const cols = key.length;
  const rows = Math.ceil(prepared.length / cols);

  // Create matrix manually to avoid side effects
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

  visualSteps = keyOrder.map((pair, stepIdx) => ({
    activeCol: pair.index,
    keyChar: pair.char,
    matrix: matrix,
    key: key,
    stepNum: stepIdx + 1,
    totalSteps: keyOrder.length,
  }));

  currentStep = 0;
  document.getElementById("visualizer-section").style.display = "block";
  renderStep();
}

function renderStep() {
  const step = visualSteps[currentStep];
  const area = document.getElementById("visual-matrix-area");
  const info = document.getElementById("step-info");
  const explanation = document.getElementById("visual-explanation");

  info.innerText = `Step ${step.stepNum} of ${step.totalSteps}`;

  let html = `<table class="matrix-table"><tr>`;
  step.key.split("").forEach((c, i) => {
    const activeClass = i === step.activeCol ? "active-key" : "";
    html += `<th class="${activeClass}">${c}</th>`;
  });
  html += `</tr>`;

  step.matrix.forEach((row) => {
    html += `<tr>`;
    row.forEach((cell, i) => {
      const highlight = i === step.activeCol ? "highlight-col" : "";
      html += `<td class="${highlight}">${cell}</td>`;
    });
    html += `</tr>`;
  });
  html += `</table>`;

  area.innerHTML = html;
  explanation.innerHTML = `Reading Column <strong>${step.activeCol + 1}</strong> (Key Character: <strong>${step.keyChar}</strong>). 
    These letters are added to the ciphertext next.`;
}

function generateWorkedExample(message, key) {
  const section = document.getElementById("worked-example-section");
  const content = document.getElementById("worked-example-content");
  section.style.display = "block";

  const prepared = message.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const keySorted = key.split("").sort().join(", ");

  content.innerHTML = `
        <div style="text-align: left;">
            <p><strong>1. Data Preparation:</strong> The text was cleaned to <code>${prepared}</code>. 
            The key <code>${key}</code> has <strong>${key.length}</strong> characters, so we use ${key.length} columns.</p>
            
            <p><strong>2. Grid Filling:</strong> We wrote the text across the rows. 
            Any empty cells were filled with "X" to keep the grid rectangular.</p>

            <p><strong>3. Column Ordering:</strong> The key characters are sorted alphabetically: <code>${keySorted}</code>. 
            This dictates the order we read the columns.</p>

            <p><strong>4. Final Extraction:</strong> We look at the first character in the sorted key, find its original column, 
            and read it top-to-bottom. We repeat this for all columns.</p>
        </div>
    `;
  section.scrollIntoView({ behavior: "smooth" });
}
