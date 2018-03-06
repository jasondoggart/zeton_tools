require 'rails_helper'

RSpec.describe ClientTeamMember, type: :model do
  describe 'creation' do
    before do
      @client_team_member = FactoryBot.create(:client_team_member)
    end

    it 'can be created with valid parameters' do
      expect(@client_team_member).to be_valid
    end

    it 'cannot be created without a first name' do
      @client_team_member.first_name = ''
      expect(@client_team_member).to_not be_valid
    end

    it 'cannot be created without a last name' do
      @client_team_member.last_name = ''
      expect(@client_team_member).to_not be_valid
    end

    it 'cannot be created without an email' do
      @client_team_member.email = ''
      expect(@client_team_member).to_not be_valid
    end

    it 'cannout be created without an organization' do
      @client_team_member.organization = ''
      expect(@client_team_member).to_not be_valid
    end

    it 'cannot be created without a project' do
      @client_team_member.project = nil
      expect(@client_team_member).to_not be_valid
    end
  end
end
