/* save login */
const registerButton = document.querySelector(`.register-button`).addEventListener(`click`, saveData);

function saveData() {
    const dataInputName = document.getElementById(`dataInputName`).value;
    const dataInputMail = document.getElementById(`dataInputMail`).value;
    const dataInputPhone = document.getElementById(`dataInputPhone`).value;
    const dataInputPassword = document.getElementById(`dataInputPassword`).value;
    if (dataInputName === `` || dataInputMail === `` || dataInputPhone === `` || dataInputPassword === ``) {
        alert(`Fill in the whole form before submitting.`);
        return;
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
