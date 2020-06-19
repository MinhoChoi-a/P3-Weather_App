

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

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
        
        console.log(data);
        
        const {main, name, sys, weather} = data.list[0];
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
        <button value="${name}" onclick="xButton(this.value)">X</button>
        <div id="modalBtn" onclick="openModal()">
          <h2 class="city-name" data-name="${name}, ${sys.country}">
              <span>${name}</span>
              <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>'C</sup>
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
}
     else {
          window.alert("Could not get your location. you can search yourself.");
    }
}

function openModal() {
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
    console.log(list.childNodes);
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
        
        const {main, name, sys, weather} = data;
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
        <button value="${name}" onclick="xButton(this.value)">X</button>
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>'C</sup>
        </div>
        <figure>
            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
            <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
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


