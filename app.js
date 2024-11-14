const currentDate = displayCurrentDate();
const dateWithDots = currentDate.replace(/\//g, ".");
//display date and create an entry in the db for this day 
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

///////////// pillbox///////// 

// Define shift times as an array of start and end times
const shifts = [
    { shiftNumber: 1, startHour: 8, endHour: 9 },   // Shift 1: 8:00 - 8:30 AM
    { shiftNumber: 2, startHour: 12, endHour: 13 }, // Shift 2: 12:00 - 12:30 PM
    { shiftNumber: 3, startHour: 16, endHour: 17 }  // Shift 3: 16:00 - 16:30
];

// Function to check if the current time is within any shift time and return shift number
function getCurrentShift() {
    const now = new Date();
    const currentHour = now.getHours();

    // Loop through each shift to check if the current time falls within any shift time
    for (const shift of shifts) {
        const { shiftNumber, startHour, endHour } = shift;

        if ((currentHour>=startHour) && (currentHour<endHour)) {
            return shiftNumber;  // Return the shift number if within shift time
        }
    }

    return null;  // Return null if not within any shift time
}
//pillbox data 
let title;
let date;
let commanderName;
let openHour;
let closeHour;
let notes;
let shiftData;


let counters = [0, 0, 0, 0, 0];

function updateCounterFromInput(counterNumber) {
    const inputValue = parseInt(document.getElementById(`counter${counterNumber}`).value, 10);
    if (inputValue < 0) {
        inputValue = 0;  // Reset to 0 if the value is negative
        document.getElementById(`counter${counterNumber}`).value = 0;  // Update the input field
        counters[counterNumber - 1] = 0;
    }
    counters[counterNumber - 1] = isNaN(inputValue) ? 0 : inputValue;
}

function increment(counterNumber) {
    counters[counterNumber - 1] += 1;
    document.getElementById(`counter${counterNumber}`).value = counters[counterNumber - 1];
}

function decrement(counterNumber) {
    if (counters[counterNumber - 1] > 0) {
        counters[counterNumber - 1] -= 1;
        document.getElementById(`counter${counterNumber}`).value = counters[counterNumber - 1];
    }
}


function getData(){
    for (let i = 1; i <= 5; i++) {
        updateCounterFromInput(i);
    }
    title = `**${document.getElementById('title').innerText}**`;
    date = `תאריך: ${currentDate}`;
    commanderName = document.getElementById('commander-name').value || "לא צויין";
    openHour = document.getElementById('open-gate').value;
    closeHour = document.getElementById('close-gate').value;
    notes = document.getElementById('notesInput').value || "אין הערות";
    shiftData = `${title}\n${date}\nשם המפקד: ${commanderName}\nפתיחת שער: ${openHour}\nסגירת שער: ${closeHour}\nמספר נכנסים: ${counters[0]}\nמספר יוצאים: ${counters[1]}\nרכבים נכנסים: ${counters[2]}\nרכבים יוצאים: ${counters[3]}\nמסורבים: ${counters[4]}\nהערות: ${notes}`;
}

function copyData()
{
    if(getCurrentShift()!=null){
        getData();
        saveData();
        navigator.clipboard.writeText(shiftData).then(() => {
            alert("הועתק");
        }).catch(err => {
            alert("Failed to copy data: " + err);
        });
    }
    else{
        if (confirm("אינך נמצא בזמן משמרת, האם בכל זאת תרצה לבצע שינויים?")) {
            // User clicked 'OK', proceed with the action
            console.log("ok ok ok ");
            getData();
            saveData();
            navigator.clipboard.writeText(shiftData).then(() => {
                alert("הועתק");
            }).catch(err => {
                alert("Failed to copy data: " + err);
            });
        } else {
            // User clicked 'Cancel', do nothing or show a message
            console.log("Action canceled by the user.");
        }
    }
    
}

function sendWhatsApp(){
    if(getCurrentShift()!=null){
        getData();
        saveData();
        const phoneNumber = "972543149995";
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(shiftData)}`;
        window.open(whatsappURL, "_blank");
    }
    else{
        if (confirm("אינך נמצא בזמן משמרת, האם בכל זאת תרצה לבצע שינויים?")) {
            // User clicked 'OK', proceed with the action
            console.log("ok ok ok ");
            getData();
            saveData();
            const phoneNumber = "972543149995";
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(shiftData)}`;
            window.open(whatsappURL, "_blank");
        } else {
            // User clicked 'Cancel', do nothing or show a message
            console.log("Action canceled by the user.");
        }
    }
    
}

function goHome() {
    window.location.href = 'index.html';
}

function saveData(){
    const data={
        date: dateWithDots,
        commanderName: commanderName,
        openGateHour: openHour,
        closeGatehour: closeHour,
        peopleEnter: counters[0],
        peopleExit: counters[1],
        vehicleEnter : counters[2],
        vehicleExit: counters[3],
        peopleRefused: counters[4],
    }
    const db = firebase.firestore();
        db.collection("412A").doc(dateWithDots) // Replace with your document structure as needed
            .collection("pillbox").doc(openHour)
            .set(data, { merge: true })
            .then(() => console.log(`Data saved successfully during shift1`))
            .catch(error => console.error("Error saving data:", error));
    
}

///////// olive picking ///////////////////////////////////////

let oliveCounters = [0, 0, 0, 0, 0, 0, 0, 0];

function updateCounterFromInputOlive(counterNumber) {
    const inputValue = parseInt(document.getElementById(`oliveCounter${counterNumber}`).value, 10);
    if (inputValue < 0) {
        inputValue = 0;  // Reset to 0 if the value is negative
        document.getElementById(`oliveCounter${counterNumber}`).value = 0;  // Update the input field
        oliveCounters[counterNumber - 1] = 0;
    }
    oliveCounters[counterNumber - 1] = isNaN(inputValue) ? 0 : inputValue;
}

function incrementOlive(counterNumber) {
    oliveCounters[counterNumber - 1] += 1;
    document.getElementById(`oliveCounter${counterNumber}`).value = oliveCounters[counterNumber - 1];
}

function decrementOlive(counterNumber) {
    if (oliveCounters[counterNumber - 1] > 0) {
        oliveCounters[counterNumber - 1] -= 1;
        document.getElementById(`oliveCounter${counterNumber}`).value = oliveCounters[counterNumber - 1];
    }
}

let titleText;
let entryExitText;
let oliveCommanderName;
let oliveNotes;
let oliveDate;
let oliveData;

function getOliveData(){
    for (let i = 1; i <= 8; i++) {
        updateCounterFromInputOlive(i);
    }
    titleText = `**${document.getElementById("gate-name").value}**`;
    entryExitText = `**${document.getElementById("enter-exit").value}**`;
    oliveCommanderName = document.getElementById("commander-name-olive").value || "לא צויין";
    oliveNotes = document.getElementById("notesInputOlive").value || "אין הערות";
    oliveDate = `תאריך: ${currentDate}`;
    oliveData = `${titleText}\n${entryExitText}\n${oliveDate}\nשם המפקד: ${oliveCommanderName}\n` +
               `מבוגרים: ${oliveCounters[1]}\n` +
               `מסורבים (מבוגרים): ${oliveCounters[0]}\n` +
               `ילדים: ${oliveCounters[3]}\n` +
               `מסורבים (ילדים): ${oliveCounters[2]}\n` +
               `חמורים: ${oliveCounters[5]}\n` +
               `מסורבים (חמורים): ${oliveCounters[4]}\n` +
               `טרקטורים: ${oliveCounters[7]}\n` +
               `מסורבים (טרקטורים): ${oliveCounters[6]}\n` +
               `הערות: ${oliveNotes}`;
}

function copyOliveData(){
    getOliveData();
    saveOliveData();
    console.log(oliveData);
    navigator.clipboard.writeText(oliveData).then(() => {
        alert("הועתק");
    }).catch(err => {
        alert("Failed to copy data: " + err);
    });
}
function sendOliveData(){
    getOliveData();
    saveOliveData();
    const phoneNumber = "972522121836";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(oliveData)}`;
    window.open(whatsappURL, "_blank");
}

function saveOliveData(){
    const GateName = document.getElementById("gate-name").value;
    const EnterExit = document.getElementById("enter-exit").value;
    const data={
        date: dateWithDots,
        commanderName: oliveCommanderName,
        gateName: GateName,
        entryExitGate: EnterExit,
        adults: oliveCounters[1],
        adultsRefuse : oliveCounters[0],
        children: oliveCounters[3],
        childrenRefuse : oliveCounters[2],
        donkeys: oliveCounters[5],
        donkeysRefuse : oliveCounters[4],
        trucks: oliveCounters[7],
        trucksRefuse: oliveCounters[6]
    }
    const db = firebase.firestore();
        db.collection("412A").doc(dateWithDots) // Replace with your document structure as needed
            .collection(GateName).doc(EnterExit)
            .set(data, { merge: true })
            .then(() => console.log(`Data saved successfully during shift1`))
            .catch(error => console.error("Error saving data:", error));
    
}
