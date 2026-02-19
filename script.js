const sectionsContainer = document.getElementById("sectionsContainer");
const addSectionBtn = document.getElementById("addSectionBtn");

let sectionCounter = 0;

/* ==============================
   UTILITIES
============================== */

function toRoman(num) {
    const roman = [
        ["M",1000],["CM",900],["D",500],["CD",400],
        ["C",100],["XC",90],["L",50],["XL",40],
        ["X",10],["IX",9],["V",5],["IV",4],["I",1]
    ];
    let result = "";
    for (let [letter, value] of roman) {
        while (num >= value) {
            result += letter;
            num -= value;
        }
    }
    return result;
}

function renumberSections() {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section, index) => {
        const roman = toRoman(index + 1);
        section.querySelector(".section-number").textContent = roman;
    });
}

/* ==============================
   SECTION CREATION
============================== */

function createSection() {
    sectionCounter++;

    const section = document.createElement("div");
    section.classList.add("section");

    section.innerHTML = `
        <div class="section-header">
            <div class="section-left">
                Section <span class="section-number"></span> :
                <select class="section-type">
                    <option value="vsa">Very Short Answer</option>
                    <option value="sa">Short Answer</option>
                    <option value="la">Long Answer</option>
                    <option value="mcq">MCQ</option>
                    <option value="match">Match the Following</option>
                    <option value="fill">Fill in the Blanks</option>
                    <option value="tf">True / False</option>
                    <option value="oneword">One Word Answer</option>
                </select>
            </div>

            <div class="section-right">
                <span class="question-count">0</span> ×
                <input type="number" class="marks-per-question" value="1" min="1" style="width:60px;"> =
                <span class="section-total">0</span>
                <button class="remove-section no-print">Remove</button>
            </div>
        </div>

        <div class="section-description"></div>

        <div class="questions-container"></div>

        <div class="section-separator"></div>
    `;

    sectionsContainer.appendChild(section);

    attachSectionEvents(section);
    renumberSections();
    updateSectionTotals(section);
}

/* ==============================
   EVENTS
============================== */

function attachSectionEvents(section) {
    const removeBtn = section.querySelector(".remove-section");
    const marksInput = section.querySelector(".marks-per-question");
    const typeSelect = section.querySelector(".section-type");

    removeBtn.addEventListener("click", () => {
        section.remove();
        renumberSections();
        updateOverallTotal();
    });

    marksInput.addEventListener("input", () => {
        updateSectionTotals(section);
    });

    typeSelect.addEventListener("change", () => {
        updateSectionDescription(section);
    });

    updateSectionDescription(section);
}

/* ==============================
   DESCRIPTION SYSTEM
============================== */

function updateSectionDescription(section) {
    const type = section.querySelector(".section-type").value;
    const descriptionDiv = section.querySelector(".section-description");

    const descriptions = {
        vsa: "Answer all the questions in one or two sentences.",
        sa: "Answer each question in brief.",
        la: "Answer each question in detail.",
        mcq: "Choose the correct option.",
        match: "Match the following correctly.",
        fill: "Fill in the blanks with suitable answers.",
        tf: "Write True or False.",
        oneword: "Answer in one word."
    };

    descriptionDiv.textContent = descriptions[type] || "";
}

/* ==============================
   MARKS CALCULATION
============================== */

function updateSectionTotals(section) {
    const questionCount = section.querySelectorAll(".question").length;
    const marksPerQuestion = parseInt(section.querySelector(".marks-per-question").value) || 0;
    const total = questionCount * marksPerQuestion;

    section.querySelector(".question-count").textContent = questionCount;
    section.querySelector(".section-total").textContent = total;

    updateOverallTotal();
}

function updateOverallTotal() {
    let total = 0;
    document.querySelectorAll(".section-total").forEach(el => {
        total += parseInt(el.textContent) || 0;
    });

    document.getElementById("headerTotalMarks").textContent = total;
}

/* ==============================
   INIT
============================== */

addSectionBtn.addEventListener("click", createSection);
