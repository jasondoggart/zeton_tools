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
    fill_in('Area', with: "Equipment")
    fill_in('Title', with: "The title")
    fill_in('Action Item', with: "The action item text")
    click_on('Add Action Item')
    expect(current_path).to eq(project_action_items_path)
    expect(ActionItem.count).to eq(before_count + 1)
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

end
