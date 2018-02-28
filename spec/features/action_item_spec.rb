require "rails_helper"
require "support/features/clearance_helpers"

describe "Action Item" do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45",
                              project_name: "a name",
                              client: "a client",
                              user: @user)
    sign_in_with(@user.email, @user.password)
  end

  it 'can be created' do
    before_count = ActionItem.count
    visit root_path
    click_link("project_#{@project.id}")
    visit project_action_items_path
    click_link("new_action_item")
    select('Process', from: "Area")
    fill_in('Title', with: "The title")
    fill_in('Action Item', with: "The action item text")
    click_on('Add Action Item')
    expect(current_path).to eq(project_action_items_path)
    expect(ActionItem.count).to eq(before_count + 1)
  end

  it 'can be displayed on the action item list' do
    visit root_path
    click_link("project_#{@project.id}")
    action_item = FactoryBot.create(:action_item, project: @project)
    visit project_action_items_path
    expect(page).to have_content(action_item.ai_number)
  end

  it 'can be updated from the action items list' do
    visit root_path
    click_link("project_#{@project.id}")
    action_item = FactoryBot.create(:action_item, project: @project)
    visit project_action_items_path
    click_link("show_action_item_#{action_item.id}")
    click_link("edit_action_item_#{action_item.id}")
    fill_in('Title', with: "New title")
    click_on("Update Action Item")
    expect(current_path).to eq(project_action_items_path)
    expect(action_item.reload.title).to eq("New title")
  end

  it 'can be deleted' do
    visit root_path
    click_link("project_#{@project.id}")
    action_item = FactoryBot.create(:action_item, project: @project)
    before_count = ActionItem.count
    visit project_action_items_path
    click_link("show_action_item_#{action_item.id}")
    click_link("delete_action_item_#{action_item.id}")
    expect(current_path).to eq(project_action_items_path)
    expect(ActionItem.count).to eq(before_count - 1)
  end

  it 'can have instruments associated with it through the new path' do
    @project.instruments.create(type_code: "FE", loop: "1004")
    visit root_path
    click_link("project_#{@project.id}")
    action_item = FactoryBot.create(:action_item, project: @project)
    visit project_action_items_path
    click_link('new_action_item')
    select('Process', from: "Area")
    fill_in('Title', with: "The title")
    fill_in('Action Item', with: "The action item text")
    select(@project.instruments.last.tag, from: 'Associated Instruments')
    click_on('Add Action Item')
    expect(@project.action_items.last.instruments.last).to eq(Instrument.last)
  end

  it 'can have equipment associated with it through the new path' do
    @project.equipment.create(tag: "V-101", description: "Vessel", equipment_type: "Vessel")
    visit root_path
    click_link("project_#{@project.id}")
    action_item = FactoryBot.create(:action_item, project: @project)
    visit project_action_items_path
    click_link('new_action_item')
    select('Process', from: "Area")
    fill_in('Title', with: "The title")
    fill_in('Action Item', with: "The action item text")
    select(@project.equipment.last.tag, from: 'Associated Equipment')
    click_on('Add Action Item')
    expect(@project.action_items.last.equipment.last).to eq(Equipment.last)
  end

  it 'can have handvalves associated with it through the new path' do
    valve = FactoryBot.create(:handvalve, project: @project)
    visit root_path
    click_link("project_#{@project.id}")
    action_item = FactoryBot.create(:action_item, project: @project)
    visit project_action_items_path
    click_link('new_action_item')
    select('Process', from: "Area")
    fill_in('Title', with: "The title")
    fill_in('Action Item', with: "The action item text")
    select(@project.handvalves.last.tag, from: 'Associated Handvalves')
    click_on('Add Action Item')
    expect(@project.action_items.last.handvalves.last).to eq(Handvalve.last)
  end

  it 'redirects new_action_item to sign_in if not signed in' do
    sign_out
    visit new_action_item_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects edit_action_item to sign_in if not signed in' do
    sign_out
    ai = FactoryBot.create(:action_item)
    visit edit_action_item_path(ai)
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

  it 'redirects new_action_item to root if no current_project' do
    visit new_action_item_path
    expect(current_path).to eq(root_path)
  end

  it 'changes current_project to match action_item project when visiting edit_action_item' do
    ai = FactoryBot.create(:action_item, project: @project2)
    visit root_path
    click_link("project_#{@project1.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project1.id)
    visit edit_action_item_path(ai)
    expect(page.get_rack_session_key('project_id')).to eq(@project2.id)
  end

  it 'changes current_project to match action_item project when visiting show_action_item' do
    ai = FactoryBot.create(:action_item, project: @project2)
    visit root_path
    click_link("project_#{@project1.id}")
    expect(page.get_rack_session_key('project_id')).to eq(@project1.id)
    visit action_item_path(ai)
    expect(page.get_rack_session_key('project_id')).to eq(@project2.id)
  end
end
