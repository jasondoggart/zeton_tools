require 'rails_helper'

RSpec.describe ActionItem, type: :model do
  describe 'creation' do
    before do
      @action_item = FactoryBot.create(:action_item)
    end

    it 'can be created with valid parameters' do
      expect(@action_item).to be_valid
    end
  end
end

