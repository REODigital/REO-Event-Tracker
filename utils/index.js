// gets something from application console.
export function pingWindow(queryObj, callback) {
  chrome.devtools.inspectedWindow.eval(
    queryObj,
    function (result, isException) {
      if (!isException) {
        // console.log("RESULT:", result);
        callback(result);
      } else {
        callback(false);
      }
    }
  );
}

export function getTime() {
  var now = new Date();
  var hours = String(now.getHours()).padStart(2, "0");
  var minutes = String(now.getMinutes()).padStart(2, "0");
  var seconds = String(now.getSeconds()).padStart(2, "0");

  return hours + ":" + minutes + ":" + seconds;
}

export function generateExperimentListItem(experiment) {
  return `<li><figure><img src="./assets/abtest.png" width="16" height="16" alt="abtest" /></figure><p>${experiment}</p></li>`;
}
