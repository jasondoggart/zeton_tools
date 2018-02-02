class CreateDocuments < ActiveRecord::Migration[5.1]
  def change
    create_table :documents do |t|
      t.string :name
      t.string :phase
      t.string :timing
      t.string :file_location
      t.string :type
      t.string :revision_name
      t.string :revision_type
      t.string :revision_frequency

      t.timestamps
    end
  end
end
