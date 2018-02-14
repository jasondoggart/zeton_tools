require 'rails_helper'

RSpec.describe Handvalve, type: :model do
  describe 'creation' do
    before do
      @handvalve = FactoryBot.create(:handvalve)
    end

    it 'can be created with valid parameters' do
      expect(@handvalve).to be_valid
    end

    it 'cannot be created without a project' do
      @handvalve.project = nil
      expect(@handvalve).to_not be_valid
    end

    it 'cannot be created without a tag' do
      @handvalve.tag = ''
      expect(@handvalve).to_not be_valid
    end
  end
end
