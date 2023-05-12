function f(x) {
  return Math.cbrt(x / ((x - 1) * (x - 1)));
}

function maxArr(arr) {
  let max = arr[0];
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    if (!isNaN(arr[i]) && arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function minArr(arr) {
  let min = arr[0];
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    if (!isNaN(arr[i]) && arr[i] < min) {
      min = arr[i];
    }
  }
  return min;
}

let height = 450,
  width = 450,
  margin = 30;

// создание объекта svg
let svg = d3
  .select(".graphic")
  .append("svg")
  .attr("class", "axis")
  .attr("width", width)
  .attr("height", height);
// длина оси X= ширина контейнера svg - отступ слева и справа
let xAxisLength = width - 2 * margin;
// длина оси Y = высота контейнера svg - отступ сверху и снизу
let yAxisLength = height - 2 * margin;

function drawGraphic(a, b) {
  let data = [];
  if (isNaN(parseFloat(a)) || !isFinite(a)) {
    alert("a должно быть вещественным числом");
    return;
  }
  if (isNaN(parseFloat(b)) || !isFinite(b)) {
    alert("b должно быть вещественным числом");
    return;
  }

  a = Number(a);
  b = Number(b);
  if (a >= b) {
    alert("a должно быть меньше b");
    return;
  }

  d3.select("svg").remove();
  // создание объекта svg
  let svg = d3
    .select(".graphic")
    .append("svg")
    .attr("class", "axis")
    .attr("width", width)
    .attr("height", height);

  let arr_x = [];
  let arr_y = [];
  for (let i = a; b - i > 0.001; i += 0.01) {
    arr_x.push(i);
    let y = f(i);
    arr_y.push(y);
  }

  let max_y = maxArr(arr_y);
  let min_y = minArr(arr_y);
  if (max_y > 50) {
    max_y = 50;
    min_y = -50;
  } else if (min_y < -50) {
    max_y = 50;
    min_y = 50;
  }

  let rawData = [];
  for (let i = 0; i < arr_x.length; i++) {
    if (!isFinite(arr_y[i])) {
      rawData.push({ x: arr_x[i], y: NaN });
    } else {
      rawData.push({ x: arr_x[i], y: arr_y[i] });
      max = arr_y[i];
    }
  }

  // функция интерполяции значений на ось Х
  let scaleX = d3.scale
    .linear()
    .domain([minArr(arr_x) - 1, maxArr(arr_x) + 1])
    .range([0, xAxisLength]);

  // функция интерполяции значений на ось Y
  let scaleY = d3.scale.linear().domain([max_y, min_y]).range([0, yAxisLength]);

  // масштабирование реальных данных в данные для нашей координатной системы
  for (let i = 0; i < rawData.length; i++) {
    data.push({
      x: scaleX(rawData[i].x) + margin,
      y: scaleY(rawData[i].y) + margin,
    });
  }
  // создаем ось X
  let xAxis = d3.svg.axis().scale(scaleX).orient("bottom");
  // создаем ось Y
  let yAxis = d3.svg.axis().scale(scaleY).orient("left");

  // отрисовка оси Х
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr(
      "transform", // сдвиг оси вниз и вправо
      "translate(" + margin + "," + (scaleY(0) + margin) + ")"
    )
    .call(xAxis);

  // Рассчет сдвига оси Y в точку 0 по оси X
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr(
      "transform", // сдвиг оси вправо и вниз на margin
      "translate(" + (scaleX(0) + margin) + "," + margin + ")"
    )
    .call(yAxis);

  // создаем набор вертикальных линий для сетки
  d3.selectAll("g.x-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", 0)
    .attr("y1", -height)
    .attr("x2", 0)
    .attr("y2", yAxisLength);

  // рисуем горизонтальные линии координатной сетки
  d3.selectAll("g.y-axis g.tick")
    .append("line")
    .classed("grid-line", true)
    .attr("x1", -width)
    .attr("y1", 0)
    .attr("x2", xAxisLength)
    .attr("y2", 0);

  // функция, создающая по массиву точек линии
  let line = d3.svg
    .line()
    .interpolate("basis")
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    })
    .defined(function (d) {
      return !isNaN(d.y);
    });
  // добавляем путь
  svg
    .append("g")
    .append("path")
    .attr("d", line(data))
    .style("stroke", "steelblue")
    .style("stroke-width", 2);
}
