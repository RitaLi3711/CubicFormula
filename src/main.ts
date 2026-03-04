const solveButton = document.getElementById(
  "solve-button",
) as HTMLButtonElement;

solveButton.addEventListener("click", () => {
  const aInput = document.getElementById("a-value") as HTMLInputElement;
  const bInput = document.getElementById("b-value") as HTMLInputElement;
  const cInput = document.getElementById("c-value") as HTMLInputElement;
  const dInput = document.getElementById("d-value") as HTMLInputElement;

  const a = parseFloat(aInput.value);
  const b = parseFloat(bInput.value);
  const c = parseFloat(cInput.value);
  const d = parseFloat(dInput.value);

const formatTerm = (value: number, variable: string) => {
  if (value === 0) return "";
  if (value === 1) return ` + ${variable}`;
  if (value === -1) return ` - ${variable}`;
  return value > 0
    ? ` + ${value}${variable}`
    : ` - ${Math.abs(value)}${variable}`;
};

let equation = `${a}x³`;
equation += formatTerm(b, "x²");
equation += formatTerm(c, "x");
equation += formatTerm(d, "");
equation += " = 0";

const equationEl = document.getElementById(
  "equation-text"
) as HTMLElement;

equationEl.textContent = equation.replace("+ -", "- ");

  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const translation = -b / (3 * a);
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

  const trigMethod = (p: number, q: number) => {
    const k = 2 * Math.sqrt(-p / 3);
    const theta = Math.acos(-q / (2 * Math.sqrt(-Math.pow(p / 3, 3)))) / 3;

    return [
      k * Math.cos(theta) + translation,
      k * Math.cos(theta + (2 * Math.PI) / 3) + translation,
      k * Math.cos(theta + (4 * Math.PI) / 3) + translation,
    ];
  };

  const cardanoMethod = (p: number, q: number) => {
    const u = Math.cbrt(
      -q / 2 + Math.sqrt(Math.pow(q / 2, 2) + Math.pow(p / 3, 3)),
    );
    const v = Math.cbrt(
      -q / 2 - Math.sqrt(Math.pow(q / 2, 2) + Math.pow(p / 3, 3)),
    );

    return u + v + translation;
  };

  const getRoots = () => {
    if (discriminant < 0) {
      return trigMethod(p, q);
    } else if (discriminant > 0) {
      const realRoot = cardanoMethod(p, q);
      return [realRoot, "complex", "complex"];
    } else {
      if (p === 0 && q === 0) {
        const realRoot = cardanoMethod(p, q);
        return [realRoot, realRoot, realRoot];
      } else {
        const r1 = Math.cbrt(q / 2);
        const r2 = -2 * r1;

        const doubleRoot = r1 + translation;
        const singleRoot = r2 + translation;

        return [doubleRoot, doubleRoot, singleRoot];
      }
    }
  };

const roots = getRoots();

const pEl = document.getElementById("p-value")!;
const qEl = document.getElementById("q-value")!;
const discEl = document.getElementById("disc-value")!;

pEl.textContent = p.toFixed(4);
qEl.textContent = q.toFixed(4);
discEl.textContent = discriminant.toFixed(4);

const root1El = document.getElementById("root1-value") as HTMLElement;
const root2El = document.getElementById("root2-value") as HTMLElement;
const root3El = document.getElementById("root3-value") as HTMLElement;

const formatRoot = (r: number | string) => {
  if (typeof r === "number") {
    return `${r.toFixed(4)}    0`;
  } else {
    return `complex    0`;
  }
};

root1El.textContent = formatRoot(roots[0]);
root2El.textContent = formatRoot(roots[1]);
root3El.textContent = formatRoot(roots[2]);

});
