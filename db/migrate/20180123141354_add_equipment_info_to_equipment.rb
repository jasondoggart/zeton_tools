class AddEquipmentInfoToEquipment < ActiveRecord::Migration[5.1]
  def change
    add_column :equipment, :tag, :string
    add_column :equipment, :description, :string
    add_column :equipment, :equipment_type, :string
    add_column :equipment, :scope, :string
    add_column :equipment, :supplier, :string
    add_column :equipment, :manufacturer, :string
    add_column :equipment, :model_number, :string
    add_column :equipment, :zeton_po, :string
    add_column :equipment, :tracking_number, :string
    add_column :equipment, :receiving_info, :string
  end
end
