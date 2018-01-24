require 'rails_helper'

RSpec.describe RfiResponse, type: :model do
  describe 'creation' do
    before do
      @response = FactoryBot.create(:rfi_response)
    end

    it 'can be created with valid parameters' do
      expect(@response).to be_valid
    end
  end
end
