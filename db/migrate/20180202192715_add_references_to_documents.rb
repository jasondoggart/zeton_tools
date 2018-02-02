class AddReferencesToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :documents, :users, column: :prepared_by, primary_key: :id
    add_foreign_key :documents, :users, column: :delivered_to, primary_key: :id
  end
end
