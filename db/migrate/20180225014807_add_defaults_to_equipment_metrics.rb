class AddDefaultsToEquipmentMetrics < ActiveRecord::Migration[5.1]
  def change
    change_column :equipment, :datasheet_complete, :integer, :default => 0
    change_column :equipment, :datasheet_released, :integer, :default => 0
    change_column :equipment, :rfq_sent, :integer, :default => 0
    change_column :equipment, :po_placed, :integer, :default => 0
    change_column :equipment, :drawing_for_approval_received,
      :integer, :default => 0
    change_column :equipment, :drawing_for_approval_marked_up,
      :integer, :default => 0
    change_column :equipment, :drawing_for_approval_sent_to_client,
      :integer, :default => 0
    change_column :equipment,
      :drawing_for_approval_released_for_construction, :integer, :default => 0
    change_column :equipment, :item_received_at_zeton, :integer, :default => 0
    change_column :equipment,
      :item_inspected_and_released, :integer, :default => 0
    change_column :equipment, :item_installed_by_mech, :integer, :default => 0
    change_column :equipment, :item_grounded_by_elec, :integer, :default => 0
    change_column :equipment, :item_inspected_by_eng, :integer, :default => 0
  end
end
