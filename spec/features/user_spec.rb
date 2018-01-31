require "rails_helper"
require "support/features/clearance_helpers"

describe 'User' do
  it 'can see projects that they manage or are part of when they log in' do
    user = FactoryBot.create(:user)
    project1 = Project.create(project_number: '999-99', project_name: 'a project', user: user)
    project2 = FactoryBot.create(:project)
    team_member = TeamMember.create(user: user, project: project2)
    sign_in_with(user.email, user.password)
    visit root_path
    expect(page).to have_content(project1.project_number)
    expect(page).to have_content(project2.project_number)
    expect(page).to have_content("Project Manager")
    expect(page).to have_content("Team Member")
  end

end
