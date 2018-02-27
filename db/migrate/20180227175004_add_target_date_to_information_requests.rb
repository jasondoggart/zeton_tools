class AddTargetDateToInformationRequests < ActiveRecord::Migration[5.1]
  def change
    add_column :information_requests, :target_date, :datetime
  end
end
