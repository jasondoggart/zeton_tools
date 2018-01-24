require 'rails_helper'

RSpec.describe RfiResponse, type: :model do
  describe 'creation' do
    before do
      @rfi_response = FactoryBot.create(:rfi_response)
    end

    it 'can be created with valid parameters' do
      expect(@rfi_response).to be_valid
    end

    it 'cannot be created without a response' do
      @rfi_response.response = ''
      expect(@rfi_response).to_not be_valid
    end
    it 'cannot be created without an organization' do
      @rfi_response.organization = ''
      expect(@rfi_response).to_not be_valid
    end
    it 'cannot be created without a responder' do
      @rfi_response.responder = ''
      expect(@rfi_response).to_not be_valid
    end
    it 'cannot be created without a information_request' do
      @rfi_response.information_request = nil
      expect(@rfi_response).to_not be_valid
    end
  end
end
