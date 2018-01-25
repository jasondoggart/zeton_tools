class AddProjectToInformationRequests < ActiveRecord::Migration[5.1]
  def change
    add_reference :information_requests, :project, foreign_key: true
  end
end
