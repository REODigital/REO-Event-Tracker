export function experimentHandler_abtasty(result) {
  let active = [];
  let inactive = [];
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const experiment = result[key];
      if (
        experiment.status === "target_pages_rejected" ||
        experiment.status === "qa_parameters_rejected" ||
        experiment.status === "pending" ||
        experiment.status === "segment_rejected"
      ) {
        var text = "";
        if (experiment.variationName) {
          text = experiment.name + " - " + experiment.variationName;
        } else {
          text = experiment.name;
        }
        inactive.push(text);
      }
      if (experiment.status === "accepted") {
        var text = "";
        if (experiment.variationName) {
          text = experiment.name + " - " + experiment.variationName;
        } else {
          text = experiment.name;
        }
        active.push(text);
      }
    }
  }

  console.log({ active: active, inactive: inactive });

  return {
    active: active,
    inactive: inactive,
  };
}
