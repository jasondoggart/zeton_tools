require "rails_helper"
require "support/features/clearance_helpers"

describe 'Project Session' do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
  end

  it 'can be created when a user clicks on a project' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    expect(current_path).to eq(project_path(@project))
    expect(page.get_rack_session_key('project_id')).to eq(@project.id)
  end

  it 'is destroyed when the user goes to the root_path' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    expect(current_path).to eq(project_path(@project))
    expect(page.get_rack_session_key('project_id')).to eq(@project.id)
    visit root_path
    expect(page.get_rack_session).to_not include('project_id')
  end

  it 'changes current_project when a new project show page is visited' do
    another_user = FactoryBot.create(:user)
    another_project = FactoryBot.create(:project, user: another_user)
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project.id)
    visit project_path(another_project)
    expect(page.get_rack_session_key('project_id')).to eq(another_project.id)
  end

  it 'redirects to root path if a user tries to access the project_instruments_path without current_project being set' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    visit project_instruments_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects to root path if a user tries to access the project_instruments_metrics_path without current_project being set' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    visit project_instruments_metrics_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects to root path if a user tries to access the project_equipment_path without current_project being set' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    visit project_equipment_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects to root path if a user tries to access the project_equipment_metrics_path without current_project being set' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    visit project_equipment_metrics_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects to root path if a user tries to access the project_rfis_path without current_project being set' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    visit project_rfis_path
    expect(current_path).to eq(root_path)
  end

end
