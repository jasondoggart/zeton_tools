module MetricsHelper

  # Instrument metrics
  def total_instrument_count
    current_project.instruments.count
  end
  def total_count_for(project, record)
    record.where(project: project).count
  end

  def in_zeton_scope_for(project, record)
    record.where(scope: "Zeton", project: project).count
  end

  def metrics_percent_for(item, total)
    item.to_f/total.to_f * 100
  end

  def datasheet_submitted_for_approval_required
    not_required = current_project.instruments.where(datasheet_submitted_for_approval: 2).count
    return total_instrument_count - not_required
  end

  def datasheet_submitted_for_approval_complete
    current_project.instruments.where(datasheet_submitted_for_approval: 1).count
  end

  def datasheet_submitted_for_approval_percent
    datasheet_submitted_for_approval_complete.to_f/datasheet_submitted_for_approval_required.to_f * 100
  end

  def datasheet_approved_required
    not_required = current_project.instruments.where(datasheet_approved: 2).count
    return total_instrument_count - not_required
  end

  def datasheet_approved_complete
    current_project.instruments.where(datasheet_approved: 1).count
  end
  
  def datasheet_approved_percent
    datasheet_approved_complete.to_f/datasheet_approved_required.to_f * 100
  end

  def rfq_sent_required
    not_required = current_project.instruments.where(rfq_sent: 2).count
    return total_instrument_count - not_required
  end

  def rfq_sent_complete
    current_project.instruments.where(rfq_sent: 1).count
  end

  def rfq_sent_percent
    rfq_sent_complete.to_f/rfq_sent_required.to_f * 100
  end

  def po_placed_required
    not_required = current_project.instruments.where(po_placed: 2).count
    return total_instrument_count - not_required
  end

  def po_placed_complete
    current_project.instruments.where(po_placed: 1).count
  end

  def po_placed_percent
    po_placed_complete.to_f/po_placed_required.to_f * 100
  end

  def item_received_required
    not_required = current_project.instruments.where(item_received: 2).count
    return total_instrument_count - not_required
  end

  def item_received_complete
    current_project.instruments.where(item_received: 1).count
  end

  def item_received_percent
    item_received_complete.to_f/item_received_required.to_f * 100
  end

  def item_inspected_and_released_required
    not_required = current_project.instruments.where(item_inspected_and_released: 2).count
    return total_instrument_count - not_required
  end

  def item_inspected_and_released_complete
    current_project.instruments.where(item_inspected_and_released: 1).count
  end

  def item_inspected_and_released_percent
    item_inspected_and_released_complete.to_f/item_inspected_and_released_required.to_f * 100
  end

  def mounted_by_mechanical_required
    not_required = current_project.instruments.where(mounted_by_mechanical: 2).count
    return total_instrument_count - not_required
  end

  def mounted_by_mechanical_complete
    current_project.instruments.where(mounted_by_mechanical: 1).count
  end

  def mounted_by_mechanical_percent
    mounted_by_mechanical_complete.to_f/mounted_by_mechanical_required.to_f * 100
  end

  def plumbed_by_mechanical_required
    not_required = current_project.instruments.where(plumbed_by_mechanical: 2).count
    return total_instrument_count - not_required
  end

  def plumbed_by_mechanical_complete
    current_project.instruments.where(plumbed_by_mechanical: 1).count
  end

  def plumbed_by_mechanical_percent
    plumbed_by_mechanical_complete.to_f/plumbed_by_mechanical_required.to_f * 100
  end

  def cable_pulled_required
    not_required = current_project.instruments.where(cable_pulled: 2).count
    return total_instrument_count - not_required
  end

  def cable_pulled_complete
    current_project.instruments.where(cable_pulled: 1).count
  end

  def cable_pulled_percent
    cable_pulled_complete.to_f/cable_pulled_required.to_f * 100
  end

  def cable_terminated_at_source_required
    not_required = current_project.instruments.where(cable_terminated_at_source: 2).count
    return total_instrument_count - not_required
  end

  def cable_terminated_at_source_complete
    current_project.instruments.where(cable_terminated_at_source: 1).count
  end

  def cable_terminated_at_source_percent
    cable_terminated_at_source_complete.to_f/cable_terminated_at_source_required.to_f * 100
  end

  def cable_terminated_at_destination_required
    not_required = current_project.instruments.where(cable_terminated_at_destination: 2).count
    return total_instrument_count - not_required
  end

  def cable_terminated_at_destination_complete
    current_project.instruments.where(cable_terminated_at_destination: 1).count
  end

  def cable_terminated_at_destination_percent
    cable_terminated_at_destination_complete.to_f/cable_terminated_at_destination_required.to_f * 100
  end

  def continuity_tested_required
    not_required = current_project.instruments.where(continuity_tested: 2).count
    return total_instrument_count - not_required
  end

  def continuity_tested_complete
    current_project.instruments.where(continuity_tested: 1).count
  end

  def continuity_tested_percent
    continuity_tested_complete.to_f/continuity_tested_required.to_f * 100
  end

  def grounded_by_electrical_required
    not_required = current_project.instruments.where(grounded_by_electrical: 2).count
    return total_instrument_count - not_required
  end

  def grounded_by_electrical_complete
    current_project.instruments.where(grounded_by_electrical: 1).count
  end

  def grounded_by_electrical_percent
    grounded_by_electrical_complete.to_f/grounded_by_electrical_required.to_f * 100
  end

  def checked_by_eng_required
    not_required = current_project.instruments.where(checked_by_eng: 2).count
    return total_instrument_count - not_required
  end

  def checked_by_eng_complete
    current_project.instruments.where(checked_by_eng: 1).count
  end

  def checked_by_eng_percent
    checked_by_eng_complete.to_f/checked_by_eng_required.to_f * 100
  end

  # Equipment Metrics
  def equipment_in_zeton_scope
    current_project.equipment.where(scope: "Zeton").count
  end

  def total_equipment_count
    current_project.equipment.count
  end

  def equipment_in_zeton_scope_percent
    equipment_in_zeton_scope.to_f/total_equipment_count.to_f * 100
  end

  def equipment_datasheet_complete_required
    not_required = current_project.equipment.where(datasheet_complete: 2).count
    return total_equipment_count - not_required
  end

  def equipment_datasheet_complete_complete
    current_project.equipment.where(datasheet_complete: 1).count
  end

  def equipment_datasheet_complete_percent
    equipment_datasheet_complete_complete.to_f/equipment_datasheet_complete_required.to_f * 100
  end

  def datasheet_released_required
    not_required = current_project.equipment.where(datasheet_released: 2).count
    return total_equipment_count - not_required
  end

  def datasheet_released_complete
    current_project.equipment.where(datasheet_released: 1).count
  end

  def datasheet_released_percent
    datasheet_released_complete.to_f/datasheet_released_required.to_f * 100
  end

  def equipment_rfq_sent_required
    not_required = current_project.equipment.where(rfq_sent: 2).count
    return total_equipment_count - not_required
  end

  def equipment_rfq_sent_complete
    current_project.equipment.where(rfq_sent: 1).count
  end

  def equipment_rfq_sent_percent
    rfq_sent_complete.to_f/rfq_sent_required.to_f * 100
  end

  def equipment_po_placed_required
    not_required = current_project.equipment.where(po_placed: 2).count
    return total_equipment_count - not_required
  end

  def equipment_po_placed_complete
    current_project.equipment.where(po_placed: 1).count
  end

  def equipment_po_placed_percent
    po_placed_complete.to_f/po_placed_required.to_f * 100
  end

  def drawing_for_approval_received_required
    not_required = current_project.equipment.where(drawing_for_approval_received: 2).count
    return total_equipment_count - not_required
  end

  def drawing_for_approval_received_complete
    current_project.equipment.where(drawing_for_approval_received: 1).count
  end

  def drawing_for_approval_received_percent
    drawing_for_approval_received_complete.to_f/drawing_for_approval_received_required.to_f * 100
  end

  def drawing_for_approval_marked_up_required
    not_required = current_project.equipment.where(drawing_for_approval_marked_up: 2).count
    return total_equipment_count - not_required
  end

  def drawing_for_approval_marked_up_complete
    current_project.equipment.where(drawing_for_approval_marked_up: 1).count
  end

  def drawing_for_approval_marked_up_percent
    drawing_for_approval_marked_up_complete.to_f/drawing_for_approval_received_required.to_f * 100
  end

  def drawing_for_approval_sent_to_client_required
    not_required = current_project.equipment.where(drawing_for_approval_sent_to_client: 2).count
    return total_equipment_count - not_required
  end

  def drawing_for_approval_sent_to_client_complete
    current_project.equipment.where(drawing_for_approval_sent_to_client: 1).count
  end

  def drawing_for_approval_sent_to_client_percent
    drawing_for_approval_sent_to_client_complete.to_f/drawing_for_approval_sent_to_client_required.to_f * 100
  end

  def drawing_for_approval_released_required
    not_required = current_project.equipment.where(drawing_for_approval_released_for_construction: 2).count
    return total_equipment_count - not_required
  end

  def drawing_for_approval_released_complete
    current_project.equipment.where(drawing_for_approval_released_for_construction: 1).count
  end

  def drawing_for_approval_released_percent
    drawing_for_approval_released_complete.to_f/drawing_for_approval_released_required.to_f * 100
  end

  def item_received_at_zeton_required
    not_required = current_project.equipment.where(item_received_at_zeton: 2).count
    return total_equipment_count - not_required
  end

  def item_received_at_zeton_complete
    current_project.equipment.where(item_received_at_zeton: 1).count
  end

  def item_received_at_zeton_percent
    item_received_at_zeton_complete.to_f/item_received_at_zeton_required.to_f * 100
  end

  def equipment_item_inspected_and_released_required
    not_required = current_project.equipment.where(item_inspected_and_released: 2).count
    return total_equipment_count - not_required
  end

  def equipment_item_inspected_and_released_complete
    current_project.equipment.where(item_inspected_and_released: 1).count
  end

  def equipment_item_inspected_and_released_percent
    item_inspected_and_released_complete.to_f/item_inspected_and_released_required.to_f * 100
  end

  def item_installed_by_mech_required
    not_required = current_project.equipment.where(item_installed_by_mech: 2).count
    return total_equipment_count - not_required
  end

  def item_installed_by_mech_complete
    current_project.equipment.where(item_installed_by_mech: 1).count
  end

  def item_installed_by_mech_percent
    item_installed_by_mech_complete.to_f/item_installed_by_mech_required.to_f * 100
  end

  def item_grounded_by_elec_required
    not_required = current_project.equipment.where(item_grounded_by_elec: 2).count
    return total_equipment_count - not_required
  end

  def item_grounded_by_elec_complete
    current_project.equipment.where(item_grounded_by_elec: 1).count
  end

  def item_grounded_by_elec_percent
    item_grounded_by_elec_complete.to_f/item_grounded_by_elec_required.to_f * 100
  end

  def item_inspected_by_eng_required
    not_required = current_project.equipment.where(item_inspected_by_eng: 2).count
    return total_equipment_count - not_required
  end
  
  def item_inspected_by_eng_complete
    current_project.equipment.where(item_inspected_by_eng: 1).count
  end

  def item_inspected_by_eng_percent
    item_inspected_by_eng_complete.to_f/item_inspected_by_eng_required.to_f * 100
  end

  # Handvalve Metrics
  def handvalves_in_zeton_scope
    current_project.handvalves.where(scope: "Zeton").count
  end

  def total_handvalve_count
    current_project.handvalves.count
  end

  def handvalves_in_zeton_scope_percent
    handvalves_in_zeton_scope.to_f/total_handvalve_count.to_f * 100
  end

  def description_complete_required
    not_required = current_project.handvalves.where(valve_description_complete: 2).count
    return total_handvalve_count - not_required
  end

  def description_complete_complete
    current_project.handvalves.where(valve_description_complete: 1).count
  end

  def description_complete_percent
    description_complete_complete.to_f/description_complete_required.to_f * 100
  end
  def description_approved_required
    not_required = current_project.handvalves.where(valve_description_approved: 2).count
    return total_handvalve_count - not_required
  end

  def description_approved_complete
    current_project.handvalves.where(valve_description_approved: 1).count
  end

  def description_approved_percent
    description_approved_complete.to_f/description_approved_required.to_f * 100
  end
  def handvalve_po_placed_required
    not_required = current_project.handvalves.where(po_placed: 2).count
    return total_handvalve_count - not_required
  end

  def handvalve_po_placed_complete
    current_project.handvalves.where(po_placed: 1).count
  end

  def handvalve_po_placed_percent
    handvalve_po_placed_complete.to_f/handvalve_po_placed_required.to_f * 100
  end
  def handvalve_item_received_required
    not_required = current_project.handvalves.where(item_received: 2).count
    return total_handvalve_count - not_required
  end

  def handvalve_item_received_complete
    current_project.handvalves.where(item_received: 1).count
  end

  def handvalve_item_received_percent
    handvalve_item_received_complete.to_f/handvalve_item_received_required.to_f * 100
  end
  def handvalve_item_released_required
    not_required = current_project.handvalves.where(item_inspected_and_released: 2).count
    return total_handvalve_count - not_required
  end

  def handvalve_item_released_complete
    current_project.handvalves.where(item_inspected_and_released: 1).count
  end

  def handvalve_item_released_percent
    handvalve_item_released_complete.to_f/handvalve_item_released_required.to_f * 100
  end
  def handvalve_item_mounted_required
    not_required = current_project.handvalves.where(item_plumbed: 2).count
    return total_handvalve_count - not_required
  end

  def handvalve_item_mounted_complete
    current_project.handvalves.where(item_plumbed: 1).count
  end

  def handvalve_item_mounted_percent
    handvalve_item_mounted_complete.to_f/handvalve_item_mounted_required.to_f * 100
  end
  def handvalve_item_plumbed_required
    not_required = current_project.handvalves.where(item_plumbed: 2).count
    return total_handvalve_count - not_required
  end

  def handvalve_item_plumbed_complete
    current_project.handvalves.where(item_plumbed: 1).count
  end

  def handvalve_item_plumbed_percent
    handvalve_item_plumbed_complete.to_f/handvalve_item_plumbed_required.to_f * 100
  end
  def handvalve_checked_by_eng_required
    not_required = current_project.handvalves.where(item_checked_by_eng: 2).count
    return total_handvalve_count - not_required
  end

  def handvalve_checked_by_eng_complete
    current_project.handvalves.where(item_checked_by_eng: 1).count
  end

  def handvalve_checked_by_eng_percent
    handvalve_checked_by_eng_complete.to_f/handvalve_checked_by_eng_required.to_f * 100
  end
end
