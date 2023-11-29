import {
  LookerEmbedSDK,
  LookerEmbedDashboard,
  LookerEmbedExplore,
  LookerEmbedLook,
} from "@looker/embed-sdk";
import { StaticThemeObject } from "./StaticThemeObject";

const fetchServerCookie = async () => {
  const response = await fetch("/api/getcookie")
  console.log(response)
  if(response.ok) {
    console.log(response.text())
    const cookie = await response.json()
    return cookie
  } 

  return undefined
}

/**
 *
 * @param {string} type of content to be embedded (will either be dashboard, look or explore)
 * @param {string} id of content to be embedded (will differ depending on the type of content embedded)
 * @param {string} url of embedded content (should include embed domain and any theme customizations)
 * @returns {EmbedBuilder<LookerEmbedDashboard | LookerEmbedExplore | LookerEmbedLook>}
 */

export const EmbedCheckAuth = async (type, id, url, active, dark) => {
  const cookie = await fetchServerCookie()
  console.log("Cookie: ", cookie)
  let embed;
  // add switch statement checking if dashboard, explore, or look
  // then apply the same if else below, expect repeated for each
  switch (type) {
    case "dashboard":
    //   if (
    //     'embedSession' in cookie &&
    //     cookie.embedSession.setTime + cookie.embedSession.validFor > Date.now()
    //   ) {
        // embed = LookerEmbedSDK.createDashboardWithUrl(
    //       url +
    //         id +
    //         `?sdk=2&embed_domain=${import.meta.env.VITE_EMBED_HOST}&theme=${
    //           dark
    //             ? import.meta.env.VITE_EMBED_THEME_DARK
    //             : import.meta.env.VITE_EMBED_THEME
    //         }`,
    //     );
    //     break;
    //   } else {
        // console.log("No embed session detected. Authenticating...");
      embed = LookerEmbedSDK.createDashboardWithId(id);
      break;
      // }
    case "look":
      if (
        'embedSession' in cookie &&
        cookie.embedSession.setTime + cookie.embedSession.validFor > Date.now()
      ) {
        embed = LookerEmbedSDK.createLookWithUrl(
          url +
            `?sdk=2&embed_domain=${
              import.meta.env.VITE_EMBED_HOST
            }&_theme=${StaticThemeObject(type)}`,
        );
        break;
      } else {
        // LookerEmbedSDK.init(, '/auth')
        embed = LookerEmbedSDK.createLookWithId(id);
        break;
      }
    case "explore":
      if (
        'embedSession' in cookie &&
        cookie.embedSession.setTime + cookie.embedSession.validFor > Date.now()
      ) {
        embed = LookerEmbedSDK.createExploreWithUrl(
          url +
            `?sdk=2&embed_domain=${import.meta.env.VITE_EMBED_HOST}&theme=${
              import.meta.env.VITE_EMBED_THEME
            }`,
        );
        break;
      } else {
        // LookerEmbedSDK.init(, '/auth')
        embed = LookerEmbedSDK.createExploreWithId(id);
        break;
      }
  }

  return embed;
};
