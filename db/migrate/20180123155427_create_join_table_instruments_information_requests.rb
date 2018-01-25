class CreateJoinTableInstrumentsInformationRequests < ActiveRecord::Migration[5.1]
  def change
    create_join_table :instruments, :information_requests do |t|
    end
  end
end
