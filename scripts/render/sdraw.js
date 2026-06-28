import {draw_page} from "./draw_page.js"; 

function c_sdraw() {}

c_sdraw.prototype.page = draw_page;

export let sdraw = new c_sdraw();
