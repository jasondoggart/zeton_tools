class CreateJoinTableInstrumentsInformationRequests < ActiveRecord::Migration[5.1]
  def change
    create_join_table :instruments, :information_requests do |t|
      # t.index [:instrument_id, :information_request_id]
      # t.index [:information_request_id, :instrument_id]
    end
  end
end
