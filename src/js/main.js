// Import our custom CSS
import '../scss/styles.scss'

// // Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'


// import Alert from 'bootstrap/js/dist/alert'


// // or, specify which plugins you need:
// import { Tooltip, Toast, Popover } from 'bootstrap'
const InfoMessageType = {
  ERR: 1,
  WARN: 2,
  INFO: Symbol("green")
};
Object.freeze(InfoMessageType);

let eventsintime = [];
let currentEventID = -1;

let restURL = 'http://localhost:8089/services/rest.api.php';

function setupformelements(eventID){
  currentEventID = eventID;
  document.querySelector("#start-date").value = (eventID) ? eventsintime[eventID].startdate : null;
  document.querySelector("#end-date").value = (eventID) ? eventsintime[eventID].enddate : null;
  document.querySelector("#description").value = (eventID) ? eventsintime[eventID].description : null;
  document.querySelector("#description").focus();

}

function infoBoxUpdate(infoMsg, infoMsgType){
  let classList = document.querySelector("#info-box").classList
  classList.remove(...classList);
  classList.add("alert");
  document.querySelector("#info-box").innerHTML = infoMsg;
  if (infoMsgType === InfoMessageType.ERR){
    classList.add("alert-danger");
  } else if (infoMsgType === InfoMessageType.WARN){
    classList.add("alert-warning");
  } else if (infoMsgType === InfoMessageType.INFO){
    classList.add("alert-primary");
  }
}

function getallevents(){
  fetch(`${restURL}/getallevents/`, {
    method: "GET"
}).then(response => response.json())
.then(data => {
  let eventTableBody = document.querySelector("#event-table-body");
  eventTableBody.innerHTML = null;
  data.forEach(eventObject => {
    eventsintime[eventObject.id] = {startdate:eventObject.startdate, enddate:eventObject.enddate, description:eventObject.description};
    let tableRow = document.createElement('tr');
    tableRow.name = "event-row";
    
    tableRow.appendChild(
      Object.assign(
        document.createElement("input"),
        {
          class: "form-check-input me-1",
          type: "radio",
          name:'row-item',
          id:eventObject.id
        }
      )
    );
    tableRow.appendChild(
      Object.assign(document.createElement("td"),{innerHTML: eventObject.description})
    );
    tableRow.appendChild(
      Object.assign(document.createElement("td"),{innerHTML: eventObject.startdate})
    );
    tableRow.appendChild(
      Object.assign(document.createElement("td"),{innerHTML: eventObject.enddate})
    );

    eventTableBody.appendChild(tableRow);

  });

  document.querySelectorAll('input[name="row-item"]').forEach(tablerow => 
    tablerow.addEventListener('change', () => {
      setupformelements(tablerow.id);  
    })
  );  

})
.catch((err) => {
  console.log(err);
})
}

window.onload = function(){
  if(window.location.href.includes("localhost")){
    restURL = 'http://localhost:8089/services/rest.api.php'
  } else {
    restURL = 'https://history.peterb.in/services/rest.api.php/'
  }
  getallevents();
};


document.querySelector("#save").addEventListener("click", function (e) {
  let allGood = true;
  if (!document.querySelector("#description").value){
    allGood = false;
    infoBoxUpdate("Description of event is required",InfoMessageType.ERR);
  }
  if (allGood){
    if (!document.querySelector("#start-date").value){
      allGood = false;
      infoBoxUpdate("Start date of event is required",InfoMessageType.ERR);
    }
  }
  if (allGood){
    fetch(`${restURL}/saveevent/`, {
      method: "POST",
      body: JSON.stringify({
          eventid:currentEventID,
          startdate:document.querySelector("#start-date").value,
          enddate:document.querySelector("#end-date").value,
          description:document.querySelector("#description").value
        }
     )})
    .then(response => response.json())
    .then(data => {
      console.log(currentEventID);
      
      infoBoxUpdate(`${currentEventID>0 ? "Updated" : "New"} event <b>${data.description}; ${data.startdate}; ${data.enddate}</b>`,InfoMessageType.INFO);
      setupformelements(0);
      getallevents();
    })
    .catch((err) => {
      console.log(err);
    })
  }
});

document.querySelector("#reset").addEventListener("click", function (e) {
  setupformelements(0);
});








