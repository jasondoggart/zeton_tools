require "rails_helper"
require "support/features/clearance_helpers"

describe "Document" do
  before do
    @project = FactoryBot.create(:project)
  end

  it 'can be created from the document list' do
    before_count = @project.documents.count
    visit project_documents_path(@project)
    click_link('new_document_link')
    fill_in('Document Name', with: "New Doc")
    click_on('Add Document')
    expect(current_path).to eq(project_documents_path(@project))
    expect(Document.count).to eq(before_count + 1)
    expect(Document.last.name).to eq("New Doc")
  end

  it 'can be updated from the document list' do
    visit project_documents_path(@project)
    click_link("edit_document_#{@project.documents.first.id}")
    fill_in('Document Name', with: "Revised Name")
    click_on('Update Document')
    expect(current_path).to eq(project_documents_path(@project))
    expect(@project.documents.first.name).to eq("Revised Name")
  end

  it 'can be deleted from the document list' do
    before_count = @project.documents.count
    visit project_documents_path(@project)
    click_link("delete_document_#{@project.documents.first.id}")
    expect(current_path).to eq(project_documents_path(@project))
    expect(@project.documents.count).to eq(before_count - 1)

  end
end
