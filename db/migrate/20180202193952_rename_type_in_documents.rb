class RenameTypeInDocuments < ActiveRecord::Migration[5.1]
  def change
    rename_column :documents, :type, :document_type
  end
end
