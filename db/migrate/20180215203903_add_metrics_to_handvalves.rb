class AddMetricsToHandvalves < ActiveRecord::Migration[5.1]
  def change
    add_column :handvalves, :valve_description_complete, :integer
    add_column :handvalves, :valve_description_approved, :integer
    add_column :handvalves, :po_placed, :integer
    add_column :handvalves, :item_received, :integer
    add_column :handvalves, :item_inspected_and_released, :integer
    add_column :handvalves, :item_mounted, :integer
    add_column :handvalves, :item_plumbed, :integer
    add_column :handvalves, :item_checked_by_eng, :integer
  end
end
