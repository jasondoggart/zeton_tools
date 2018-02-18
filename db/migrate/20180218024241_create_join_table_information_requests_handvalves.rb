class CreateJoinTableInformationRequestsHandvalves < ActiveRecord::Migration[5.1]
  def change
    create_join_table :handvalves, :information_requests do |t|
      # t.index [:handvalve_id, :information_request_id]
      # t.index [:information_request_id, :handvalve_id]
    end
  end
end
