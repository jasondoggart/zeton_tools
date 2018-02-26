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
      @equipment.tag = ''
      expect(@equipment).to_not be_valid
    end

    it 'cannot be created without a description' do
      @equipment.description = ''
      expect(@equipment).to_not be_valid
    end

    it 'cannot be created without a equipment type' do
      @equipment.equipment_type = ''
      expect(@equipment).to_not be_valid
    end

    it 'cannot be created without a project' do
      @equipment.project = nil
      expect(@equipment).to_not be_valid
    end
  end

  describe "updating" do
    before do
      @equipment = FactoryBot.create(:equipment)
    end
    it 'datasheet_complete must have a value of 0,1 or 2' do
      @equipment.datasheet_complete = 3
      expect(@equipment).to_not be_valid
    end

    it 'datasheet_released must have a value of 0,1,2' do
      @equipment.datasheet_released = 3
      expect(@equipment).to_not be_valid
    end

    it 'rfq_sent must have a value of 0,1,2' do
      @equipment.rfq_sent = 3
      expect(@equipment).to_not be_valid
    end

    it 'po_placed must have a value of 0,1,2' do
      @equipment.po_placed = 3
      expect(@equipment).to_not be_valid
    end

    it 'drawing_for_approval_received must have a value of 0,1,2' do
      @equipment.drawing_for_approval_received = 3
      expect(@equipment).to_not be_valid
    end

    it 'drawing_for_approval_marked_up must have a value of 0,1,2' do
      @equipment.drawing_for_approval_marked_up = 3
      expect(@equipment).to_not be_valid
    end

    it 'drawing_for_approval_sent_to_client must have a value of 0,1,2' do
      @equipment.drawing_for_approval_sent_to_client = 3
      expect(@equipment).to_not be_valid
    end

    it 'drawing_for_approval_released_for_construction must have a value of 0,1,2' do
      @equipment.drawing_for_approval_released_for_construction = 3
      expect(@equipment).to_not be_valid
    end

    it 'item_received_at_zeton must have a value of 0,1,2' do
      @equipment.item_received_at_zeton = 3
      expect(@equipment).to_not be_valid
    end

    it 'item_inspected_and_released must have a value of 0,1,2' do
      @equipment.item_inspected_and_released = 3
      expect(@equipment).to_not be_valid
    end

    it 'item_installed_by_mech must have a value of 0,1,2' do
      @equipment.item_installed_by_mech = 3
      expect(@equipment).to_not be_valid
    end

    it 'item_grounded_by_elec must have a value of 0,1,2' do
      @equipment.item_grounded_by_elec = 3
      expect(@equipment).to_not be_valid
    end

    it 'item_inspected_by_eng must have a value of 0,1,2' do
      @equipment.item_inspected_by_eng = 3
      expect(@equipment).to_not be_valid
    end

  end
end
