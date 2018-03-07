class CreateClientDocuments < ActiveRecord::Migration[5.1]
  def change
    create_table :client_documents do |t|
      t.string :document_name
      t.string :document_number
      t.string :document_revision
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
