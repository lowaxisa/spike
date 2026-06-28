console.log("iniciando...");

// --- error debug
window.onerror = (msg, url, line) => {
	alert(`O erro "${msg}" ocorreu na linha ${line}`);
};

// --- imports
import {spike} from "./data.js";
import {send, recive} from "./tools/api.js";
import {show_task} from "./tools/render.js";
import {boot} from "./boot.js";
import {sdraw} from "./render/sdraw.js";

boot();
sdraw.page("load");

// --- global var
const api = "https://script.google.com/macros/s/AKfycbw3VN2sSD4feBDMXuIDDkVvNb6Z42WmEq5pB3gW3U95AQQ8Yc9iw3LkT4q3S7MkcLd-Yg/exec";

// --- state var
let loadf_initiated = false;

// --- logic
async function loadf() {
	loadf_initiated = true;
	spike.home.list.innerHTML = "";
	spike.home.load.style.display = "block";
  spike.home.load.innerText = "Carregando as tarefas... (isso pode demorar um pouco)";
  try {
    let response = await fetch(api + "?route=comp_form");

    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }

    let data = await response.json();

    for (let i = data.length - 1; i >= 1; i--) {
      let row = data[i];
      let date = new Date(row[2]);
      date = (date.getDate() + 1) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

      show_task(spike.home.list, row[0], row[1], date);
    }
  } catch(err) {
    spike.home.load.innerText = `O banco de dados parece estar fora de ar, tente novamente mais tarde. Erro: ${err}`;
    loadf_initiated = false;
    return;
  }

	spike.home.load.style.display = "none";
	loadf_initiated = false;
}

async function sendf(task_title, task_desc, task_date) {
	let src =  JSON.stringify({
		title: task_title,
		desc: task_desc,
		date: task_date,
	});
	let response = await send(api, "?route=comp_send", src);
}

// --- event listener
spike.home.new.addEventListener("click", () => {
	sdraw.page("form", "flex");
});

spike.form.cancel.addEventListener("click", () => {
	sdraw.page("home");
});

spike.form.send.addEventListener("click", async () => {
	let ftitle = spike.form.name.value;
	let fdesc = spike.form.desc.value;
	let fdate = spike.form.date.value;

	spike.form.name.value = "";
	spike.form.desc.value = "";
	spike.form.date.value = "";

	alert("enviando isso pode demorar um pouco");
	try {
		await sendf(ftitle, fdesc, fdate);
		sdraw.page("home");
		await loadf();
	}
	catch (err) {
		alert("erro ao enviar :(");
		alert(err);
	}
});

spike.home.reload.addEventListener("click", async () => {
	if (loadf_initiated) {
		return;
	}
	spike.home.reload.disabled = true;
	spike.home.reload.style.opacity = "0.5";
	await loadf();
	spike.home.reload.disabled = false;
	spike.home.reload.style.opacity = "1.0";
});

window.addEventListener("DOMContentLoaded", async () => {
	spike.home.reload.style.opacity = "0.5";
	await loadf();
	spike.home.reload.style.opacity = "1.0";
});

sdraw.page("home");
