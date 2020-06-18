loadData = (callback) => {
  const xml = new XMLHttpRequest('application/json');
  xml.open('GET', 'cars.json', true);
  xml.onreadystatechange = () => {
    if (xml.readyState == 4 && xml.status == '200') {
      callback(xml.responseText);
    }
  };
  xml.send(null);
};

getCommonMakes = (cars) => {
  const makes = cars.filter((car) => car.make_is_common === '1');
  console.log('Number of common cars: ' + makes.length);
  console.log(`----------------------`);
};

getMakesPerCountry = (cars) => {
  const makes = cars.reduce((acc, car) => {
    acc[car.make_country] = !acc[car.make_country]
      ? 1
      : acc[car.make_country] + 1;
    return acc;
  }, {});

  console.log(`Car Makes per country:`);
  Object.keys(makes).forEach((ele) => console.log(`${ele}: ${makes[ele]}`));
  console.log(`----------------------`);
};

getMakesByCountryCommon = (cars) => {
  const makes = cars.reduce((acc, car) => {
    const type = car.make_is_common === '1' ? 'common' : 'uncommon';
    if (!acc[car.make_country]) {
      acc[car.make_country] = { common: 0, uncommon: 0 };
    }
    acc[car.make_country][type] += 1;
    return acc;
  }, {});

  console.log(`Car Makes per country:`);
  Object.keys(makes).forEach((ele) =>
    console.log(
      `${ele}: ${makes[ele].common} common, ${makes[ele].uncommon} uncommon`
    )
  );
  console.log(`----------------------`);
};

let cars;
loadData(function (response) {
  cars = JSON.parse(response);
  main();
});

main = () => {
  getCommonMakes(cars);
  getMakesPerCountry(cars);
  getMakesByCountryCommon(cars);
};
