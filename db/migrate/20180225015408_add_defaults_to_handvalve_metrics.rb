class AddDefaultsToHandvalveMetrics < ActiveRecord::Migration[5.1]
  def change
    change_column :handvalves, :valve_description_complete,
      :integer, :default => 0
    change_column :handvalves, :valve_description_approved,
      :integer, :default => 0
    change_column :handvalves, :po_placed,
      :integer, :default => 0
    change_column :handvalves, :item_received,
      :integer, :default => 0
    change_column :handvalves, :item_inspected_and_released,
      :integer, :default => 0
    change_column :handvalves, :item_mounted,
      :integer, :default => 0
    change_column :handvalves, :item_plumbed,
      :integer, :default => 0
    change_column :handvalves, :item_checked_by_eng,
      :integer, :default => 0
  end
end
