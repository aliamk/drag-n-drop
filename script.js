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
let dragging = false

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

// Filter arrays to remove empty items
function filterArray(array) {
  // console.log(array)
  const filteredArray = array.filter(item => item !== null)
  // console.log(filteredArray)
  return filteredArray
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
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = true
  listEl.id = index
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
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
  backlogListArray = filterArray(backlogListArray)

  // Progress Column
  progressList.textContent = '' 
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index)
  })
  progressListArray = filterArray(progressListArray)

  // Complete Column
  completeList.textContent = '' 
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  })
  completeListArray = filterArray(completeListArray)

  // On Hold Column
  onHoldList.textContent = '' 
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  onHoldListArray = filterArray(onHoldListArray)
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true
  updateSavedColumns()
}

// Update Items - Delete if necessay or update the array value
function updateItem(id, column) {
  const selectedArray = listArrays[column]
  // console.log(selectedArray)
  const selectedColumnEl = listColumns[column].children
  // console.log(selectedColumnEl[id].textContent)
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id]
    } else {
      // console.log(selectedArray)
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM()
  }
}

// Add to column list, reset textbox
function addToColumn(column) {
  // console.log(addItems[column].textContent)
  const itemText = addItems[column].textContent
  const selectedArray = listArrays[column]
  selectedArray.push(itemText)
  addItems[column].textContent = ''
  updateDOM()
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}

// Allow arrays to reflect drag and drop items
// Create empty array, map through an array containing items, 
// find every instance of children with textContent, assign to the empty array
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent)
  progressListArray = Array.from(progressList.children).map(i => i.textContent)
  completeListArray = Array.from(completeList.children).map(i => i.textContent)
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent) 
  updateDOM()
}


// When item starts dragging
function drag(e) {
  draggedItem = e.target
  // console.log('draggedItem:', draggedItem)
  dragging = true
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
  // Add item to column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  // dragging complete
  dragging = false
  rebuildArrays()
}

//  On Load
updateDOM()