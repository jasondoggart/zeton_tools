class AddProjectToInstruments < ActiveRecord::Migration[5.1]
  def change
    add_reference :instruments, :project, foreign_key: true
  end
end
