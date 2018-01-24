FactoryBot.define do
  factory :instrument do
    type_code "FT"
    loop "1001"
    zeton_skid_number "A"
    zeton_skid_level "1"
    scope "Zeton"
    mech_elec "M/E"
    supplier "Good supplier"
    manufacturer "Good manufacturer"
    model "12341234"
    process_connection "1/2\" FNPT"
    material_of_construction "316 SS"
    item_type 0
    location 0
    dcs_io_type "AI"
    range "0 - 10 kg/hr"
    zeton_po "18.000001"
    project
  end
end
