FactoryBot.define do
  factory :equipment do
    tag "V-101"
    description "Feed vessel"
    equipment_type "Vessel"
    scope "Zeton"
    supplier "Fab shop"
    manufacturer "Fab shop"
    model_number "1234"
    zeton_po "18.000001"
    datasheet_complete 0
    datasheet_released 0
    rfq_sent 0
    po_placed 0
    drawing_for_approval_received 0
    drawing_for_approval_marked_up 0
    drawing_for_approval_sent_to_client 0
    drawing_for_approval_released_for_construction 0
    item_received_at_zeton 0
    item_inspected_and_released 0
    item_installed_by_mech 0
    item_grounded_by_elec 0
    item_inspected_by_eng 0
    project
  end
end
