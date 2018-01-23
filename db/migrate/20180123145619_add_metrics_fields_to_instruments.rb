class AddMetricsFieldsToInstruments < ActiveRecord::Migration[5.1]
  def change
    add_column :instruments, :datasheet_submitted_for_approval, :integer
    add_column :instruments, :datasheet_approved, :integer
    add_column :instruments, :rfq_sent, :integer
    add_column :instruments, :po_placed, :integer
    add_column :instruments, :item_received, :integer
    add_column :instruments, :item_inspected_and_released, :integer
    add_column :instruments, :mounted_by_mechanical, :integer
    add_column :instruments, :plumbed_by_mechanical, :integer
    add_column :instruments, :cable_pulled, :integer
    add_column :instruments, :cable_terminated_at_source, :integer
    add_column :instruments, :cable_terminated_at_destination, :integer
    add_column :instruments, :continuity_tested, :integer
    add_column :instruments, :grounded_by_electrical, :integer
    add_column :instruments, :checked_by_eng, :integer
  end
end
