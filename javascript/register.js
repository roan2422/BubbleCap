/* save login */
const registerButton = document.querySelector(`.register-button`).addEventListener(`click`, saveData);

function saveData() {
    const dataInputName = document.getElementById(`dataInputName`).value.trim();
    const dataInputMail = document.getElementById(`dataInputMail`).value.trim();
    const dataInputPhone = document.getElementById(`dataInputPhone`).value.trim();
    const dataInputPassword = document.getElementById(`dataInputPassword`).value.trim();
    if (
        dataInputName.length < 1 ||
        dataInputMail.length < 1 ||
        dataInputPhone.length < 1 ||
        dataInputPassword.length < 1
    ) {
        alert(`Fill in the whole form before submitting.`);
    } else {
        localStorage.setItem(`userData`, dataInputName);
        displayData();
        window.location.replace(`index.html`);
    }
}

/* een form met alleen een naam zou niet echt mooi eruit zien */

/* display name */
function displayData() {
    const savedData = localStorage.getItem(`userData`);
    if (savedData) document.getElementById(`savedData`).innerText = `Hello, ${savedData}`;
}

displayData();
