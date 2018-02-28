require 'rails_helper'

RSpec.describe InformationRequest, type: :model do
  describe "creation" do
    before do
      @request = FactoryBot.create(:information_request)
    end

    it 'can be created with valid parameters' do
      expect(@request).to be_valid
    end

    it 'cannot be created without a clarification' do
      @request.zeton_clarification = ''
      expect(@request).to_not be_valid
    end
  end

  describe "scopes" do
    before do
      @rfi1 = FactoryBot.create(:information_request,
                               answered: 0,
                               area: "instruments",
                               target_date: Time.now,
                               created_at: Time.now
                              )
      @rfi2 = FactoryBot.create(:information_request,
                               answered: 1,
                               area: "equipment",
                               target_date: Time.now + 10,
                               created_at: Time.now + 10
                              )

    end

    it 'has a status scope' do
      expect(InformationRequest.with_status(0)).to include(@rfi1)
      expect(InformationRequest.with_status(0)).to_not include(@rfi2)
      expect(InformationRequest.with_status(1)).to include(@rfi2)
      expect(InformationRequest.with_status(1)).to_not include(@rfi1)
    end

    it 'has an area scope' do
      expect(InformationRequest.with_area("instruments")).to include(@rfi1)
      expect(InformationRequest.with_area("instruments")).to_not include(@rfi2)
    end

    it 'can be sorted by target_date' do
      expect(InformationRequest.sorted_by("target_date_asc").first.id).to eq(@rfi1.id)
      expect(InformationRequest.sorted_by("target_date_desc").first.id).to eq(@rfi2.id)
    end

    it 'can be sorted by status' do
      expect(InformationRequest.sorted_by("answered_asc").first.id).to eq(@rfi1.id)
      expect(InformationRequest.sorted_by("answered_desc").first.id).to eq(@rfi2.id)
    end

    it 'can be sorted by created_at' do
      expect(InformationRequest.sorted_by("date_created_asc").first.id).to eq(@rfi1.id)
      expect(InformationRequest.sorted_by("date_created_desc").first.id).to eq(@rfi2.id)
    end
  end
end
