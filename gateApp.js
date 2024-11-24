///////// zfoni ///////////////////////////////////////
function getGateData() {
    // let gateDataArray = [];
    // for (let i = 1; i <= 24; i++) {
    //     let gateName = document.getElementById(`gate-name-${i}`).value || `שער ${i}`;
    //     let goodCount = document.getElementById(`goodCount-${i}`).value || 0;
    //     let badCount = document.getElementById(`badCount-${i}`).value || 0;
    //     let notes = document.getElementById(`notesGate${i}`).value || "אין הערות";

    //     let gateData = {
    //         gateName: gateName,
    //         goodCount: goodCount,
    //         badCount: badCount,
    //         notes: notes,
    //     };

    //     gateDataArray.push(gateData);
    // }

    // let commanderName = document.getElementById("commander-name").value || "לא צויין";
    // let date = new Date().toLocaleDateString("he-IL");

    // let allGateData = `תאריך: ${date}\n` +
    //                   `שם המפקד: ${commanderName}\n\n`;

    // gateDataArray.forEach((gate, index) => {
    //     allGateData += `שער ${index + 1}: ${gate.gateName}\n` +
    //                    `✅ מצב תקין: ${gate.goodCount}\n` +
    //                    `❌ מצב לא תקין: ${gate.badCount}\n` +
    //                    `הערות: ${gate.notes}\n\n`;
    // });
    let Data = "";
    console.log("now im here")
    let rows = document.querySelectorAll(".row"); // Select all rows with the "row" class

    rows.forEach(row => {
        // Extract data from each row
        let gateName = row.querySelector(".col:nth-child(1)").textContent.trim(); // Right column (gate name)
    
        // Determine the status from the checked radio button
        let goodRadio = row.querySelector('input[type="radio"][id*="good"]'); // Radio for "good"
        let badRadio = row.querySelector('input[type="radio"][id*="bad"]'); // Radio for "bad"
    
        let status = "לא ידוע"; // Default status
    if (goodRadio && goodRadio.checked) {
        status = "תקין"; // Good is checked
    } else if (badRadio && badRadio.checked) {
        status = "לא תקין"; // Bad is checked
    }
    
        // Extract notes from the left column
        let notesInput = row.querySelector(".notes-gates").value;
    
        let rowData = `${gateName} , ${status} , ${notesInput}` + "\n";
        Data+=rowData;
        // Log or process the data
        // Data.push(` ${gateName} , ${status} , ${notesInput}`);
        // console.log(`Gate Name: ${gateName}`);
        // console.log(`Status: ${status}`);
        // console.log(`Notes: ${notes}`);
    });
    
    return Data;
}

function copyGateData() {
    console.log("im here ")
    const gateData = getGateData();
    navigator.clipboard.writeText(gateData).then(() => {
        alert("הנתונים הועתקו בהצלחה");
    }).catch(err => {
        alert("שגיאה בהעתקת הנתונים: " + err);
    });
}

function sendGatWhatsApp(){
    const gateData = getGateData();
    const phoneNumber = "972522121836";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(gateData)}`;
    window.open(whatsappURL, "_blank");
}

function saveGates(){
    let rows = document.querySelectorAll(".row"); // Select all rows with the "row" class

    rows.forEach(row => {
        // Extract data from each row
        let gateName = row.querySelector(".col:nth-child(1)").textContent.trim(); // Right column (gate name)
    
        // Determine the status from the checked radio button
        let goodRadio = row.querySelector('input[type="radio"][id*="good"]'); // Radio for "good"
        let badRadio = row.querySelector('input[type="radio"][id*="bad"]'); // Radio for "bad"
    
        let status = "לא ידוע"; // Default status
    if (goodRadio && goodRadio.checked) {
        status = "תקין"; // Good is checked
    } else if (badRadio && badRadio.checked) {
        status = "לא תקין"; // Bad is checked
    }
    
        // Extract notes from the left column
        let notesInput = row.querySelector(".notes-gates").value || "אין הערות";
    
        let rowData = `${gateName} , ${status} , ${notesInput}` + "\n";
        Data+=rowData;

    });
}
