require "rails_helper"
require "support/features/clearance_helpers"

describe "Document" do
  before do
    @user = FactoryBot.create(:user)
    @project = Project.create(project_number: "123-45", project_name: "a name", client: "a client", user: @user)
  end

  it 'can be created from the document list' do
    before_count = @project.documents.count
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_documents_path
    click_link('new_document_link')
    fill_in('Document Name', with: "New Doc")
    click_on('Add Document')
    expect(current_path).to eq(project_documents_path)
    expect(Document.count).to eq(before_count + 1)
    expect(Document.last.name).to eq("New Doc")
  end

  it 'can be updated from the document list' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_documents_path
    click_link("edit_document_#{@project.documents.first.id}")
    fill_in('Document Name', with: "Revised Name")
    click_on('Update Document')
    expect(current_path).to eq(project_documents_path)
    expect(@project.documents.first.name).to eq("Revised Name")
  end

  it 'can be deleted from the document list' do
    sign_in_with(@user.email, @user.password)
    visit root_path
    click_link("project_#{@project.id}")
    before_count = @project.documents.count
    visit project_documents_path
    click_link("delete_document_#{@project.documents.first.id}")
    expect(current_path).to eq(project_documents_path)
    expect(@project.documents.count).to eq(before_count - 1)
  end

  it 'redirects new_document to sign_in when not signed in' do
    visit new_document_path
    expect(current_path).to eq(sign_in_path)
  end

  it 'redirects edit_document to sign_in when not signed in' do
    doc = FactoryBot.create(:document, project: @project)
    visit edit_document_path(doc)
    expect(current_path).to eq(sign_in_path)
  end

end

describe 'current_project' do
  before do
    @user = FactoryBot.create(:user)
    @project = FactoryBot.create(:project, user: @user)
    sign_in_with(@user.email, @user.password)
  end

  it 'redirects new_document to root when no current project' do
    visit new_document_path
    expect(current_path).to eq(root_path)
  end

  it 'redirects edit_document to root when no current project' do
    doc = FactoryBot.create(:document, project: @project)
    visit edit_document_path(doc)
    expect(current_path).to eq(root_path)
  end

end
