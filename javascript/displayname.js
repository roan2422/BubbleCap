/* display name */
function displayData() {
    const savedData = localStorage.getItem(`userData`);
    if (savedData) document.getElementById(`savedData`).innerText = `Hello, ${savedData}`;
}

displayData();
