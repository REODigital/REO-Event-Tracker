import { generateExperimentListItem } from "../../utils/index.js";

export function experimentHandler_abtasty(
  result,
  activeExperimentsCount,
  inactiveExperimentsCount,
  activeExperiments,
  inactiveExperiments
) {
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const experiment = result[key];
      if (experiment.status === "target_pages_rejected") {
        inactiveExperiments.innerHTML += generateExperimentListItem(
          experiment.name,
          experiment.variationName
        );
        inactiveExperimentsCount.textContent =
          parseInt(inactiveExperimentsCount.textContent) + 1;
      }
      if (experiment.status === "accepted") {
        activeExperiments.innerHTML += generateExperimentListItem(
          experiment.name,
          experiment.variationName
        );
        activeExperimentsCount.textContent =
          parseInt(activeExperimentsCount.textContent) + 1;
      }
    }
  }
}
