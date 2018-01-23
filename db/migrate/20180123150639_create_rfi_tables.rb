class CreateRfiTables < ActiveRecord::Migration[5.1]
  def change
    create_table :rfi_tables do |t|
      t.string :client_document_number
      t.string :client_document_title
      t.string :client_document_revision
      t.string :client_document_section
      t.string :zeton_clarification
      t.integer :answered

      t.timestamps
    end
  end
end
