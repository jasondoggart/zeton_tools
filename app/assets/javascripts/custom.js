$(document).ready(function() {
  showSelect2();
});

function showSelect2() {
  $('#information_request_instrument_ids').select2({
    placeholder: "Select associated instruments",
    theme: "bootstrap"
  });
  $('#information_request_equipment_ids').select2({
    placeholder: "Select associated equipment",
    theme: "bootstrap"
  });
  $('#information_request_handvalve_ids').select2({
    placeholder: "Select associated handvalves",
    theme: "bootstrap"
  });
}


$('#filter-toggle-link').click(function() {
  if ($('#filters').hasClass('filters-close')) {
    $('#filters').removeClass('filters-close');
  } else {
    $('#filters').addClass('filters-close');
  }
});

function toggleDropdown(list, arrow, height) {
  const ddList = document.querySelector(list);
  const listItems = ddList.querySelectorAll('.list-item');
  const newArrow = document.querySelector(arrow);
  dropdownStatus(listItems, height, newArrow)
}

function dropdownStatus(listItems, height, newArrow) {
  listItems.forEach((e) => {
    if (e.classList.contains('hide')) {
      e.classList.remove('hide');
      document.documentElement.style.setProperty(height, '27px');
      newArrow.innerHTML = '<i class="fa fa-caret-down"></i>';
    } else {
      e.classList.add('hide');
      document.documentElement.style.setProperty(height, '0px');
      newArrow.innerHTML = '<i class="fa fa-caret-right"></i>';
    }
  });
}

function showPopup(e) {
  const popup = document.querySelector(e);
  popup.classList.contains('hide') ? popup.classList.remove('hide') : popup.classList.add('hide');

}

function showDocumentData(e, divid) {
  const left = e.clientX + 'px';
  const top = e.clientY + 'px';

  const div = document.querySelector(divid);

  div.style.left = left;
  div.style.top = top;

  showPopup(divid);
}

function darkLabel(divid) {
  const div = document.querySelector(divid);

  div.style.color = '#424241';
}
function lightLabel(divid) {
  const div = document.querySelector(divid);

  div.style.color = '#a5a5a5';
}

function showInput(divid, label) {
  const div = document.querySelector(divid);
  const show = div.querySelector(`${divid}-show`);
  const formDiv = div.querySelector(`${divid}-form`);
  const form = formDiv.querySelector('form');
  const input = form.querySelector('input');
  input.focus();
  show.classList.add('hide');
  formDiv.classList.remove('hide');
  darkLabel(label);


}


document.addEventListener('turbolinks:load', function() {
  FontAwesome.dom.i2svg();
});

document.addEventListener('turbolinks:load', function() {
  document.documentElement.style.setProperty('--bom-dropdown-item-height', '0px');
  document.documentElement.style.setProperty('--pm-dropdown-item-height', '0px');
  document.documentElement.style.setProperty('--metrics-dropdown-item-height', '0px');
  document.documentElement.style.setProperty('--client-dropdown-item-height', '0px');
});
