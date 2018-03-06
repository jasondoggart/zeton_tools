require "rails_helper"
require "support/features/clearance_helpers"

describe "Client Team Member" do
  before do
    @user = FactoryBot.create(:user)
    @project = FactoryBot.create(:project, user: @user)
    sign_in_with @user.email, @user.password
  end

  it 'can be created from the project show page' do
    before_count = @project.client_team_members.count
    visit root_path
    click_link("project_#{@project.id}")
    click_link("add_client_team_member")
    fill_in("First name", with: "Super")
    fill_in("Last name", with: "Client")
    fill_in("Email", with: "super.client@example.com")
    fill_in("Organization", with: "Client Org")
    click_on("Add Client Team Member")
    expect(current_path).to eq(project_path(@project))
    expect(ClientTeamMember.last.first_name).to eq("Super")
    expect(ClientTeamMember.last.last_name).to eq("Client")
    expect(ClientTeamMember.last.email).to eq("super.client@example.com")
    expect(ClientTeamMember.last.organization).to eq("Client Org")
    expect(@project.reload.client_team_members.count).to eq(before_count + 1)
  end

  it 'can be removed from the project show page' do
    client_team_member = FactoryBot.create(
      :client_team_member, project: @project
    )
    before_count = @project.client_team_members.count
    visit root_path
    click_link("project_#{@project.id}")
    click_link("remove_client_team_member_#{client_team_member.id}")
    expect(current_path).to eq(project_path(@project))
    expect(@project.reload.client_team_members.count).to eq(before_count - 1)
  end
end
