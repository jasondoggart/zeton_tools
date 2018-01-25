require "rails_helper"
require "support/features/clearance_helpers"

describe 'Instruments' do
  before do
    @project = FactoryBot.create(:project)
  end
  it 'can be created from the instruments list' do
    visit project_instruments_path(@project)
    click_link('new_instrument_link')
    fill_in('Type', with: "FE")
    fill_in('Loop', with: "1234")
    click_on('Add Instrument')
    expect(current_path).to eq(project_instruments_path(@project))
    expect(Instrument.last.type_code).to eq("FE")
    expect(Instrument.last.loop).to eq("1234")
    expect(Instrument.last.project).to eq(@project)
  end

  it 'can be updated' do
    instrument = Instrument.create(type_code: "FE", loop: "1234", project: @project)
    visit project_instruments_path(@project)
    expect(current_path).to eq(project_instruments_path(@project))
    click_link("edit_instrument_#{instrument.id}")
    fill_in('Type', with: "TE")
    click_on('Update Instrument')
    expect(current_path).to eq(project_instruments_path(@project))
    expect(instrument.reload.type_code).to eq("TE")
  end
end
