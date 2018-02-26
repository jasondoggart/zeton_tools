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

  describe 'update' do
    before do
      @handvalve = FactoryBot.create(:handvalve)
    end


    it 'valve_description_complete must be 0,1,2' do
      @handvalve.valve_description_complete = 3
      expect(@handvalve).to_not be_valid
    end

    it 'valve_description_approved must be 0,1,2' do
      @handvalve.valve_description_approved = 3
      expect(@handvalve).to_not be_valid
    end

    it 'po_placed must be 0,1,2' do
      @handvalve.po_placed = 3
      expect(@handvalve).to_not be_valid
    end

    it 'item_received must be 0,1,2' do
      @handvalve.item_received = 3
      expect(@handvalve).to_not be_valid
    end

    it 'item_inspected_and_released must be 0,1,2' do
      @handvalve.item_inspected_and_released = 3
      expect(@handvalve).to_not be_valid
    end

    it 'item_mounted must be 0,1,2' do
      @handvalve.item_mounted = 3
      expect(@handvalve).to_not be_valid
    end

    it 'item_plumbed must be 0,1,2' do
      @handvalve.item_plumbed = 3
      expect(@handvalve).to_not be_valid
    end

    it 'item_checked_by_eng must be 0,1,2' do
      @handvalve.item_checked_by_eng = 3
      expect(@handvalve).to_not be_valid
    end

  end
end
