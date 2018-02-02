class AddUserColumnsToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_reference :documents, :prepared_by, foreign_key: true
    add_reference :documents, :delivered_to, foreign_key: true
  end
end
