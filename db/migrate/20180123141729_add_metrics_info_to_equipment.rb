class AddMetricsInfoToEquipment < ActiveRecord::Migration[5.1]
  def change
    add_column :equipment, :datasheet_complete, :integer
    add_column :equipment, :datasheet_released, :integer
    add_column :equipment, :rfq_sent, :integer
    add_column :equipment, :po_placed, :integer
    add_column :equipment, :drawing_for_approval_received, :integer
    add_column :equipment, :drawing_for_approval_marked_up, :integer
    add_column :equipment, :drawing_for_approval_sent_to_client, :integer
    add_column :equipment, :drawing_for_approval_released_for_construction, :integer
    add_column :equipment, :item_received_at_zeton, :integer
    add_column :equipment, :item_inspected_and_released, :integer
    add_column :equipment, :item_installed_by_mech, :integer
    add_column :equipment, :item_grounded_by_elec, :integer
    add_column :equipment, :item_inspected_by_eng, :integer
  end
end
