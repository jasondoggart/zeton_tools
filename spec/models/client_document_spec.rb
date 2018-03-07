require 'rails_helper'

RSpec.describe ClientDocument, type: :model do
  describe 'creation' do
    before do
      @client_document = FactoryBot.create(:client_document)
    end

    it 'can be created with valid parameters' do
      expect(@client_document).to be_valid
    end

    it 'cannot be created without a document name' do
      @client_document.document_name = ''
      expect(@client_document).to_not be_valid
    end
  end
end
