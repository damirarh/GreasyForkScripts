// ==UserScript==
// @name         Copy TrueGaming achievement list
// @namespace    https://damirscorner.com
// @version      1.0.0
// @description  Copies the achievements/trophies from the True Achievements, TrueTrophies, and TrueSteamAchievements game page to clipboard as a table for further processing elsewhere.
// @author       Damir Arh
// @license      MIT
// @supportURL   https://github.com/damirarh/GreasyForkScripts
// @match        https://www.trueachievements.com/game/*/achievements*
// @match        https://www.truetrophies.com/game/*/trophies*
// @match        https://truesteamachievements.com/game/*/achievements*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function copyToClipboard() {
    const elementsToParse = document.querySelectorAll(
      ".ach-panels, .panel-header[id]"
    );
    let currentDlc;
    let achievements = [];

    for (const element of elementsToParse) {
      if (element.classList.contains("ach-panels")) {
        const achievementElements = element.querySelectorAll("li");
        for (const achievementElement of achievementElements) {
          const achievement = {
            dlc: currentDlc,
          };

          const titleElement = achievementElement.querySelector(".title");
          if (titleElement) {
            achievement.name = titleElement.textContent;
            achievement.ta = titleElement.dataset.af;
            achievement.url = titleElement.href.match(/^([^?])+/g)[0];
          }

          const descriptionElement = achievementElement.querySelector("p");
          if (descriptionElement) {
            achievement.description = descriptionElement.textContent;
            const scoreData = descriptionElement.dataset.bf;
            achievement.score = scoreData && scoreData.replace(" - ", "");
          }

          const progressElement = achievementElement.querySelector(
            ".progress-bar"
          );
          if (progressElement) {
            achievement.ratio = progressElement.dataset.af.match(
              /= (([\d\.])+)\)$/
            )[1];
          }

          const lockElement = achievementElement.querySelector(".lock");
          achievement.unlocked = !!(
            lockElement && lockElement.classList.contains("u")
          );

          achievements.push(achievement);
        }
      } else if (element.classList.contains("panel-header")) {
        const dlcTypeElement = element.querySelector(".tile span");
        const dlcTitleElement = element.querySelector(".title a");

        currentDlc = {
          type: dlcTypeElement && dlcTypeElement.textContent,
          title: dlcTitleElement && dlcTitleElement.textContent,
        };
      }
    }

    const achievementsTable =
      "DLC type\tDLC title\tName\tDescription\tScore\tTA\tTA ratio\tUnlocked\tURL\n" +
      achievements
        .map(function (achievement) {
          return (
            `${(achievement.dlc && achievement.dlc.type) || ""}` +
            `\t${(achievement.dlc && achievement.dlc.title) || ""}` +
            `\t${achievement.name}` +
            `\t${achievement.description}` +
            `\t${achievement.score}` +
            `\t${achievement.ta}` +
            `\t ${achievement.ratio}` + // leading space helps Excel not to recognize it as a date
            `\t${achievement.unlocked ? "Yes" : "No"}` +
            `\t${achievement.url}`
          );
        })
        .join("\n");
    navigator.clipboard.writeText(achievementsTable);
  }

  const filterDropdownTitleElement = document.querySelector(
    "#btnFlagFilter_Options .title"
  );

  if (!filterDropdownTitleElement) {
    return;
  }

  const copyIcon = document.createElement("img");
  copyIcon.setAttribute("src", "/images/icons/copy.png");
  copyIcon.setAttribute("alt", "Copy to clipboard");

  const copyAnchor = document.createElement("a");
  copyAnchor.setAttribute("href", "#");
  copyAnchor.setAttribute("title", "Copy to clipboard");
  copyAnchor.style.marginLeft = "0";
  copyAnchor.appendChild(copyIcon);

  copyAnchor.addEventListener("click", copyToClipboard);

  filterDropdownTitleElement.appendChild(copyAnchor);
})();
