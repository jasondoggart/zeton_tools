require "rails_helper"
require "support/features/clearance_helpers"

describe "Project" do
  it 'shows all team members on the project dashboard' do
    project = FactoryBot.create(:project)
    user = FactoryBot.create(:user)
    user2 = FactoryBot.create(:user)
    team_member = TeamMember.create(project: project, user: user)
    team_member2 = TeamMember.create(project: project, user: user2)
    visit project_path(project)
    expect(page).to have_content(user.full_name)
    expect(page).to have_content(user2.full_name)
  end

  it 'can be created' do
    before_count = Project.count
    user = User.create(first_name: "test", last_name: "user", email: 'test@test.com', password: "password")
    sign_in_with('test@test.com', "password")
    click_link('create_project')
    expect(current_path).to eq(new_project_path)
    fill_in('Project number', with: "145-45")
    fill_in('Project name', with: "A project")
    select(user.email, from: 'project_user_id')
    click_on('Add')
    expect(current_path).to eq(root_path)
    expect(Project.count).to eq(before_count + 1)
  end

  it 'can be updated' do
    user = User.create(first_name: "test", last_name: "user", email: 'test@test.com', password: "password")
    project = FactoryBot.create(:project, user: user)
    sign_in_with('test@test.com', 'password')
    visit project_path(project)
    click_link("update_project_#{project.id}")
    expect(current_path).to eq(edit_project_path(project))
    fill_in("Project number", with: "999-99")
    click_on('Update')
    expect(current_path).to eq(project_path(project))
    expect(project.reload.project_number).to eq("999-99")
  end
end
