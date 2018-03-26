require "rails_helper"
require "support/features/clearance_helpers"

describe "Equipment" do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
  end

  it 'can be created from the equipment list' do
    before_count = Equipment.count
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_equipment_path
    click_link('new_equipment_link')
    fill_in('Tag', with: "V-101")
    fill_in('Description', with: "A vessel")
    fill_in('Equipment type', with: "Vessel")
    click_on('Add Equipment')
    expect(current_path).to eq(project_equipment_path)
    expect(Equipment.last.tag).to eq("V-101")
    expect(Equipment.last.description).to eq("A vessel")
    expect(Equipment.last.equipment_type).to eq("Vessel")
    expect(Equipment.count).to eq(before_count + 1)
  end

  it 'can be updated' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    equipment = Equipment.create(tag: "V-101", description: "A Vessel", equipment_type: "Vessel", project: @project)
    visit project_equipment_path
    click_link("show_equipment_#{equipment.id}")
    click_link("edit_equipment_#{equipment.id}")
    fill_in('Tag', with: "V-123")
    click_on('Update Equipment')
    expect(current_path).to eq(project_equipment_path)
    expect(equipment.reload.tag).to eq("V-123")
  end

  it 'can be deleted' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    equipment = Equipment.create(tag: "V-101", description: "A Vessel", equipment_type: "Vessel", project: @project)
    before_count = Equipment.count
    visit project_equipment_path
    click_link("show_equipment_#{equipment.id}")
    click_link("delete_equipment_#{equipment.id}")
    expect(current_path).to eq(project_equipment_path)
    expect(Equipment.count).to eq(before_count - 1)
  end

  it 'has a show page' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    equipment = Equipment.create(tag: "V-101", description: "A Vessel", equipment_type: "Vessel", project: @project)
    visit equipment_path(equipment)
  end

  it 'redirects new_equipment to sign_in if not signed in' do
    visit new_equipment_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects edit_equipment to sign_in if not signed in' do
    equip = FactoryBot.create(:equipment)
    visit edit_equipment_path(equip)
    expect(current_path).to eq(sign_in_path)
  end
end

describe 'current_project' do
  before do
    @user = FactoryBot.create(:user)
    @project = FactoryBot.create(:project, user: @user)
    sign_in_with(@user.email, @user.password)
  end

  it 'redirects new_equipment to root if no current_project' do
    visit new_equipment_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects edit_equipment to root if no current_project' do
    equip = FactoryBot.create(:equipment)
    visit edit_equipment_path(equip)
    expect(current_path).to eq(root_path)
  end
end
