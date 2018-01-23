class CreateInstruments < ActiveRecord::Migration[5.1]
  def change
    create_table :instruments do |t|
      t.string :type_code
      t.string :loop
      t.string :zeton_skid_number
      t.string :zeton_skid_level
      t.string :scope
      t.string :mech_elec
      t.string :supplier
      t.string :manufacturer
      t.string :model
      t.string :process_connection
      t.string :material_of_construction
      t.integer :item_type
      t.integer :location
      t.string :dcs_io_type
      t.string :range
      t.string :zeton_po
      t.string :tracking_number
      t.string :receiving_info

      t.timestamps
    end
  end
end
