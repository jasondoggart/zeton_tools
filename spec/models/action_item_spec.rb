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

  describe 'scopes' do
    before do
      @project = FactoryBot.create(:project)
      @action_item1 = FactoryBot.create(:action_item,
                                        project: @project,
                                        status: 1,
                                        area: "instruments",
                                        target_date: Time.now,
                                        created_at: Time.now
                                       )
      @action_item2 = FactoryBot.create(:action_item,
                                        project: @project,
                                        area: "equipment",
                                        target_date: Time.now + 10,
                                        created_at: Time.now + 10
                                       )
    end

    it 'has a status scope' do
      expect(ActionItem.with_status(0)).to_not include(@action_item1)
      expect(ActionItem.with_status(1)).to include(@action_item1)
    end

    it 'has an area scope' do
      expect(ActionItem.with_area("instruments")).to include(@action_item1)
      expect(ActionItem.with_area("instruments")).to_not include(@action_item2)
    end

    it 'can be sorted by target date' do
      expect(ActionItem.sorted_by("target_date_asc").first.id).to eq(@action_item1.id)
      expect(ActionItem.sorted_by("target_date_desc").first.id).to eq(@action_item2.id)
    end

    it 'can be sorted by status' do
      expect(ActionItem.sorted_by("status_asc").first.id).to eq(@action_item2.id)
      expect(ActionItem.sorted_by("status_desc").first.id).to eq(@action_item1.id)
    end

    it 'can be sorted by created_at' do
      expect(ActionItem.sorted_by("date_created_asc").first.id).to eq(@action_item1.id)
      expect(ActionItem.sorted_by("date_created_desc").first.id).to eq(@action_item2.id)
    end
  end
end

