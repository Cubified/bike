/*
 * Very ugly, made in less than 1hr.
 */

const globals = {
  gear_start: 1,
  gear_end: 1,
  min_gears: 2,
  mutation_chance: 0.1,
  min_survival: 20,
  percent_survival: 0.50,
  initial_size: 100,
  min_children: 2,
  max_children: 4,
  target: Math.PI,
  allow_skips: true,
  fitness_func: 1,
};

const flip_coin = (chance = 0.5) =>
  (Math.random() < chance);

const choose_index = (arr) =>
  Math.floor(Math.random() * arr.length);

const choose = (arr) =>
  arr[choose_index(arr)];

const n_rands = (n) => {
  let arr = [];
  const start = Math.floor(Math.random() * 30) + 1;
  const step = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < n; i++) {
    arr.push(start + (step * i));
  }
  return arr.sort();
};

const gears = [...new Array(7).keys()].map(() => n_rands(7));
const SKIP = -1;

const ratio = (org) => {
  let out = globals.gear_start;
  for (let i = 0; i < org.length - 1;) {
    let next = i+1;
    while (org[next] === SKIP) next++;
    if (next >= org.length) return Infinity;
    out *= org[i] / org[next];
    i = next;
  }
  out *= globals.gear_end;
  if (isNaN(out)) return Infinity;
  return out;
};

const fitness = (org) => {
  switch (globals.fitness_func) {
    case 0:
      const out = 1.0 / (Math.abs(ratio(org) - globals.target));
      if (isNaN(out) || !isFinite(out)) return 9999;
      return out;
    case 1:
      const pow = -0.4 / Math.abs(ratio(org) - globals.target);
      return 10 - 10 * Math.exp(pow);
    case 2:
      return Math.exp(-Math.pow(Math.abs(ratio(org) - globals.target), 2.0));
  }
};

const crossover = (a, b) => {
  const out = [];
  for (let i = 0; i < gears.length; i++) {
    if (flip_coin(globals.mutation_chance) || (!a[i] && !b[i])) {
      out.push(choose(gears[i]));
    } else if (globals.allow_skips && flip_coin(globals.mutation_chance)) {
      out.push(SKIP);
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

const epoch = () => {
  let generation = [];
  for (let i = 0; i < globals.initial_size; i++) {
    generation.push(organism());
  }
  return generation;
};

const breed = (gen) => {
  if (gen.length * globals.percent_survival < globals.min_survival) {
    gen = gen.slice(0, globals.min_survival);
  } else {
    gen.splice(Math.floor(gen.length * globals.percent_survival));
  }

  let next_gen = [];
  for (let i = 0; i < gen.length; i += 2) {
    const n_children = Math.floor(globals.max_children * (gen.length - i) / gen.length);

    for (let i = 0; i < n_children; i++) {
      next_gen.push(crossover(gen[i], gen[i+1]));
    }
  }

  /*
  let next_gen = [];
  while (gen.length > 1) {
    const a = choose_index(gen);
    const b = choose_index(gen);

    // const n_children = choose([...Array(globals.max_children - globals.min_children).keys()]) + globals.min_children + 1;
    const n_children = 
    for (let i = 0; i < n_children; i++) {
      next_gen.push(crossover(gen[a], gen[b]));
    }

    gen.splice(a, 1);
    gen.splice(b, 1);
  }
  */

  return next_gen.sort((a, b) => (fitness(b) - fitness(a)));
};

/***/

let reset = false;
const main = () => {
  let generation = epoch();
  let best = { org: [], fitness: -1 };

  ui_init();

  let time = 0;
  const upd = () => {
    requestAnimationFrame(upd);

    /*time++;
    if (time < 10) return;
    time = 0;*/

    const next_gen = breed(generation);
    if (next_gen.length === 0) return;

    ui_draw_gen(next_gen);

    let changed = false;
    if (fitness(next_gen[0]) > fitness(best)) {
      best = next_gen[0];
      changed = true;
    }

    ui_draw_best(best, changed);

    if (reset) {
      generation = epoch();
      reset = false;
    } else {
      generation = next_gen;
    }
  };
  upd();
};

main();
