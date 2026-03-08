const drawGrid = () => {
  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.strokeStyle = "#cccccc"; //grid lines
  ctx.lineWidth = 0.5;
  for (let x = -15; x <= 15; x++) {
    const canvasX = 300 + x * 20;
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, 400);
  }
  for (let y = -10; y <= 10; y++) {
    const canvasY = 200 - y * 20;
    ctx.moveTo(0, canvasY);
    ctx.lineTo(600, canvasY);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.moveTo(0, 200);
  ctx.lineTo(600, 200);
  ctx.moveTo(300, 0);
  ctx.lineTo(300, 400);
  ctx.stroke();
};

const drawFunction = (
  a: number,
  b: number,
  c: number,
  d: number,
  roots: (number | string)[],
) => {
  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 600, 400);
  drawGrid();

  ctx.beginPath();
  ctx.strokeStyle = "#e6aace";
  ctx.lineWidth = 3;

  let first = true;

  for (let x = -15; x <= 15; x += 0.1) {
    const y = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
    const canvasX = 300 + x * 20;
    const canvasY = 200 - y * 20;

    if (first) {
      ctx.moveTo(canvasX, canvasY);
      first = false;
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();

  roots.forEach((root) => {
    if (typeof root === "number") {
      ctx.beginPath();
      ctx.fillStyle = "red";
      const canvasX = 300 + root * 20;
      const canvasY = 200;
      ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#0d1821";
      ctx.fill();
    }
  });
};

  //clears results box
const clearResults = (
  pEl: HTMLElement,
  qEl: HTMLElement,
  discEl: HTMLElement,
  root1El: HTMLElement,
  root2El: HTMLElement,
  root3El: HTMLElement,
) => {
  pEl.textContent = "";
  qEl.textContent = "";
  discEl.textContent = "";
  root1El.innerHTML = "";
  root2El.innerHTML = "";
  root3El.innerHTML = "";
};

  //gives sign in equation
const formatTerm = (value: number, variable: string) => {
  if (value === 0) {
    return "";
  } else if (value > 0) {
    return ` + ${value}${variable}`;
  } else {
    return ` - ${Math.abs(value)}${variable}`;
  }
};

const trigMethod = (p: number, q: number, translation: number) => {
  const k = 2 * Math.sqrt(-p / 3);
  const theta = Math.acos(-q / (2 * Math.sqrt(-Math.pow(p / 3, 3)))) / 3;

  return [
    k * Math.cos(theta) + translation,
    k * Math.cos(theta + (2 * Math.PI) / 3) + translation,
    k * Math.cos(theta + (4 * Math.PI) / 3) + translation,
  ];
};

const cardanoMethod = (p: number, q: number, translation: number) => {
  const u = Math.cbrt(
    -q / 2 + Math.sqrt(Math.pow(q / 2, 2) + Math.pow(p / 3, 3)),
  );
  const v = Math.cbrt(
    -q / 2 - Math.sqrt(Math.pow(q / 2, 2) + Math.pow(p / 3, 3)),
  );

  return u + v + translation;
};

const getRoots = (
  discriminant: number,
  p: number,
  q: number,
  translation: number,
) => {
  if (discriminant < 0) {
    return trigMethod(p, q, translation);
  } else if (discriminant > 0) {
    const realRoot = cardanoMethod(p, q, translation);
    return [realRoot, "complex", "complex"];
  } else {
    if (p === 0 && q === 0) {
      const realRoot = cardanoMethod(p, q, translation);
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

//determine if root is complex
const formatRoot = (r: number | string) => {
  if (typeof r === "number") {
    return `${r.toFixed(4)} 0`;
  } else {
    return `complex 0`;
  }
};

drawGrid(); //initalize site with empty grid
const solveButton = document.getElementById(
  "solve-button",
) as HTMLButtonElement;

solveButton.addEventListener("click", () => {
  //get values(string) + convert to floats
  const a = parseFloat(
    (document.getElementById("a-value") as HTMLInputElement).value,
  );
  const b = parseFloat(
    (document.getElementById("b-value") as HTMLInputElement).value,
  );
  const c = parseFloat(
    (document.getElementById("c-value") as HTMLInputElement).value,
  );
  const d = parseFloat(
    (document.getElementById("d-value") as HTMLInputElement).value,
  );

  const equationEl = document.getElementById("equation-text") as HTMLElement;
  const pEl = document.getElementById("p-value")!;
  const qEl = document.getElementById("q-value")!;
  const discEl = document.getElementById("disc-value")!;
  const root1El = document.getElementById("root1-value") as HTMLElement;
  const root2El = document.getElementById("root2-value") as HTMLElement;
  const root3El = document.getElementById("root3-value") as HTMLElement;

  //must be cubic feature
  if (a === 0) {
    equationEl.textContent = "give a cubic equation";
    drawGrid(); // Show empty grid
    clearResults(pEl, qEl, discEl, root1El, root2El, root3El);
    return;
  }

  let equation = `${a}x³${formatTerm(b, "x²")}${formatTerm(c, "x")}${formatTerm(d, "")} = 0`;
  equation = equation.replace(/\+ -/g, "- ").replace(/^\s\+\s/, "");
  equationEl.textContent = equation;

  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const translation = -b / (3 * a);
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

  const roots = getRoots(discriminant, p, q, translation);

  pEl.textContent = p.toFixed(4);  //update result box
  qEl.textContent = q.toFixed(4);
  discEl.textContent = discriminant.toFixed(4);
  root1El.innerHTML = formatRoot(roots[0]);
  root2El.innerHTML = formatRoot(roots[1]);
  root3El.innerHTML = formatRoot(roots[2]);

  drawFunction(a, b, c, d, roots);
});