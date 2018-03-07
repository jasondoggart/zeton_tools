class AddClientTeamMemberToInformationRequests < ActiveRecord::Migration[5.1]
  def change
    add_reference :information_requests, :client_team_member, foreign_key: true
  end
end
