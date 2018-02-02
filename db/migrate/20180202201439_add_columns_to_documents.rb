class AddColumnsToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :prepared_by_role, :string
    add_column :documents, :delivered_to_role, :string
  end
end
