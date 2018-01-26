class AddDefaultValuesToInstruments < ActiveRecord::Migration[5.1]
  def change
    change_column :instruments, :datasheet_submitted_for_approval, :integer, :default => 0
    change_column :instruments, :datasheet_approved, :integer, :default => 0
    change_column :instruments, :rfq_sent, :integer, :default => 0
    change_column :instruments, :po_placed, :integer, :default => 0
    change_column :instruments, :item_received, :integer, :default => 0
    change_column :instruments, :item_inspected_and_released, :integer, :default => 0
    change_column :instruments, :mounted_by_mechanical, :integer, :default => 0
    change_column :instruments, :plumbed_by_mechanical, :integer, :default => 0
    change_column :instruments, :cable_pulled, :integer, :default => 0
    change_column :instruments, :cable_terminated_at_source, :integer, :default => 0
    change_column :instruments, :cable_terminated_at_destination, :integer, :default => 0
    change_column :instruments, :continuity_tested, :integer, :default => 0
    change_column :instruments, :grounded_by_electrical, :integer, :default => 0
    change_column :instruments, :checked_by_eng, :integer, :default => 0
  end
end
