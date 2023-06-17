const itemForm = document.getElementById("item-form")
const itemInput = document.getElementById("item-input")
const itemList = document.getElementById("item-list")
const clearButton = document.getElementById("clear")
const itemFilter = document.getElementById('filter')
const fromBtn = itemForm.querySelector('button')
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromLocalStorage();
    itemsFromStorage.forEach((item) => AddItemToDom(item))
    checkUI()
}
function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value;
    // validate Input
    if (newItem === '') {
        alert('pls. add an item');
        return;
    }
    // check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('that item is already exists!')
            return;
        }
    }

    // create Item Dom Element
    AddItemToDom(newItem);
    // create Item to localStorage
    AddItemToLocalStorage(newItem);
    checkUI();
    itemInput.value = '';
}


function AddItemToDom(item) {
    // create listItem
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
    itemList.appendChild(li)
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes
    return icon;
}
function AddItemToLocalStorage(item) {
    // we call it so we don't repeat the same code
    const itemsFromStorage = getItemsFromLocalStorage();

    // add items to array
    itemsFromStorage.push(item);

    // convert to json string & set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}
function getItemsFromLocalStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage
}
function onclickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    }
}
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromLocalStorage();
    return itemsFromStorage.includes(item);
}
function setItemToEdit(item) {
    isEditMode = true

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))

    item.classList.add('edit-mode')
    item.style.color = '#ccc'
    fromBtn.innerHTML = '<i class="fa-solid fa-pen"></>update item'
    fromBtn.style.backgroundColor = 'green'
    itemInput.value = item.textContent
}
function removeItem(item) {
    if (confirm('are you sure?')) {
        // remove items from dom
        item.remove();

        // remove items from storage
        removeItemFromStorage(item.textContent)
        checkUI();
    }
};
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromLocalStorage()
    // filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item)
    //  Re-set to local storage 
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
    // console.log(itemsFromStorage);
}

function clearItem() {
    // itemList.innerHTML = ''
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }
    // clear from local storage
    localStorage.removeItem('items');
    checkUI();

}
function filterItem(e) {
    // there is an item because it's not in glopal scope
    const item = document.querySelectorAll('li')
    const text = e.target.value.toLowerCase();
    item.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        console.log(itemName);
        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex"
        } else {
            item.style.display = "none"
        }
    })
    // get array from html if it was item with get element
    // Array.from(item.forEach())   => 
}
function checkUI() {
    itemInput.value = '';
    const item = document.querySelectorAll('li')
    if (item.length === 0) {
        clearButton.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    fromBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    fromBtn.style.backgroundColor = '#333';
    isEditMode = false;
}
// initialize app to get it out of globalScope
function init() {
    // EventListener
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onclickItem);
    clearButton.addEventListener('click', clearItem);
    itemFilter.addEventListener('input', filterItem);
    document.addEventListener('DOMContentLoaded', displayItems)
    checkUI();
}
init();

