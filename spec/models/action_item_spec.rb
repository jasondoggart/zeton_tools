require 'rails_helper'

RSpec.describe ActionItem, type: :model do
  describe 'creation' do
    before do
      @action_item = FactoryBot.create(:action_item)
    end

    it 'can be created with valid parameters' do
      expect(@action_item).to be_valid
    end

    it 'cannot be created without an area' do
      @action_item.area = ''
      expect(@action_item).to_not be_valid
    end

    it 'cannot be created without without a title' do
      @action_item.title = ''
      expect(@action_item).to_not be_valid
    end

    it 'cannot be created without a description' do
      @action_item.description = ''
      expect(@action_item).to_not be_valid
    end

  end
end

