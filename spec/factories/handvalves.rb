FactoryBot.define do
  factory :handvalve do
    tag "HV-1001"
    valve_code "T1L"
    valve_type "Ball"
    size "3/4 in."
    line_number "1001"
    zeton_skid_number "A"
    zeton_skid_level "1"
    scope "Zeton"
    supplier "Swagelok"
    manufacturer "Swagelok"
    model "SS-42GS4"
    process_connection "3/4 in. Tubing"
    material_of_construction "316 SS"
    valve_counting_code "VTUBE"
    valve_location "LTUBE"
    zeton_po "18.12345"
    project
  end
end
