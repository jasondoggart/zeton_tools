require "rails_helper"
require "support/features/clearance_helpers"

describe "Information Request" do
  before do
    @project = FactoryBot.create(:project)
  end

  it 'can be created' do
    before_count = InformationRequest.count
    visit project_rfis_path(@project)
    click_link('new_rfi')
    fill_in('Zeton clarification', with: "Clar")
    click_on('Add RFI')
    expect(current_path).to eq(project_rfis_path(@project))
    expect(InformationRequest.count).to eq(before_count + 1)
  end

  it 'can be updated' do
    rfi = InformationRequest.create(zeton_clarification: "asdf", project: @project)
    visit project_rfis_path(@project)
    click_link("edit_rfi_#{rfi.id}")
    fill_in('Zeton clarification', with: "new")
    click_on('Update RFI')
    expect(current_path).to eq(project_rfis_path(@project))
    expect(rfi.reload.zeton_clarification).to eq("new")
  end

  it 'can be deleted' do
    rfi = InformationRequest.create(zeton_clarification: "asdf", project: @project)
    before_count = InformationRequest.count
    visit project_rfis_path(@project)
    click_link("delete_rfi_#{rfi.id}")
    expect(current_path).to eq(project_rfis_path(@project))
    expect(InformationRequest.count).to eq(before_count - 1)
  end

  it 'can be viewed in its show page' do
    rfi = InformationRequest.create(zeton_clarification: "asdf", project: @project)
    visit project_rfis_path(@project)
    click_link("show_rfi_#{rfi.id}")
    expect(current_path).to eq(information_request_path(rfi))

  end
end
