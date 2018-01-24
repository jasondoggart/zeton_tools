class AddProjectsToEquipment < ActiveRecord::Migration[5.1]
  def change
    add_reference :equipment, :project, foreign_key: true
  end
end
