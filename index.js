let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
const tabBtn = document.getElementById("tab-btn");

if (leadsFromLocalStorage) {
 myLeads = leadsFromLocalStorage;
 render(myLeads);
}

inputBtn.addEventListener("click", function () {
 let inputValue = inputEl.value.trim();
 
 if (inputValue) {
   if (!inputValue.startsWith('http://') && !inputValue.startsWith('https://')) {
     inputValue = 'https://' + inputValue;
   }
   
   myLeads.push(inputValue);
   inputEl.value = "";
   localStorage.setItem("myLeads", JSON.stringify(myLeads));
   render(myLeads);
 }
});

tabBtn.addEventListener("click", function(){    
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
       myLeads.push(tabs[0].url);
       localStorage.setItem("myLeads", JSON.stringify(myLeads));
       render(myLeads);
   })
})

ulEl.addEventListener("click", function(e) {
   if (e.target.closest(".delete-item-btn")) {
       const index = parseInt(e.target.closest(".delete-item-btn").dataset.index);
       deleteItem(index);
   }
});

function render(leads) {
 let listItems = "";
 for (let i = 0; i < leads.length; i++) {
   const lead = leads[i];
   let faviconUrl = "";
   
   try {
     const domain = new URL(lead).hostname;
     faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
   } catch (error) {
     faviconUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E";
   }
   
   listItems += `
           <li>
               <a target='_blank' class="lead-link" href='${lead}'>
                   <img src="${faviconUrl}" alt="favicon" class="favicon">
                   <span>${lead}</span>
               </a>
               <button class="delete-item-btn" data-index="${i}">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                   </svg>
               </button>
           </li>
       `;
 }
 ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function () {
 localStorage.clear();
 myLeads = [];
 render(myLeads);
});

function deleteItem(index) {
   myLeads.splice(index, 1);
   localStorage.setItem("myLeads", JSON.stringify(myLeads));
   render(myLeads);
}
