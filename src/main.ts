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
  console.log("p =", p);
  console.log("q =", q);
  console.log("discriminant =", discriminant);
  console.log("Roots =", roots);
});