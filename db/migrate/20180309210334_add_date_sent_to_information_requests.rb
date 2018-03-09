class AddDateSentToInformationRequests < ActiveRecord::Migration[5.1]
  def change
    add_column :information_requests, :date_sent, :datetime
  end
end
