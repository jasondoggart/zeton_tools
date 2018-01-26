require "rails_helper"
require "support/features/clearance_helpers"

describe 'RFI Responses' do
  before do
    @project = FactoryBot.create(:project)
    @rfi = InformationRequest.create(zeton_clarification: "clarification", project: @project)
  end

  it 'can be created from the RFI show page' do
    before_count = @rfi.rfi_responses.count
    visit information_request_path(@rfi)
    click_link('new_rfi_response')
    fill_in('Response', with: "a response")
    fill_in('Organization', with:  "client")
    fill_in('Responder', with: "AA")
    click_on('Add Response')
    expect(@rfi.rfi_responses.count).to eq(before_count + 1)
    expect(current_path).to eq(information_request_path(@rfi))
    expect(page).to have_content("a response")
  end

  it 'can be updated from the RFI show page' do
    rfi_response = RfiResponse.create(response: "a response", organization: "client", responder: 'jd', information_request: @rfi)
    visit information_request_path(@rfi)
    click_link("edit_rfi_response_#{rfi_response.id}")
    fill_in('Response', with: 'a new response')
    click_on('Update Response')
    expect(current_path).to eq(information_request_path(@rfi))
    expect(rfi_response.reload.response).to eq('a new response')
    expect(page).to have_content('a new response')
  end
end
