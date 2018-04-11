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

  describe 'scopes' do
    before do
      @inst1 = FactoryBot.create(:instrument,
                                 type_code: "FE",
                                 loop: "1001",
                                 scope: "a"
                                )
      @inst2 = FactoryBot.create(:instrument,
                                 type_code: "XV",
                                 loop: "2001",
                                 scope: "b"
                                )
    end

    it 'has a type_code scope' do
      expect(Instrument.with_type_code("FE")).to include(@inst1)
      expect(Instrument.with_type_code("FE")).to_not include(@inst2)
    end

    it 'has a loop scope' do
      expect(Instrument.with_loop("1001")).to include(@inst1)
      expect(Instrument.with_loop("1001")).to_not include(@inst2)
    end

    it 'can be sorted by type' do
      expect(Instrument.sorted_by("type_asc").first.id).to eq(@inst1.id)
      expect(Instrument.sorted_by("type_desc").first.id).to eq(@inst2.id)
    end

    it 'can be sorted by loop' do
      expect(Instrument.sorted_by("loop_asc").first.id).to eq(@inst1.id)
      expect(Instrument.sorted_by("loop_desc").first.id).to eq(@inst2.id)
    end

    it 'can be sorted by scope' do
      expect(Instrument.sorted_by("scope_asc").first.id).to eq(@inst1.id)
      expect(Instrument.sorted_by("scope_desc").first.id).to eq(@inst2.id)
    end

  end
  describe 'properties_heading' do
    it 'has an array of property headings that includes only data attributes' do
      expect(Instrument.data_attributes).to include("type_code")
    end

    it 'has a hash of property headings that includes their heading text and icons' do
      expect(Instrument.data_headings).to include(:type_code)
    end

    it 'has an icon associated with each data attribute' do
      expect(Instrument.data_headings[:type_code][:icon]).to eq('<i class="fas fa-bullseye"></i>')
    end

  end

end
