const api_key = 'c2085ecd0134f3b169a4e368c4bc10c6';

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const dailyFor = document.querySelector(".modal .daily");

const modal = document.querySelector(".modal");

window.onload=getLocation;

function getLocation() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = Number.parseFloat(position.coords.latitude).toFixed(2);
      var long = Number.parseFloat(position.coords.longitude).toFixed(2);
      
      const url = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${long}&cnt=1&appid=${api_key}&units=metric`;

      fetch(url)
      .then(response => response.json())
      .then(data => {
        
        const {main, name, sys, weather, coord} = data.list[0];
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

        const val = (coord.lat).toString()+ '/' + (coord.lon).toString();

        const li = document.createElement("li");
        
        li.classList.add("city");
        
        const markup = `
        <button value="${name}" onclick="xButton(this.value)"><span class="material-icons">
        remove_circle_outline</span></button>
        <div id="modalBtn" onclick="openModal('${val}')">
          <div class="city-name" data-name="${name}, ${sys.country}">
              <span>${name}</span>
              <sup>${sys.country}</sup>
          </div>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
          </div>
          <figure>
              <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
              <figcaption>${weather[0]["description"]}</figcaption>
          </figure>
        </div>
        `;

        li.innerHTML = markup;
        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = "Please search for a valid city 😩";
      });
    
    msg.textContent = "";
    form.reset();
    input.focus();
    
    var day = new Date();
    
    const info = (day.toString()).split(" ");

    day = info[1].toUpperCase()+" "+info[2]+" "+info[0].toUpperCase();

    document.querySelector(".sub-heading .date").innerHTML = day;

  });
}
     else {
          window.alert("Could not get your location. you can search yourself.");
    }
}

function openModal(val) {
  document.querySelector(".modal .daily").innerHTML ="";

  const coord = val.split("/");

  const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${coord[0]}&lon=${coord[1]}&exclude={current, minutely, hourly}&appid=${api_key}`;
  
      fetch(url)
      .then(response => response.json())
      .then(data => {
        
        const {daily} = data;
        
        for(var i=1; i< daily.length; i++){
        const li = document.createElement("li");
        li.classList.add("forecast");
        
        let date = new Date(daily[i].dt * 1000);
        
        var day = new Date();
    
        const info = (day.toString()).split(" ");
    
        day = info[2]+" "+info[0].toUpperCase();
    
        //const day = (date.toString()).split(" ");

        let icon = `https://openweathermap.org/img/wn/${daily[i].weather[0]["icon"]}@2x.png`;
        
        let markup = `
        <p>${day}</p>
        <div class="city-temp">${Math.round(daily[i].temp.day)}<sup>°C</sup>
          </div>
          <figure>
              <img class="city-iconMini" src=${icon} alt="main"}>
              <figcaption>${daily[i].weather[0]["description"]}</figcaption>
          </figure>
        </div>
        `;

        li.innerHTML += markup;
        dailyFor.appendChild(li);
        }
      });
  
  modal.style.display = "block";

}

window.onclick = function(e) {
  if(e.target == modal) {
  modal.style.display = "none";
  }
}


function xButton(value) {

  const nameList = document.querySelectorAll(".ajax-section .cities .city-name span");
  
  for(var i =0; i<nameList.length; i++)
  {
    if(value==nameList[i].innerHTML)
    {
      list.removeChild(list.childNodes[i+1]);
    }
  }

}


form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${api_key}&units=metric`;
    
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
    
    if (listItemsArray.length > 0) {
        
        const filteredArray = listItemsArray.filter( el => {
            let content = "";

            if(inputVal.includes(",")) {
                if(inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                }
                else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            }
            else {
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        })
    
        if(filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${
                filteredArray[0].querySelector(".city-name span").textContent
                }....otherwise be more specific by providing the country code as well`;
            form.reset();
            input.focus();
            return;
            }
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        
        console.log(data);
        
        const {main, name, sys, weather, coord} = data;
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

        const val = (coord.lat).toString()+ '/' + (coord.lon).toString();

        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
        <button value="${name}" onclick="xButton(this.value)"><span class="material-icons">
        remove_circle_outline</span></button>
        <div id="modalBtn" onclick="openModal('${val}')">
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
        </div>
        <figure>
            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
            <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
        </div>
        `;

        li.innerHTML = markup;
        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = "Please search for a valid city 😩";
      });
    
    msg.textContent = "";
    form.reset();
    input.focus();
    
  });


