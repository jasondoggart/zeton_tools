require 'rails_helper'

RSpec.describe Instrument, type: :model do
  describe 'creation' do
    before do
      @instrument = FactoryBot.create(:instrument)
    end

    it 'can be created with valid parameters' do
      expect(@instrument).to be_valid
    end

    it 'cannot be created without a type' do
      @instrument.type_code = ''
      expect(@instrument).to_not be_valid
    end
    
    it 'cannot be created without a loop' do
      @instrument.loop = ''
      expect(@instrument).to_not be_valid
    end
  end
end
