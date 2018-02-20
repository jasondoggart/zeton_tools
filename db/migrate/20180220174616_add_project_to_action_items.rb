class AddProjectToActionItems < ActiveRecord::Migration[5.1]
  def change
    add_reference :action_items, :project, foreign_key: true
  end
end
