function navigateTo(page) {
    window.location.href = page;
}

  document.addEventListener("DOMContentLoaded", (event) => {
    loadDataCi();
    console.log("DOM fully loaded and parsed");

  });


const currentDate = displayCurrentDate();
const dateWithDots = currentDate.replace(/\//g, ".");
//display date and create an entry in the db for this day 
function displayCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-IL', options);
    console.log(formattedDate)
    const stringWithDots = formattedDate.replace(/\//g, ".");
    console.log(stringWithDots);
    return formattedDate;
}

function loadDataCi(){
    let items=[];
    firestore.collection("CIs").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let data = {
                commanderName:doc.data().commanderName,
                ci_FirstName :doc.data().ciFirstName,
                ci_lastName: doc.data().ciLastName,
                ci_id :doc.data().ciFirstName,
                ci_tel: doc.data().ciLastName,
                ci_address :doc.data().ciFirstName,
                date_added: doc.data().date
            };
            console.log(data);
            items.push(data);
        });
        if(items.length === 0 )
        {
            console.log('list is empty');
        }
        else{
            loadCiTable(items);
        }
    });
}
  
  const saveButton = document.querySelector('.save-data-ci');
  // regSubmitButton.addEventListener('click', register);
  if (saveButton) {
    saveButton.addEventListener('click', saveCiData);
  }
  
  function saveCiData(){
    const data={
        date: dateWithDots,
        commanderName: document.getElementById('commanderName-ci').value,
        ciFirstName:document.getElementById('ci-name-first').value,
        ciLastName: document.getElementById('ci-name-last').value,
        ciID: document.getElementById('ci-id').value,
        ciTel: document.getElementById('ci-phone').value,
        ciAddress: document.getElementById('address').value
    }
    console.log(data);
    firestore.collection("CIs").doc(data.ciID) // Replace with your document structure as needed
            .set(data, { merge: true })
            .then(() => console.log(`Data saved successfully during shift1`))
            .catch(error => console.error("Error saving data:", error));

    document.getElementById('commanderName-ci').value = '';
    document.getElementById('ci-name-first').value = '';
    document.getElementById('ci-name-last').value = '';
    document.getElementById('ci-id').value = '';
    document.getElementById('ci-phone').value = '';
    document.getElementById('address').value = '';

  }


  const tableBody = document.querySelector('#table-body');
  const displayedDocIds = new Set();
  // Listen to Firestore for real-time updates
firestore.collection("CIs").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const docId = change.doc.id;
        const data = change.doc.data();
        const item = {
            commanderName:data.commanderName,
            ci_FirstName :data.ciFirstName,
            ci_lastName: data.ciLastName,
        }
        const rowNumber = tableBody.rows.length + 1;
        // Check if the document is already displayed
        if (!displayedDocIds.has(docId)) {
          displayedDocIds.add(docId);
          tableBody.appendChild(createRow(rowNumber, item));
        }
      }
    });
  });
  function createRow(index, rowData = {}) {
    const row = document.createElement('tr');
    row.innerHTML = `
                <th scope="row">${index}</th>
                <td>${rowData.ci_FirstName !== undefined ? rowData.ci_FirstName : ''}</td>
                <td>${rowData.ci_lastName !== undefined ? rowData.ci_lastName : ''}</td>
                <td>${rowData.commanderName !== undefined ? rowData.commanderName : ''}</td>
            `;
    return row;
}
function loadCiTable(data)
{
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; // Clear existing rows

    // Load provided data
    data.forEach((item, index) => {
        tbody.appendChild(createRow(index + 1, item));
    });
}