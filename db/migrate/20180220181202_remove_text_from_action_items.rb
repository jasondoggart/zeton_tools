class RemoveTextFromActionItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :action_items, :text, :string
  end
end
