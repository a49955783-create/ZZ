window.onload = function () {
    setTimeout(() => {
        document.getElementById("intro").style.display = "none";
        document.getElementById("app").style.display = "block";
    }, 1200);
};

/* ============================================
   إضافة سطر جديد
=============================================== */
function addNewRow(code = "", status = "", location = "", unit = "") {
    let body = document.getElementById("codesBody");

    let tr = document.createElement("tr");

    tr.innerHTML = `
        <td><input class="code-field" value="${code}"></td>
        <td>
            <select class="status-field">
                <option>مشغول</option>
                <option>مباشر</option>
                <option>الهلي</option>
                <option>ميداني</option>
                <option>بلاغ</option>
            </select>
        </td>
        <td><input class="location-field" value="${location}"></td>
        <td><input class="unit-field" value="${unit}"></td>
        <td>
            <button class="action-btn edit-btn" onclick="editRow(this)">تعديل</button>
            <button class="action-btn partner-btn" onclick="addPartner(this)">شريك</button>
            <button class="action-btn delete-btn" onclick="deleteRow(this)">حذف</button>
        </td>
    `;

    body.appendChild(tr);
}

document.getElementById("addRow").onclick = () => addNewRow();

/* ============================================
   تعديل – حذف – شريك
=============================================== */
function deleteRow(btn) {
    btn.parentElement.parentElement.remove();
}

function addPartner(btn) {
    let tr = btn.parentElement.parentElement;
    tr.querySelector(".unit-field").value += " + شريك";
}

function editRow(btn) {
    alert("🔧 الآن يمكنك تعديل السطر مباشرة.");
}

/* ============================================
   OCR – استخراج النص وتوزيعه تلقائياً
=============================================== */
document.getElementById("imageInput").addEventListener("change", function () {
    let file = this.files[0];
    if (!file) return;

    document.getElementById("ocrStatus").innerText = "جاري المعالجة...";
    document.getElementById("ocrProgress").value = 0;

    Tesseract.recognize(
        file,
        "eng",
        {
            logger: m => {
                if (m.status === "recognizing text") {
                    document.getElementById("ocrProgress").value = Math.floor(m.progress * 100);
                }
            }
        }
    ).then(result => {
        let text = result.data.text;

        // استخراج الأكواد فقط (أرقام)
        let codes = text.match(/\b\d+\b/g);

        if (codes) {
            codes.forEach(c => addNewRow(c, "", "", ""));
        }

        document.getElementById("ocrStatus").innerText = "✔ تم استخراج الأكواد وتوزيعها";
        updateFinal();
    });
});

/* ============================================
   تحديث النتيجة النهائية
=============================================== */
function updateFinal() {
    let rows = document.querySelectorAll("#codesBody tr");
    let output = "";

    rows.forEach(r => {
        let c = r.querySelector(".code-field").value;
        let s = r.querySelector(".status-field").value;
        let l = r.querySelector(".location-field").value;
        let u = r.querySelector(".unit-field").value;

        output += `🔹 الكود: ${c} | الحالة: ${s} | الموقع: ${l} | التوزيع: ${u}\n`;
    });

    document.getElementById("finalResult").value = output;
}

setInterval(updateFinal, 500);
