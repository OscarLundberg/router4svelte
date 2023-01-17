import { get } from "svelte/store";
import { isset } from "./helpers";
import { routerState } from "./router";

type HistoryMode = "ADD" | "REPLACE" | "IGNORE";
function updateHistory(path: string, mode: HistoryMode) {
  console.log("Updating history", path, mode)
  if (mode == "IGNORE") {
    console.log("IGNORING")
    return;
  }
  if (mode == "ADD") { history.pushState({ path }, path); }
  if (mode == "REPLACE") { history.replaceState({ path }, path); }
}

// * @description The pathing mode is determined by the first character of the string. 
// * @tutorial
// * |Starting Path|Function call|Resulting path|Mode|
// * |:--|:--|:--|:--|
// * |"/#/home"|routeTo("/about")|"/#/about"|Leading `/` - Absolute|
// * |"/#/search"|routeTo("?q=cat")|"/#/search?q=cat"|Leading `?` - Query|
// * |"/#/about"|routeTo("#h1")|"/#/about/contact#h1"|Leading `#` - Hash|
// * |"/#/about/team"|routeTo("contact")|"/#/about/contact"|None of the above - Relative|
// * @param mode How the history should be changed 
// function resolvePath(path: string) {
//   const [leading, ...rest] = path;
//   if (!isset(leading)) { return ["", false]; }
//   if (leading === "/") { return [path, true] };
//   if (leading === "?" || leading === "#") { return [routerState + path, true] };
//   let prev = get(routerState).split("/");
//   return [prev.slice(0, -1)]
// }

export const RouterApi = {
  /**
   * @summary Navigates to the specified path
   * @param path The absolute path to navigate to with leading `/` 
   * @description ```
   * "ADD"      // Adds a new entry in the history (default)
   * "REPLACE"  // Replaces the current history entry with the new value
   * "IGNORE"   // Ignore completely - no change to the history
   * ```
   * @example
   * ```js
   * routeTo("/about");
   * routeTo("/callback/xyz", "IGNORE");
   * ```
   */
  routeTo(path: string, mode: HistoryMode = "ADD") {
    // let [path, success] = resolvePath(path);
    // if (!success) {
    // console.warn("[router4svelte] received empty path");
    // return;
    // }
    let newRoute = `#${path}`;
    if (get(routerState) === newRoute) { return; }
    history.pushState({ path }, path, newRoute);
    routerState.set(newRoute);
  },
  /**
   * @summary Manually update the history.
   * @param path The path to set
   * @param mode How the history should be changed
   * @description ```
   * "ADD"      // Adds a new entry in the history (default)
   * "REPLACE"  // Replaces the current history entry with the new value
   * ```
   */
  updateHistory(path: string, mode: HistoryMode) {
    console.log("Updating history", path, mode)
    if (mode == "IGNORE") {
      console.log("IGNORING")
      return;
    }
    if (mode == "ADD") { history.pushState({ path }, path); }
    if (mode == "REPLACE") { history.replaceState({ path }, path); }
  },

  /**
   * @summary Go back in the history –
   * same behaviour as pressing the forward button in the browser
   */
  back() {
    window.history.back();
  },
  /**
   * @summary Go forward in the history – 
   * same behaviour as pressing the forward button in the browser
   */
  forward() {
    window.history.forward();
  },
  /** Get the query as an object */
  get query() {
    return {}
  },
  get queryString() {
    return ""
  },
  get hash() {
    return "";
  }
}