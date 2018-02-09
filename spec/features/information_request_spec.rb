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
    select(@project.instruments.last.tag, from: 'Assoicated Instruments')
    click_on('Add RFI')
    expect(@project.information_requests.instruments.last).to eq(Instrument.last)
  end
end
