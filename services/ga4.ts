export const sendGA4Events = ({
  campaign,
  measurementId,
  apiSecretKey,
  ga4ClientId,
}: {
  campaign: string;
  measurementId?: string;
  apiSecretKey?: string;
  ga4ClientId?: string;
}) => {
  const GA4_CLIENT_ID = ga4ClientId || Math.random().toString(36).substring(7);
  const ANALYTICS_ID = measurementId || "G-7PNZ5E4JDZ";
  const API_SECRET = apiSecretKey  || "RU0cCzDxRbCbpV6xOZ7xQA";

  async function sendGA4Event(name: string, action: string, label: string) {
    return await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${ANALYTICS_ID}&api_secret=${API_SECRET}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: GA4_CLIENT_ID,
          events: [
            {
              name: action,
              params: {
                event_category: name,
                event_label: label,
              },
            },
          ],
        }),
      }
    );
  }

  function pushEvent(action: string, label: string) {
    console.debug("pushEvent", { label, campaign, action });

    sendGA4Event(campaign, action, label)
      .then((data) => {
        console.debug("sendGA4Events", data.status);
      })
      .catch((e) => console.error(e));
  }

  return {
    pushEvent,
    sendItemImpression: (label: string) =>
      pushEvent("item_impression", `impression:${label}`),
    sendItemClick: (label: string) =>
      pushEvent("item_impression", `click:${label}`),
  };
};
