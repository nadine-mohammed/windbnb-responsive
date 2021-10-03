const availableStays = document.getElementById("available-stays");
const staysCont = document.getElementById("stays");
const numOfStays = document.getElementById("num-of-stays");
//
const containerShadow = document.getElementById("container-shadow");
const homeStaysInputs = document.getElementsByClassName("search-i");
const mainSearchCont = document.getElementById("main-search-container");
const mainSearchBtn = document.getElementById("main-search-btn");
const locInput = document.getElementById("location");
const guestsInput = document.getElementById("guests");
const locOptions = document.getElementById("location-options");
const guestsOptions = document.getElementById("guests-options");
// -----------------------------
const homeLocation = document.getElementById("outer-location");
const innerLocation = document.getElementById("inner-location");
const innerGuests = document.getElementById("inner-guests");
const homeGuests = document.getElementById("outer-guests");
//-------------
const minusAdultBtn = document.getElementById("minus-adult-btn");
const plusAdultBtn = document.getElementById("plus-adult-btn");
const minusChildBtn = document.getElementById("minus-child-btn");
const plusChildBtn = document.getElementById("plus-child-btn");
const innerNumAdult = document.getElementById("num-adult");
const innerNumChild = document.getElementById("num-child");
///--------------
let guestsNumAdult = 0;
let guestsNumChild = 0;
let totalGuests = 0;
// ------------------------------------------------------------------
const noData = document.getElementById("no-data");
const resetBtn = document.getElementById("delete-ico-btn");
resetBtn.addEventListener("click", function () {
  innerGuests.value = "";
  homeGuests.value = "";
  homeLocation.value = "";
  innerLocation.value = "";
  innerNumAdult.innerText = "0";
  innerNumChild.innerText = "0";
  guestsNumAdult = 0;
  guestsNumChild = 0;
  totalGuests = 0;
  setStaysData();
});
///--------------

for (let i = 0; i < homeStaysInputs.length; i++) {
  homeStaysInputs[i].addEventListener("click", toggleFilter);
}

mainSearchBtn.addEventListener("click", function () {
  homeLocation.value = innerLocation.value;
  homeGuests.value = innerGuests.value;
  setStaysData(innerLocation.value, innerGuests.value);
  hideAll();
  toggleFilter();
});

function toggleFilter() {
  let bodyRect = document.body.getBoundingClientRect();
  let elemRect = mainSearchCont.getBoundingClientRect();
  let offset = elemRect.top - bodyRect.top;
  if (offset == -1000) {
    mainSearchCont.style.animation = "showMenu 0.5s forwards";
    containerShadow.style.display = "block";
  } else {
    mainSearchCont.style.animation = "hideMenu 0.5s forwards";
    containerShadow.style.display = "none";
  }
}

///-------------------------------
locInput.addEventListener("click", function () {
  hideAll();
  displayOps(locOptions, locInput);
});
guestsInput.addEventListener("click", function () {
  hideAll();
  displayOps(guestsOptions, guestsInput);
});

function hideAll() {
  locInput.classList.remove("focusOnDp");
  guestsInput.classList.remove("focusOnDp");
  locOptions.style.display = "none";
  guestsOptions.style.display = "none";
}
function displayOps(ops, parent) {
  parent.classList.add("focusOnDp");
  ops.style.display = "block";
}
//---------------------------------
let staysData;
async function readStays() {
  let response = await fetch("./assets/stays.json");
  staysData = await response.json();
  setStaysData();
  getAllLocations();
}
function getAllLocations() {
  let locOptionsData = [];
  for (let i = 0; i < staysData.length; i++) {
    if (
      locOptionsData.indexOf(`${staysData[i].city},${staysData[i].country}`) ===
      -1
    ) {
      locOptionsData.push(`${staysData[i].city},${staysData[i].country}`);
    }
  }
  setLocationsList(locOptionsData);
}
function setLocationsList(locOptionsData) {
  for (let i = 0; i < locOptionsData.length; i++) {
    let optionItem = document.createElement("li");
    optionItem.classList.add("user-option");
    let locIco = document.createElement("span");
    locIco.classList.add("material-icons");
    locIco.innerText = "location_on";
    let temp = document.createElement("span");
    temp.innerText = locOptionsData[i];

    optionItem.appendChild(locIco);
    optionItem.appendChild(temp);
    locOptions.appendChild(optionItem);
    optionItem.addEventListener("click", function () {
      innerLocation.value = locOptionsData[i];
    });
  }
}
minusAdultBtn.addEventListener("click", function () {
  guestsNumAdult--;
  if (guestsNumAdult < 0) {
    guestsNumAdult = 0;
  }
  setGuests(guestsNumAdult, innerNumAdult);
});
plusAdultBtn.addEventListener("click", function () {
  guestsNumAdult++;
  setGuests(guestsNumAdult, innerNumAdult);
});
minusChildBtn.addEventListener("click", function () {
  guestsNumChild--;
  if (guestsNumChild < 0) {
    guestsNumChild = 0;
  }
  setGuests(guestsNumChild, innerNumChild);
});
plusChildBtn.addEventListener("click", function () {
  guestsNumChild++;
  setGuests(guestsNumChild, innerNumChild);
});
function setGuests(numGuests, numTxt) {
  numTxt.innerText = numGuests;
  totalGuests = guestsNumAdult + guestsNumChild;
  if (totalGuests > 0) {
    innerGuests.value = totalGuests;
  } else {
    innerGuests.value = "";
  }
}
//-------------------------------------------------------------------
function setStaysData(locFilter, guestsFilter) {
  let cityFilter;
  let countryFilter;
  if (locFilter) {
    cityFilter = locFilter.split(",")[0];
    countryFilter = locFilter.split(",")[1];
  }
  let sData = staysData;
  if (!countryFilter) {
    countryFilter = "Finland";
  }

  sData = staysData.filter((val) => {
    if (cityFilter && !guestsFilter) {
      return val.country === countryFilter && val.city === cityFilter;
    }
    if (guestsFilter && !cityFilter) {
      return (
        val.country === countryFilter &&
        parseInt(val.maxGuests) === parseInt(guestsFilter)
      );
    }
    if (!guestsFilter && !cityFilter) {
      return val.country === countryFilter;
    }
    if (guestsFilter && cityFilter) {
      return (
        val.country === countryFilter &&
        val.city === cityFilter &&
        parseInt(val.maxGuests) === parseInt(guestsFilter)
      );
    }
  });
  numOfStays.innerText = `${sData.length} stays`;
  staysCont.innerHTML = "";
  if (sData.length > 0) {
    noData.style.display = "none";
    for (let i = 0; i < sData.length; i++) {
      drawStay(
        sData[i].photo,
        sData[i].superHost,
        sData[i].type,
        sData[i].beds,
        sData[i].rating,
        sData[i].title,
        i,
        sData.length
      );
    } //
  } else {
    noData.style.display = "block";
  }
}
function drawStay(
  photo,
  supHost,
  type,
  beds,
  rating,
  title,
  stayNum,
  staysLen
) {
  let stay = document.createElement("div");
  stay.classList.add("stay");
  stay.innerHTML = `
  <div class="stay">
  <div class="stay-img">
  <img class="stay-img-link" src=${photo}/>
  <div>
  <div class="stay-main-details">
  ${supHost ? '<div class="super-host">super host</div>' : ""}
  <div class="stay-type">${beds ? `${type} . ${beds} beds` : `${type}`}</div>
  <div class="stay-rating">
  <span class="material-icons star-ico">star</span>
  <span>${rating}</span>
  </div>
  </div>
  <div class="stay-title">${title}</div>
  </div>
  `;
  staysCont.append(stay);
  if (stayNum === staysLen - 1) {
    availableStays.appendChild(staysCont);
  }
}
readStays();
