const drawGrid = () => {
  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 600, 400);

  ctx.beginPath();
  ctx.strokeStyle = "#cccccc";
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

const drawFunction = (a: number, b: number, c: number, d: number, roots: (number | string)[]) => {
  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
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
      const canvasX = 300 + root * 20;
      const canvasY = 200;
      ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#0d1821";
      ctx.fill();
    }
  });
};

const clearResults = (
  pElement: HTMLElement,
  qElement: HTMLElement,
  discElement: HTMLElement,
  root1Element: HTMLElement,
  root2Element: HTMLElement,
  root3Element: HTMLElement
) => {
  pElement.textContent = "";
  qElement.textContent = "";
  discElement.textContent = "";
  root1Element.innerHTML = "";
  root2Element.innerHTML = "";
  root3Element.innerHTML = "";
};

const formatSign = (value: number, variable: string) => {
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
  const theta = Math.acos(-q / (2 * Math.sqrt(Math.pow(-p / 3, 3)))) / 3;

  return [
    k * Math.cos(theta) + translation,
    k * Math.cos(theta + (2 * Math.PI) / 3) + translation,
    k * Math.cos(theta + (4 * Math.PI) / 3) + translation,
  ];
};

const cardanoMethod = (p: number, q: number, translation: number) => {
  const u = Math.cbrt(-q / 2 + Math.sqrt(Math.pow(q / 2, 2) + Math.pow(p / 3, 3)));
  const v = Math.cbrt(-q / 2 - Math.sqrt(Math.pow(q / 2, 2) + Math.pow(p / 3, 3)));

  return u + v + translation;
};

const getRoots = (discriminant: number, p: number, q: number, translation: number) => {
  if (Math.abs(discriminant) < 1e-12) {
    discriminant = 0;
  }
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

const formatRoot = (r: number | string) => {
  if (typeof r === "number") {
    return `${r.toFixed(4)} 0`;
  } else {
    return `complex 0`;
  }
};

drawGrid(); //initalize site with empty grid
const solveButton = document.getElementById("solve-button") as HTMLButtonElement;

solveButton.addEventListener("click", () => {
  const a = parseFloat((document.getElementById("a-value") as HTMLInputElement).value);
  const b = parseFloat((document.getElementById("b-value") as HTMLInputElement).value);
  const c = parseFloat((document.getElementById("c-value") as HTMLInputElement).value);
  const d = parseFloat((document.getElementById("d-value") as HTMLInputElement).value);

  const equationElement = document.getElementById("equation-text") as HTMLElement;
  const pElement = document.getElementById("p-value")!;
  const qElement = document.getElementById("q-value")!;
  const discElement = document.getElementById("disc-value")!;
  const root1Element = document.getElementById("root1-value") as HTMLElement;
  const root2Element = document.getElementById("root2-value") as HTMLElement;
  const root3Element = document.getElementById("root3-value") as HTMLElement;

  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    //must have proper inputs
    equationElement.textContent = "no blanks in input";
    drawGrid();
    clearResults(pElement, qElement, discElement, root1Element, root2Element, root3Element);
    return;
  }
  //must be cubic feature
  if (a === 0) {
    equationElement.textContent = "give a cubic equation";
    drawGrid();
    clearResults(pElement, qElement, discElement, root1Element, root2Element, root3Element);
    return;
  }

  let equation = `${a}x³${formatSign(b, "x²")}${formatSign(c, "x")}${formatSign(d, "")} = 0`;
  equation = equation.replace(/\+ -/g, "- ").replace(/^\s\+\s/, "");
  equationElement.textContent = equation;

  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;
  const translation = -b / (3 * a);

  pElement.textContent = p.toFixed(4);
  qElement.textContent = q.toFixed(4);
  discElement.textContent = discriminant.toFixed(4);

  const roots = getRoots(discriminant, p, q, translation);
  root1Element.innerHTML = formatRoot(roots[0]);
  root2Element.innerHTML = formatRoot(roots[1]);
  root3Element.innerHTML = formatRoot(roots[2]);

  drawFunction(a, b, c, d, roots);
});