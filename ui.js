/*
 * Very ugly, made in less than 1hr.
 */

const el_n = document.getElementById('n');
const el_gen = document.getElementById('gen');
const el_best = document.getElementById('best');

const el_gen_gears = document.getElementById('gen_gears');
const el_gen_ratio = document.getElementById('gen_ratio');

const el_best_gen = document.getElementById('best_gen');
const el_best_gears = document.getElementById('best_gears');
const el_best_ratio = document.getElementById('best_ratio');

const el_gears_container = document.getElementById('gears_container');
const el_add_gear = document.getElementById('add_gear');
const el_del_gear = document.getElementById('del_gear');
const el_target_ratio = document.getElementById('target_ratio');
const el_mutation_chance = document.getElementById('mutation_chance');
const el_allow_skips = document.getElementById('allow_skips');
const el_fitness_func = document.getElementById('fitness_func');
const el_reset = document.getElementById('reset');

let min_gear = 1;
let max_gear = 1;

const gears_helper = () => {
  min_gear = Math.min(...gears.flat());
  max_gear = Math.max(...gears.flat());

  el_gears_container.innerHTML = '';
  for (let i = 0; i < gears.length; i++) {
    const el = document.createElement('input');
    el.addEventListener('keyup', () => {
      gears[i] = el.value.split(',').map((x) => {
        const val = parseFloat(x.trim());
        if (isNaN(val) || !isFinite(val) || val === 0.0) return 1.0;
        return val;
      });
    });
    el.value = gears[i].join(', ');
    el_gears_container.appendChild(el);
    el_gears_container.appendChild(document.createElement('br'));
  }
  el_gen.innerHTML = '<div class="gear"></div>'.repeat(gears.length);
};

const ui_init = () => {
  gears_helper();

  el_target_ratio.addEventListener('change', () => {
    globals.target = parseFloat(el_target_ratio.value);
  });
  el_add_gear.addEventListener('click', () => {
    gears.push(n_rands(gears[0]?.length ?? 7));
    gears_helper();
  });
  el_del_gear.addEventListener('click', () => {
    gears.splice(gears.length - 1, 1);
    gears_helper();
  });

  el_mutation_chance.addEventListener('keyup', () => {
    globals.mutation_chance = parseFloat(el_mutation_chance.value);
    if (isNaN(globals.mutation_chance)) globals.mutation_chance = 0.0;
  });
  el_mutation_chance.value = globals.mutation_chance;

  el_allow_skips.addEventListener('change', () => {
    globals.allow_skips = el_allow_skips.checked;
  });

  el_fitness_func.addEventListener('change', () => {
    globals.fitness_func = parseInt(el_fitness_func.value);
  });

  el_reset.addEventListener('click', () => {
    reset = true;
  });
};

const scale_helper = (x) =>
  x === SKIP ? 0 : (0.8 * x) + 0.2;

let n = 1;
const ui_draw_gen = (next_gen) => {
  for (let i = 0; i < next_gen[0].length; i++) {
    el_gen.children[i].style.transform = `scale(${scale_helper((next_gen[0][i] - min_gear) / max_gear)})`;
  }

  el_n.innerText = n++;

  el_gen_gears.innerText = 'Gears: [' + next_gen[0].filter((x) => (x !== -1)).toString() + ']';
  el_gen_ratio.innerText = 'Ratio: ' + ratio(next_gen[0]).toFixed(5);

  /*
  console.log('GENERATION:', n++);
  console.log('Size:', next_gen.length);
  console.log('Best performer:', next_gen[0]);
  console.log('Ratio:', ratio(next_gen[0]));
  console.log('Fitness:', fitness(next_gen[0]));
  console.log();
  */
};

const ui_draw_best = (best, changed) => {
  if (!best) return;

  if (changed) {
    el_best.innerHTML = '<div class="gear"></div>'.repeat(best.length);
    el_best_gen.innerText = 'Generation: ' + n;
  }

  for (let i = 0; i < best.length; i++) {
    el_best.children[i].style.transform = `scale(${scale_helper((best[i] - min_gear) / max_gear)})`;
  }

  el_best_gears.innerText = 'Gears: [' + best.filter((x) => (x !== -1)).toString() + ']';
  el_best_ratio.innerText = 'Ratio: ' + ratio(best).toFixed(5);
    /*
  console.log('Best overall:', best);
  console.log('Ratio:', ratio(best));
  console.log('Fitness:', ratio(best));
  */
};
