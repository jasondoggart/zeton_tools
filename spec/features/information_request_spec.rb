require "rails_helper"
require "support/features/clearance_helpers"

describe "Information Request" do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
  end

  it 'can be created' do
    before_count = InformationRequest.count
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_rfis_path
    click_link('new_rfi')
    fill_in('Zeton Clarification', with: "Clar")
    click_on('Add RFI')
    expect(current_path).to eq(project_rfis_path)
    expect(InformationRequest.count).to eq(before_count + 1)
  end

  it 'can be updated' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    rfi = InformationRequest.create(zeton_clarification: "asdf", project: @project)
    visit project_rfis_path
    click_link("show_rfi_#{rfi.id}")
    click_link("edit_rfi_#{rfi.id}")
    fill_in('Zeton Clarification', with: "new")
    click_on('Update RFI')
    expect(current_path).to eq(project_rfis_path)
    expect(rfi.reload.zeton_clarification).to eq("new")
  end

  it 'can be deleted' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    rfi = InformationRequest.create(zeton_clarification: "asdf", project: @project)
    before_count = InformationRequest.count
    visit project_rfis_path
    click_link("show_rfi_#{rfi.id}")
    click_link("delete_rfi_#{rfi.id}")
    expect(current_path).to eq(project_rfis_path)
    expect(InformationRequest.count).to eq(before_count - 1)
  end

  it 'can be viewed in its show page' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    rfi = InformationRequest.create(zeton_clarification: "asdf", project: @project)
    visit project_rfis_path
    click_link("show_rfi_#{rfi.id}")
    expect(current_path).to eq(information_request_path(rfi))
  end

  it 'can have instruments associated with it through the new path' do
    @project.instruments.create(type_code: "FE", loop: "1004")
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_rfis_path
    click_link('new_rfi')
    fill_in('Zeton Clarification', with: "Clar")
    select(@project.instruments.last.tag, from: 'Instruments')
    click_on('Add RFI')
    expect(@project.information_requests.last.instruments.last).to eq(Instrument.last)
  end

  it 'can have equipment associated with it through the new path' do
    @project.equipment.create(tag: "V-101", description: "Vessel", equipment_type: "Vessel")
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_rfis_path
    click_link('new_rfi')
    fill_in('Zeton Clarification', with: "Clar")
    select(@project.equipment.last.tag, from: 'Equipment')
    click_on('Add RFI')
    expect(@project.information_requests.last.equipment.last).to eq(Equipment.last)
  end

  it 'redirects new_information_request to sign_in if not signed in' do
    visit new_information_request_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects edit-information_request to sign_in if not signed in' do
    rfi = FactoryBot.create(:information_request)
    visit edit_information_request_path(rfi)
    expect(current_path).to eq(sign_in_path)
  end
end

describe 'current_project' do
  before do
    @user = FactoryBot.create(:user)
    @project1 = FactoryBot.create(:project, user: @user)
    @project2 = FactoryBot.create(:project, user: @user)
    sign_in_with(@user.email, @user.password)
  end

  it 'redirects new_information_request to root if no current_project' do
    visit new_information_request_path
    expect(current_path).to eq(root_path)
  end

  it 'changes current_project to match rfi project when at edit rfi path' do
    rfi = FactoryBot.create(:information_request, project: @project2)
    visit root_path
    click_link("project_#{@project1.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project1.id)
    visit edit_information_request_path(rfi)
    expect(page.get_rack_session_key('project_id')).to eq(@project2.id)
  end

  it 'changes current_project to match rfi project when at rfi path' do
    rfi = FactoryBot.create(:information_request, project: @project2)
    visit root_path
    click_link("project_#{@project1.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project1.id)
    visit information_request_path(rfi)
    expect(page.get_rack_session_key('project_id')).to eq(@project2.id)
  end
end
