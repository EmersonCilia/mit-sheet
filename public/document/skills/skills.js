export default function handleDamageReduction(event) {
    let target;
    let damageTaken;

    // Case 1: If event is an event object
    if (event instanceof Event) {
        if (event.target){
        target = event.target;
        }
        if (event.target.tagName === "SELECT"){
            target = event.target.closest(".row").querySelector("div[id$='-damage-total'] textarea");
        }
    }
    // Case 2: If event is directly an element
    else if (event instanceof HTMLElement) {
        target = event;
        console.log(target)
    } else {
        console.error("Invalid event input. Expected an Event or HTMLElement.");
        return null;
    }

    // Split the ID into parts for processing
    const idParts = target.id.split("-");

    // Get the skill name based on the type of input
    let skillName;

    // Determine the damageTaken element based on the type of input
    if (target.type === "checkbox") {
        damageTaken = document.getElementById(`${idParts[1]}-damage-taken`);
        skillName = idParts[1];
    } else if (target.type === "textarea") {
        damageTaken = document.getElementById(`${idParts[0]}-damage-taken`);
        skillName = idParts[0];
    }

    // List of mitigations to check
    const mitigations = [
        "Reprisal", "Rampart", "Heart_of_Corundum", "Great_Nebula", "Heart_of_Light",
        "Camouflage", "Dark_Mind", "Oblation", "Shadowed_Vigil",
        "Dark_Missionary", "Shield_Samba", "Fey_Illumination_sch", "Sacred_Soil","Expedient",
        "Addle", "Feint", "Aquaveil", "Temperance"
    ];

    // Object to store mitigation statuses
    const mitigationStatus = {};

    // Check each mitigation dynamically across all skills
    mitigations.forEach((mitigationName) => {
        const mitigationCheckboxes = document.querySelectorAll(`[id$="-${mitigationName}"][type="checkbox"]`);
        mitigationStatus[mitigationName] = Array.from(mitigationCheckboxes).some((checkbox) => checkbox.checked);
    });

    // Handle the damage reduction logic
    const damagetotalSkill = parseFloat(
        document.querySelector(`#${skillName}-damage-total textarea`).value
    );

    const damageTypeSelect = document.querySelector(`#${skillName}-type select`);
    const damageType = damageTypeSelect ? damageTypeSelect.value : null; // Get the value of the selected option

    // Start with the total damage and apply reductions multiplicatively
    let adjustedDamage = damagetotalSkill;

    if (mitigationStatus["Reprisal"]) {
        adjustedDamage *= 0.9; // Reduce damage by 10%
    }
    if (mitigationStatus["Rampart"]) {
        adjustedDamage *= 0.8; // Reduce damage by 20%
    }
    if (mitigationStatus["Heart_of_Corundum"]) {
        adjustedDamage *= 0.85; // Reduce damage by 15%
    }
    if (mitigationStatus["Great_Nebula"]) {
        adjustedDamage *= 0.6; // Reduce damage by 40%
    }
    if (mitigationStatus["Heart_of_Light"]) {
        damageType === "magical" ? adjustedDamage *= 0.9 : adjustedDamage *= 0.95; // Reduce damage by 10%
    }
    if (mitigationStatus["Camouflage"]) {
        adjustedDamage *= 0.85; // Reduce damage by 15%
    }
    if (mitigationStatus["Dark_Mind"]) {
        damageType === "magical" ? adjustedDamage *= 0.8 : adjustedDamage *= 0.9; // Reduce damage by 20%
    }
    if (mitigationStatus["Shadowed_Vigil"]) {
        adjustedDamage *= 0.6; // Reduce damage by 40%
    }
    if (mitigationStatus["Dark_Missionary"]) {
        damageType === "magical" ? adjustedDamage *= 0.9 : adjustedDamage *= 0.95; // Reduce damage by 10%
    }
    if (mitigationStatus["Shield_Samba"]) {
        adjustedDamage *= 0.85; // Reduce damage by 15%
    }
    if (mitigationStatus["Fey_Illumination_sch"]) {
        adjustedDamage *= 0.95; // Reduce damage by 5%
    }
    if (mitigationStatus["Sacred_Soil"]) {
        adjustedDamage *= 0.9; // Reduce damage by 10%
    }
    if (mitigationStatus["Expedient"]) {
        adjustedDamage *= 0.9; // Reduce damage by 10%
    }
    if (mitigationStatus["Addle"]) {
        damageType === "magical" ? adjustedDamage *= 0.9 : adjustedDamage *= 0.95; // Reduce damage by 10% or 5%
    }
    if (mitigationStatus["Feint"]) {
        damageType === "magical" ? adjustedDamage *= 0.95 : adjustedDamage *= 0.9; // Reduce damage by 10%
    }
    if (mitigationStatus["Aquaveil"]) {
        adjustedDamage *= 0.9; // Reduce damage by 10%
    }
    if (mitigationStatus["Temperance"]) {
        adjustedDamage *= 0.9; // Reduce damage by 10%
    }
    // Set the calculated adjusted damage
    damageTaken.innerHTML = adjustedDamage;

    return !isNaN(parseFloat(damageTaken.innerHTML)) ? damageTaken.innerHTML : "";
}