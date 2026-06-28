import {spike} from "./../data.js";

export function draw_page(page = null, mode = "block") {
  let keys = Object.keys(spike);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === page) {
      spike[keys[i]].page.style.display = mode;
    } else {
      spike[keys[i]].page.style.display = "none";
    }
  }
}
