const rowContainer = document.querySelector('.row-container');// The original div that contains the players

//on submit of input-add-skill execute the function to create a new row
export default function addSkillRow(skillName, spreadSheet) {
    if (skillName) {

        let skillNameArray = skillName;

        if (skillName.skillname) {
            skillName = skillName.skillname;
        }

        // Prevent creating a row with the same name
        const existingRows = spreadSheet.querySelectorAll('.row-container .col.border:first-child');
        const skillExists = Array.from(existingRows).some(row => row.textContent === skillName);

        if (skillExists) {
            return "stop"; //return stop as result of stopping the function (used to emit an alert if skill already exists)
        }

        // Create a new row for the skill name
        let newRow = ``;
        newRow = rowCreation(skillName, skillNameArray, newRow)

        // Loop through each player div
        const playerDivs = rowContainer.querySelectorAll('#player');

        playerDivs.forEach(playerDiv => {

            const playerName = playerDiv.querySelector('.playername');
            const playerNameText = playerName ? playerName.textContent : 'unknown';
            const images = playerDiv.querySelectorAll('img'); // Get all images for this player

            newRow += `
            <div class="col border spreadsheet-box">
                <div class="playername"></div>
                <div class="d-flex justify-content-center" style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
            `;

            // Loop through each img skills to generate an equal amount of checkbox
            images.forEach(img => {
                newRow = checkCheckbox(skillName, playerNameText, img, skillNameArray, newRow);
            });
            newRow += `</div></div>`; // Close the flex container and the player div
        });
        newRow += '</div></div> '; // Close the row div

        // Append the new row to the spreadsheet container
        spreadSheet.innerHTML += newRow;
    }
}

// Loop through each img skills to generate an equal amount of checkbox
function checkCheckbox(skillName, playerNameText, img, skillNameArray, newRow) {
    // Check if skillNameArray is truthy and contains the data for skillName-playerNameText-img.alt

    let imgDescription = img.alt; // Get the image description
    let checkboxId = `checkbox-${skillName}-${playerNameText}-${imgDescription}`; // Unique ID for the checkbox

    // Check if skillNameArray has the key and get its value
    let checkboxData = skillNameArray[checkboxId];
    if (skillNameArray) {
        if (checkboxData === true) {
            newRow += `
            <div class="checkbox-div">
                <label for="${checkboxId}"></label>
                <input type="checkbox" id="${checkboxId}" checked="checked" />
            </div>`;
        } else {
            newRow += `
                <div class="checkbox-div">
                    <label for="${checkboxId}"></label>
                    <input type="checkbox" id="${checkboxId}" />  
                </div> 
            `;
        }
    } else {
        // If skillNameArray is falsy, just create an unchecked checkbox
        newRow += `
        <div class="checkbox-div">
            <label for="checkbox-${skillName}-${playerNameText}-${img.alt}"></label>
            <input type="checkbox" id="checkbox-${skillName}-${playerNameText}-${img.alt}" />
        </div>`;
    }
    return newRow; // Return the updated newRow
}
// Create a new row for the skill name
function rowCreation(skillName, skillNameArray, newRow) {
//if the row is already on the database it creates the first one, if it's a new row the second one
    if (skillNameArray.timer || skillNameArray.damagetotal || skillNameArray.type) {
        newRow += `
        <div class="row row-container">
            <div class="col-4 sticky-left">
                <div class="row spreadsheet-box">
                    <button class="trash-can" id="btn-delete-${skillName}"><img src="./img/trash_can.svg" alt="trash_can"></button>
                    <div class="col border boss-info" id="${skillName}-skill">${skillName}</div>
                    <div class="col border boss-info" id="${skillName}-timer"><textarea id="${skillName}-timer-textarea" maxlength="22">${skillNameArray.timer}</textarea></div>
                    <div class="col border boss-info" id="${skillName}-damage-total"><textarea id="${skillName}-damage-total-textarea" maxlength="22">${skillNameArray.damagetotal}</textarea></div>
                    <div class="col border boss-info" id="${skillName}-damage-taken">${skillNameArray.damagetaken}</div>
                    <div class="col border boss-info" id="${skillName}-type">
                        <select>
                            <option value="magical" ${skillNameArray.type === "magical" ? "selected" : ""}>Magical</option>
                            <option value="physical" ${skillNameArray.type === "physical" ? "selected" : ""}>Physical</option>
                        </select> 
                    </div>
                </div>
            </div>
             <div class="skills">`;
    } else {
        newRow += `
        <div class="row row-container">
            <div class="col-4 sticky-left">
                <div class="row spreadsheet-box">
                    <button class="trash-can" id="btn-delete-${skillName}"><img src="./img/trash_can.svg" alt="trash_can"></button>
                    <div class="col border boss-info" id="${skillName}-skill">${skillName}</div>
                    <div class="col border boss-info" id="${skillName}-timer"><textarea id="${skillName}-timer-textarea" maxlength="22"></textarea></div>
                    <div class="col border boss-info" id="${skillName}-damage-total"><textarea id="${skillName}-damage-total-textarea" maxlength="22"></textarea></div>
                    <div class="col border boss-info" id="${skillName}-damage-taken"></div>
                    <div class="col border boss-info" id="${skillName}-type">
                       <select>
                            <option value="magical" selected>Magical</option>
                            <option value="physical">Physical</option>
                        </select>
                    </div>
                </div>
            </div>
             <div class="skills">`;
    }

    return newRow
}