class CreateJoinTableActionItemsInstruments < ActiveRecord::Migration[5.1]
  def change
    create_join_table :action_items, :instruments do |t|
      # t.index [:action_item_id, :instrument_id]
      # t.index [:instrument_id, :action_item_id]
    end
  end
end
