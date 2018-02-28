require "rails_helper"
require "support/features/clearance_helpers"

describe 'Instruments' do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
  end
  it 'can be created from the instruments list' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_instruments_path
    click_link('new_instrument_link')
    fill_in('Type', with: "FE")
    fill_in('Loop', with: "1234")
    click_on('Add Instrument')
    expect(current_path).to eq(project_instruments_path)
    expect(Instrument.last.type_code).to eq("FE")
    expect(Instrument.last.loop).to eq("1234")
    expect(Instrument.last.project).to eq(@project)
  end

  it 'can be updated from the instrument list' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    instrument = Instrument.create(type_code: "FE", loop: "1234", project: @project)
    visit project_instruments_path
    click_link("show_instrument_#{instrument.id}")
    click_link("edit_instrument_#{instrument.id}")
    fill_in('Type', with: "TE")
    click_on('Update Instrument')
    expect(current_path).to eq(project_instruments_path)
    expect(instrument.reload.type_code).to eq("TE")
  end

  it 'can be updated from the instrument metrics list' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    instrument = Instrument.create(type_code: "FE", loop: "1234", project: @project)
    visit project_instruments_metrics_path
    click_link("show_instrument_#{instrument.id}")
    click_link("edit_instrument_#{instrument.id}")
    fill_in('Type', with: "TE")
    click_on('Update Instrument')
    expect(current_path).to eq(project_instruments_path)
    expect(instrument.reload.type_code).to eq("TE")
  end

  it 'can be deleted' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    instrument = Instrument.create(type_code: "FE", loop: "1234", project: @project)
    visit project_instruments_path
    click_link("show_instrument_#{instrument.id}")
    before_count = Instrument.count
    click_link("delete_instrument_#{instrument.id}")
    expect(current_path).to eq(project_instruments_path)
    expect(Instrument.count).to eq(before_count - 1)
  end

  it 'has a show page that redirects back to the project instrument list' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    instrument = Instrument.create(type_code: "FE", loop: "1234", project: @project)
    visit instrument_path(instrument)
    click_link('back_to_instrument_list')
    expect(current_path).to eq(project_instruments_path)
  end

  it 'redirects new_instrument to sign in if not signed in' do
    visit new_instrument_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects edit_instrument to sign in if not signed in' do
    inst = FactoryBot.create(:instrument)
    visit edit_instrument_path(inst)
    expect(current_path).to eq(sign_in_path)
  end

end

describe 'current_project' do
  before do
    @user = FactoryBot.create(:user)
    @project1 = FactoryBot.create(:project, user: @user)
    sign_in_with(@user.email, @user.password)
  end

  it 'redirects to new_instrument to root_path if no current_project' do
    visit new_instrument_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects to edit_instrument to root_path if no current_project' do
    inst = FactoryBot.create(:instrument, project: @project1)
    visit edit_instrument_path(inst)
    expect(current_path).to eq(root_path)
  end

  it 'redirects to instrument to root_path if no current_project' do
    inst = FactoryBot.create(:instrument, project: @project1)
    visit instrument_path(inst)
    expect(current_path).to eq(root_path)
  end

end
