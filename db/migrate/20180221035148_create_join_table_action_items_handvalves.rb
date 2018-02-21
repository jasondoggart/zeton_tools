class CreateJoinTableActionItemsHandvalves < ActiveRecord::Migration[5.1]
  def change
    create_join_table :action_items, :handvalves do |t|
      # t.index [:action_item_id, :handvalve_id]
      # t.index [:handvalve_id, :action_item_id]
    end
  end
end
