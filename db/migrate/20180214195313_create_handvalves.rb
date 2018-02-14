class CreateHandvalves < ActiveRecord::Migration[5.1]
  def change
    create_table :handvalves do |t|
      t.string :tag
      t.string :valve_code
      t.string :valve_type
      t.string :size
      t.string :line_number
      t.string :zeton_skid_number
      t.string :zeton_skid_level
      t.string :scope
      t.string :supplier
      t.string :manufacturer
      t.string :model
      t.string :process_connection
      t.string :material_of_construction
      t.string :valve_counting_code
      t.string :valve_location
      t.string :zeton_po

      t.timestamps
    end
  end
end
