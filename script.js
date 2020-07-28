const addBtns = document.querySelectorAll('.add-btn:not(.solid)')
const saveItemBtns = document.querySelectorAll('.solid')
const addItemContainers = document.querySelectorAll('.add-container')
const addItems = document.querySelectorAll('.add-item')
// Item Lists
const itemLists = document.querySelectorAll('.drag-item-list')
const backlogList = document.getElementById('backlog-list')
const progressList = document.getElementById('progress-list')
const completeList = document.getElementById('complete-list')
const onHoldList = document.getElementById('on-hold-list')

// Items
let updatedOnLoad = false     //when we load the page, we want to show we haven't uploaded from storage yet

// Initialize Arrays
let backlogListArray = []
let progressListArray = []
let completeListArray = []
let onHoldListArray = []
let listArrays = []         // Stores all the above arrays


// Drag Functionality


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems)
    progressListArray = JSON.parse(localStorage.progressItems)
    completeListArray = JSON.parse(localStorage.completeItems)
    onHoldListArray = JSON.parse(localStorage.onHoldItems)
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax']
    progressListArray = ['Work on projects', 'Listen to music']
    completeListArray = ['Being cool', 'Getting stuff done']
    onHoldListArray = ['Being uncool']
  }
}
// getSavedColumns()
// updateSavedColumns()

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]))
  })
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray))
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray))
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray))
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray))
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl)
  // console.log('column:', column)
  // console.log('item:', item)
  // console.log('index:', index)
  // List Item
  const listEl = document.createElement('li')
  listEl.classList.add('drag-item')
  listEl.textContent = item
  // Append
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once - if its false, then call getSavedColumns
  if (!updatedOnLoad) {
    getSavedColumns()
  }
  // Backlog Column
  backlogList.textContent = ''  // referring to all the <li>s
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
  // Progress Column
  progressList.textContent = ''  // referring to all the <li>s
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 0, progressItem, index)
  })
  // Complete Column
  completeList.textContent = ''  // referring to all the <li>s
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 0, completeItem, index)
  })
  // On Hold Column
  onHoldList.textContent = ''  // referring to all the <li>s
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 0, onHoldItem, index)
  })
  // Run getSavedColumns only once, Update Local Storage


}
//  On Load
updateDOM()