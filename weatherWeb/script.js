//定义变量
const apiKey = "20809d74fd164589b217a180b714a1cd";
const searchBtn = document.querySelector(".search");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todaytemp = document.querySelector(".weather-temp");
const daysList = document.querySelector(".day-list");

//查询函数
async function getWeatherData(location) {
  const locationUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${location}&key=${apiKey}`;
  fetch(locationUrl)
    .then((reponse) => {
      if (reponse.status != 200) {
        throw new Error("请输入正确的城市名");
      }
      return reponse.json();
    })
    .then((data) => {
      const locationId = data.location[0].id;
      //拿到未来7天
      const futureWeatherUrl = `https://devapi.qweather.com/v7/weather/7d?key=${apiKey}&location=${locationId}`;
      fetch(futureWeatherUrl)
        .then((reponse) => {
          return reponse.json();
        })
        .then((data) => {
          console.log(data.daily.slice(0));
          const today = new Date();
          const nextDayDate = data.daily.slice(0);
          const uniqueDays = new Set();
          let count = 0;
          daysList.innerHTML = "";
          for (const dayDate of nextDayDate) {
            const forecastDate = new Date(dayDate.fxDate);
            const dayAbb = forecastDate.toLocaleDateString("zh", {
              weekday: "short",
            });
            const dayTemp = `${dayDate.tempMax}­°C`;
            const iconCode = dayDate.iconDay;
            if (
              !uniqueDays.has(forecastDate) &&
              today.getDate() !== forecastDate.getDate()
            ) {
              uniqueDays.add(forecastDate);
              daysList.innerHTML += `
                    <li>
                    <i class='weather-icon qi-${iconCode}'></i>
                    <span>${dayAbb}</span>
                    <span class = 'day-temp'>${dayTemp}</span>
                    </li>
                    `;
              count++;
            }
            if (count === 4) break;
          }
        });
      //渲染左边盒子的天气信息
      const locationElement = document.querySelector(".today-info>div>span");
      locationElement.textContent = `${data.location[0].adm1},${data.location[0].name}`;
      todayInfo.querySelector("h2").textContent = new Date().toLocaleDateString(
        "zh",
        { weekday: "short" }
      );
      todayInfo.querySelector("span").textContent =
        new Date().toLocaleDateString("zh", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      const apiUrl = `https://devapi.qweather.com/v7/weather/now?key=${apiKey}&location=${locationId}`;
      fetch(apiUrl)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const todayWeatherIconCode = data.now.icon;
          const todayWeatherTemp = data.now.temp;
          const todayWeather = data.now.text;

          console.log(data.now);
          console.log(todayWeatherTemp);
          todayWeatherIcon.className = `weather-icon qi-${todayWeatherIconCode}`;
          todaytemp.textContent = `${todayWeatherTemp}­°C`;

          document.querySelector(".today-weather h3").textContent =
            todayWeather;

          const todayPrecipitation = `${data.now.vis}公里`;
          const todayHumidity = `${data.now.humidity}%`;
          const todayWindSpeed = `${data.now.windSpeed} km/h`;

          const dayInfoContainer = document.querySelector(".day-info");
          dayInfoContainer.innerHTML = `
            <div>
            <span class="title">能见度</span>
            <span class="value">${todayPrecipitation}</span>
        </div>
        <div>
            <span class="title">湿度</span>
            <span class="value">${todayHumidity}</span>
        </div>
        <div>
            <span class="title">风速</span>
            <span class="value">${todayWindSpeed}</span>
        </div>
            `;
        });
    });
}

//页面加载
document.addEventListener("DOMContentLoaded", () => {
  const defaultLocation = "信宜";
  getWeatherData(defaultLocation);
});

//查询按钮点击
searchBtn.addEventListener("click", () => {
  const location = prompt("请输入你要查询的城市：");
  if (!location) return;
  getWeatherData(location);
});
