function generateVariationName(experimentName, variationName) {
  var text = "";
  if (variationName) {
    text = experimentName + " - " + variationName;
  } else {
    text = experimentName;
  }
  return text;
}

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
        inactive.push(
          generateVariationName(experiment.name, experiment.variationName)
        );
      }
      if (experiment.status === "accepted") {
        active.push(
          generateVariationName(experiment.name, experiment.variationName)
        );
      }
    }
  }

  return {
    active: active,
    inactive: inactive,
  };
}

export function experimentHandler_optimizely(result) {
  let active = [];
  let inactive = [];
  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const experiment = result[key];
      if (experiment.isActive == false) {
        inactive.push(
          generateVariationName(
            experiment.experimentName,
            experiment.variation?.name
          )
        );
      }
      if (experiment.isActive == true) {
        active.push(
          generateVariationName(
            experiment.experimentName,
            experiment.variation?.name
          )
        );
      }
    }
  }
  return {
    active: active,
    inactive: inactive,
  };
}

export function experimentHandler_vwo(result) {
  const parsedResult = JSON.parse(result);
  let active = [];
  let inactive = [];
  for (const key in parsedResult) {
    if (parsedResult.hasOwnProperty(key)) {
      const experiment = parsedResult[key];
      if (experiment.combination_chosen) {
        var comb_chosen = experiment.combination_chosen;
        active.push(
          generateVariationName(experiment.name, experiment.comb_n[comb_chosen])
        );
      } else {
        inactive.push(generateVariationName(experiment.name, null));
      }
    }
  }
  return {
    active: active,
    inactive: inactive,
  };
}

export function experimentHandler_adobetarget_v2(result) {
  const activities = result?.offers?.map(
    (item) =>
      `${item.responseTokens["activity.name"]} - ${item.responseTokens["experience.name"]}`
  );
  const uniqueActivities = new Set();
  activities.forEach((activity) => {
    uniqueActivities.add(activity);
  });

  return {
    active: [...uniqueActivities],
    inactive: [],
  };
}

export function experimentHandler_adobetarget_v1(result) {
  const activities = result?.execute?.pageLoad?.options?.map(
    (item) =>
      `${item.responseTokens["activity.name"]} - ${item.responseTokens["experience.name"]}`
  );
  const uniqueActivities = new Set();
  activities.forEach((activity) => {
    uniqueActivities.add(activity);
  });

  return {
    active: [...uniqueActivities],
    inactive: [],
  };
}

export function experimentHandler_dynamicyield(result) {
  let active = [];
  let inactive = [];

  result.forEach(function (experiment) {
    active.push(
      generateVariationName(
        experiment.objectName,
        experiment.variations[0] || experiment.conditionName
      )
    );
  });

  return {
    active: active,
    inactive: inactive,
  };
}
