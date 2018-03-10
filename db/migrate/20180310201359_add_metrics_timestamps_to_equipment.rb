class AddMetricsTimestampsToEquipment < ActiveRecord::Migration[5.1]
  def change
    add_column :equipment, :datasheet_complete_completed_at, :datetime
    add_column :equipment, :datasheet_released_completed_at, :datetime
    add_column :equipment, :rfq_sent_completed_at, :datetime
    add_column :equipment, :po_placed_completed_at, :datetime
    add_column :equipment, :drawing_for_approval_received_completed_at, :datetime
    add_column :equipment, :drawing_for_approval_marked_up_completed_at, :datetime
    add_column :equipment, :drawing_for_approval_sent_to_client_completed_at, :datetime
    add_column :equipment, :drawing_for_approval_released_for_construction_completed_at, :datetime
    add_column :equipment, :item_received_at_zeton_completed_at, :datetime
    add_column :equipment, :item_inspected_and_released_completed_at, :datetime
    add_column :equipment, :item_installed_by_mech_completed_at, :datetime
    add_column :equipment, :item_grounded_by_elec_completed_at, :datetime
    add_column :equipment, :item_inspected_by_eng_completed_at, :datetime
  end
end
