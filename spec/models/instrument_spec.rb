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

    it 'cannot be created without a project number' do
      @instrument.project = nil
      expect(@instrument).to_not be_valid
    end
  end

  describe 'updating' do
    before do
      @instrument = FactoryBot.create(:instrument)
    end

    it 'must have a value of 0, 1, or 2 for datasheet_submitted_for_approval' do
      @instrument.datasheet_submitted_for_approval = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for datasheet_approved' do
      @instrument.datasheet_approved = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for rfq_sent' do
      @instrument.rfq_sent = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for po_placed' do
      @instrument.po_placed = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for item_received' do
      @instrument.item_received = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for item_inspected_and_released' do
      @instrument.item_inspected_and_released = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for mounted_by_mechanical' do
      @instrument.mounted_by_mechanical = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for plumbed_by_mechanical' do
      @instrument.plumbed_by_mechanical = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for cable_pulled' do
      @instrument.cable_pulled = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for cable_terminated_at_source' do
      @instrument.cable_terminated_at_source = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for cable_terminated_at_destination' do
      @instrument.cable_terminated_at_destination = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for continuity_tested' do
      @instrument.continuity_tested = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for grounded_by_electrical' do
      @instrument.grounded_by_electrical = 3
      expect(@instrument).to_not be_valid
    end

    it 'must have a value of 0, 1, or 2 for checked_by_eng' do
      @instrument.checked_by_eng = 3
      expect(@instrument).to_not be_valid
    end

  end

end
