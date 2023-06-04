/*
 * Very ugly, made in less than 1hr.
 */

const globals = {
  gear_start: 1,
  gear_end: 1,
  mutation_chance: 0.3,
  min_survival: 200,
  percent_survival: 0.20,
  initial_size: 10000,
  min_children: 2,
  max_children: 4,
  target: Math.PI,
};

const gears = [
  [3,  5,  7,  11, 41, 43],
  [29, 31, 37, 13, 17, 23],
  [51, 5, 7,  89, 41, 11],
  [17, 19, 23, 57, 37, 3],
  [29, 31, 37, 13, 17, 23],
  [51, 5, 7,  89, 41, 11],
];

const flip_coin = (chance = 0.5) =>
  (Math.random() < chance);

const choose_index = (arr) =>
  Math.floor(Math.random() * arr.length);

const choose = (arr) =>
  arr[choose_index(arr)];

const ratio = (org) => {
  let out = globals.gear_start;
  for (let i = 0; i < org.length - 1; i++) {
    out *= org[i] / org[i+1];
  }
  out *= globals.gear_end;
  if (isNaN(out) || !isFinite(out)) return globals.target;
  return out;
};

const fitness = (org) => {
  const out = 1.0 / (Math.abs(ratio(org) - globals.target));
  if (isNaN(out) || !isFinite(out)) return 9999;
  return out;
};

const crossover = (a, b) => {
  const out = [];
  for (let i = 0; i < gears.length; i++) {
    if (flip_coin(globals.mutation_chance)) {
      out.push(choose(gears[i]));
    } else {
      out.push(choose([a[i], b[i]]));
    }
  }
  return out;
};

const organism = () => {
  const out = [];
  for (let i = 0; i < gears.length; i++) {
    out.push(choose(gears[i]));
  }
  return out;
};

const breed = (gen) => {
  if (gen.length * globals.percent_survival < globals.min_survival) {
    gen = gen.slice(0, globals.min_survival);
  } else {
    gen.splice(Math.floor(gen.length * globals.percent_survival));
  }

  let next_gen = [];
  while (gen.length > 1) {
    const a = choose_index(gen);
    const b = choose_index(gen);

    const n_children = choose([...Array(globals.max_children - globals.min_children).keys()]) + globals.min_children + 1;
    for (let i = 0; i < n_children; i++) {
      next_gen.push(crossover(gen[a], gen[b]));
    }

    gen.splice(a, 1);
    gen.splice(b, 1);
  }

  return next_gen.sort((a, b) => (fitness(b) - fitness(a)));
};

/***/

const main = () => {
  let generation = [];
  for (let i = 0; i < globals.initial_size; i++) {
    generation.push(organism());
  }

  let best = { org: [], fitness: -1 };

  ui_init();

  const upd = () => {
    requestAnimationFrame(upd);

    const next_gen = breed(generation);
    if (next_gen.length === 0) return;

    ui_draw_gen(next_gen);

    let changed = false;
    if (fitness(next_gen[0]) > fitness(best)) {
      best = next_gen[0];
      changed = true;
    }

    ui_draw_best(best, changed);

    generation = next_gen;
  };
  upd();
};

main();
