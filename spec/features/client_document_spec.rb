require "rails_helper"
require "support/features/clearance_helpers"

describe 'Client Document' do
  before do
    @user = FactoryBot.create(:user)
    @project = FactoryBot.create(:project, user: @user)
    sign_in_with @user.email, @user.password
  end

  it 'can be created from the client documents list' do
    visit root_path
    click_link("project_#{@project.id}")
    visit project_client_documents_path
    click_link('new_client_document_link')
    fill_in('Document name', with: "A document")
    fill_in('Document number', with: "1234")
    fill_in('Document revision', with: "B")
    click_on('Add document')
    expect(current_path).to eq(project_client_documents_path)
    expect(ClientDocument.last.document_name).to eq("A document")
    expect(ClientDocument.last.document_number).to eq("1234")
    expect(ClientDocument.last.document_revision).to eq("B")
  end

  it 'has a document show page that displays its rfis' do
    client_document = FactoryBot.create(:client_document, project: @project)
    rfi = FactoryBot.create(
      :information_request, client_document: client_document
    )
    visit root_path
    click_link("project_#{@project.id}")
    visit project_client_documents_path
    click_link("show_client_document_#{client_document.id}")
    expect(current_path).to eq(client_document_path(client_document))
    expect(page).to have_content(rfi.zeton_clarification)
  end

  it 'can be edited from its show page' do
    client_document = FactoryBot.create(:client_document, project: @project)
    visit root_path
    click_link("project_#{@project.id}")
    visit project_client_documents_path
    click_link("show_client_document_#{client_document.id}")
    click_link("edit_client_document_#{client_document.id}")
    fill_in('Document name', with: "A new name")
    fill_in('Document number', with: "12345")
    fill_in('Document revision', with: "C")
    click_on('Update document')
    expect(current_path).to eq(client_document_path(client_document))
    expect(client_document.reload.document_name).to eq("A new name")
    expect(client_document.reload.document_number).to eq("12345")
    expect(client_document.reload.document_revision).to eq("C")
  end

  it 'can be deleted from its show page' do
    client_document = FactoryBot.create(:client_document, project: @project)
    before_count = @project.client_documents.count
    visit root_path
    click_link("project_#{@project.id}")
    visit project_client_documents_path
    click_link("show_client_document_#{client_document.id}")
    click_link("delete_client_document_#{client_document.id}")
    expect(current_path).to eq(project_client_documents_path)
    expect(@project.client_documents.count).to eq (before_count - 1)
  end
end

