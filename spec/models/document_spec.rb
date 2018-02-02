require 'rails_helper'

RSpec.describe Document, type: :model do
  describe 'creation' do
    before do
      @user1 = FactoryBot.create(:user)
      @user2 = FactoryBot.create(:user)
      @project = Project.create(project_number: "123-45", project_name: "A project", user: @user1)
      @document = Document.create(name: "Design Doc",
                                 phase: "Fabrication",
                                 timing: "Frame Fabrication",
                                 file_location: "H://",
                                 document_type: "Electronic",
                                 revision_name: "Issued for Fabrication",
                                 revision_type: "New",
                                 revision_frequency: "Weekly",
                                 project: @project,
                                 prepared_by_id: @user1.id,
                                 delivered_to_id: @user2.id
                                 )
    end

    it 'can be created with valid parameters' do
      expect(@document).to be_valid
    end

    it 'cannot be created without a project' do
      @document.project = nil
      expect(@document).to_not be_valid
    end
  end
end
