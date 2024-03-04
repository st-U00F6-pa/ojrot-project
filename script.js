let allow_soft_sign_checkbox = document.getElementById('allow-soft-sign');
let allow_affricate_conversion_checkbox = document.getElementById('allow-affricate-conversion');
let allow_smart_capitalization_checkbox = document.getElementById('allow-smart-capitalization');

let cyrillic_preview_checkbox = document.getElementById("cyrillic-live-preview");
let latin_preview_checkbox = document.getElementById("latin-live-preview");

let cyrillic_translate_button = document.getElementById('translate-cyrillic');
let latin_translate_button = document.getElementById('translate-latin');

let cyrillic_textarea = document.getElementById("cyrillic-textarea");
let latin_textarea = document.getElementById("latin-textarea");

const disable_sound = true;

cyrillic_preview_checkbox.onchange = (e) => {

	latin_preview_checkbox.checked = false;
	toggle_buttons();
	autoupdate_text();
	click();
}
latin_preview_checkbox.onchange = (e) => {

	cyrillic_preview_checkbox.checked = false;
	toggle_buttons();
	autoupdate_text();
	click();
}
function toggle_buttons() {

	if (cyrillic_preview_checkbox.checked || latin_preview_checkbox.checked) {

		cyrillic_translate_button.disabled = true;
		latin_translate_button.disabled = true;
	} 
	else {
		
		cyrillic_translate_button.disabled = false;
		latin_translate_button.disabled = false;
	}
}
function autoupdate_text() {
	
	if (cyrillic_preview_checkbox.checked) {

		latin_textarea.value = cyrillic_translate(cyrillic_textarea.value);
	}
	if (latin_preview_checkbox.checked) {

		cyrillic_textarea.value = latin_translate(latin_textarea.value);
	}
}
function click() {

	if (disable_sound) return;

	let sound = new Audio('click.wav');
	sound.loop = false;
	sound.play();
}
function ding() {
	
	if (disable_sound) return;

	let sound = new Audio('ding.wav');
	sound.loop = false;
	sound.play();
}

cyrillic_textarea.oninput = (e) => {

	latin_preview_checkbox.checked = false;
	toggle_buttons();
	autoupdate_text();
}
latin_textarea.oninput = (e) => {

	cyrillic_preview_checkbox.checked = false;
	toggle_buttons();
	autoupdate_text();
}

cyrillic_translate_button.onclick = () => {

	let text = cyrillic_textarea.value;

	latin_textarea.value = cyrillic_translate(text);
	ding();
}
latin_translate_button.onclick = () => {

	let text = latin_textarea.value;

	cyrillic_textarea.value = latin_translate(text);
	ding();
}

allow_soft_sign_checkbox.onchange = (e) => {
	
	allow_soft_sign = allow_soft_sign_checkbox.checked;
	autoupdate_text();
	click();
}
allow_affricate_conversion_checkbox.onchange = (e) => {
	
	allow_affricate_conversion = allow_affricate_conversion_checkbox.checked;
	autoupdate_text();
	click();
}
allow_smart_capitalization_checkbox.onchange = (e) => {
	
	allow_smart_capitalization = allow_smart_capitalization_checkbox.checked;
	autoupdate_text();
	click();
}

allow_soft_sign = allow_soft_sign_checkbox.checked;
allow_affricate_conversion = allow_affricate_conversion_checkbox.checked;
allow_smart_capitalization = allow_smart_capitalization_checkbox.checked;

toggle_buttons();