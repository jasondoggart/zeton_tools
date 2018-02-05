require "rails_helper"
require "support/features/clearance_helpers"

describe 'Team Members' do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
    @user1 = FactoryBot.create(:user)
    @user2 = FactoryBot.create(:user)
    @user3 = FactoryBot.create(:user)
  end

  it 'can be created from the project dashboard' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_path(@project)
    before_count = @project.team_members.count
    click_link('add_team_member')
    expect(current_path).to eq(new_team_member_path)
    select @user1.email, from: 'team_member_user_id'
    click_on('Add')
    expect(current_path).to eq(project_path(@project))
    expect(@project.team_members.count).to eq(before_count + 1)
    click_link('add_team_member')
    expect(current_path).to eq(new_team_member_path)
    select @user2.email, from: 'team_member_user_id'
    click_on('Add')
    expect(current_path).to eq(project_path(@project))
    expect(@project.team_members.count).to eq(before_count + 2)
  end

  it 'can be removed from the project dashboard' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    team_member = TeamMember.create(user: @user1, project: @project)
    visit project_path(@project)
    before_count = @project.team_members.count
    click_link("remove_team_member_#{team_member.id}")
    expect(current_path).to eq(project_path(@project))
    expect(@project.team_members.count).to eq(before_count - 1)
  end
end
