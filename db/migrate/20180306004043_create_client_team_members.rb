class CreateClientTeamMembers < ActiveRecord::Migration[5.1]
  def change
    create_table :client_team_members do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :organization
      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
