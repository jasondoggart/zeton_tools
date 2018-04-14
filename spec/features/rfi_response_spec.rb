require "rails_helper"
require "support/features/clearance_helpers"

describe 'RFI Responses' do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
    @rfi = InformationRequest.create(zeton_clarification: "clarification", project: @project)
    sign_in_with(@user.email, @user.password)
  end

  it 'can be created from the RFI show page' do
    before_count = @rfi.rfi_responses.count
    visit root_path
    click_link("project_#{@project.id}")
    visit information_request_path(@rfi)
    click_on('New Response')
    fill_in('Response', with: "a response")
    fill_in('Organization', with:  "client")
    fill_in('Responder', with: "AA")
    click_on('Add Response')
    expect(@rfi.rfi_responses.count).to eq(before_count + 1)
    expect(current_path).to eq(information_request_path(@rfi))
    expect(page).to have_content("a response")
  end

end
