require "rails_helper"
require "support/features/clearance_helpers"

describe "Handvalve" do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
  end

  it 'can be created from the project handvalves list' do
    before_count = Handvalve.count
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_handvalves_path
    click_link('new_handvalve_link')
    fill_in('Tag', with: "HV-1002")
    click_on('Add Handvalve')
    expect(current_path).to eq(project_handvalves_path)
    expect(Handvalve.last.tag).to eq("HV-1002")
    expect(@project.handvalves.count).to eq(before_count + 1)
  end

  it 'can be displayed on the project handvalves list' do
    @project.handvalves.create(tag: "HV-1002")
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_handvalves_path
    expect(page).to have_content("HV-1002")
  end

  it 'can be edited from the handvalve show page' do
    handvalve = @project.handvalves.create(tag: "HV-1002")
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_handvalves_path
    click_link("show_handvalve_#{handvalve.id}")
    click_link("edit_handvalve_#{handvalve.id}")
    fill_in('Tag', with: "CK-1001")
    click_on("Update Handvalve")
    expect(current_path).to eq(project_handvalves_path)
    expect(handvalve.reload.tag).to eq("CK-1001")
  end
end
