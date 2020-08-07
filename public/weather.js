const inp = document.querySelector('#myInput')
const countries = JSON.parse(document.querySelector('.coun_list').value);    

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const dailyFor = document.querySelector(".modal .daily");

const modal = document.querySelector(".modal");

const api_key = document.querySelector('.api_key').value;

window.onload=getLocation;

function getLocation() {
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = Number.parseFloat(position.coords.latitude).toFixed(2);
      var long = Number.parseFloat(position.coords.longitude).toFixed(2);
      
      const url = `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${long}&cnt=1&appid=${api_key}&units=metric`;

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

var dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function openModal(val) {
  document.querySelector(".modal .daily").innerHTML ="";

  const coord = val.split("/");

  var date = new Date();
  var day;
  var list = [];

  for(var i=0; i < 7; i++) {
  
  if(date.getDay()+i < 7) {
    day = dayList[date.getDay()+i];
  }
  else {
    day = dayList[date.getDay()+i - 7];
  }

  list.push(day);

  }

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord[0]}&lon=${coord[1]}&exclude={current, minutely, hourly}&appid=${api_key}`;
  
      fetch(url)
      .then(response => response.json())
      .then(data => {
        
        const {daily} = data;
        
        for(var i=1; i< daily.length; i++){
        const li = document.createElement("li");
        li.classList.add("forecast");
        
        let date = new Date(daily[i].dt * 1000);
        
        //const day = (date.toString()).split(" ");

        let icon = `https://openweathermap.org/img/wn/${daily[i].weather[0]["icon"]}@2x.png`;
        
        let markup = `
        <p>${list[i-1]}</p>
        <div class="city-temp">${(Math.round(daily[i].temp.day))/10}<sup>°C</sup>
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

const submit = document.querySelector('#submitbtn');

form.addEventListener('submit', e => {
    
    e.preventDefault();

    submitbtn.style.background = "#379683";

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
        msg.textContent = "Please search for a valid city";
      });
    
    msg.textContent = "";
    form.reset();
    input.focus();
    
  });


var currentFocus;

inp.addEventListener("input", function() {
      var a, b, i, val = this.value;

      closeAllLists();
      
      if (!val) { return false;}
      
      currentFocus = -1;
      
      a = document.createElement("DIV");
      
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      
      this.parentNode.appendChild(a);
      
      for (i = 0; i < countries.length; i++) {
        
        if (countries[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + countries[i].substr(0, val.length) + "</strong>";
          b.innerHTML += countries[i].substr(val.length);
          
          b.innerHTML += "<input type='hidden' value='" + countries[i] + "'>";
          
              b.addEventListener("click", function(e) {
          
              inp.value = this.getElementsByTagName("input")[0].value;
          
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
});
    

const submitbtn = document.querySelector('#submitbtn');

inp.addEventListener("keydown", function(e) {
    
    submitbtn.style.background = "#05386b";
  
    if (e.keyCode == 13) {
      submitbtn.style.background = "#379683";
    }
}); 
  
function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
}

function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
}


function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });



