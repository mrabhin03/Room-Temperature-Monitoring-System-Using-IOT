let Entityies = null;
let Addes = 6;
let Labels = [];
let Values = [];
let DatesArray = [];

const leftArray = document.getElementById("leftArray");
const rightArray = document.getElementById("rightArray");
const ctx = document.getElementById("TimeChart").getContext("2d");
function setChart(labelV, DataV) {
  let chartScales;

  if (window.innerWidth < 800) {
    chartScales = {
      x: {
        beginAtZero: false,
        min: 10,
        max: 40,
        grid: { drawBorder: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
        },
      },
    };
  } else {
    chartScales = {
      y: {
        beginAtZero: false,
        min: 18,
        max: 40,
        grid: { drawBorder: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
        },
      },
    };
  }

  Entityies = new Chart(ctx, {
    type: "line",
    data: {
      labels: labelV,
      datasets: [
        {
          label: "Temperature",
          data: DataV,
          borderColor: "#333",
          backgroundColor: "#000000" + 20,
          borderWidth: 4,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: "#000",
          pointBorderColor: "#000",
          pointHoverBorderColor: "#000",
        },
      ],
    },
    options: {
      indexAxis: ((window.innerWidth < 800) ? "y" : "x"),
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#333",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
      scales: chartScales,
    },
  });
}

let endIndex = Labels.length;
function getSlice(mode) {
  if (mode === 0) {
    endIndex = endIndex - Addes;
    if (endIndex < Addes) {
      endIndex = Addes;
    }
    let start = Math.max(0, endIndex - Addes);
    let end = endIndex;
    updateChart(Labels.slice(start, end), Values.slice(start, end));
  } else if (mode === 1) {
    endIndex = endIndex + Addes;
    if (endIndex > Labels.length) {
      endIndex = Labels.length;
    }
    let end = endIndex;
    let start = Math.max(0, endIndex - Addes);
    updateChart(Labels.slice(start, end), Values.slice(start, end));
  }
}

function updateChart(NewLabel, NewData) {
  if (Entityies) {
    Entityies.data.datasets[0].data = NewData;
    Entityies.data.labels = NewLabel;
    Entityies.update();
  }
}
function getFormattedDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
document.getElementById("selectDate").value = getFormattedDate();
function updateAdds(obj) {
  Addes = parseInt(obj);
  leftArray.innerHTML = `-${Addes}`;
  rightArray.innerHTML = `+${Addes}`;
  if (endIndex < Addes) {
    endIndex = Addes > Labels.length ? Labels.length : Addes;
  }
  let end = endIndex;
  let start = Math.max(0, endIndex - Addes);
  updateChart(Labels.slice(start, end), Values.slice(start, end));
}

let LatestValuesID = 0;
let DataGraph;
function fetchLatestTemperature() {
  fetch("PHPs/getValues.php?Mode=0")
    .then((response) => response.json())
    .then((data) => {
      if (data.ValuesID != LatestValuesID) {
        LatestValuesID = data.ValuesID;
        document.getElementById("entityValue").innerHTML = `${data.Value}`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
function fetchCalculatedValue(mode) {
  fetch("PHPs/getValues.php?Mode=1")
    .then((response) => response.json())
    .then((data) => {
      if (DataGraph != data) {
        templeng = Labels.length;
        Labels = data.time;
        Values = data.temperature;
        DatesArray = data.date;
        DataGraph = data;
        if (mode == 0) {
          setChart(Labels.slice(-Addes), Values.slice(-Addes));
        } else {
          if (endIndex == templeng) {
            endIndex = Labels.length;
            let end = endIndex;
            let start = Math.max(0, endIndex - Addes);
            updateChart(Labels.slice(start, end), Values.slice(start, end));
          } else {
            endIndex = endIndex == 0 ? Labels.length : endIndex;
            let end = endIndex;
            let start = Math.max(0, endIndex - Addes);
            updateChart(Labels.slice(start, end), Values.slice(start, end));
          }
        }
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
function getDateValue(obj) {
  TheValue = obj.value;
  let Dateindex = DatesArray.lastIndexOf(TheValue);
  let firstDateindex = DatesArray.indexOf(TheValue);
  if (Dateindex == -1) {
    if (TheValue < DatesArray[0]) {
      Dateindex = DatesArray.lastIndexOf(DatesArray[0]);
      firstDateindex = DatesArray.indexOf(DatesArray[0]);
    } else if (TheValue > DatesArray[DatesArray.length - 1]) {
      Dateindex = DatesArray.lastIndexOf(DatesArray[DatesArray.length - 1]);
      firstDateindex = DatesArray.indexOf(DatesArray[DatesArray.length - 1]);
    } else {
      let newValue = 0;
      for (let i = 0; i < DatesArray.length; i++) {
        if (DatesArray[i] > TheValue) {
          newValue = i;
          break;
        }
      }
      Dateindex = DatesArray.lastIndexOf(DatesArray[newValue]);
      firstDateindex = DatesArray.indexOf(DatesArray[newValue]);
    }
  }
  let end = (endIndex = Dateindex + 1);
  let start =
    Dateindex + 1 - firstDateindex > Addes
      ? Math.max(0, endIndex - Addes)
      : firstDateindex;
  updateChart(Labels.slice(start, end), Values.slice(start, end));
  console.log(Dateindex + "  " + DatesArray[Dateindex]);
}
fetchCalculatedValue(0);
fetchLatestTemperature();
setInterval(fetchLatestTemperature, 2000);
setInterval(fetchCalculatedValue, 2000);
