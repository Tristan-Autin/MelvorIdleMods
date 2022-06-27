// ==UserScript==
// @name            Select Easy Slayer Task
// @version         1.0.0
// @license         MIT
// @description     A mod that adds a select button in the slayer task window. It allows you to select a task among all the easy tasks listed.
// @author          Tristan-Autin
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// @namespace       https://greasyfork.org/en/users/929271
// ==/UserScript==

function EasySlayerTaskChoice() {
  // Monster IDs of Easy Slayer tasks.
  const MONSTER_IDS = [
    37, 111, 5, 35, 38, 67, 36, 81, 71, 4, 28, 82, 0, 59, 68, 75, 8, 14, 1, 9,
    70, 3, 72, 6, 12, 60, 13, 29, 10, 18, 24, 76, 20, 62, 69,
  ];

  var extendTask = document.getElementById("combat-slayer-task-extend-button");
  extendTask.classList.add(...["d-flex", "flex-column", "mt-5"]);
  let select = document.createElement("button");
  let optionsContainer = document.createElement("div");
  select.classList.add(
    ...["btn", "btn-sm", "btn-secondary", "dropdown-toggle", "mt-3", "w-100"]
  );
  select.setAttribute("data-toggle", "dropdown");
  select.innerHTML = "Choose your task";

  optionsContainer.classList.add(
    ...["dropdown-menu", "font-size-sm", "overflow-y-auto"]
  );
  optionsContainer.setAttribute(
    "style",
    "max-height: 60vh;z-index: 9999; min-width: 20rem;"
  );
  combatManager.slayerTask.extendContainer.appendChild(select);
  combatManager.slayerTask.extendContainer.appendChild(optionsContainer);

  for (let i = 0; i < MONSTER_IDS.length; i++) {
    let MONSTER_NAME = getMonsterName(MONSTER_IDS[i]);
    getButton(MONSTER_IDS[i], MONSTER_NAME);
  }

  function getButton(monsterId, monsterName) {
    let option = document.createElement("div");
    option.classList.add(
      ...["dropdown-item", "bank-defaultItemTab-0", "pointer-enabled", "d-flex"]
    );
    option.addEventListener("click", () => setNewEasyTask(monsterId));
    optionsContainer.appendChild(option);

    let img = document.createElement("img");
    img.setAttribute(
      "src",
      `https://cdn.melvor.net/core/v018/${MONSTERS[monsterId].media}`
    );
    img.classList.add(...["skill-icon-xs"]);
    option.appendChild(img);

    let p = document.createElement("p");
    p.innerHTML = monsterName;
    p.classList.add(...["mb-0", "ml-3", "align-self-center"]);
    option.appendChild(p);
    return option;
  }

  function setNewEasyTask(id) {
    // Check if currently fighting an Easy task. Comment these lines out if you like to live dangerously
    if (combatManager.slayerTask.tier > 0) {
      notifyPlayer(
        CONSTANTS.skill.Slayer,
        "You must be fighting an Easy slayer task",
        "danger"
      );
      return;
    }

    while (combatManager.slayerTask.monster.id != id) {
      combatManager.slayerTask.selectTask(0, false, false);
    }
  }
}

// Injecting the script when possible
(() => {
  function loadScript() {
    // Load script after the actual Melvor game has loaded
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      clearInterval(scriptLoader);

      const scriptElem = document.createElement("script");
      scriptElem.textContent = `try {(${EasySlayerTaskChoice})();} catch (e) {console.log(e);}`;
      document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
    }
  }

  const scriptLoader = setInterval(loadScript, 250);
})();
