export default function handleDamageReduction(event) {
    let target;
    let damageTaken;

    // Determine the target element based on the event type
    if (event instanceof Event) {
        if (event.target) target = event.target;
        if (event.target.tagName === "SELECT") {
            target = event.target.closest(".row").querySelector("div[id$='-damage-total'] textarea");
        }
    } else if (event instanceof HTMLElement) {
        target = event;
    } else {
        console.error("Invalid event input. Expected an Event or HTMLElement.");
        return null;
    }

    const idParts = target.id.split("-");
    const skillName = idParts[1] || idParts[0]; // Skill name from the ID

    // Scope mitigation checks to the current row
    const currentRow = target.closest(".row");

    // Get the damage total for this skill
    const damagetotalSkill = parseFloat(
        currentRow.querySelector(`#${skillName}-damage-total textarea`).value
    );

    const damageTypeSelect = currentRow.querySelector(`#${skillName}-type select`);
    const damageType = damageTypeSelect ? damageTypeSelect.value : null;

    // List of mitigations to check (scoped to the current row)
    const mitigations = [
        "Reprisal", "Rampart", "Heart_of_Corundum", "Great_Nebula", "Heart_of_Light",
        "Camouflage", "Dark_Mind", "Oblation", "Shadowed_Vigil",
        "Dark_Missionary", "Shield_Samba", "Fey_Illumination_sch", "Sacred_Soil", "Expedient",
        "Addle", "Feint", "Aquaveil", "Temperance"
    ];

    let adjustedDamage = damagetotalSkill;

    // Check each mitigation for this row
    mitigations.forEach((mitigationName) => {
        const mitigationCheckbox = currentRow.querySelector(`[id$="-${mitigationName}"][type="checkbox"]`);
        if (mitigationCheckbox && mitigationCheckbox.checked) {
            switch (mitigationName) {
                case "Reprisal":
                    adjustedDamage *= 0.9;
                    break;
                case "Rampart":
                    adjustedDamage *= 0.8;
                    break;
                case "Heart_of_Corundum":
                    adjustedDamage *= 0.85;
                    break;
                case "Great_Nebula":
                    adjustedDamage *= 0.6;
                    break;
                case "Heart_of_Light":
                    adjustedDamage *= damageType === "magical" ? 0.9 : 0.95;
                    break;
                case "Camouflage":
                    adjustedDamage *= 0.85;
                    break;
                case "Dark_Mind":
                    adjustedDamage *= damageType === "magical" ? 0.8 : 0.9;
                    break;
                case "Shadowed_Vigil":
                    adjustedDamage *= 0.6;
                    break;
                case "Dark_Missionary":
                    adjustedDamage *= damageType === "magical" ? 0.9 : 0.95;
                    break;
                case "Shield_Samba":
                    adjustedDamage *= 0.85;
                    break;
                case "Fey_Illumination_sch":
                    adjustedDamage *= 0.95;
                    break;
                case "Sacred_Soil":
                    adjustedDamage *= 0.9;
                    break;
                case "Expedient":
                    adjustedDamage *= 0.9;
                    break;
                case "Addle":
                    adjustedDamage *= damageType === "magical" ? 0.9 : 0.95;
                    break;
                case "Feint":
                    adjustedDamage *= damageType === "magical" ? 0.95 : 0.9;
                    break;
                case "Aquaveil":
                    adjustedDamage *= 0.9;
                    break;
                case "Temperance":
                    adjustedDamage *= 0.9;
                    break;
                default:
                    break;
            }
        }
    });

    // Update the damage taken for this row
    damageTaken = currentRow.querySelector(`#${skillName}-damage-taken`);
    damageTaken.innerHTML = adjustedDamage;

    return !isNaN(adjustedDamage) ? adjustedDamage : "";
}