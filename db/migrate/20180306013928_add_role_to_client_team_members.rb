class AddRoleToClientTeamMembers < ActiveRecord::Migration[5.1]
  def change
    add_column :client_team_members, :role, :string
  end
end
