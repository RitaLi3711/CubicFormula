const aInput = document.getElementById("a-value") as HTMLInputElement;
const bInput = document.getElementById("b-value") as HTMLInputElement;
const cInput = document.getElementById("c-value") as HTMLInputElement;
const dInput = document.getElementById("d-value") as HTMLInputElement;

const a = parseFloat(aInput.value);
const b = parseFloat(bInput.value);
const c = parseFloat(cInput.value);
const d = parseFloat(dInput.value);

const p = (3 * a * c - b * b) / (3 * a * a);
const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);