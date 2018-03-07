class ChangeClientDocumentToForeignKeyInInformationRqeuests < ActiveRecord::Migration[5.1]
  def change
    remove_column :information_requests, :client_document_number, :string
    remove_column :information_requests, :client_document_title, :string
    remove_column :information_requests, :client_document_revision, :string
    remove_column :information_requests, :client_document_section, :string
    add_reference :information_requests, :client_document, foreign_key: true
  end
end
