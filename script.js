function updateField(id, value) {
    document.getElementById(id).innerText = value.trim();
}

function updateRow(rowId, spanId, value) {
    const row = document.getElementById(rowId);
    const span = document.getElementById(spanId);

    span.innerText = value.trim();
    row.style.display = value.trim() === "" ? "none" : "block";
}

function updateTime() {
    const h = document.getElementById("hours").value;
    const m = document.getElementById("minutes").value;

    const row = document.getElementById("row-time");
    const display = document.getElementById("timeDisplay");

    if (!h && !m) {
        row.style.display = "none";
        return;
    }

    let text = "";
    if (h) text += h + " Hour" + (h > 1 ? "s " : " ");
    if (m) text += m + " Minute" + (m > 1 ? "s" : "");

    display.innerText = text.trim();
    row.style.display = "block";
}

function loadLogo(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const img = document.getElementById("logoPreview");
        img.src = reader.result;
        img.style.display = "block";
    };
    reader.readAsDataURL(event.target.files[0]);
}

/* PDF Download (GitHub Safe) */
function downloadPDF() {

    const element = document.getElementById("paper");

    const options = {
        margin: 10,
        filename: "question-paper.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(element).save();
}

/* Print */
function printPaper() {
    window.print();
}
