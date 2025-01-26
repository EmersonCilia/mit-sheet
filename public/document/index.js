import { emitRowsValue, selectDocument, emitCheckboxValue, emitSelectOption, emitDeleteDocument, emitDeleteRow } from "./socket-front-document.js";
import addSkillRow from "./domFunction.js";
import handleDamageReduction from "./skills/skills.js"

//the parameter of url will be used to find docs in the database
const parameters = new URLSearchParams(window.location.search);
const documentName = parameters.get("name");

//doc name in the header
const titleDocument = document.getElementById("title-document");
titleDocument.textContent = documentName || "Untitled Document";

//used to execute functions that will create new rolls when add button is clicked
const skillName = document.getElementById('input-skill-name');
const spreadSheet = document.getElementById('container-spreadsheet');

//element used to update interface with connected users
const connectedUsers = document.getElementById("connected-users");

//delete button
const documentDeleteBtn = document.getElementById("delete-document");


//Ensure to call selectDocument every time the page is loaded
function refineSucessAuthorization(payloadToken) {
    selectDocument({ documentName, userName: payloadToken.username });
}

function updateUsersInterface(userInDocument) {
    connectedUsers.innerHTML = "";

    userInDocument.forEach((user) => {
        connectedUsers.innerHTML += `
            <li class="list-group-item">${user}</li>
            `
    });
}


//functions
function updateSkillText(data) {
    // Check if the data belongs to the current document
    if (data.name !== documentName) return;

    const skillNameInput = Object.keys(data).find(key => key !== "name"); // Dynamically get the key
    const skillname = data[skillNameInput].skillname;
    let damagetotal = data[skillNameInput].damagetotal;
    let timer = data[skillNameInput].timer;
    let damagetaken = data[skillNameInput].damagetaken;
    const skillNameDiv = document.getElementById(`${skillname}-skill`);
    if (!skillNameDiv) {
        // If skill row doesn't exist, add it
        updateSkillRows(skillname, spreadSheet); // Call the addSkillRow method to create the row
        return;
    }
    // Select the correct DOM elements
    let damagetotalElement = document.querySelector(`#${skillname}-damage-total textarea`);
    let timerElement = document.querySelector(`#${skillname}-timer textarea`);
    let damageTakenElement = document.getElementById(`${skillname}-damage-taken`);
    // Update the DOM elements' values
    if (damagetotalElement) damagetotalElement.value = damagetotal;
    if (timerElement) timerElement.value = timer;
    if (damageTakenElement) damageTakenElement.innerText = damagetaken;
}
function updateSkillRows(skillNameDb) {
    addSkillRow(skillNameDb, spreadSheet);
}

function checkboxUpdater(checkboxId, damagetaken) {
    const checkbox = document.getElementById(checkboxId);
    
    if (checkbox) {
        const idParts = checkboxId.split("-");
        const skillName = idParts[1];
        let damageTakenElement = document.getElementById(`${skillName}-damage-taken`);
        damageTakenElement.innerText = damagetaken;
        // Check if the checkbox is currently checked
        if (checkbox.checked) {
            // Update both the property and attribute to uncheck
            checkbox.checked = false; // Updates the UI state
            checkbox.removeAttribute('checked'); // Updates the DOM attribute
        } else {
            // Update both the property and attribute to check
            checkbox.checked = true; // Updates the UI state
            checkbox.setAttribute('checked', 'checked'); // Updates the DOM attribute
        }
        // You can call additional logic like syncing with the database here
        selectDocument(documentName);
    }
}
function typeUpdater(skillNameDiv, selectedType) {
    const selectDiv = document.getElementById(`${skillNameDiv}-type-select`);
    if (selectDiv) {
        selectDiv.value = selectedType;
    }
}

function alertAndRedirect(name) {
    if (name === documentName) {
        alert(`Document ${name} deleted!`);
        window.location.href = "/";
    }
}
function deleteAndUpdateRow(param) {
    const rowDiv = document.getElementById(`${param}-skill`)
    const RowToDelete = rowDiv.closest(".row-container")
    spreadSheet.removeChild(RowToDelete);
}

export { updateSkillRows, updateSkillText, checkboxUpdater, typeUpdater, refineSucessAuthorization, updateUsersInterface, alertAndRedirect, deleteAndUpdateRow }

//event listeners
document.addEventListener("input", function (e) {
    let target = e.target;
    let newValue = target.value;

    // Get the parent div with the dynamic ID
    const parentDiv = target.closest("div[id$='-timer'], div[id$='-damage-total']");

    if (parentDiv) {
        const idParts = parentDiv.id.split("-");
        const skillName = idParts[0]; // e.g., "qweqwe" from "qweqwe-timer"
        let property;
        let damageTotal = document.getElementById(`${skillName}-damage-total-textarea`)
        let timer =  document.getElementById(`${skillName}-timer-textarea`)
    
        let damageTaken = handleDamageReduction(damageTotal)
        // Dynamically update the database
        property = idParts[1] === "timer" ?
            emitRowsValue({
                documentName,
                skillNameInput: skillName,
                timer: newValue,
                damagetotal: damageTotal.value,
                damagetaken: damageTaken.toFixed(1)
            }) :
            (emitRowsValue({
                documentName,
                skillNameInput: skillName,
                timer: timer.value,
                damagetotal: newValue,
                damagetaken: damageTaken.toFixed(1)
            })
        )
    }
});

document.getElementById('form-add-new-skill').addEventListener('submit', function (e) {
    e.preventDefault();

    const skillNameInputValue = skillName.value
    const timer = document.getElementById(`${skillNameInputValue}-timer`)
    const damagetotal = document.getElementById(`${skillNameInputValue}-damage-total`)
    const damageTaken = document.getAnimations(`${skillNameInputValue}--damage-taken`).innerHTML

    let addskillResult = addSkillRow(skillNameInputValue, spreadSheet);
    if (addskillResult === "stop") {
        alert('A row with this skill name already exists!');
        return;
    } // Stop further execution if "stop" is returned
    emitRowsValue({
        documentName,
        skillNameInput: skillNameInputValue,
        timer,
        damagetotal,
        damageTaken
    });
});

document.addEventListener('click', function (event) {
    const buxfix = document.getElementById("theme-switch")
    if (event.target.type === 'checkbox' && event.target !== buxfix) {

        const checkbox = event.target;
        const idParts = checkbox.id.split("-");
        const skillNameInput = idParts[1];

        if (checkbox.checked) {
            checkbox.setAttribute('checked', 'checked'); // Dynamically add the 'checked' attribute
            let checked = true
            const damagetaken = handleDamageReduction(event)
            emitCheckboxValue(checkbox.id, skillNameInput, checked, damagetaken)
        } else {
            checkbox.removeAttribute('checked'); // Remove the 'checked' attribute when unchecked
            let checked = false;
            const damagetaken = handleDamageReduction(event)
            emitCheckboxValue(checkbox.id, skillNameInput, checked, damagetaken);
        }
    }
})

document.addEventListener("change", (event) => {
    if (event.target.tagName === "SELECT" && event.target.closest("div[id$='-type']")) {
        const skillDiv = event.target.closest(".row").querySelector("div[id$='-skill']");
        const skillNameDiv = skillDiv.id.replace("-skill", ""); // Extract skillName
        const selectedType = event.target.value; // Get the selected valu
        handleDamageReduction(event)
        emitSelectOption({ skillNameDiv, selectedType })
    }
});

documentDeleteBtn.addEventListener("click", () => {
    const confirmation = confirm(`Are you sure you want to delete "${documentName}" mitigation plan?`);
    if (confirmation) {
        emitDeleteDocument(documentName);
    }
});


document.addEventListener("click", (event) => {
    if (event.target.closest(".trash-can")) {
        const rowDiv = event.target.closest(".row-container"); // Find the parent row
        const rowName = rowDiv.querySelector("div[id$='-skill']").innerHTML; // Locate the skill div within the row
        if (rowName) {
            const confirmation = confirm(`Are you sure you want to delete the skill "${rowName}"?`);
            if (confirmation) {
                emitDeleteRow({ documentName, rowName }); // Emit the delete action only if confirmed
            }
        }
    }
});
