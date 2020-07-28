const addBtns = document.querySelectorAll('.add-btn:not(.solid)')
const saveItemBtns = document.querySelectorAll('.solid')
const addItemContainers = document.querySelectorAll('.add-container')
const addItems = document.querySelectorAll('.add-item')
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list')
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
let draggedItem
let currentColumn

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
  // console.log('index:', index)
  // List Item
  const listEl = document.createElement('li')
  listEl.classList.add('drag-item')
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
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
  backlogList.textContent = '' 
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
  // Progress Column
  progressList.textContent = '' 
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 0, progressItem, index)
  })
  // Complete Column
  completeList.textContent = '' 
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 0, completeItem, index)
  })
  // On Hold Column
  onHoldList.textContent = '' 
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 0, onHoldItem, index)
  })
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true
  updateSavedColumns()
}

// Allow arrays to reflect drag and drop items ()
function rebuildArrays() {
  // console.log(backlogList.children)
  // console.log(progressList.children)
  backlogListArray = []
  for (let i = 0; i < backlogList.children.length; i++ ) {
    backlogListArray.push(backlogList.children[i].textContent)
  }
  progressListArray = []
  for (let i = 0; i < progressList.children.length; i++ ) {
    progressListArray.push(progressList.children[i].textContent)
  }
  completeListArray = []
  for (let i = 0; i < completeList.children.length; i++ ) {
    completeListArray.push(completeList.children[i].textContent)
  }
  onHoldListArray = []
  for (let i = 0; i < onHoldList.children.length; i++ ) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM()
}


// When item starts dragging
function drag(e) {
  draggedItem = e.target
  // console.log('draggedItem:', draggedItem)
}

// When items enters the column area
function dragEnter(column) {
  // console.log(listColumns[column])
  listColumns[column].classList.add('over')
  currentColumn = column
}

// Enable dropping into columns
function allowDrop(e) {
  e.preventDefault()
}

// Doing the drop
function drop(e) {
  e.preventDefault()
  // remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })
  // Add iem to column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  rebuildArrays()
}

//  On Load
updateDOM()