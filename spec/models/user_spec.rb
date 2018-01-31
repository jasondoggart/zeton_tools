require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'creation' do
    before do
      @user = FactoryBot.create(:user)
    end

    it 'can be created with valid parameters' do
      expect(@user).to be_valid
    end

    it 'cannot be created without a first name' do
      @user.first_name = ''
      expect(@user).to_not be_valid
    end

    it 'cannot be created without a last name' do
      @user.last_name = ''
      expect(@user).to_not be_valid
    end
  end
end
