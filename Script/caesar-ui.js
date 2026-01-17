/* caesar-ui.js
   Bridge script to connect UI and provide dynamic worked examples.
*/

document.addEventListener("DOMContentLoaded", function () {
  const encryptBtn = document.getElementById("btn-encrypt");
  const decryptBtn = document.getElementById("btn-decrypt");
  const exampleSection = document.getElementById("worked-example-section");
  const exampleContent = document.getElementById("worked-example-content");

  if (encryptBtn) {
    encryptBtn.addEventListener("click", function () {
      const word = document.getElementById("word").value;
      const key = document.getElementById("key").value;

      if (!word || !key) {
        alert("Please enter both a message and a shift key.");
        return;
      }

      // 1. Run the original logic from caesar.js
      encryptWord();

      // 2. Extract the result to build the explanation
      const resultText = document.getElementById("result").innerText;
      const ciphertext = resultText.replace("Ciphered Word: ", "");

      // 3. Generate and show the worked example
      showWorkedExample(word, key, ciphertext);
    });
  }

  if (decryptBtn) {
    decryptBtn.addEventListener("click", function () {
      encryptWord(); // Logic handles UI update
      exampleSection.style.display = "none"; // Hide example during decryption for clarity
    });
  }

  function showWorkedExample(original, shift, result) {
    const cleaned = original.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const shiftVal = parseInt(shift);

    exampleSection.style.display = "block";

    let letterSteps = "";
    for (let i = 0; i < cleaned.length; i++) {
      letterSteps += `<li><strong>${cleaned[i]}</strong> moves ${shiftVal} steps &rarr; <strong>${result[i]}</strong></li>`;
    }

    exampleContent.innerHTML = `
            <div style="text-align: left;">
                <p><strong>1. Input Sanitization:</strong><br>
                The original text was cleaned of symbols and spaces: <code>${cleaned}</code></p>
                
                <p><strong>2. Applied Shift:</strong><br>
                A shift value of <code>${shiftVal}</code> was applied to the alphabet.</p>
                
                
                <p><strong>3. Letter-by-Letter Transformation:</strong></p>
                <ul class="step-list" style="margin-top: 10px; margin-bottom: 20px;">
                    ${letterSteps}
                </ul>

                <p><strong>4. Final Output:</strong><br>
                By combining these letters, we get the final ciphertext: <strong>${result}</strong></p>
            </div>
        `;

    // Scroll smoothly to the example
    exampleSection.scrollIntoView({ behavior: "smooth" });
  }
});
