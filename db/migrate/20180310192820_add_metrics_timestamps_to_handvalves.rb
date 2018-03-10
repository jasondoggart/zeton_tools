class AddMetricsTimestampsToHandvalves < ActiveRecord::Migration[5.1]
  def change
    add_column :handvalves, :valve_description_complete_completed_at, :datetime
    add_column :handvalves, :valve_description_approved_completed_at, :datetime
    add_column :handvalves, :po_placed_completed_at, :datetime
    add_column :handvalves, :item_received_completed_at, :datetime
    add_column :handvalves, :item_inspected_and_released_completed_at, :datetime
    add_column :handvalves, :item_mounted_completed_at, :datetime
    add_column :handvalves, :item_plumbed_completed_at, :datetime
    add_column :handvalves, :item_checked_by_eng_completed_at, :datetime
  end
end
