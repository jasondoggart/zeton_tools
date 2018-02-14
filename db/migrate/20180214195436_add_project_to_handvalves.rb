class AddProjectToHandvalves < ActiveRecord::Migration[5.1]
  def change
    add_reference :handvalves, :project, foreign_key: true
  end
end
