loadData = (callback) => {
  const xml = new XMLHttpRequest('application/json');
  xml.open('GET', 'pokemon.json', true);
  xml.onreadystatechange = () => {
    if (xml.readyState == 4 && xml.status == '200') {
      callback(xml.responseText);
    }
  };
  xml.send(null);
};

getAvgWeightAndHeight = (pokemon) => {
  let totals = { weight: 0, height: 0 };
  totals = pokemon.reduce((tot, p) => {
    tot.weight += kgToLbs(p.weight);
    tot.height += mToIn(p.height);
    return tot;
  }, totals);

  console.log(`Average weight: ${(totals.weight / pokemon.length).toFixed(2)}`);
  console.log(`Average weight: ${(totals.height / pokemon.length).toFixed(2)}`);
  console.log(`----------------------`);
};

getTotalEggDistance = (pokemon, weakness) => {
  const distance = pokemon.reduce((acc, p) => {
    if (p.egg !== 'Not in Eggs' && p.weaknesses.includes(weakness)) {
      acc += Number.parseFloat(p.egg);
    }
    return acc;
  }, 0);

  console.log(`Total egg distance: ${distance} km`);
  console.log(`----------------------`);
};

getWeaknessAverages = (pokemon) => {
  const totals = getWeaknessTotals(pokemon);
  let averages = Object.keys(totals).map((type) => {
    return {
      type: type,
      avgWeaknesses: (totals[type].weaknessCount / totals[type].count).toFixed(
        2
      ),
    };
  });

  averages = averages.sort((a, b) => b.avgWeaknesses - a.avgWeaknesses);
  console.log('Pokemon Types with average weaknesses:');
  averages.forEach((ele) => console.log(`${ele.type}: ${ele.avgWeaknesses}`));
  console.log('----------------------');
};

getWeaknessTotals = (pokemon) => {
  return pokemon.reduce((tot, p) => {
    p.type.forEach((type) => {
      if (!tot[type]) {
        tot[type] = {
          count: 0,
          weaknessCount: 0,
        };
      }
      tot[type].count += 1;
      tot[type].weaknessCount += p.weaknesses.length;
    });
    return tot;
  }, {});
};

kgToLbs = (weightStr) => {
  const kg = Number.parseFloat(weightStr.substring(0, weightStr.length - 3));
  return kg * 2.21;
};

mToIn = (heightStr) => {
  const meters = Number.parseFloat(
    heightStr.substring(0, heightStr.length - 2)
  );
  return meters * 39.37;
};

averageSpawnTime = (pokemon) => {
  const totalSeconds = pokemon.reduce((tot, p) => {
    if (p.spawn_time != 'N/A') {
      const [min, sec] = [...p.spawn_time.split(':')].map((t) =>
        Number.parseInt(t)
      );
      tot += min * 60 + sec;
    }
    return tot;
  }, 0);

  const avgSec = Math.round(totalSeconds / pokemon.length);
  const finalMin = Math.trunc(avgSec / 60);
  const finalSec = avgSec % 60;
  return `${finalMin}:${finalSec}`;
};

getWeightClassSpawnTimes = (pokemon, numOfWeightClasses) => {
  const sortedPokemon = pokemon.sort(
    (a, b) => kgToLbs(a.weight) - kgToLbs(b.weight)
  );

  const classSize = Math.floor(pokemon.length / numOfWeightClasses);
  let remaining = pokemon.length % numOfWeightClasses;
  const groupedPokemon = {};
  let startId = 0;
  let endId = 0;
  for (i = 1; i <= numOfWeightClasses; i++) {
    endId = endId + classSize;
    if (remaining != 0) {
      endId += 1;
      remaining -= 1;
    }
    groupedPokemon[i] = sortedPokemon.slice(startId, endId);
    startId = endId;
  }

  console.log('Average spawn time based on weight groupings');
  Object.keys(groupedPokemon).forEach((group) => {
    console.log(
      `The average spawn time for group ${group} is ${averageSpawnTime(
        groupedPokemon[group]
      )}`
    );
  });
  console.log('----------------------');
};

let pokemon;
loadData(function (response) {
  pokemon = JSON.parse(response);
  main();
});

main = () => {
  getAvgWeightAndHeight(pokemon);
  getTotalEggDistance(pokemon, 'Psychic');
  getWeaknessAverages(pokemon);
  getWeightClassSpawnTimes(pokemon, 5);
};
