require "rails_helper"
require "support/features/clearance_helpers"

describe "Project" do
  it 'shows all team members on the project dashboard' do
    user = FactoryBot.create(:user)
    project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: user)
    sign_in_with(user.email, user.password)
    visit root_path
    click_link("project_#{project.id}")
    user1 = FactoryBot.create(:user)
    user2 = FactoryBot.create(:user)
    team_member = TeamMember.create(project: project, user: user1)
    team_member2 = TeamMember.create(project: project, user: user2)
    visit project_path(project)
    expect(page).to have_content(user1.full_name)
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
    fill_in('Client', with: "A client")
    select(user.email, from: 'project_user_id')
    click_on('Add')
    expect(current_path).to eq(root_path)
    expect(Project.count).to eq(before_count + 1)
  end

  it 'can be updated' do
    user = User.create(first_name: "test", last_name: "user", email: 'test@test.com', password: "password")
    project = FactoryBot.create(:project, user: user)
    sign_in_with('test@test.com', 'password')
    visit root_path
    click_link("project_#{project.id}")
    visit project_path(project)
    click_link("update_project_#{project.id}")
    expect(current_path).to eq(edit_project_path(project))
    fill_in("Project number", with: "999-99")
    click_on('Update')
    expect(current_path).to eq(project_path(project))
    expect(project.reload.project_number).to eq("999-99")
  end

  it 'has a project metrics view' do
    user = User.create(first_name: "test", last_name: "user", email: 'test@test.com', password: "password")
    project = FactoryBot.create(:project, user: user)
    sign_in_with('test@test.com', 'password')
    visit root_path
    click_link("project_#{project.id}")
    visit project_metrics_path
  end

  it 'redirects away from project show page if user is not signed in' do
    project = FactoryBot.create(:project)
    visit project_path(project)
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project metrics page if user is not signed in' do
    project = FactoryBot.create(:project)
    visit project_metrics_path(project)
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_instruments if user is not signed in' do
    visit project_instruments_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_instruments_excel if user is not signed in' do
    visit project_instruments_excel_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_instruments_metrics if user is not signed in' do
    visit project_instruments_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_equipment if user is not signed in' do
    visit project_equipment_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_equipment_metrics if user is not signed in' do
    visit project_equipment_metrics_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_equipment_excel if user is not signed in' do
    visit project_equipment_excel_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_rfis if user is not signed in' do
    visit project_rfis_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_handvalves if user is not signed in' do
    visit project_handvalves_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_handvalves_metrics if user is not signed in' do
    visit project_handvalves_metrics_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from project_handvalves_excel if user is not signed in' do
    visit project_handvalves_excel_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from new_project if user is not signed in' do
    visit new_project_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects away from edit_project if user is not signed in' do
    project = FactoryBot.create(:project)
    visit edit_project_path(project)
    expect(current_path).to eq(sign_in_path)
  end

end

describe 'Project Session' do
  before do
    @user = FactoryBot.create(:user)
    sign_in_with(@user.email, @user.password)
    @project1 = FactoryBot.create(:project, user: @user)
    @project2 = FactoryBot.create(:project, user: @user)
  end

  it 'redirects project_instruments to root if no current project' do
    visit project_instruments_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_instruments_metrics to root if no current project' do
    visit project_instruments_metrics_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_instruments_excel to root if no current project' do
    visit project_instruments_excel_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_equipment to root if no current project' do
    visit project_equipment_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_equipment_metrics to root if no current project' do
    visit project_equipment_metrics_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_equipment_excel to root if no current project' do
    visit project_equipment_excel_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_rfis to root if no current project' do
    visit project_rfis_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_action_items to root if no current project' do
    visit project_action_items_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_metrics_summary to root if no current project' do
    visit project_metrics_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_handvalves to root if no current project' do
    visit project_handvalves_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_handvalves_metrics to root if no current project' do
    visit project_handvalves_metrics_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects project_handvalves_excel to root if no current project' do
    visit project_handvalves_excel_path
    expect(current_path).to eq(root_path)
  end

  it 'updates current project if project_path for different project' do
    visit root_path
    click_link("project_#{@project1.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project1.id)
    visit project_path(@project2)
    expect(page.get_rack_session_key('project_id')).to eq(@project2.id)
  end

  it 'updates current project if edit_project_path for different project' do
    visit root_path
    click_link("project_#{@project1.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project1.id)
    visit edit_project_path(@project2)
    expect(page.get_rack_session_key('project_id')).to eq(@project2.id)
  end

end
