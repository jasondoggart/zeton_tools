$(document).ready(function() {
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
});
