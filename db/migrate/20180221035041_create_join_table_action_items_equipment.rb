class CreateJoinTableActionItemsEquipment < ActiveRecord::Migration[5.1]
  def change
    create_join_table :action_items, :equipment do |t|
      # t.index [:action_item_id, :equipment_id]
      # t.index [:equipment_id, :action_item_id]
    end
  end
end
