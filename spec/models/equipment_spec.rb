require 'rails_helper'

RSpec.describe Equipment, type: :model do
  describe "creation" do
    before do
      @equipment = FactoryBot.create(:equipment)
    end

    it 'can be created with valid parameters' do
      expect(@equipment).to be_valid
    end

    it 'cannot be created without a tag number' do
      @equipment.tag = '';
      expect(@equipment).to_not be_valid
    end

    it 'cannot be created without a description' do
      @equipment.description = '';
      expect(@equipment).to_not be_valid
    end

    it 'cannot be created without a equipment type' do
      @equipment.equipment_type = '';
      expect(@equipment).to_not be_valid
    end
  end
end
