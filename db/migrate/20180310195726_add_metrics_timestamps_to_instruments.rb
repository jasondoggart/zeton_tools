class AddMetricsTimestampsToInstruments < ActiveRecord::Migration[5.1]
  def change
    add_column :instruments, :datasheet_submitted_for_approval_completed_at, :datetime
    add_column :instruments, :datasheet_approved_completed_at, :datetime
    add_column :instruments, :rfq_sent_completed_at, :datetime
    add_column :instruments, :po_placed_completed_at, :datetime
    add_column :instruments, :item_received_completed_at, :datetime
    add_column :instruments, :item_inspected_and_released_completed_at, :datetime
    add_column :instruments, :mounted_by_mechanical_completed_at, :datetime
    add_column :instruments, :plumbed_by_mechanical_completed_at, :datetime
    add_column :instruments, :cable_pulled_completed_at, :datetime
    add_column :instruments, :cable_terminated_at_source_completed_at, :datetime
    add_column :instruments, :cable_terminated_at_destination_completed_at, :datetime
    add_column :instruments, :continuity_tested_completed_at, :datetime
    add_column :instruments, :grounded_by_electrical_completed_at, :datetime
    add_column :instruments, :checked_by_eng_completed_at, :datetime
  end
end
