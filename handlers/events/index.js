export function handler_abtasty(payload, updateList) {
  payload.h.forEach(function (item) {
    if (item.t === "PAGEVIEW") {
      var eventType = "Pageview";
      var eventName = decodeURIComponent(payload.dl);
      if (eventType && eventName) {
        updateList(eventType, eventName);
      }
    } else if (item.ec) {
      var eventType = payload.h[0]["ec"];
      var eventName = payload.h[0]["ea"];
      if (eventType && eventName) {
        updateList(eventType, eventName);
      }
    }
  });
}
export function handler_adobeTarget_v1(payload, updateList) {
  payload.notifications.forEach(function (item) {
    if (item.mbox.name) {
      var eventType = "mbox";
      var eventName = item.mbox.name;
      if (eventType && eventName) {
        updateList(eventType, eventName);
      }
    }
  });
}
export function handler_adobeTarget_v2(payload, updateList) {
  payload.forEach(function (item) {
    if (item.name === "mbox") {
      var eventType = "mbox";
      var eventName = item.value;
      if (eventType && eventName) {
        updateList(eventType, eventName);
      }
    }
  });
}
export function handler_optimizely(payload, updateList) {
  function flattenEvents(data) {
    const flattenedEvents = [];
    data.visitors.forEach((visitor) => {
      visitor.snapshots.forEach((snapshot) => {
        snapshot.events.forEach((event) => {
          flattenedEvents.push({
            visitor_id: visitor.visitor_id,
            session_id: visitor.session_id,
            event_id: event.e,
            event_name: event.k,
            timestamp: event.t,
            user_id: event.u,
            event_type: event.y,
            attributes: event.a,
          });
        });
      });
    });
    return flattenedEvents;
  }
  var flattenedEventsArray = flattenEvents(payload);
  // console.log(flattenedEventsArray);
  flattenedEventsArray.forEach(function (item) {
    if (item.event_type && item.event_type === "view_activated") {
      var eventType = "Pageview";
      var eventName = item.event_name;
      if (eventType && eventName) {
        updateList(eventType, eventName);
      }
    }
    if (item.event_type && item.event_type === "other") {
      var eventType = "Action Tracking";
      var eventName = item.event_name;
      if (eventType && eventName) {
        updateList(eventType, eventName);
      }
    }
  });
}
export function handler_vwo(payload, updateList) {
  var eventName = payload.d.event.name;
  var eventType = "Custom event";
  if (eventName.includes("shopify")) {
    eventName = eventName.split("shopify.")[1];
    eventType = "Shopify event";
  }
  if (
    payload.d.event.name === "shopify.pageViewed" ||
    payload.d.event.name === "shopify.productViewed"
  ) {
    eventName += " - " + payload.d.event.props.page.url;
  }
  if (eventType && eventName) {
    updateList(eventType, eventName);
  }
}

export function handler_dynamicyield(payload, updateList) {
  let eventName;
  let eventType = "Custom";

  payload.forEach(function (item) {
    if (item.name === "name") {
      eventName = decodeURIComponent(item.value);
    }
  });
  if (eventName) {
    updateList(eventType, eventName);
  }
}
