class ChangeItemTypeAndLocationFromIntegerToStringInInstruments < ActiveRecord::Migration[5.1]
  def change
    change_column :instruments, :item_type, :string
    change_column :instruments, :location, :string
  end
end
