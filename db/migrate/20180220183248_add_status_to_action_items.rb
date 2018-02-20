class AddStatusToActionItems < ActiveRecord::Migration[5.1]
  def change
    add_column :action_items, :status, :integer, default: 0
  end
end
