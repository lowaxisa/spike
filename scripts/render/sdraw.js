import {draw_page} from "./draw_page.js"; 
import {draw_form} from "./draw_form.js";

function c_sdraw() {}

c_sdraw.prototype.page = draw_page;
c_sdraw.prototype.form = draw_form;

export let sdraw = new c_sdraw();
