class DropRfiTable < ActiveRecord::Migration[5.1]
  def change
    drop_table :rfi_tables
  end
end
