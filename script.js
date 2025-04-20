document.addEventListener("DOMContentLoaded", () => {
    Papa.parse("data-to-visualize/Electric_Vehicle_Population_Data.csv", {
      download: true,
      header: true,
      complete: function (result) {
        
        const data = result.data;
        createCharts(data);
        populateTable(data);
      },
    });
  });
  
  function createCharts(data) {
    const carType = {};
    data.forEach((car) => {
      const type = car["Electric Vehicle Type"];
      if (type) {
        carType[type] = (carType[type] || 0) + 1;
      }
    });
  
    new Chart(document.getElementById("carTypechart"), {
      type: "pie",
      data: {
        labels: Object.keys(carType),
        datasets: [
          {
            labels: "Electric Vehicle Type",
            data: Object.values(carType),
            backgroundColor: ["#60a5fa", "#34d399", "#fbbf24"],
          },
        ],
      },
      options: {
        aspectRatio: 1.5,
        responsive: true,
        maintainAspectRatio: false,
      },
    });
    const topCount = {};
    data.forEach((car) => {
      const make = car["Make"];
      if (make) {
        topCount[make] = (topCount[make] || 0) + 1;
      }
    });
    const sortedOrder = Object.entries(topCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const topLabels = sortedOrder.map(([label]) => label);
    const topCounts = sortedOrder.map(([_, count]) => count);
  
    new Chart(document.getElementById("topChart"), {
      type: "bar",
      data: {
        labels: topLabels,
        datasets: [
          {
            label: "Top 5 Makes",
            data: topCounts,
            backgroundColor: "#34d399",
          },
        ],
      },
    });
  
    const yearlyTrendCount = {};
    data.forEach((car) => {
      const year = car["Model Year"];
      if (year) {
        yearlyTrendCount[year] = (yearlyTrendCount[year] || 0) + 1;
      }
    });
  
    const yearSorted = Object.keys(yearlyTrendCount).sort();
    const years = yearSorted.map((year) => yearlyTrendCount[year]);
  
    new Chart(document.getElementById("yearlyChart"), {
      type: "line",
      data: {
        labels: yearSorted,
        datasets: [
          {
            label: "EVs by Year",
            data: years,
            borderColor: "#6366f1",
            fill: false,
          },
        ],
      },
    });
  }
  
  function populateTable(data) {
    const tbody = document.querySelector("#Table tbody");
    const rows = data
      .slice(0, 10)
      .map(
        (ev) => `
      <tr>
        <td class="border px-3 py-2">${ev["VIN (1-10)"]}</td>
        <td class="border px-3 py-2">${ev["Make"]}</td>
        <td class="border px-3 py-2">${ev["Model"]}</td>
        <td class="border px-3 py-2">${ev["Electric Vehicle Type"]}</td>
        <td class="border px-3 py-2">${ev["Model Year"]}</td>
      </tr>
    `
      )
      .join("");
  
    tbody.innerHTML = rows;
  }
  