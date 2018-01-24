class CreateJoinTableEquipmentInformationRequests < ActiveRecord::Migration[5.1]
  def change
    create_join_table :equipment, :information_requests do |t|
      # t.index [:equipment_id, :information_request_id]
      # t.index [:information_request_id, :equipment_id]
    end
  end
end
