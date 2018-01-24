class CreateRfiResponses < ActiveRecord::Migration[5.1]
  def change
    create_table :rfi_responses do |t|
      t.text :response
      t.references :information_request, foreign_key: true
      t.string :organization
      t.string :responder

      t.timestamps
    end
  end
end
