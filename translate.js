let allow_soft_sign = false;
let allow_double_vowel_iotation = false;
let allow_affricate_conversion = false;
let allow_smart_capitalization = false;

const latin_characters = [
	'a', 'o', 'e', 'u', 'ө', 'y', 'i', 'ь',
	'b', 'v', 'g', 'd', 'ç', 'ƶ', 'z',
	'j', 'k', 'l', 'm', 'n', 'p', 'r',
	's', 't', 'f', 'x', 'c', 'ş', 'ꞑ'
]
const latin_vowels = latin_characters.slice(0, 8);
const latin_iotatable = latin_characters.slice(0, 4); 

const cyrillic_characters = [
	'ё', 'ю', 'е', 'я', 'а', 'у', 'ӱ', 'о', 'ӧ', 'э', 'и', 'ы',
	'б', 'в', 'г', 'д', 'ј', 'ж', 'з',
	'й', 'к', 'л', 'м', 'н', 'п', 'р',
	'с', 'т', 'ф', 'х', 'ч', 'ш',
	'щ', 'ь', 'ъ', 'ц', 'ҥ'
]
const cyrillic_vowels = cyrillic_characters.slice(0, 12);
const cyrillic_iotatable = cyrillic_characters.slice(0, 4); 

const latin_to_cyrillic_lookup = {
	'a' : 'а',
	'b' : 'б',
	'v' : 'в',
	'g' : 'г',
	'd' : 'д',
	'ç' : 'ј',
	'z' : 'з',
	'ƶ' : 'ж',
	'i' : 'и',
	'j' : 'й',
	'k' : 'к',
	'l' : 'л',
	'm' : 'м',
	'n' : 'н',
	'o' : 'о',
	'ө' : 'ӧ',
	'p' : 'п',
	'r' : 'р',
	's' : 'с',
	't' : 'т',
	'u' : 'у',
	'y' : 'ӱ',
	'f' : 'ф',
	'x' : 'х',
	'c' : 'ч',
	'ş' : 'ш',
	'ь' : 'ы',
	'e' : 'е',
	'ꞑ' : 'ҥ',
	"иа" : "ia"
};

const cyrillic_to_latin_lookup = {
	'а' : 'a',
	'б' : 'b',
	'в' : 'v',
	'г' : 'g',
	'д' : 'd',
	'ј' : 'ç',
	'з' : 'z',
	'ж' : 'ƶ',
	'и' : 'i',
	'й' : 'j',
	'к' : 'k',
	'л' : 'l',
	'м' : 'm',
	'н' : 'n',
	'о' : 'o',
	'ӧ' : 'ө',
	'п' : 'p',
	'р' : 'r',
	'с' : 's',
	'т' : 't',
	'у' : 'u',
	'ӱ' : 'y',
	'ф' : 'f',
	'х' : 'x',
	'ч' : 'c',
	'ш' : 'ş',
	'ы' : 'ь',
	'э' : 'e',
	'ё' : 'ө',
	'ю' : 'y',
	'е' : 'e',
	'я' : 'ia',
	'щ' : 'şc',
	'ь' : '',
	'ъ' : '',
	'ц' : 'ts',
	'ҥ' : 'ꞑ'
};

function latin_to_cyrillic_word(word, do_capitalization = false) {

	let characters = word.split('');

	let output = "";

	let index = 0;
	let word_length = word.length;

	function is_vowel(character) {

		if (character === undefined) return false;
		return (latin_vowels.includes(character.toLowerCase()));
	}
	function can_be_iotated(vowel) {
		
		return (latin_iotatable.includes(vowel))
	}
	function iotate(vowel) {

		if (vowel == "a") {
			return 'я';
		}
		if (vowel == "o") {
			return 'ё';
		}
		if (vowel == "u") {
			return 'ю';
		}
		if (vowel == "e") {
			return 'е';
		}
	}
	function is_uppercase(character) {
		
		return character.toUpperCase() == character;
	}
	function matches(shift, character) {

		if (characters[index + shift] === undefined) return false;

		return characters[index + shift].toLowerCase() == character;
	}

	for (index = 0; index < word_length; index++) {

		let character = characters[index].toLowerCase();
		let uppercase = do_capitalization ? is_uppercase(characters[index]) : false;

		if (character == "e" && index == 0) {

			output += uppercase ? "Э" : "э";
		}
		else if (can_be_iotated(character)) {
			
			if (index == 1 && matches(-1, "j")) {
				
				output = output.slice(0, -1);
				output += uppercase ? iotate(character).toUpperCase() : iotate(character);
			}
			else if (allow_double_vowel_iotation && is_vowel(characters[index - 2]) && matches(-1, "j")) {

				output = output.slice(0, -1);
				output += uppercase ? iotate(character).toUpperCase() : iotate(character);
			}
			else if (allow_soft_sign && !is_vowel(characters[index - 2]) && matches(-1, "j")) {

				output = output.slice(0, -1);
				output += uppercase ? "Ь" : "ь";
				output += uppercase ? iotate(character).toUpperCase() : iotate(character);
			}
			else {
				
				output += uppercase ? latin_to_cyrillic_lookup[character].toUpperCase() : latin_to_cyrillic_lookup[character];
			}
		}
		else if (allow_affricate_conversion && character == 'c' && matches(-1, 'ş')) {

			output = output.slice(0, -1);
			output += uppercase ? 'Щ' : 'щ';
		}
		else if (allow_affricate_conversion && character == 's' && matches(-1, 't')) {

			output = output.slice(0, -1);
			output += uppercase ? 'Ц' : 'ц';
		}
		else {

			output += uppercase ? latin_to_cyrillic_lookup[character].toUpperCase() : latin_to_cyrillic_lookup[character];
		}
	}

	return output;
}
function cyrillic_to_latin_word(word, do_capitalization = false) {

	let characters = word.split('');

	let output = "";

	let index = 0;
	let word_length = word.length;

	function is_vowel(character) {

		if (character === undefined) return false;
		return (cyrillic_vowels.includes(character.toLowerCase()));
	}
	function is_iotated(vowel) {
		
		return (cyrillic_iotatable.includes(vowel.toLowerCase()))
	}
	function de_iotate(vowel) {

		if (vowel.toLowerCase() == "я") {
			return 'а';
		}
		if (vowel.toLowerCase() == "ё") {
			return 'о';
		}
		if (vowel.toLowerCase() == "ю") {
			return 'у';
		}
		if (vowel.toLowerCase() == "е") {
			return 'е';
		}
	}
	function is_uppercase(character) {
		
		return character.toUpperCase() == character;
	}
	function matches(shift, character) {

		if (characters[index + shift] === undefined) return false;

		return characters[index + shift].toLowerCase() == character;
	}

	for (index = 0; index < word_length; index++) {

		let character = characters[index].toLowerCase();
		let uppercase = do_capitalization ? is_uppercase(characters[index]) : false;

		if (is_iotated(character)) {
			
			if (index == 0) {
				
				output += uppercase ? "J" : "j";
				output += uppercase ? (cyrillic_to_latin_lookup[de_iotate(character)]).toUpperCase() : cyrillic_to_latin_lookup[de_iotate(character)];
			}
			else if (is_vowel(characters[index - 1])) {

				output += uppercase ? "J" : "j";
				output += uppercase ? (cyrillic_to_latin_lookup[de_iotate(character)]).toUpperCase() : cyrillic_to_latin_lookup[de_iotate(character)];
			}
			else if (matches(-1, "й")) {
				
				output += uppercase ? (cyrillic_to_latin_lookup[de_iotate(character)]).toUpperCase() : cyrillic_to_latin_lookup[de_iotate(character)];
			} 
			else {
				
				output += uppercase ? (cyrillic_to_latin_lookup[character]).toUpperCase() : cyrillic_to_latin_lookup[character];
			}
		}
		else if (character == 'ь' && !is_vowel(characters[index - 1]) && is_vowel(characters[index + 1])) {

			output += uppercase ? "J" : "j";
		}
		else if (character == 'ъ') {

			output += uppercase ? "J" : "j";
		}
		else {
			
			output += uppercase ? (cyrillic_to_latin_lookup[character]).toUpperCase() : cyrillic_to_latin_lookup[character];
		}
	}

	return output;
}

function cyrillic_translate(input) {

	let output = "";

	let word = "";

	let word_is_capitalized = false;
	let word_has_capitals = false;

	let index = 0;
	let input_length = input.length;

	for (index = 0; index < input_length; index++) {
		
		let character = input[index];
		let character_lowercase = character.toLowerCase();
		
		if (cyrillic_characters.includes(character_lowercase)) {

			if (character_lowercase != character && (word != "" || word_is_capitalized)) {
				
				word_is_capitalized = false;
				word_has_capitals = true;
			}
			else if (character_lowercase != character && word == "") {
				
				word_is_capitalized = true;
			}

			word += character;
		}
		else {

			let translated_word = cyrillic_to_latin_word(word, word_has_capitals && allow_smart_capitalization);

			if (word != '' && word_is_capitalized && allow_smart_capitalization) {
				
				output += translated_word[0].toUpperCase() + translated_word.slice(1);
			}
			else output += translated_word;
			
			
			word = "";
			word_is_capitalized = false;
			word_has_capitals = false;

			output += character;
		}
	}
	let translated_word = cyrillic_to_latin_word(word, word_has_capitals && allow_smart_capitalization);

	if (word != '' && word_is_capitalized && allow_smart_capitalization) {
		
		output += translated_word[0].toUpperCase() + translated_word.slice(1);
	}
	else output += translated_word;

	return output.replace('b', 'ʙ');
}
function latin_translate(input) {

	input = input.replace('ʙ', 'b');

	let output = "";

	let word = "";

	let word_is_capitalized = false;
	let word_has_capitals = false;
	
	let index = 0;
	let input_length = input.length;

	for (index = 0; index < input_length; index++) {
		
		let character = input[index];
		let character_lowercase = character.toLowerCase();
		
		if (latin_characters.includes(character.toLowerCase())) {

			if (character_lowercase != character && (word != "" || word_is_capitalized)) {
				
				word_is_capitalized = false;
				word_has_capitals = true;
			}
			else if (character_lowercase != character && word == "") {
				
				word_is_capitalized = true;
			}

			word += character;
		}
		else {

			let translated_word = latin_to_cyrillic_word(word, word_has_capitals && allow_smart_capitalization);
			
			if (word != '' && word_is_capitalized && allow_smart_capitalization) {
				
				output += translated_word[0].toUpperCase() + translated_word.slice(1);
			}
			else output += translated_word;

			word = "";
			word_is_capitalized = false;
			word_has_capitals = false;
			output += character;
		}
	}
	let translated_word = latin_to_cyrillic_word(word, word_has_capitals && allow_smart_capitalization);
	
	if (word != '' && word_is_capitalized && allow_smart_capitalization) {
		
		output += translated_word[0].toUpperCase() + translated_word.slice(1);
	}
	else output += translated_word;

	return output;
}