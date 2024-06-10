import {
  pingWindow,
  getTime,
  generateExperimentListItem,
} from "./utils/index.js";
import {
  handler_abtasty,
  handler_adobeTarget_v1,
  handler_adobeTarget_v2,
  handler_optimizely,
  handler_vwo,
} from "./handlers/events/index.js";
import {
  experimentHandler_abtasty,
  experimentHandler_optimizely,
} from "./handlers/experiments/index.js";

chrome.devtools.panels.create(
  "REO Events",
  "icon.png",
  "devtools.html",
  function (panel) {
    panel.onShown.addListener(function (panelWindow) {
      var body = panelWindow.document.body;
      var urlsList = panelWindow.document.querySelector("ul#event-list");
      const activeExperimentsCount = body.querySelector(
        "#experiments div.active span"
      );
      const inactiveExperimentsCount = body.querySelector(
        "#experiments div.inactive span"
      );
      const activeExperiments = body.querySelector(
        "#experiments .exp-list.active ul"
      );
      const inactiveExperiments = body.querySelector(
        "#experiments .exp-list.inactive ul"
      );

      function updateList(eventType, eventName) {
        var listItem = panelWindow.document.createElement("li");
        listItem.classList.add("event-list");
        listItem.innerHTML = `<div class="event-time">${getTime()}</div><div class="event-type">${eventType}</div><div class="event-name">${eventName}</div>`;
        urlsList.appendChild(listItem);
      }
      function clearList() {
        urlsList.innerHTML = "";
      }
      function clearExperiments() {
        body.querySelector("div.exp-list.active").classList.remove("open");
        body.querySelector("div.exp-list.inactive").classList.remove("open");
        activeExperimentsCount.innerText = `0`;
        inactiveExperimentsCount.innerText = `0`;
        activeExperiments.innerHTML = ``;
        inactiveExperiments.innerHTML = ``;
      }

      function updateToolInfo() {
        function showTool(filename) {
          body.querySelector(".tool").classList.remove("searching");
          body.querySelector(".tool").classList.add("found");
          body
            .querySelector(".tool img.found")
            .setAttribute("src", `./assets/${filename}`);
        }
        pingWindow("window.ABTasty", function (result) {
          if (result) {
            showTool("abtasty.png");
          }
        });
        pingWindow("window.adobe.target.VERSION", function (result) {
          if (result) {
            showTool("adobetarget.png");
          }
        });
        pingWindow("window.optimizely", function (result) {
          if (result) {
            showTool("optimizely.png");
          }
        });
        pingWindow("window.VWO", function (result) {
          if (result) {
            showTool("vwo.png");
          }
        });
      }
      // updates the AB test tool.
      updateToolInfo();

      function updateExperiments() {
        function populateTests(tool, result) {
          // console.log({ tool, result });
          var consolidatedExperiments;
          if (tool === "abtasty") {
            consolidatedExperiments = experimentHandler_abtasty(result);
          }
          if (tool === "optimizely") {
            consolidatedExperiments = experimentHandler_optimizely(result);
          }

          clearExperiments();

          inactiveExperimentsCount.innerText =
            consolidatedExperiments.inactive.length;
          activeExperimentsCount.innerText =
            consolidatedExperiments.active.length;

          consolidatedExperiments.active.forEach(function (item) {
            activeExperiments.innerHTML += generateExperimentListItem(item);
          });
          consolidatedExperiments.inactive.forEach(function (item) {
            inactiveExperiments.innerHTML += generateExperimentListItem(item);
          });
        }

        pingWindow("window.ABTasty.results", function (result) {
          if (result) {
            populateTests("abtasty", result);
          }
        });
        pingWindow(
          "window.optimizely.get('state').getExperimentStates()",
          function (result) {
            if (result) {
              populateTests("optimizely", result);
            }
          }
        );
      }
      updateExperiments();

      // click event listener.
      body.addEventListener("click", function (e) {
        if (e.target.closest("button#clear-events")) {
          clearList();
        }
        if (
          e.target.closest("section#experiments") &&
          e.target.closest("div.exp-list")
        ) {
          // open & close experiment list accordian.
          var expList = e.target.closest("div.exp-list");
          if (expList.classList.contains("open")) {
            expList.classList.remove("open");
          } else {
            expList.classList.add("open");
          }
        }
        if (e.target.closest("button#refresh")) {
          // click on refresh button.
          clearExperiments();
          updateExperiments();
        }
      });

      // network request listener.
      chrome.devtools.network.onRequestFinished.addListener(function (request) {
        if (request.request.url.includes("ariane.abtasty.com")) {
          var payload = JSON.parse(request.request.postData.text);
          handler_abtasty(payload, updateList);
        }
        if (request.request.url.includes("/v1/delivery")) {
          var payload = JSON.parse(request.request.postData.text);
          handler_adobeTarget_v1(payload, updateList);
        }
        if (request.request.url.includes("/mbox/json")) {
          var payload = request.request.queryString;
          handler_adobeTarget_v2(payload, updateList);
        }
        if (request.request.url.includes("logx.optimizely")) {
          var payload = JSON.parse(request.request.postData.text);
          handler_optimizely(payload, updateList);
        }
        if (
          request.request.url.includes("visualwebsiteoptimizer.com") &&
          request.request.method === "POST"
        ) {
          var payload = JSON.parse(request.request.postData.text);
          handler_vwo(payload, updateList);
        }
      });
    });
  }
);
