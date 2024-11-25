///////// zfoni ///////////////////////////////////////

const currentDate = displayCurrentDate();

function displayCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-IL', options);
    document.getElementById('date').innerHTML = `תאריך:&nbsp;&nbsp;&nbsp;${formattedDate}`;
    console.log(formattedDate)
    const stringWithDots = formattedDate.replace(/\//g, ".");
    console.log(stringWithDots);
    firestore.collection("412A").doc(stringWithDots).set({});
    return formattedDate;
}


function getGateData() {
    let Data = "";
    console.log("now im here");

    // Get the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('he-IL'); 
    const shiftSelect = document.getElementById('shiftSelect');
    const selectedShift = shiftSelect.value;

    Data += `**מעבירים דרומי**\n`;
    Data += `משמרת: ${selectedShift}\n\n`;
    Data += `תאריך: ${formattedDate}\n\n`;

    // Select all rows with gate data
    let rows = document.querySelectorAll(".row"); 

    rows.forEach(row => {
        // Find the gate name element
        let gateNameElement = row.querySelector(".col:nth-child(1)");
        if (!gateNameElement) {
            console.warn("Missing gate name in row, skipping...");
            return; // Skip this row if no gate name found
        }

        let gateName = gateNameElement.textContent.trim(); 

        // Determine the status from the checked radio button
        let goodRadio = row.querySelector('input[type="radio"][id*="good"]'); 
        let badRadio = row.querySelector('input[type="radio"][id*="bad"]'); 

        let status = "לא ידוע"; // Default status
        if (goodRadio && goodRadio.checked) {
            status = "תקין"; 
        } else if (badRadio && badRadio.checked) {
            status = "לא תקין"; 
        }

        // Extract notes, ensuring no "undefined" or empty placeholder text
        let notesInput = row.querySelector(".notes-gates");
        let notes = notesInput ? notesInput.value.trim() : ""; 

        // Construct row data
        let rowData = `${gateName} , ${status}`;
        if (notes) rowData += ` , ${notes}`; // Only add notes if they exist
        rowData += "\n";

        // Append to Data
        Data += rowData;
    });

    return Data;
}



function saveGateData() {
    // Get the current date in the desired format
    const currentDate = new Date();
    const dateWithDots = currentDate.toLocaleDateString('he-IL').replace(/\//g, '.'); // Format date as "DD.MM.YYYY"

    // Get the selected shift value from the dropdown
    const shiftSelect = document.getElementById('shiftSelect');
    const selectedShift = shiftSelect.value;

    // Validate the shift selection
    if (!selectedShift || selectedShift === "בחר משמרת") {
        selectedShift === "לא ידוע"
    }

    // Reference Firebase Firestore
    const db = firebase.firestore();

    // Select all rows with gate data
    let rows = document.querySelectorAll(".row");

    rows.forEach(row => {
        // Find the gate name element
        let gateNameElement = row.querySelector(".col:nth-child(1)");
        if (!gateNameElement) {
            console.warn("Missing gate name in row, skipping...");
            return; // Skip this row if no gate name found
        }

        let gateName = gateNameElement.textContent.trim();

        // Determine the status from the checked radio button
        let goodRadio = row.querySelector('input[type="radio"][id*="good"]'); // Radio for "good"
        let badRadio = row.querySelector('input[type="radio"][id*="bad"]'); // Radio for "bad"

        let status = "לא ידוע"; // Default status
        if (goodRadio && goodRadio.checked) {
            status = "תקין"; // Good is checked
        } else if (badRadio && badRadio.checked) {
            status = "לא תקין"; // Bad is checked
        }

        // Extract notes from the left column (leave empty if no notes)
        let notesInput = row.querySelector(".notes-gates");
        let notes = notesInput ? notesInput.value.trim() : ""; // Add notes only if they exist

        // Prepare data object for Firebase
        const data = {
            gateName: gateName,
            status: status,
            notes: notes,
            date: dateWithDots,
            shift: selectedShift // Use the selected shift value
        };

        // Save the data to Firebase
        db.collection("412A").doc(dateWithDots) // Replace with your document structure as needed
            .collection("gateDromi").doc(gateName)
            .set(data, { merge: true })
            .then(() => console.log(`Data for gate ${gateName} saved successfully`))
            .catch(error => console.error(`Error saving data for gate ${gateName}:`, error));
    });
}



function copyGateData() {
    console.log("im here ");
    saveGateData()
    const gateData = getGateData();
    navigator.clipboard.writeText(gateData).then(() => {
        alert("הנתונים הועתקו בהצלחה");
    }).catch(err => {
        alert("שגיאה בהעתקת הנתונים: " + err);
    });
}


function sendGatWhatsApp(){
    const gateData = getGateData();
    saveGateData()
    const phoneNumber = "972522121836";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(gateData)}`;
    window.open(whatsappURL, "_blank");
}

function goHome() {
    window.location.href = 'index.html';
}
