require 'rails_helper'

RSpec.describe InformationRequest, type: :model do
  describe "creation" do
    before do
      @request = FactoryBot.create(:information_request)
    end

    it 'can be created with valid parameters' do
      expect(@request).to be_valid
    end

    it 'cannot be created without a clarification' do
      @request.zeton_clarification = ''
      expect(@request).to_not be_valid
    end
  end
end
