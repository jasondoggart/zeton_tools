class AddReferencesToInformationRequests < ActiveRecord::Migration[5.1]
  def change
    add_reference :information_requests, :equipment, foreign_key: true
    add_reference :information_requests, :instrument, foreign_key: true
  end
end
