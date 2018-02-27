class AddAreaToInformationRequests < ActiveRecord::Migration[5.1]
  def change
    add_column :information_requests, :area, :string
  end
end
