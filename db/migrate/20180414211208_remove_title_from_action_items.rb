class RemoveTitleFromActionItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :action_items, :title, :string
  end
end
