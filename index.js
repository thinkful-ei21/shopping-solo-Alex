'use strict';

const STORE = [
  {name: "apples", checked: false, hidden: false},
  {name: "oranges", checked: false, hidden: false},
  {name: "milk", checked: true, hidden: false},
  {name: "bread", checked: false, hideen: false}
];


function generateItemElement(item, itemIndex, template) {
        
   return `<li class="js-item-index-element ${item.hidden ? "hidden" : ''}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false, hidden: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
  if ($(':checkbox').prop('checked') && STORE[itemIndex].checked) {STORE[itemIndex].hidden=true}
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', function (event) {
    STORE.splice(getItemIndexFromElement(event.currentTarget), 1);
    renderShoppingList();
  });
  
}

function handleHideCheckedClicked() {
  $(':checkbox').click(function (event){
    STORE.forEach(function(item, index) {
      if (item.checked) {item.hidden = !item.hidden}
    })
    renderShoppingList();
    })
}

function handleSearchClicked() {
  $('.js-search-form').on('click', '.js-item-search-button',function(event){
    searchFilter($('.js-list-search-text').val())
    $('.js-list-search-text').val('');
    renderShoppingList();
  })
}

function searchFilter(searchTerm){
  STORE.forEach(function (item){
    if (!item.hidden){
      item.hidden = true;
      item.name.split(' ').forEach(function(singleWord){
        if (singleWord === searchTerm) {
          item.hidden = false;
        }
      })
    }
  })
}

function resetSearch() {
  STORE.forEach(function(item) {
    item.hidden = false;
    if (item.checked && $(':checkbox').prop('checked')) {item.hidden = !item.hidden}
  });
  renderShoppingList();
}
function handleEditClicked() {
  $('.js-shopping-list').on('click', '.js-item-edit', function (event) {
    let newName = (window.prompt('Enter new name for item'));
    if (newName === null || newName === '') {newName = STORE[getItemIndexFromElement(event.currentTarget)].name} 
    STORE[getItemIndexFromElement(event.currentTarget)].name = newName;
    renderShoppingList();
  });
}

function handleResetClicked() {
  $('.js-search-form').on('click', '.js-item-search-reset', function (event) {
    resetSearch();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleHideCheckedClicked();
  handleSearchClicked();
  handleEditClicked();
  handleResetClicked();
}

$(handleShoppingList);