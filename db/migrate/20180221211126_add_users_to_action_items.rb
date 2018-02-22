class AddUsersToActionItems < ActiveRecord::Migration[5.1]
  def change
    add_column :action_items, :creator_id, :integer
    add_column :action_items, :assigned_to_id, :integer
  end
end
